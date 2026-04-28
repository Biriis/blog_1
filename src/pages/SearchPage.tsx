import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { articleAPI } from '../utils/storage';
import { Article } from '../types';
import ArticleCard from '../components/ArticleCard';
import SearchBar from '../components/SearchBar';
import Header from '../components/Header';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [hasLastFrame, setHasLastFrame] = useState(() => {
    return typeof window !== 'undefined' && !!sessionStorage.getItem('videoLastFrame');
  });
  const keyword = searchParams.get('keyword') || '';

  useEffect(() => {
    if (keyword) {
      const data = articleAPI.search(keyword);
      setArticles(data);
    }
    
    const lastFrame = sessionStorage.getItem('videoLastFrame');
    setHasLastFrame(!!lastFrame);
  }, [keyword]);

  const handleClearSearch = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 z-0">
        {hasLastFrame ? (
          <img
            src={sessionStorage.getItem('videoLastFrame') || ''}
            alt="Background"
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            src="/background.mp4"
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/70" />
      </div>
      
      <div className="relative z-10">
      <Header />
      
      <main>
        <section className="container mx-auto px-4 py-12 sm:py-16">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              搜索结果
            </h1>
            {keyword && (
              <p className="text-white/80">
                关键词: "<span className="font-semibold text-blue-400">{keyword}</span>"
              </p>
            )}
          </div>
          
          <div className="flex justify-center mb-12">
            <SearchBar 
              showClear={true}
              onClear={handleClearSearch}
            />
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-20 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <div className="w-20 h-20 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">未找到相关文章</h2>
              <p className="text-white/60 mb-6">试试其他关键词搜索</p>
            </div>
          ) : (
            <>
              <div className="mb-8 text-center">
                <p className="text-white/80">
                  找到 <span className="font-bold text-blue-400">{articles.length}</span> 篇相关文章
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {articles.map((article, index) => (
                  <div 
                    key={article.id} 
                    className="animate-fade-in-up"
                    style={{animationDelay: `${index * 100}ms`}}
                  >
                    <ArticleCard article={article} />
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      <footer className="bg-black/30 backdrop-blur-md border-t border-white/10 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="font-semibold text-white">我的博客</span>
            </div>
            <p className="text-sm text-white/60 text-center sm:text-right">
              <span>&copy; {new Date().getFullYear()} 我的博客.</span>
              <span className="hidden sm:inline"> All rights reserved.</span>
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
      </div>
    </div>
  );
};

export default SearchPage;
