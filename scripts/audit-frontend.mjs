import { spawnSync } from "node:child_process";

const allowedAdvisories = new Set([
  // Solo afecta las APIs RSC inestables. Esta SPA usa BrowserRouter clásico.
  "https://github.com/advisories/GHSA-qwww-vcr4-c8h2",
]);

const npmExecutable = process.env.npm_execpath;
const command = npmExecutable ? process.execPath : "npm";
const args = npmExecutable
  ? [npmExecutable, "audit", "--omit=dev", "--json"]
  : ["audit", "--omit=dev", "--json"];
const result = spawnSync(command, args, {
  cwd: process.cwd(),
  encoding: "utf8",
});

if (result.error) {
  console.error(`No se pudo ejecutar npm audit: ${result.error.message}`);
  process.exit(1);
}

let report;
try {
  report = JSON.parse(result.stdout);
} catch {
  console.error(result.stderr || result.stdout || "npm audit no devolvió JSON válido.");
  process.exit(1);
}

if (report.error) {
  console.error(report.error.summary || report.error.message || "npm audit falló.");
  process.exit(1);
}

const vulnerabilities = report.vulnerabilities ?? {};
const allowedPackages = new Set();

const isAllowed = (name, visiting = new Set()) => {
  if (allowedPackages.has(name)) return true;
  if (visiting.has(name)) return false;

  const vulnerability = vulnerabilities[name];
  if (!vulnerability) return false;

  const nextVisiting = new Set(visiting).add(name);
  const allowed = vulnerability.via.every((source) =>
    typeof source === "string"
      ? isAllowed(source, nextVisiting)
      : allowedAdvisories.has(source.url),
  );

  if (allowed) allowedPackages.add(name);
  return allowed;
};

const blocking = Object.keys(vulnerabilities).filter((name) => !isAllowed(name));

if (blocking.length > 0) {
  for (const name of blocking) {
    const vulnerability = vulnerabilities[name];
    console.error(`${name}: vulnerabilidad ${vulnerability.severity} (${vulnerability.range})`);
  }
  process.exit(1);
}

if (Object.keys(vulnerabilities).length > 0) {
  console.log(
    "Auditoría correcta: solo se omite GHSA-qwww-vcr4-c8h2, exclusivo de APIs RSC no utilizadas.",
  );
} else {
  console.log("Auditoría correcta: sin vulnerabilidades de producción.");
}
