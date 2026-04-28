import { Article, ArticleFormData, SearchParams } from '../types';

const STORAGE_KEY = 'blog_articles';

const sampleArticles: Article[] = [
  {
    id: '1',
    title: '欢迎访问我的个人博客',
    coverImage: 'https://picsum.photos/800/400?random=10',
    summary: '这是一个使用现代技术栈开发的个人博客网站，支持富文本编辑和代码编辑功能。',
    content: '<h2>欢迎来到我的博客</h2><p>这是一个使用 React + TypeScript + Tailwind CSS 构建的现代化博客系统。</p><p>功能特点：</p><ul><li>响应式设计，适配各种设备</li><li>支持富文本编辑</li><li>支持代码编辑</li><li>全文搜索功能</li></ul>',
    publishDate: new Date().toISOString().split('T')[0],
    tags: ['欢迎', '博客', 'React'],
    isDraft: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'React Hooks 完全指南',
    coverImage: 'https://picsum.photos/800/400?random=20',
    summary: '深入学习 React Hooks，包括 useState、useEffect、useContext 等常用 Hook 的使用方法和最佳实践。',
    content: '<h2>React Hooks 完全指南</h2><p>React Hooks 是 React 16.8 引入的新特性，让我们可以在函数组件中使用状态和其他 React 特性。</p><h3>useState</h3><p>useState 是最常用的 Hook，用于在函数组件中添加状态。</p>',
    publishDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    tags: ['React', 'Hooks', '前端'],
    isDraft: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Tailwind CSS 实战技巧',
    coverImage: 'https://picsum.photos/800/400?random=30',
    summary: '分享 Tailwind CSS 在实际项目中的使用技巧和经验总结。',
    content: '<h2>Tailwind CSS 实战技巧</h2><p>Tailwind CSS 是一个实用优先的 CSS 框架，本篇文章将分享一些实战技巧。</p><h3>响应式设计</h3><p>使用 Tailwind 可以轻松实现响应式设计。</p>',
    publishDate: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    tags: ['CSS', 'Tailwind', '前端'],
    isDraft: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

function loadArticles(): Article[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    } else {
      saveArticles(sampleArticles);
      return sampleArticles;
    }
  } catch (error) {
    console.error('加载数据失败:', error);
    return sampleArticles;
  }
}

function saveArticles(articles: Article[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  } catch (error) {
    console.error('保存数据失败:', error);
  }
}

export const articleAPI = {
  getAll: (params?: SearchParams): Article[] => {
    let articles = loadArticles();
    
    articles = articles.filter(article => !article.isDraft);
    
    if (params?.tag) {
      articles = articles.filter(article => 
        article.tags.some(tag => tag.includes(params.tag!))
      );
    }
    
    if (params?.startDate) {
      articles = articles.filter(article => article.publishDate >= params.startDate!);
    }
    
    if (params?.endDate) {
      articles = articles.filter(article => article.publishDate <= params.endDate!);
    }
    
    return articles.sort((a, b) => 
      new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );
  },

  getById: (id: string): Article | null => {
    const articles = loadArticles();
    return articles.find(article => article.id === id) || null;
  },

  create: (data: ArticleFormData): Article => {
    const articles = loadArticles();
    const now = new Date().toISOString();
    
    const newArticle: Article = {
      id: Date.now().toString(),
      title: data.title,
      coverImage: data.coverImage || '',
      summary: data.summary || '',
      content: data.content,
      publishDate: data.publishDate || now.split('T')[0],
      tags: data.tags || [],
      isDraft: data.isDraft || false,
      createdAt: now,
      updatedAt: now
    };
    
    articles.push(newArticle);
    saveArticles(articles);
    return newArticle;
  },

  update: (id: string, data: ArticleFormData): Article | null => {
    const articles = loadArticles();
    const index = articles.findIndex(article => article.id === id);
    
    if (index === -1) return null;
    
    const updatedArticle: Article = {
      ...articles[index],
      title: data.title,
      coverImage: data.coverImage || articles[index].coverImage,
      summary: data.summary || articles[index].summary,
      content: data.content,
      publishDate: data.publishDate || articles[index].publishDate,
      tags: data.tags || articles[index].tags,
      isDraft: data.isDraft !== undefined ? data.isDraft : articles[index].isDraft,
      updatedAt: new Date().toISOString()
    };
    
    articles[index] = updatedArticle;
    saveArticles(articles);
    return updatedArticle;
  },

  delete: (id: string): void => {
    const articles = loadArticles();
    const filtered = articles.filter(article => article.id !== id);
    saveArticles(filtered);
  },

  search: (keyword: string): Article[] => {
    const articles = loadArticles();
    const lowerKeyword = keyword.toLowerCase();
    
    return articles
      .filter(article => 
        !article.isDraft && (
          article.title.toLowerCase().includes(lowerKeyword) ||
          article.content.toLowerCase().includes(lowerKeyword) ||
          article.summary.toLowerCase().includes(lowerKeyword)
        )
      )
      .sort((a, b) => 
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
      );
  },
};
