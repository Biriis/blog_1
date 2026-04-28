import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-xl group-hover:shadow-blue-500/40 transition-all duration-300">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
              我的博客
            </span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link 
              to="/" 
              className="relative text-white/80 hover:text-white font-medium transition-colors duration-200 group"
            >
              <span>首页</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
