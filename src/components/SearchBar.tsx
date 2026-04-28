import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  onSearch?: (keyword: string) => void;
  onClear?: () => void;
  showClear?: boolean;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  onClear,
  showClear = false,
  placeholder = "搜索文章标题或关键词..." 
}) => {
  const [keyword, setKeyword] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      if (onSearch) {
        onSearch(keyword);
      } else {
        navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
      }
    }
  };

  const handleClear = () => {
    setKeyword('');
    if (onClear) {
      onClear();
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl">
      <div className={`relative transition-all duration-300 ${isFocused ? 'transform scale-105' : ''}`}>
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg 
            className={`w-5 h-5 transition-colors duration-200 ${isFocused ? 'text-blue-400' : 'text-white/60'}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-12 pr-32 py-4 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
        />
        
        {showClear && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-24 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-md"
            title="清除搜索"
          >
            <svg 
              className="w-4 h-4 text-white"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-200 hover:shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!keyword.trim()}
        >
          搜索
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
