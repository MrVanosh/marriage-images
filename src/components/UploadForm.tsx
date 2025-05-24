'use client';

import { uploadImages } from '@/utils/uploadImages';
import { useTranslations } from 'next-intl';
import { useCallback, useRef, useState } from 'react';

export function UploadForm() {
  const t = useTranslations('Upload');
  const [files, setFiles] = useState<File[]>([]);
  const [uploaderName, setUploaderName] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList) => {
    const validFiles: File[] = [];
    const maxSize = 50 * 1024 * 1024; // 50MB
    const validTypes = ['image/jpeg', 'image/png', 'image/heic', 'image/heif'];

    Array.from(fileList).forEach((file) => {
      if (!validTypes.includes(file.type.toLowerCase())) {
        setUploadError(t('invalid_format'));
        return;
      }
      if (file.size > maxSize) {
        setUploadError(t('file_too_large'));
        return;
      }
      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      setFiles(validFiles);
      setUploadError(null);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      await uploadImages(files, uploaderName, description);
      setUploadSuccess(true);
      setFiles([]);
      setUploaderName('');
      setDescription('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setUploadError(t('upload_error'));
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* File Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
          isDragActive
            ? 'border-gray-900 bg-gray-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={t('select_files')}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/heic,image/heif"
          onChange={handleFileInput}
          className="sr-only"
          disabled={isUploading}
        />

        <div className="space-y-4">
          <div className="text-4xl">📷</div>
          <p className="text-lg text-gray-700">
            {files.length > 0
              ? t('files_selected', { count: files.length })
              : t('select_files')}
          </p>
          <p className="text-sm text-gray-500">{t('accepted_formats')}</p>
        </div>
      </div>

      {/* Uploader Name */}
      <div>
        <label
          htmlFor="uploader-name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t('your_name')}
        </label>
        <input
          id="uploader-name"
          type="text"
          value={uploaderName}
          onChange={e => setUploaderName(e.target.value)}
          placeholder={t('your_name_placeholder')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors duration-200"
          disabled={isUploading}
        />
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t('description')}
        </label>
        <textarea
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder={t('description_placeholder')}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors duration-200"
          disabled={isUploading}
        />
      </div>

      {/* Error Message */}
      {uploadError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {uploadError}
        </div>
      )}

      {/* Success Message */}
      {uploadSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {t('upload_success')}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex flex-col gap-4">
        <button
          type="submit"
          disabled={files.length === 0 || isUploading}
          className="w-full py-3 px-6 text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
          aria-label={t('upload_button')}
        >
          {isUploading ? t('uploading') : t('upload_button')}
        </button>

        {uploadSuccess && (
          <button
            type="button"
            onClick={() => {
              setUploadSuccess(false);
              fileInputRef.current?.click();
            }}
            className="w-full py-3 px-6 text-gray-900 bg-white border-2 border-gray-900 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
            aria-label={t('upload_more')}
          >
            {t('upload_more')}
          </button>
        )}
      </div>
    </form>
  );
}
