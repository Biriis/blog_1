import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'blog.db');

const buffer = fs.readFileSync(dbPath);
const SQL = await initSqlJs();
const db = new SQL.Database(buffer);

const result = db.exec('SELECT id, username, password, role FROM users');
if (result.length > 0) {
  console.log('找到用户:');
  result[0].values.forEach(row => {
    console.log('ID:', row[0]);
    console.log('用户名:', row[1]);
    console.log('密码哈希:', row[2]);
    console.log('角色:', row[3]);
  });
} else {
  console.log('没有找到用户');
}

const count = db.exec('SELECT COUNT(*) as count FROM users');
console.log('用户总数:', count[0]?.values[0][0]);

// 测试密码
console.log('\n测试密码 admin123:');
const passwords = ['admin123', 'admin', 'password'];
for (const pwd of passwords) {
  try {
    const isMatch = bcrypt.compareSync(pwd, result[0]?.values[0]?.[2] || '');
    console.log(`密码 "${pwd}": ${isMatch ? '正确 ✓' : '错误 ✗'}`);
  } catch (e) {
    console.log(`密码 "${pwd}": 验证失败 - ${e.message}`);
  }
}
