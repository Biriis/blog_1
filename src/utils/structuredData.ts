import { ArticleSchema, WebsiteSchema, BreadcrumbSchema, BreadcrumbItem, OrganizationSchema } from '../types/seo';

const getSiteUrl = () => {
  return import.meta.env.VITE_SITE_URL || 'https://your-blog.com';
};

const getSiteName = () => {
  return 'Fly博客';
};

const getAuthorName = () => {
  return '博主';
};

export const generateArticleSchema = (article: {
  id: string;
  title: string;
  summary: string;
  coverImage?: string;
  publishDate: string;
  tags?: string[];
  content?: string;
  updatedAt?: string;
}): ArticleSchema => {
  const siteUrl = getSiteUrl();
  const siteName = getSiteName();
  const authorName = getAuthorName();
  
  const imageUrl = article.coverImage || `${siteUrl}/default-article-image.png`;
  const wordCount = article.content 
    ? article.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length 
    : 0;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': article.title,
    'description': article.summary,
    'image': imageUrl,
    'datePublished': article.publishDate,
    'dateModified': article.updatedAt || article.publishDate,
    'author': {
      '@type': 'Person',
      'name': authorName,
      'url': siteUrl
    },
    'publisher': {
      '@type': 'Organization',
      'name': siteName,
      'logo': {
        '@type': 'ImageObject',
        'url': `${siteUrl}/logo.png`
      }
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `${siteUrl}/article/${article.id}`
    },
    'keywords': article.tags?.join(', '),
    'articleSection': article.tags?.[0] || '技术',
    'wordCount': wordCount
  };
};

export const generateWebsiteSchema = (): WebsiteSchema => {
  const siteUrl = getSiteUrl();
  const siteName = getSiteName();
  const authorName = getAuthorName();

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': siteName,
    'url': siteUrl,
    'description': '分享技术心得，记录生活点滴的博客网站',
    'author': {
      '@type': 'Person',
      'name': authorName
    },
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': `${siteUrl}/search?keyword={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
};

export const generateBreadcrumbSchema = (items: BreadcrumbItem[]): BreadcrumbSchema => {
  const siteUrl = getSiteUrl();

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`
    }))
  };
};

export const generateOrganizationSchema = (): OrganizationSchema => {
  const siteUrl = getSiteUrl();
  const siteName = getSiteName();

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': siteName,
    'url': siteUrl,
    'logo': `${siteUrl}/logo.png`,
    'sameAs': [
      'https://github.com/yourgithub',
      'https://twitter.com/yourtwitter'
    ]
  };
};

export const generateArticleListSchema = (articles: Array<{id: string; title: string}>): {
  '@context': 'https://schema.org';
  '@type': 'ItemList';
  'itemListElement': Array<{
    '@type': 'ListItem';
    'position': number;
    'url': string;
    'name': string;
  }>;
} => {
  const siteUrl = getSiteUrl();

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'itemListElement': articles.map((article, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'url': `${siteUrl}/article/${article.id}`,
      'name': article.title
    }))
  };
};
