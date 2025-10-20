'use client';

import { useState, useCallback } from 'react';
import ImageUpload from './components/ImageUpload';
import ImagePreview from './components/ImagePreview';
import CompressionControls from './components/CompressionControls';

export default function CompressPage() {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(80);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleImageUpload = useCallback((file: File) => {
    setOriginalImage(file);
    setCompressedImage(null);
  }, []);

  const handleCompress = useCallback(async () => {
    if (!originalImage) return;

    setIsProcessing(true);
    try {
      const compressedDataUrl = await compressImage(originalImage, quality);
      setCompressedImage(compressedDataUrl);
    } catch (error) {
      console.error('压缩失败:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [originalImage, quality]);

  const compressImage = (file: File, quality: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality / 100);
          resolve(compressedDataUrl);
        } else {
          reject(new Error('无法获取画布上下文'));
        }
      };

      img.onerror = () => reject(new Error('图片加载失败'));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleDownload = useCallback(() => {
    if (!compressedImage) return;

    const link = document.createElement('a');
    link.download = 'compressed-image.jpg';
    link.href = compressedImage;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [compressedImage]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">图片压缩工具</h1>
          <p className="text-gray-600">上传图片并选择压缩质量来减小文件大小</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <ImageUpload onImageUpload={handleImageUpload} />
        </div>

        {originalImage && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <CompressionControls
              quality={quality}
              onQualityChange={setQuality}
              onCompress={handleCompress}
              isProcessing={isProcessing}
              disabled={!originalImage}
            />
          </div>
        )}

        {(originalImage || compressedImage) && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <ImagePreview
              originalImage={originalImage}
              compressedImage={compressedImage}
              onDownload={handleDownload}
            />
          </div>
        )}
      </div>
    </div>
  );
}