// scripts/dev.js
const { spawn, exec } = require('child_process');

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

const lg = msg => console.log(msg);
const logStep = msg => lg(`\n${colors.bold}${colors.cyan}🚀 [SISTEMA]${colors.reset} ${msg}`);
const logSuccess = msg => lg(`${colors.bold}${colors.green}✅ [ÉXITO]${colors.reset}   ${msg}`);
const logInfo = msg => lg(`${colors.bold}${colors.yellow}⏳ [INFO]${colors.reset}    ${msg}`);
const logProcess = (prefix, color, data) => {
  const lines = data
    .toString()
    .split('\n')
    .filter(line => line.trim() !== '');
  lines.forEach(line => {
    lg(`${colors.gray}${new Date().toLocaleTimeString()} ${color}[${prefix}]${colors.reset} ${line}`);
  });
};

console.clear();
lg(`\n${colors.bold}${colors.magenta}========================================================================`);
lg(`                 DISTRITO GOURMET                 `);
lg(`========================================================================${colors.reset}\n`);

logStep('Inicializando entorno de desarrollo unificado...');

let backendReady = false;
let frontendReady = false;
let frontend = null;
let shuttingDown = false;

const backend = spawn('php', ['artisan', 'serve'], { cwd: './backend', shell: true });

setTimeout(() => {
  logInfo('Verificando y levantando servidor de la API Backend (Laravel)...');
}, 500);

const checkBackendOutput = data => {
  if (shuttingDown) return;
  const output = data.toString();
  logProcess('BACKEND', colors.blue, output);

  if (!backendReady && (output.includes('Server running on') || output.includes('Development Server'))) {
    backendReady = true;
    logSuccess('Servidor Backend en línea y aceptando conexiones.');
    startFrontend();
  }
};

backend.stdout.on('data', checkBackendOutput);
backend.stderr.on('data', checkBackendOutput);

function startFrontend() {
  logInfo('Construyendo y levantando ecosistema Frontend (React/Vite)...');

  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  frontend = spawn(npmCmd, ['run', 'dev'], { cwd: './frontend', shell: true });

  frontend.stdout.on('data', data => {
    if (shuttingDown) return;
    const output = data.toString();
    logProcess('FRONTEND', colors.magenta, output);

    if (!frontendReady && (output.toLowerCase().includes('ready in') || output.toLowerCase().includes('local:'))) {
      frontendReady = true;
      logSuccess('Servidor Frontend compilado y montado exitosamente.');

      setTimeout(() => {
        lg(`\n${colors.bold}${colors.green} ==================================================================== `);
        lg(`   ¡SISTEMA ONLINE!    `);
        lg(` ==================================================================== ${colors.reset}\n`);

        lg(`   ${colors.bold}${colors.blue}🌐 API Backend:${colors.reset}       http://127.0.0.1:8000`);
        lg(`   ${colors.bold}${colors.magenta}🌐 Aplicación React:${colors.reset}  http://localhost:5173\n`);

        logInfo('Presiona Ctrl + C en esta terminal cuando desees detener la ejecución.');
      }, 600);
    }
  });

  frontend.stderr.on('data', data => {
    if (shuttingDown) return;
    logProcess('FRONTEND', colors.red, data);
  });
}

function killProcess(child) {
  if (!child) return;
  try {
    if (process.platform === 'win32') {
      exec(`taskkill /PID ${child.pid} /T /F`, () => {});
    } else {
      child.kill('SIGINT');
    }
  } catch (e) {}
}

const cleanup = () => {
  if (shuttingDown) return;
  shuttingDown = true;
  logStep('Cerrando servicios y limpiando puertos activos...');
  killProcess(backend);
  if (frontend) killProcess(frontend);

  setTimeout(() => {
    logSuccess('Entorno de desarrollo cerrado correctamente. ¡Hasta pronto!');
    process.exit(0);
  }, 1500);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
