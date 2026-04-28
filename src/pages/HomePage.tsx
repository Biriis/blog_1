import React, { useEffect, useState, useRef } from 'react';
import { articleAPI } from '../utils/storage';
import { Article } from '../types';
import ArticleCard from '../components/ArticleCard';
import SearchBar from '../components/SearchBar';
import Header from '../components/Header';

const HomePage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [hasLastFrame, setHasLastFrame] = useState(() => {
    return typeof window !== 'undefined' && !!sessionStorage.getItem('videoLastFrame');
  });
  const [showContent, setShowContent] = useState(() => {
    return typeof window !== 'undefined' && !!sessionStorage.getItem('videoLastFrame');
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    loadArticles();
    
    const lastFrame = sessionStorage.getItem('videoLastFrame');
    if (lastFrame) {
      setHasLastFrame(true);
      setShowContent(true);
    } else {
      setHasLastFrame(false);
      setShowContent(false);
    }
  }, []);

  const loadArticles = () => {
    const data = articleAPI.getAll();
    setArticles(data);
  };

  const captureLastFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/png');
        sessionStorage.setItem('videoLastFrame', dataUrl);
      }
    }
  };

  const handleVideoTimeUpdate = () => {
    if (videoRef.current && !showContent) {
      const currentTime = videoRef.current.currentTime;
      if (currentTime >= 3) {
        setShowContent(true);
        captureLastFrame();
      }
    }
  };

  const handleVideoEnded = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      captureLastFrame();
      setHasLastFrame(true);
    }
  };

  return (
    <div className="min-h-screen relative">
      <canvas ref={canvasRef} className="hidden" />
      <div className="fixed inset-0 z-0">
        {hasLastFrame ? (
          <img
            src={sessionStorage.getItem('videoLastFrame') || ''}
            alt="Background"
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            src="/background.mp4"
            autoPlay
            muted
            playsInline
            onTimeUpdate={handleVideoTimeUpdate}
            onEnded={handleVideoEnded}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/70" />
      </div>
      
      {showContent && (
        <div className="relative z-10 animate-content-in">
          <Header />
        
          <main>
            <section className="container mx-auto px-4 py-20 sm:py-24 lg:py-32">
              <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight animate-slide-up">
                  欢迎来到我的博客
                </h1>
                <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto animate-slide-up" style={{animationDelay: '0.1s'}}>
                  分享技术心得，记录生活点滴。在这里，每一次点击都是新的发现。
                </p>
                <div className="flex justify-center animate-slide-up" style={{animationDelay: '0.2s'}}>
                  <SearchBar />
                </div>
              </div>
            </section>

            <section className="container mx-auto px-4 py-16 sm:py-20">
              <div className="mb-10 transition-all duration-1000 delay-300 opacity-100 translate-y-0">
                <div className="flex items-center gap-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                      最新文章
                    </h2>
                    <p className="text-white/60">发现精彩内容</p>
                  </div>
                  <div className="hidden sm:block flex-1 max-w-md h-1 bg-gradient-to-r from-blue-500 via-white to-purple-500 rounded-full" />
                </div>
              </div>

              {articles.length === 0 ? (
                <div className="text-center py-20 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 transition-all duration-1000 delay-500 opacity-100 translate-y-0">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <p className="text-white text-lg mb-2">暂无文章</p>
                  <p className="text-white/60 text-sm">敬请期待更多精彩内容</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {articles.map((article, index) => (
                    <div 
                      key={article.id} 
                      className="transition-all duration-1000 opacity-100 translate-y-0"
                      style={{transitionDelay: `${400 + index * 100}ms`}}
                    >
                      <ArticleCard article={article} />
                    </div>
                  ))}
                </div>
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
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes content-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }
        
        .animate-content-in {
          animation: content-in 0.5s ease-in forwards;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
