// server.js - BorgBackup MCP Server cho Valorant Project
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const app = express();
app.use(cors());
app.use(express.json());

// Cấu hình
const REPO = process.env.BORG_REPO;
const PROJECT_PATH = process.env.BORG_PROJECT_PATH;
process.env.BORG_PASSPHRASE = process.env.BORG_PASSPHRASE;

// Tạo thư mục backup nếu chưa có
exec(`mkdir -p "${REPO}"`, () => {});

// Chạy lệnh Borg
async function runBorg(command) {
  try {
    const { stdout, stderr } = await execPromise(command, { timeout: 600000 });
    return { success: true, output: stdout, error: stderr };
  } catch (err) {
    return { success: false, output: err.stdout, error: err.stderr || err.message };
  }
}

// Khởi tạo repo nếu chưa có
async function initRepo() {
  const check = await runBorg(`borg info "${REPO}"`);
  if (!check.success && check.error.includes("does not exist")) {
    await runBorg(`borg init --encryption=repokey "${REPO}"`);
  }
}

// Gọi init khi khởi động
initRepo();

// === ENDPOINTS ===

app.get('/backup-status', async (req, res) => {
  await initRepo();
  const result = await runBorg(`borg list --last 1 --format="{archive}\\t{time}\\n" "${REPO}"`);
  if (!result.success) return res.json({ error: result.error });
  const lines = result.output.trim().split('\n').filter(Boolean);
  if (!lines.length) return res.json({ latest: null, message: "Chưa có backup" });
  const [archive, time] = lines[0].split('\t');
  res.json({ latest: { archive, time } });
});

app.post('/trigger-backup', async (req, res) => {
  await initRepo();
  const archiveName = `valorant-${new Date().toISOString().replace(/[:.]/g, '-')}`;
  const excludeFile = `${PROJECT_PATH}/.borgignore`;

  // Tạo .borgignore
  const exclude = `
node_modules/
.git/
.env
*.log
.DS_Store
  `.trim();
  await execPromise(`echo "${exclude}" > "${excludeFile}"`);

  const cmd = `borg create --stats --progress --exclude-from "${excludeFile}" "${REPO}::${archiveName}" "${PROJECT_PATH}"`;
  const result = await runBorg(cmd);
  if (!result.success) return res.json({ success: false, error: result.error });

  await runBorg(`borg prune --keep-daily=7 --keep-weekly=4 --keep-monthly=6 --prefix 'valorant-' "${REPO}"`);
  res.json({ success: true, archive: archiveName });
});

app.get('/list-archives', async (req, res) => {
  await initRepo();
  const result = await runBorg(`borg list --format="{archive}{TAB}{time}{NL}" "${REPO}"`);
  const archives = (result.output || '').trim().split('\n')
    .filter(Boolean)
    .map(line => {
      const [archive, time] = line.split('\t');
      return { archive, time };
    });
  res.json({ archives });
});

app.get('/.well-known/mcp.json', (req, res) => {
  res.json({
    name: "Valorant BorgBackup MCP",
    description: "Quản lý sao lưu dự án Valorant bằng BorgBackup",
    endpoints: [
      { method: "GET", path: "/backup-status" },
      { method: "POST", path: "/trigger-backup" },
      { method: "GET", path: "/list-archives" }
    ]
  });
});

app.get('/', (req, res) => res.json({ status: "OK", mcp: "/.well-known/mcp.json" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MCP Server chạy: http://localhost:${PORT}`);
});
