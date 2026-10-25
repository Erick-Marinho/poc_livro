// npm run tunel: o túnel do FontMar (a landing e o site dos livros num domínio só, como em produção) em dia com a pasta.
//   Sobe o que faltar (o site dos livros montado na 4322, a landing montada na 4173 e o ngrok) e remonta o lado que mudou
//   poucos segundos depois de cada edição. O build vai para .tunel/ e só troca a versão no ar quando dá certo: build
//   quebrado no meio de uma edição deixa o túnel na última versão boa. Ctrl+C para o que este script subiu.
// A landing fica ao lado deste repositório (../FontMarAI); outro lugar: LANDING=caminho npm run tunel
import { spawn, spawnSync } from "node:child_process";
import { existsSync, readdirSync, renameSync, rmSync, statSync } from "node:fs";
import { connect } from "node:net";
import { resolve } from "node:path";

const RAIZ = resolve(import.meta.dirname, "..");
const LANDING = resolve(RAIZ, process.env.LANDING ?? "../FontMarAI");
const PORTA_LIVROS = 4322;
const PORTA_LANDING = 4173;
const ESPERA_MS = 1500;
if (!existsSync(`${LANDING}/package.json`)) { console.error(`a landing não está em ${LANDING}: clone o FontMarAI ao lado deste repositório, ou use LANDING=caminho`); process.exit(1); }

const hora = () => new Date().toTimeString().slice(0, 8);
const diz = (msg) => console.log(`${hora()} ${msg}`);
const ocupada = (porta) => new Promise((ok) => { const s = connect(porta, "127.0.0.1", () => { s.end(); ok(true); }); s.on("error", () => ok(false)); });

/* os dois lados: de onde vem o código, como monta numa pasta à parte e onde fica a versão no ar */
const lados = {
  livros: {
    nome: "o site dos livros", de: "do site dos livros",
    pastas: ["livros", "experimentos", "src"].map((p) => `${RAIZ}/${p}`), arquivos: ["astro.config.mjs", "package.json"].map((a) => `${RAIZ}/${a}`),
    montar: (destino) => ["npx", ["astro", "build", "--outDir", destino], RAIZ],
    noAr: `${RAIZ}/dist`,
  },
  landing: {
    nome: "a landing", de: "da landing",
    pastas: ["src", "public"].map((p) => `${LANDING}/${p}`), arquivos: ["index.html", "vite.config.ts", "package.json"].map((a) => `${LANDING}/${a}`),
    montar: (destino) => ["npx", ["vite", "build", "--outDir", destino, "--emptyOutDir", "--logLevel", "warn"], LANDING],
    noAr: `${LANDING}/dist`,
  },
};

/* um build por vez em cada lado; mudança no meio de um build pede outro logo depois */
for (const lado of Object.values(lados)) Object.assign(lado, { montando: false, deNovo: false, ultimaBoa: null, timer: null });
async function montar(lado, motivo) {
  if (lado.montando) { lado.deNovo = true; return; }
  lado.montando = true;
  const inicio = Date.now(), novo = `${RAIZ}/.tunel/${lado === lados.livros ? "livros" : "landing"}`, velho = `${novo}-velho`;
  diz(`${motivo}: remontando ${lado.nome}…`);
  const [cmd, args, cwd] = lado.montar(novo);
  const saida = [];
  const codigo = await new Promise((fim) => {
    const p = spawn(cmd, args, { cwd, env: { ...process.env, PUBLIC_URL_INICIO: "/" } });
    p.stdout.on("data", (d) => saida.push(d)); p.stderr.on("data", (d) => saida.push(d)); p.on("close", fim);
  });
  if (codigo === 0) {
    rmSync(velho, { recursive: true, force: true });
    if (existsSync(lado.noAr)) renameSync(lado.noAr, velho);
    renameSync(novo, lado.noAr);
    lado.ultimaBoa = hora();
    diz(`${lado.nome} no ar, montado em ${Math.round((Date.now() - inicio) / 1000)} s`);
  } else {
    /* o erro, não o rastro da pilha: a partir da primeira linha que fala em erro, sem as linhas do "at …" */
    const linhas = Buffer.concat(saida).toString().replace(/\x1b\[[0-9;]*m/g, "").split("\n").filter((l) => l.trim() && !/^\s+at /.test(l));
    const i = Math.max(0, linhas.findIndex((l) => /error|erro/i.test(l)));
    diz(`o build ${lado.de} falhou; o túnel segue com a versão ${lado.ultimaBoa ? `das ${lado.ultimaBoa}` : "anterior"}\n  ${linhas.slice(i, i + 6).join("\n  ")}`);
  }
  lado.montando = false;
  if (lado.deNovo) { lado.deNovo = false; montar(lado, "mudou durante o build"); }
}

/* a data de modificação de cada arquivo, conferida a cada segundo: o fs.watch do Linux perde o arquivo que o editor
   salva trocando por um novo (o sed -i, muitos editores), e são poucas centenas de arquivos, lidos em 1 ms */
const IGNORA = new Set([".venv", "node_modules", "__pycache__", ".pytest_cache", ".astro", "dist", ".tunel", ".leitor"]);
function datas(lado) {
  const m = new Map();
  const andar = (pasta) => {
    for (const e of readdirSync(pasta, { withFileTypes: true })) {
      if (IGNORA.has(e.name) || e.name.endsWith("~") || /\.sw.$/.test(e.name)) continue;
      const c = `${pasta}/${e.name}`;
      if (e.isDirectory()) andar(c); else try { m.set(c, statSync(c).mtimeMs); } catch { /* sumiu no meio da leitura */ }
    }
  };
  for (const pasta of lado.pastas.filter(existsSync)) andar(pasta);
  for (const arquivo of lado.arquivos.filter(existsSync)) m.set(arquivo, statSync(arquivo).mtimeMs);
  return m;
}
function vigiar(lado) {
  let antes = datas(lado);
  setInterval(() => {
    const agora = datas(lado);
    const mudou = [...agora].find(([a, t]) => antes.get(a) !== t)?.[0] ?? [...antes.keys()].find((a) => !agora.has(a));
    antes = agora;
    if (!mudou) return;
    clearTimeout(lado.timer);
    lado.timer = setTimeout(() => montar(lado, `mudou ${mudou.replace(`${RAIZ}/`, "").replace(`${LANDING}/`, "FontMarAI/")}`), ESPERA_MS);
  }, 1000);
}

/* sobe o que não estiver no ar; ao sair, para só o que este script subiu */
const subidos = [];
let pararPreview = false;
await Promise.all([montar(lados.livros, "início"), montar(lados.landing, "início")]);
if (!(await ocupada(PORTA_LIVROS))) {
  /* fora de um terminal, o astro preview roda desacoplado e volta na hora: para ele com astro preview stop */
  spawnSync("npx", ["astro", "preview", "--port", String(PORTA_LIVROS), "--host", "127.0.0.1"], { cwd: RAIZ, stdio: "ignore" });
  pararPreview = true;
}
if (!(await ocupada(PORTA_LANDING))) {
  subidos.push(spawn("npx", ["vite", "preview", "--port", String(PORTA_LANDING), "--strictPort", "--host", "127.0.0.1"],
    { cwd: LANDING, stdio: "ignore", env: { ...process.env, URL_CONTEUDO: `http://localhost:${PORTA_LIVROS}` } }));
}
const ngrok = spawnSync("pgrep", ["-f", `ngrok http ${PORTA_LANDING}`]).status === 0;
if (!ngrok) {
  const p = spawn("ngrok", ["http", String(PORTA_LANDING), "--log", "stdout", "--log-format", "logfmt"], { stdio: ["ignore", "pipe", "ignore"] });
  p.on("error", () => diz("o ngrok não está instalado: o site fica só em http://localhost:4173"));
  p.stdout.on("data", (d) => { const url = d.toString().match(/url=(https:\/\/\S+)/); if (url) diz(`o túnel: ${url[1]}`); });
  subidos.push(p);
} else diz("o ngrok já estava no ar para a landing");
for (const lado of Object.values(lados)) vigiar(lado);
diz(`de olho em livros/, experimentos/, src/ e na landing; o site em http://localhost:${PORTA_LANDING}. Ctrl+C para sair`);

const sair = () => {
  for (const p of subidos) p.kill();
  if (pararPreview) spawnSync("npx", ["astro", "preview", "stop"], { cwd: RAIZ, stdio: "ignore" });
  process.exit(0);
};
process.on("SIGINT", sair);
process.on("SIGTERM", sair);
