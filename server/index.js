import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import { initDB, getAllArticles, getArticleById, createArticle, updateArticle, deleteArticle, searchArticles, getUserByUsername, saveImage, getImageByFilename } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (fs.existsSync('.env')) {
  const result = await import('dotenv/config');
}

const app = express();
const PORT = process.env.PORT || 3001;
const UPLOAD_DIR = process.env.UPLOAD_DIR || join(__dirname, 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|bmp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('只允许上传图片文件！'));
  }
});

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || '*',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: '请求过于频繁，请稍后再试' }
});

app.use('/api', limiter);

app.use('/uploads', express.static(UPLOAD_DIR));

await initDB();

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: '需要登录' });
  }

  try {
    const jwt = await import('jsonwebtoken');
    const decoded = jwt.default.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token 无效或已过期' });
  }
}

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码不能为空' });
    }

    const user = getUserByUsername(username);

    if (!user) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    const bcrypt = await import('bcryptjs');
    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    const jwt = await import('jsonwebtoken');
    const token = jwt.default.sign(
      { userId: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

app.get('/api/articles', (req, res) => {
  try {
    const { tag, startDate, endDate } = req.query;
    const articles = getAllArticles({ tag, startDate, endDate });
    res.json(articles);
  } catch (error) {
    console.error('获取文章列表失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.get('/api/articles/search', (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return res.json([]);
    }
    const articles = searchArticles(keyword);
    res.json(articles);
  } catch (error) {
    console.error('搜索失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.get('/api/articles/:id', (req, res) => {
  try {
    const article = getArticleById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: '文章不存在' });
    }
    res.json(article);
  } catch (error) {
    console.error('获取文章详情失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.post('/api/articles', authenticateToken, (req, res) => {
  try {
    const article = createArticle(req.body);
    res.status(201).json(article);
  } catch (error) {
    console.error('创建文章失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.put('/api/articles/:id', authenticateToken, (req, res) => {
  try {
    const article = updateArticle(req.params.id, req.body);
    if (!article) {
      return res.status(404).json({ error: '文章不存在' });
    }
    res.json(article);
  } catch (error) {
    console.error('更新文章失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.delete('/api/articles/:id', authenticateToken, (req, res) => {
  try {
    const success = deleteArticle(req.params.id);
    if (!success) {
      return res.status(404).json({ error: '文章不存在' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('删除文章失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请选择要上传的图片' });
    }

    const imageData = saveImage(
      req.file.filename,
      req.file.originalname,
      req.file.mimetype,
      req.file.size,
      `/uploads/${req.file.filename}`
    );

    res.json({
      url: imageData.path,
      filename: imageData.filename,
      originalName: imageData.originalName,
      size: imageData.size
    });
  } catch (error) {
    console.error('上传图片失败:', error);
    res.status(500).json({ error: '上传失败' });
  }
});

app.get('/api/images/:filename', (req, res) => {
  try {
    const image = getImageByFilename(req.params.filename);
    if (!image) {
      return res.status(404).json({ error: '图片不存在' });
    }
    res.json(image);
  } catch (error) {
    console.error('获取图片信息失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.use((err, req, res, next) => {
  console.error('错误:', err);
  
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: '文件大小不能超过 5MB' });
    }
    return res.status(400).json({ error: err.message });
  }

  if (err.message) {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({ error: '服务器错误' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║   🚀 服务器已启动                                       ║
║                                                        ║
║   📍 地址: http://localhost:${PORT}                       ║
║   📁 数据库: SQLite                                    ║
║   🛡️  安全: Helmet + Rate Limit                        ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
  `);
});
