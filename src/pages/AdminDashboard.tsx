import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api, Article } from '../utils/api';

const AdminDashboard: React.FC = () => {
  const { isAuthenticated, token, logout } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<Article[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && token) {
      loadArticles();
    }
  }, [isAuthenticated, token]);

  const loadArticles = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await api.getArticles();
      setArticles(data);
    } catch (error) {
      console.error('加载文章失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      setSearchResults(null);
      return;
    }
    if (!token) return;
    try {
      const results = await api.searchArticles(searchKeyword);
      setSearchResults(results);
    } catch (error) {
      console.error('搜索失败:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (window.confirm('确定要删除这篇文章吗？')) {
      try {
        await api.deleteArticle(id, token);
        loadArticles();
      } catch (error) {
        console.error('删除失败:', error);
        alert('删除失败');
      }
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
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="搜索文章..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              搜索
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-600">加载中...</div>
        ) : displayArticles.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            {searchResults !== null ? '没有找到相关文章' : '暂无文章'}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    标题
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    发布日期
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    标签
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {article.publishDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {article.tags?.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          article.isDraft
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {article.isDraft ? '草稿' : '已发布'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Link
                        to={`/article/${article.id}`}
                        className="text-blue-600 hover:text-blue-900"
                        target="_blank"
                      >
                        查看
                      </Link>
                      <Link
                        to={`/admin/edit/${article.id}`}
                        className="text-green-600 hover:text-green-900"
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
