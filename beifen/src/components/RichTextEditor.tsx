import React, { useRef, useCallback, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value, 
  onChange, 
  placeholder = '请输入内容...',
  disabled = false
}) => {
  const quillRef = useRef<ReactQuill>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadType, setUploadType] = useState<'image' | 'video'>('image');

  const imageHandler = useCallback(() => {
    if (disabled) return;
    
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/jpeg,image/png,image/gif,image/webp,image/bmp');
    input.click();

    input.onchange = async () => {
      if (!input.files || input.files.length === 0) return;
      
      const file = input.files[0];
      
      if (file.size > 50 * 1024 * 1024) {
        setErrorMessage('文件大小不能超过 50MB');
        setUploadStatus('error');
        setTimeout(() => setUploadStatus('idle'), 3000);
        return;
      }

      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
      if (!validTypes.includes(file.type)) {
        setErrorMessage('只能上传 JPG、PNG、GIF、WebP、BMP 格式的图片');
        setUploadStatus('error');
        setTimeout(() => setUploadStatus('idle'), 3000);
        return;
      }

      setUploadType('image');
      setUploadStatus('uploading');
      setUploadProgress(0);

      const formData = new FormData();
      formData.append('image', file);

      try {
        const token = localStorage.getItem('adminToken');
        
        if (!token) {
          setErrorMessage('请先登录');
          setUploadStatus('error');
          setTimeout(() => setUploadStatus('idle'), 3000);
          return;
        }

        const xhr = new XMLHttpRequest();
        
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            setUploadProgress(percentComplete);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              
              const quill = quillRef.current?.getEditor();
              if (quill) {
                const range = quill.getSelection(true);
                if (range) {
                  const index = range.index;
                  quill.insertEmbed(index, 'image', data.url, 'user');
                  quill.setSelection(index + 1, 0, 'user');
                }
              }
              setUploadStatus('success');
              setTimeout(() => setUploadStatus('idle'), 2000);
            } catch (err) {
              console.error('插入图片失败:', err);
              setErrorMessage('上传成功，但插入图片失败');
              setUploadStatus('error');
              setTimeout(() => setUploadStatus('idle'), 3000);
            }
          } else {
            let errorMsg = '上传失败';
            try {
              const errorData = JSON.parse(xhr.responseText);
              errorMsg = errorData.error || errorMsg;
            } catch {
              // Ignore parse error, use default message
            }
            setErrorMessage(errorMsg);
            setUploadStatus('error');
            setTimeout(() => setUploadStatus('idle'), 3000);
          }
        };

        xhr.onerror = () => {
          setErrorMessage('网络错误，请检查网络连接');
          setUploadStatus('error');
          setTimeout(() => setUploadStatus('idle'), 3000);
        };

        xhr.open('POST', `${API_BASE}/upload`);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.withCredentials = true;
        xhr.send(formData);

      } catch (error) {
        console.error('上传图片失败:', error);
        setErrorMessage('图片上传失败，请重试');
        setUploadStatus('error');
        setTimeout(() => setUploadStatus('idle'), 3000);
      }
    };
  }, [disabled]);

  const videoHandler = useCallback(() => {
    if (disabled) return;
    
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'video/mp4,video/webm,video/ogg,video/quicktime,video/x-msvideo');
    input.click();

    input.onchange = async () => {
      if (!input.files || input.files.length === 0) return;
      
      const file = input.files[0];
      
      if (file.size > 100 * 1024 * 1024) {
        setErrorMessage('视频大小不能超过 100MB');
        setUploadStatus('error');
        setTimeout(() => setUploadStatus('idle'), 3000);
        return;
      }

      const isVideo = file.type.startsWith('video/') || 
        /\.(mp4|webm|ogg|mov|avi)$/i.test(file.name);
      
      if (!isVideo) {
        setErrorMessage('只能上传 MP4、WebM、OGG、MOV、AVI 格式的视频');
        setUploadStatus('error');
        setTimeout(() => setUploadStatus('idle'), 3000);
        return;
      }

      setUploadType('video');
      setUploadStatus('uploading');
      setUploadProgress(0);

      const formData = new FormData();
      formData.append('image', file);

      try {
        const token = localStorage.getItem('adminToken');
        
        if (!token) {
          setErrorMessage('请先登录');
          setUploadStatus('error');
          setTimeout(() => setUploadStatus('idle'), 3000);
          return;
        }

        const xhr = new XMLHttpRequest();
        
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            setUploadProgress(percentComplete);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              const quill = quillRef.current?.getEditor();
              if (quill) {
                const range = quill.getSelection(true);
                if (range) {
                  const index = range.index;
                  quill.insertEmbed(index, 'video', data.url);
                  (quill as any).setSelection(index + 1);
                }
              }
              setUploadStatus('success');
              setTimeout(() => setUploadStatus('idle'), 2000);
            } catch {
              setErrorMessage('上传成功，但解析响应失败');
              setUploadStatus('error');
              setTimeout(() => setUploadStatus('idle'), 3000);
            }
          } else {
            let errorMsg = '上传失败';
            try {
              const errorData = JSON.parse(xhr.responseText);
              errorMsg = errorData.error || errorMsg;
            } catch {
              // Ignore parse error, use default message
            }
            setErrorMessage(errorMsg);
            setUploadStatus('error');
            setTimeout(() => setUploadStatus('idle'), 3000);
          }
        };

        xhr.onerror = () => {
          setErrorMessage('网络错误，请检查网络连接');
          setUploadStatus('error');
          setTimeout(() => setUploadStatus('idle'), 3000);
        };

        xhr.open('POST', `${API_BASE}/upload`);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.withCredentials = true;
        xhr.send(formData);

      } catch (error) {
        console.error('上传视频失败:', error);
        setErrorMessage('视频上传失败，请重试');
        setUploadStatus('error');
        setTimeout(() => setUploadStatus('idle'), 3000);
      }
    };
  }, [disabled]);

  useEffect(() => {
    const quill = quillRef.current?.getEditor();
    if (quill && !disabled) {
      const toolbar = quill.getModule('toolbar');
      if (toolbar) {
        if (!toolbar.handlers.image) {
          toolbar.addHandler('image', imageHandler);
        }
        if (!toolbar.handlers.video) {
          toolbar.addHandler('video', videoHandler);
        }
      }
    }
  }, [imageHandler, videoHandler, disabled]);

  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: disabled ? {} : {
        image: imageHandler,
        video: videoHandler
      }
    },
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'color', 'background',
    'align',
    'link', 'image', 'video'
  ];

  const handleClearError = () => {
    setUploadStatus('idle');
    setErrorMessage('');
  };

  return (
    <div className="bg-white">
      {uploadStatus === 'uploading' && (
        <div className="mb-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-blue-700 font-medium">
                正在上传{uploadType === 'image' ? '图片' : '视频'}...
              </p>
              <div className="mt-1 w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {uploadStatus === 'success' && (
        <div className="mb-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">{uploadType === 'image' ? '图片' : '视频'}上传成功</span>
          </div>
        </div>
      )}

      {uploadStatus === 'error' && (
        <div className="mb-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">{errorMessage || '上传失败'}</span>
            </div>
            <button
              onClick={handleClearError}
              className="text-red-500 hover:text-red-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={disabled ? () => {} : onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className={`h-96 mb-12 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
        readOnly={disabled}
      />

      <style>{`
        .ql-toolbar.ql-snow {
          border-color: #d1d5db !important;
          border-radius: 0.5rem 0.5rem 0 0;
          background-color: #f9fafb;
        }
        .ql-container.ql-snow {
          border-color: #d1d5db !important;
          border-radius: 0 0 0.5rem 0.5rem;
        }
        .ql-editor {
          min-height: 300px;
          font-size: 16px;
          line-height: 1.75;
        }
        .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
        .ql-editor video {
          max-width: 100%;
          height: auto;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
