import React, { useEffect } from 'react';
import { SEOMetadata } from '../types/seo';

interface SEOProps extends SEOMetadata {
  children?: React.ReactNode;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords = 'tech blog,web development,React,TypeScript,Node.js',
  author = 'Blogger',
  ogImage = '/og-image.png',
  canonical,
  type = 'website',
  publishDate,
  modifiedDate,
  pathname = '',
  children
}) => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://your-blog.com';
  const siteName = 'Fly Blog';
  const fullUrl = `${siteUrl}${pathname}`;
  const fullTitle = `${title} | ${siteName}`;
  const fallbackOgImage = `${siteUrl}/og-image.png`;

  useEffect(() => {
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    const titleEl = document.querySelector('title');
    if (titleEl) {
      titleEl.textContent = fullTitle;
    } else {
      const newTitle = document.createElement('title');
      newTitle.textContent = fullTitle;
      document.head.appendChild(newTitle);
    }

    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', author);

    const canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonicalLink) {
      canonicalLink.href = canonical || fullUrl;
    } else {
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = canonical || fullUrl;
      document.head.appendChild(link);
    }

    updateMetaTag('og:type', type, true);
    updateMetaTag('og:title', fullTitle, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', ogImage || fallbackOgImage, true);
    updateMetaTag('og:url', fullUrl, true);
    updateMetaTag('og:site_name', siteName, true);
    updateMetaTag('og:locale', 'zh_CN', true);

    updateMetaTag('twitter:card', 'summary_large_image', true);
    updateMetaTag('twitter:title', fullTitle, true);
    updateMetaTag('twitter:description', description, true);
    updateMetaTag('twitter:image', ogImage || fallbackOgImage, true);
    updateMetaTag('twitter:site', '@yourtwitter', true);

    if (type === 'article' && publishDate) {
      updateMetaTag('article:published_time', publishDate, true);
      updateMetaTag('article:author', author, true);
      updateMetaTag('article:section', keywords.split(',')[0], true);
    }

    if (modifiedDate) {
      updateMetaTag('article:modified_time', modifiedDate, true);
    }

    return () => {
      const metas = document.querySelectorAll('meta[property^="og:"], meta[name="twitter:"]');
      metas.forEach(meta => {
        if (meta.parentNode) {
          meta.parentNode.removeChild(meta);
        }
      });
    };
  }, [title, description, keywords, author, ogImage, canonical, type, publishDate, modifiedDate, pathname, fullTitle, fullUrl, siteName, fallbackOgImage]);

  return <>{children}</>;
};

export default SEO;
