import React from 'react';
import { Article } from '../types';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const handleClick = () => {
    navigate(`/article/${article.id}`);
  };

  return (
    <article 
      className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl hover:shadow-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:bg-white/20 cursor-pointer group border border-white/10 h-full flex flex-col"
      onClick={handleClick}
    >
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50">
        <img
          src={article.coverImage || `https://picsum.photos/800/400?random=${article.id}`}
          alt={`${article.title} - ${article.summary.substring(0, 30)}...`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.src.includes('picsum.photos')) {
              target.src = `https://picsum.photos/800/400?random=${article.id}`;
            }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
          {article.title}
        </h3>
        
        <p className="text-white/70 mb-4 text-sm flex-grow line-clamp-3">
          {article.summary}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index} 
              className="bg-blue-500/20 text-blue-300 text-xs font-medium px-3 py-1 rounded-full border border-blue-500/30 hover:bg-blue-500/30 transition-colors duration-200"
            >
              {tag}
            </span>
          ))}
          {article.tags.length > 3 && (
            <span className="text-white/50 text-xs px-2 py-1">
              +{article.tags.length - 3}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <time className="text-sm text-white/50 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(article.publishDate).toLocaleDateString(language === 'en' ? 'en-US' : 'zh-CN', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </time>
          
          <span className="text-sm text-blue-400 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {t('readMore')}
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
