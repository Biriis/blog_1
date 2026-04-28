import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { ArticleFormData } from '../types';
import RichTextEditor from '../components/RichTextEditor';
import CodeEditor from '../components/CodeEditor';

const ArticleEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    coverImage: '',
    summary: '',
    content: '',
    publishDate: new Date().toISOString().split('T')[0],
    tags: [],
    isDraft: false,
  });

  const [tagInput, setTagInput] = useState('');
  const [editorType, setEditorType] = useState<'rich' | 'code'>('rich');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isEditing && id) {
      loadArticle(id);
    }
  }, [isAuthenticated, isEditing, id]);

  const loadArticle = async (articleId: string) => {
    try {
      const article = await api.getArticle(articleId);
      if (article) {
        setFormData({
          title: article.title,
          coverImage: article.coverImage,
          summary: article.summary,
          content: article.content,
          publishDate: article.publishDate,
          tags: article.tags,
          isDraft: article.isDraft,
        });
      }
    } catch (err) {
      console.error('Failed to load article:', err);
      setError('加载文章失败');
    }
  };

  const handleSubmit = async (asDraft: boolean = false) => {
    if (!formData.title.trim()) {
      setError('请输入标题');
      return;
    }

    setError('');
    const data = { ...formData, isDraft: asDraft };
    const token = localStorage.getItem('token');

    if (!token) {
      setError('请先登录');
      navigate('/login');
      return;
    }

    try {
      if (isEditing && id) {
        await api.updateArticle(id, data, token);
      } else {
        await api.createArticle(data, token);
      }
      navigate('/admin');
    } catch (err) {
      console.error('Failed to save article:', err);
      setError('保存文章失败');
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-blue-600">
            {isEditing ? '编辑文章' : '创建新文章'}
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                标题 *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入文章标题"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                封面图片
              </label>
              <div className="space-y-3">
                <div className="flex gap-3 items-start">
                  <input
                    type="text"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="输入图片URL或上传本地图片"
                  />
                  <label className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const base64 = event.target?.result as string;
                            setFormData({ ...formData, coverImage: base64 });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    上传图片
                  </label>
                </div>
                {formData.coverImage && (
                  <div className="relative w-full">
                    <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-300">
                      <img
                        src={formData.coverImage}
                        alt="封面预览"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://picsum.photos/800/400?random=' + Date.now();
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, coverImage: '' })}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center justify-center shadow-lg"
                      title="清除图片"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                摘要
              </label>
              <textarea
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="请输入文章摘要"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                内容 *
              </label>
              
              <div className="mb-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setEditorType('rich')}
                  className={`px-4 py-2 rounded ${
                    editorType === 'rich' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  富文本编辑器
                </button>
                <button
                  type="button"
                  onClick={() => setEditorType('code')}
                  className={`px-4 py-2 rounded ${
                    editorType === 'code' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  HTML代码编辑器
                </button>
              </div>

              {editorType === 'rich' ? (
                <RichTextEditor
                  value={formData.content}
                  onChange={(value) => setFormData({ ...formData, content: value })}
                />
              ) : (
                <CodeEditor
                  value={formData.content}
                  onChange={(value) => setFormData({ ...formData, content: value })}
                  language="html"
                />
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                发布日期
              </label>
              <input
                type="date"
                value={formData.publishDate}
                onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                标签
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="输入标签后按回车添加"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  添加
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t">
              <button
                type="button"
                onClick={() => handleSubmit(false)}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                发布
              </button>
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
              >
                保存草稿
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ArticleEditor;
