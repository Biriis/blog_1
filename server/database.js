import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_PATH = process.env.DB_PATH || join(__dirname, 'blog.db');

let db = null;

export function initDB() {
  try {
    db = new Database(DB_PATH);
    
    db.exec(`
      CREATE TABLE IF NOT EXISTS articles (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        coverImage TEXT DEFAULT '',
        summary TEXT DEFAULT '',
        content TEXT NOT NULL,
        publishDate TEXT NOT NULL,
        tags TEXT DEFAULT '[]',
        isDraft INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);

    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'admin',
        createdAt TEXT NOT NULL
      )
    `);

    db.exec(`
      CREATE TABLE IF NOT EXISTS images (
        id TEXT PRIMARY KEY,
        filename TEXT NOT NULL,
        originalName TEXT NOT NULL,
        mimetype TEXT NOT NULL,
        size INTEGER NOT NULL,
        path TEXT NOT NULL,
        createdAt TEXT NOT NULL
      )
    `);

    db.exec(`CREATE INDEX IF NOT EXISTS idx_articles_publishDate ON articles(publishDate)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_articles_draft ON articles(isDraft)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_articles_title ON articles(title)`);

    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
    if (userCount.count === 0) {
      const bcrypt = await import('bcryptjs');
      const hashedPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10);
      
      db.prepare(`
        INSERT INTO users (id, username, password, role, createdAt)
        VALUES (?, ?, ?, ?, ?)
      `).run(
        uuidv4(),
        process.env.ADMIN_USERNAME || 'admin',
        hashedPassword,
        'admin',
        new Date().toISOString()
      );
    }

    const articleCount = db.prepare('SELECT COUNT(*) as count FROM articles').get();
    if (articleCount.count === 0) {
      const sampleArticles = [
        {
          id: uuidv4(),
          title: '欢迎访问我的个人博客',
          coverImage: 'https://picsum.photos/800/400?random=1',
          summary: '这是一个使用现代技术栈开发的个人博客网站，支持富文本编辑和代码编辑功能。',
          content: '<h2>欢迎来到我的博客</h2><p>这是一个使用 React + TypeScript + Tailwind CSS 构建的现代化博客系统。</p><p>功能特点：</p><ul><li>响应式设计，适配各种设备</li><li>支持富文本编辑</li><li>支持代码编辑</li><li>全文搜索功能</li></ul>',
          publishDate: new Date().toISOString().split('T')[0],
          tags: JSON.stringify(['欢迎', '博客', 'React']),
          isDraft: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: uuidv4(),
          title: 'React Hooks 完全指南',
          coverImage: 'https://picsum.photos/800/400?random=2',
          summary: '深入学习 React Hooks，包括 useState、useEffect、useContext 等常用 Hook 的使用方法和最佳实践。',
          content: '<h2>React Hooks 完全指南</h2><p>React Hooks 是 React 16.8 引入的新特性，让我们可以在函数组件中使用状态和其他 React 特性。</p><h3>useState</h3><p>useState 是最常用的 Hook，用于在函数组件中添加状态。</p>',
          publishDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
          tags: JSON.stringify(['React', 'Hooks', '前端']),
          isDraft: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: uuidv4(),
          title: 'Tailwind CSS 实战技巧',
          coverImage: 'https://picsum.photos/800/400?random=3',
          summary: '分享 Tailwind CSS 在实际项目中的使用技巧和经验总结。',
          content: '<h2>Tailwind CSS 实战技巧</h2><p>Tailwind CSS 是一个实用优先的 CSS 框架，本篇文章将分享一些实战技巧。</p><h3>响应式设计</h3><p>使用 Tailwind 可以轻松实现响应式设计。</p>',
          publishDate: new Date(Date.now() - 172800000).toISOString().split('T')[0],
          tags: JSON.stringify(['CSS', 'Tailwind', '前端']),
          isDraft: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      const insertArticle = db.prepare(`
        INSERT INTO articles (id, title, coverImage, summary, content, publishDate, tags, isDraft, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const article of sampleArticles) {
        insertArticle.run(
          article.id,
          article.title,
          article.coverImage,
          article.summary,
          article.content,
          article.publishDate,
          article.tags,
          article.isDraft,
          article.createdAt,
          article.updatedAt
        );
      }
    }

    console.log('✅ SQLite 数据库初始化成功');
    return db;
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
    throw error;
  }
}

export function getDB() {
  if (!db) {
    initDB();
  }
  return db;
}

export function getAllArticles(filters = {}) {
  const database = getDB();
  
  let sql = 'SELECT * FROM articles WHERE isDraft = 0';
  const params = [];

  if (filters.tag) {
    sql += ' AND tags LIKE ?';
    params.push(`%${filters.tag}%`);
  }

  if (filters.startDate) {
    sql += ' AND publishDate >= ?';
    params.push(filters.startDate);
  }

  if (filters.endDate) {
    sql += ' AND publishDate <= ?';
    params.push(filters.endDate);
  }

  sql += ' ORDER BY publishDate DESC';

  const articles = database.prepare(sql).all(...params);
  return articles.map(formatArticle);
}

export function getArticleById(id) {
  const database = getDB();
  const article = database.prepare('SELECT * FROM articles WHERE id = ?').get(id);
  return article ? formatArticle(article) : null;
}

export function searchArticles(keyword) {
  const database = getDB();
  const lowerKeyword = `%${keyword.toLowerCase()}%`;

  const articles = database.prepare(`
    SELECT * FROM articles 
    WHERE isDraft = 0 
    AND (
      LOWER(title) LIKE ? 
      OR LOWER(content) LIKE ? 
      OR LOWER(summary) LIKE ?
    )
    ORDER BY publishDate DESC
  `).all(lowerKeyword, lowerKeyword, lowerKeyword);

  return articles.map(formatArticle);
}

export function createArticle(data) {
  const database = getDB();
  const now = new Date().toISOString();
  const id = uuidv4();

  const article = {
    id,
    title: data.title,
    coverImage: data.coverImage || '',
    summary: data.summary || '',
    content: data.content,
    publishDate: data.publishDate || now.split('T')[0],
    tags: JSON.stringify(data.tags || []),
    isDraft: data.isDraft ? 1 : 0,
    createdAt: now,
    updatedAt: now
  };

  database.prepare(`
    INSERT INTO articles (id, title, coverImage, summary, content, publishDate, tags, isDraft, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    article.id,
    article.title,
    article.coverImage,
    article.summary,
    article.content,
    article.publishDate,
    article.tags,
    article.isDraft,
    article.createdAt,
    article.updatedAt
  );

  return formatArticle(article);
}

export function updateArticle(id, data) {
  const database = getDB();
  const now = new Date().toISOString();

  const updates = [];
  const params = [];

  if (data.title !== undefined) {
    updates.push('title = ?');
    params.push(data.title);
  }
  if (data.coverImage !== undefined) {
    updates.push('coverImage = ?');
    params.push(data.coverImage);
  }
  if (data.summary !== undefined) {
    updates.push('summary = ?');
    params.push(data.summary);
  }
  if (data.content !== undefined) {
    updates.push('content = ?');
    params.push(data.content);
  }
  if (data.publishDate !== undefined) {
    updates.push('publishDate = ?');
    params.push(data.publishDate);
  }
  if (data.tags !== undefined) {
    updates.push('tags = ?');
    params.push(JSON.stringify(data.tags));
  }
  if (data.isDraft !== undefined) {
    updates.push('isDraft = ?');
    params.push(data.isDraft ? 1 : 0);
  }

  updates.push('updatedAt = ?');
  params.push(now);
  params.push(id);

  const sql = `UPDATE articles SET ${updates.join(', ')} WHERE id = ?`;
  const result = database.prepare(sql).run(...params);

  if (result.changes === 0) {
    return null;
  }

  return getArticleById(id);
}

export function deleteArticle(id) {
  const database = getDB();
  const result = database.prepare('DELETE FROM articles WHERE id = ?').run(id);
  return result.changes > 0;
}

export function getUserByUsername(username) {
  const database = getDB();
  const user = database.prepare('SELECT * FROM users WHERE username = ?').get(username);
  return user || null;
}

export function createUser(data) {
  const database = getDB();
  const bcrypt = await import('bcryptjs');
  const id = uuidv4();
  const now = new Date().toISOString();
  const hashedPassword = bcrypt.hashSync(data.password, 10);

  database.prepare(`
    INSERT INTO users (id, username, password, role, createdAt)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, data.username, hashedPassword, data.role || 'admin', now);

  return { id, username: data.username, role: data.role || 'admin', createdAt: now };
}

export function saveImage(filename, originalName, mimetype, size, path) {
  const database = getDB();
  const id = uuidv4();
  const now = new Date().toISOString();

  database.prepare(`
    INSERT INTO images (id, filename, originalName, mimetype, size, path, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, filename, originalName, mimetype, size, path, now);

  return { id, filename, originalName, mimetype, size, path, createdAt: now };
}

export function getImageByFilename(filename) {
  const database = getDB();
  return database.prepare('SELECT * FROM images WHERE filename = ?').get(filename);
}

export function deleteImage(filename) {
  const database = getDB();
  const result = database.prepare('DELETE FROM images WHERE filename = ?').run(filename);
  return result.changes > 0;
}

function formatArticle(article) {
  return {
    ...article,
    tags: JSON.parse(article.tags || '[]'),
    isDraft: Boolean(article.isDraft)
  };
}

export function backupDatabase() {
  const database = getDB();
  const backupPath = process.env.BACKUP_PATH || join(__dirname, 'backups');
  
  if (!fs.existsSync(backupPath)) {
    fs.mkdirSync(backupPath, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = join(backupPath, `blog-backup-${timestamp}.db`);
  
  database.backup(backupFile);
  
  console.log(`✅ 数据库备份成功: ${backupFile}`);
  return backupFile;
}
