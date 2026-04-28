import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { Article } from '../types';
import Header from '../components/Header';

const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    const loadArticle = async () => {
      if (id) {
        try {
          const data = await api.getArticle(id);
          setArticle(data);
        } catch (error) {
          console.error('Failed to load article:', error);
          setArticle(null);
        }
      }
    };
    loadArticle();
  }, [id]);

  const handleBack = () => {
    navigate('/');
  };

  const handleBack = () => {
    navigate('/');
  };

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="w-20 h-20 mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">文章不存在</h2>
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl animate-fade-in-up">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8 font-medium transition-colors group"
        >
          <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回列表
        </button>

        <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {article.coverImage && (
            <div className="relative h-64 sm:h-96 overflow-hidden">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          )}

          <div className="p-6 sm:p-10">
            <header className="mb-8 pb-8 border-b border-gray-100">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                <span className="inline-flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  发布于 {new Date(article.publishDate).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-50 text-blue-700 text-sm px-4 py-2 rounded-full font-medium hover:bg-blue-100 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </header>

            <div 
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-gray-800 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-gray-700 [&_p]:mb-4 [&_p]:leading-relaxed [&_ul]:mb-4 [&_ul]:pl-6 [&_li]:mb-2 [&_a]:text-blue-500 [&_a]:underline [&_img]:rounded-lg [&_img]:mt-4 [&_img]:mb-4 [&_pre]:bg-gray-100 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-auto [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </article>

        <div className="mt-12 flex justify-center">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-8 py-3 rounded-full hover:border-blue-500 hover:text-blue-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回首页
          </button>
        </div>
      </main>

      <footer className="bg-gray-900 text-gray-400 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} 我的博客. All rights reserved.</p>
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
          animation: fade-in-up 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ArticleDetailPage;
