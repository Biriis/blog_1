import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function checkUser() {
  const SQL = await initSqlJs();
  const dbPath = path.join(__dirname, 'blog.db');
  
  if (!fs.existsSync(dbPath)) {
    console.log('数据库不存在');
    return;
  }
  
  const buffer = fs.readFileSync(dbPath);
  const db = new SQL.Database(buffer);
  
  const result = db.exec('SELECT username, password FROM users');
  
  if (result.length > 0) {
    console.log('用户:', result[0].values);
  } else {
    console.log('没有找到用户');
  }
  
  const articleCount = db.exec('SELECT COUNT(*) FROM articles');
  console.log('文章数量:', articleCount[0]?.values[0][0]);
}

checkUser().catch(console.error);
