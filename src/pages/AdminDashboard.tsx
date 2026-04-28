import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { articleAPI } from '../utils/storage';
import { Article } from '../types';

const AdminDashboard: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<Article[] | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadArticles();
    }
  }, [isAuthenticated]);

  const loadArticles = () => {
    const data = articleAPI.getAll();
    setArticles(data);
  };

  const handleSearch = () => {
    if (!searchKeyword.trim()) {
      setSearchResults(null);
      return;
    }
    const results = articleAPI.search(searchKeyword);
    setSearchResults(results);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这篇文章吗？')) {
      articleAPI.delete(id);
      loadArticles();
    }
  };

  const handleLogout = () => {
    logout();
  };

  const displayArticles = searchResults !== null ? searchResults : articles;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">请先 <Link to="/login" className="text-blue-600 hover:underline">登录</Link></p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">博客管理后台</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            退出登录
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex gap-4 items-center">
          <Link
            to="/admin/new"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            创建新文章
          </Link>
          
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="搜索文章..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded"
            />
            <button
              onClick={handleSearch}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              搜索
            </button>
            {searchResults !== null && (
              <button
                onClick={() => setSearchResults(null)}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
              >
                清除
              </button>
            )}
          </div>
        </div>

        {displayArticles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">暂无文章</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    标题
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    标签
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    发布日期
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{article.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {article.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(article.publishDate).toLocaleDateString('zh-CN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/admin/edit/${article.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        编辑
                      </Link>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
