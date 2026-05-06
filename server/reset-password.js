import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'blog.db');

const buffer = fs.readFileSync(dbPath);
const SQL = await initSqlJs();
const db = new SQL.Database(buffer);

// 删除旧的管理员账户
db.run('DELETE FROM users WHERE username = ?', ['admin']);

// 创建新的管理员账户，密码为 admin123
const hashedPassword = bcrypt.hashSync('admin123', 10);
const adminId = uuidv4();
const now = new Date().toISOString();

db.run(`
  INSERT INTO users (id, username, password, role, createdAt)
  VALUES (?, ?, ?, ?, ?)
`, [adminId, 'admin', hashedPassword, 'admin', now]);

// 保存数据库
const data = db.export();
const updatedBuffer = Buffer.from(data);
fs.writeFileSync(dbPath, updatedBuffer);

console.log('✅ 管理员账户已重置！');
console.log('用户名:', 'admin');
console.log('密码:', 'admin123');
console.log('ID:', adminId);

// 验证
const newBuffer = fs.readFileSync(dbPath);
const newDB = new SQL.Database(newBuffer);
const result = newDB.exec('SELECT username, password, role FROM users WHERE username = ?', ['admin']);
if (result.length > 0) {
  const row = result[0].values[0];
  console.log('\n验证新密码:');
  const isMatch = bcrypt.compareSync('admin123', row[1]);
  console.log('密码 admin123:', isMatch ? '正确 ✓' : '错误 ✗');
}
