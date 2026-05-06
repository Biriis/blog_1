import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { Article } from '../types';

const AdminDashboard: React.FC = () => {
  const { isAuthenticated, logout, token } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<Article[] | null>(null);
  const [filter, setFilter] = useState<'all' | 'published' | 'drafts'>('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadArticles();
    }
  }, [isAuthenticated, filter, token]);

  const loadArticles = async () => {
    setLoading(true);
    try {
      if (token) {
        const allArticles = await api.getAdminArticles(token);
        
        let filteredArticles: Article[];
        if (filter === 'drafts') {
          filteredArticles = allArticles.filter(a => a.isDraft);
        } else if (filter === 'published') {
          filteredArticles = allArticles.filter(a => !a.isDraft);
        } else {
          filteredArticles = allArticles;
        }

        setArticles(filteredArticles);
        setSearchResults(null);
      }
    } catch (error) {
      console.error('加载文章失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchKeyword.trim()) {
      setSearchResults(null);
      return;
    }

    const searchLower = searchKeyword.toLowerCase();
    const results = articles.filter(article =>
      article.title.toLowerCase().includes(searchLower) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
    setSearchResults(results);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('确定要删除这篇文章吗？')) {
      try {
        if (token) {
          await api.deleteArticle(id, token);
          setArticles(prev => prev.filter(a => a.id !== id));
          setSearchResults(prev => prev ? prev.filter(a => a.id !== id) : null);
        }
      } catch (error) {
        console.error('删除文章失败:', error);
        alert('删除失败');
        await loadArticles();
      }
    }
  };

  const handlePublishDraft = async (id: string) => {
    if (window.confirm('确定要发布这篇草稿吗？')) {
      try {
        if (token) {
          const article = articles.find(a => a.id === id);
          if (article) {
            await api.updateArticle(id, { ...article, isDraft: false }, token);
            await loadArticles();
          }
        }
      } catch (error) {
        console.error('发布草稿失败:', error);
        alert('发布失败');
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
        <div className="mb-6 flex gap-4 items-center flex-wrap">
          <Link
            to="/admin/new"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            创建新文章
          </Link>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded ${
                filter === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setFilter('published')}
              className={`px-4 py-2 rounded ${
                filter === 'published'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              已发布
            </button>
            <button
              onClick={() => setFilter('drafts')}
              className={`px-4 py-2 rounded ${
                filter === 'drafts'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              草稿箱
            </button>
          </div>

          <div className="flex-1 flex gap-2 min-w-[300px]">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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

        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-500">加载中...</p>
          </div>
        ) : displayArticles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">
              {filter === 'drafts' ? '暂无草稿' : filter === 'published' ? '暂无已发布的文章' : '暂无文章'}
            </p>
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
                    状态
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
                    <td className="px-6 py-4">
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      {article.isDraft ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          草稿
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          已发布
                        </span>
                      )}
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
                      {article.isDraft && (
                        <button
                          onClick={() => handlePublishDraft(article.id)}
                          className="text-green-600 hover:text-green-900 mr-4"
                        >
                          发布
                        </button>
                      )}
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
