export const translations = {
  zh: {
    // Header
    home: '首页',
    myBlog: 'Fly博客',
    
    // HomePage
    welcome: '欢迎来到Fly博客',
    welcomeSubtitle: '分享技术心得，记录生活点滴。在这里，每一次点击都是新的发现。',
    latestArticles: '最新文章',
    discoverContent: '发现精彩内容',
    loading: '加载中...',
    noArticles: '暂无文章',
    stayTuned: '敬请期待更多精彩内容',
    readMore: '阅读更多',
    
    // Search
    searchPlaceholder: '搜索文章标题或关键词...',
    searchButton: '搜索',
    searchResults: '搜索结果',
    searching: '正在搜索...',
    noResults: '未找到相关文章',
    tryDifferentKeywords: '试试其他关键词',
    
    // Article Detail
    backToList: '返回列表',
    articleNotFound: '文章不存在',
    backToHome: '返回首页',
    publishDate: '发布日期',
    lastUpdated: '最后更新',
    tags: '标签',
    draft: '草稿',
    
    // Article Card
    viewArticle: '查看文章',
    
    // Footer
    allRightsReserved: '版权所有',
    
    // SEO
    siteName: 'Fly博客',
    siteDescription: '分享技术心得，记录生活点滴的博客网站。涵盖前端开发、后端技术、DevOps等领域的实战经验。',
    defaultKeywords: '技术博客,前端开发,React,TypeScript,Node.js,全栈开发',
    
    // Date format
    dateFormat: {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }
  },
  en: {
    // Header
    home: 'Home',
    myBlog: 'Fly Blog',
    
    // HomePage
    welcome: 'Welcome to Fly Blog',
    welcomeSubtitle: 'Share tech insights, record life moments. Every click brings new discoveries here.',
    latestArticles: 'Latest Articles',
    discoverContent: 'Discover Amazing Content',
    loading: 'Loading...',
    noArticles: 'No Articles Yet',
    stayTuned: 'Stay tuned for more exciting content',
    readMore: 'Read More',
    
    // Search
    searchPlaceholder: 'Search articles by title or keywords...',
    searchButton: 'Search',
    searchResults: 'Search Results',
    searching: 'Searching...',
    noResults: 'No Related Articles Found',
    tryDifferentKeywords: 'Try different keywords',
    
    // Article Detail
    backToList: 'Back to List',
    articleNotFound: 'Article Not Found',
    backToHome: 'Back to Home',
    publishDate: 'Published',
    lastUpdated: 'Last Updated',
    tags: 'Tags',
    draft: 'Draft',
    
    // Article Card
    viewArticle: 'View Article',
    
    // Footer
    allRightsReserved: 'All Rights Reserved',
    
    // SEO
    siteName: 'Fly Blog',
    siteDescription: 'A tech blog sharing development insights and life moments. Covering front-end, back-end, DevOps and more.',
    defaultKeywords: 'tech blog,web development,React,TypeScript,Node.js,full-stack development',
    
    // Date format
    dateFormat: {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }
  }
};

export type Language = 'zh' | 'en';
export type TranslationKey = keyof typeof translations.zh;
