const { spawn, exec, spawnSync } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  magenta: '\x1b[35m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
};

const log = msg => console.log(msg);
const logStep = msg => log(`\n${colors.bold}${colors.cyan}[SYSTEM]${colors.reset} ${msg}`);
const logOk = msg => log(`${colors.bold}${colors.green}[OK]${colors.reset} ${msg}`);
const logInfo = msg => log(`${colors.bold}${colors.yellow}[INFO]${colors.reset} ${msg}`);

const logProcess = (prefix, color, data) => {
  const lines = data
    .toString()
    .split('\n')
    .filter(Boolean);

  lines.forEach(line => {
    log(`${colors.gray}${new Date().toLocaleTimeString()} ${color}[${prefix}]${colors.reset} ${line}`);
  });
};

const getNetworkHost = () => {
  const nets = os.networkInterfaces();
  for (const net of Object.values(nets)) {
    if (!net) continue;
    for (const addr of net) {
      if (addr.family === 'IPv4' && !addr.internal) {
        return addr.address;
      }
    }
  }
  return '127.0.0.1';
};

console.clear();
log(`${colors.bold}${colors.magenta}\n========================================`);
log('         DISTRITO GOURMET DEV');
log(`========================================${colors.reset}\n`);

const networkHost = getNetworkHost();
const backendPort = 8000;
const frontendPort = 5173;

const resolvePhpCommand = () => {
  if (process.env.PHP_BIN) return process.env.PHP_BIN;

  const wingetPhp84 = path.join(
    os.homedir(),
    'AppData',
    'Local',
    'Microsoft',
    'WinGet',
    'Packages',
    'PHP.PHP.8.4_Microsoft.Winget.Source_8wekyb3d8bbwe',
    'php.exe'
  );
  if (fs.existsSync(wingetPhp84)) return wingetPhp84;

  const wingetPhp85 = path.join(
    os.homedir(),
    'AppData',
    'Local',
    'Microsoft',
    'WinGet',
    'Packages',
    'PHP.PHP.8.5_Microsoft.Winget.Source_8wekyb3d8bbwe',
    'php.exe'
  );
  if (fs.existsSync(wingetPhp85)) return wingetPhp85;

  const whereResult = spawnSync('where.exe', ['php'], { shell: false });
  if (whereResult.status === 0) {
    const found = whereResult.stdout.toString().split(/\r?\n/).find(Boolean);
    if (found) return found.trim();
  }

  return 'php';
};

const phpCmd = resolvePhpCommand();
const phpDir = path.dirname(path.resolve(phpCmd));

const ensurePhpIni = dir => {
  const iniPath = path.join(dir, 'php.ini');
  const iniDevPath = path.join(dir, 'php.ini-development');

  if (!fs.existsSync(iniPath) && fs.existsSync(iniDevPath)) {
    fs.copyFileSync(iniDevPath, iniPath);
  }

  if (!fs.existsSync(iniPath)) return null;

  let ini = fs.readFileSync(iniPath, 'utf8');
  ini = ini.replace(/^\s*;?\s*extension_dir\s*=.*$/m, 'extension_dir = "ext"');

  const requiredExtensions = ['curl', 'fileinfo', 'intl', 'mbstring', 'mysqli', 'openssl', 'pdo_mysql', 'sodium', 'zip'];
  for (const ext of requiredExtensions) {
    const lineRegex = new RegExp(`^\\s*;?\\s*extension\\s*=\\s*${ext}\\s*$`, 'mi');
    if (lineRegex.test(ini)) {
      ini = ini.replace(lineRegex, `extension=${ext}`);
    } else {
      ini += `\r\nextension=${ext}`;
    }
  }

  fs.writeFileSync(iniPath, ini, 'utf8');
  return iniPath;
};

const phpIniPath = ensurePhpIni(phpDir);

// Kill any process already listening on a given port (Windows-only)
const freePort = port => {
  try {
    const result = spawnSync(
      'powershell',
      ['-Command', `$p = (Get-NetTCPConnection -LocalPort ${port} -State Listen -ErrorAction SilentlyContinue).OwningProcess; if ($p) { Stop-Process -Id $p -Force -ErrorAction SilentlyContinue }`],
      { shell: false }
    );
    if (result.status === 0) {
      logInfo(`Port ${port} is now free.`);
    }
  } catch (_) {}
};

let backendReady = false;
let frontendReady = false;
let frontend = null;
let shuttingDown = false;
let frontendUrl = `http://${networkHost}:${frontendPort}`;

logStep('Starting unified development environment');
logInfo(`Using PHP binary: ${phpCmd}`);

if (process.platform === 'win32') freePort(backendPort);
if (process.platform === 'win32') freePort(frontendPort);

const backend = spawn(phpCmd, ['artisan', 'serve', '--host=0.0.0.0', '--port=8000'], {
  cwd: './backend',
  shell: false,
  env: {
    ...process.env,
    ...(phpIniPath ? { PHPRC: phpDir } : {}),
    PHP_INI_SCAN_DIR: '',
  },
});

const startFrontend = () => {
  if (frontend) return;

  logInfo('Starting frontend (Vite)');
  const frontendCommand = process.platform === 'win32' ? 'cmd.exe' : 'npm';
  const frontendArgs = process.platform === 'win32' ? ['/d', '/s', '/c', 'npm run dev'] : ['run', 'dev'];

  frontend = spawn(frontendCommand, frontendArgs, {
    cwd: './frontend',
    shell: false,
  });

  frontend.stdout.on('data', data => {
    if (shuttingDown) return;
    const output = data.toString();
    logProcess('FRONTEND', colors.magenta, output);
    const networkMatch = output.match(/Network:\s+(http:\/\/[^\s]+)/i);
    if (networkMatch?.[1]) {
      frontendUrl = networkMatch[1];
    }

    const lower = output.toLowerCase();
    if (!frontendReady && (lower.includes('ready in') || lower.includes('local:') || lower.includes('network:'))) {
      frontendReady = true;
      logOk('Frontend is running');
      log('');
      log(`${colors.bold}${colors.blue}Backend:${colors.reset}  http://${networkHost}:${backendPort}`);
      log(`${colors.bold}${colors.magenta}Frontend:${colors.reset} ${frontendUrl}`);
      log('');
      logInfo('Press Ctrl+C to stop both processes');
    }
  });

  frontend.stderr.on('data', data => {
    if (shuttingDown) return;
    logProcess('FRONTEND', colors.red, data);
  });

  frontend.on('exit', code => {
    if (shuttingDown) return;
    log(`${colors.bold}${colors.red}[ERROR]${colors.reset} Frontend exited with code ${code ?? 'unknown'}`);
    cleanup();
  });
};

const checkBackendOutput = data => {
  if (shuttingDown) return;
  const output = data.toString();
  logProcess('BACKEND', colors.blue, output);

  if (!backendReady && (output.includes('Server running on') || output.includes('Development Server'))) {
    backendReady = true;
    logOk('Backend is running');
    startFrontend();
  }
};

backend.stdout.on('data', checkBackendOutput);
backend.stderr.on('data', checkBackendOutput);

backend.on('exit', code => {
  if (shuttingDown) return;
  log(`${colors.bold}${colors.red}[ERROR]${colors.reset} Backend exited with code ${code ?? 'unknown'}`);
  cleanup();
});

const killProcess = child => {
  if (!child || !child.pid) return;
  try {
    if (process.platform === 'win32') {
      exec(`taskkill /PID ${child.pid} /T /F`, () => {});
    } else {
      child.kill('SIGINT');
    }
  } catch (_) {}
};

function cleanup() {
  if (shuttingDown) return;
  shuttingDown = true;

  logStep('Stopping services');
  killProcess(backend);
  killProcess(frontend);

  setTimeout(() => {
    logOk('Development environment stopped');
    process.exit(0);
  }, 1200);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
