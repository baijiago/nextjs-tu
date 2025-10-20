import { useMemo } from 'react';

interface ImagePreviewProps {
  originalImage: File | null;
  compressedImage: string | null;
  onDownload: () => void;
}

export default function ImagePreview({ originalImage, compressedImage, onDownload }: ImagePreviewProps) {
  const originalImageUrl = useMemo(() => {
    return originalImage ? URL.createObjectURL(originalImage) : null;
  }, [originalImage]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCompressedFileSize = (): number => {
    if (!compressedImage) return 0;
    // 估算Base64编码后的文件大小
    const base64Length = compressedImage.split(',')[1]?.length || 0;
    return Math.round(base64Length * 0.75); // Base64解码后的大概大小
  };

  const compressionRatio = useMemo(() => {
    if (!originalImage || !compressedImage) return 0;
    const originalSize = originalImage.size;
    const compressedSize = getCompressedFileSize();
    return Math.round(((originalSize - compressedSize) / originalSize) * 100);
  }, [originalImage, compressedImage]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">图片预览</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 原始图片 */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">原始图片</h4>
          {originalImageUrl && (
            <div className="border rounded-lg overflow-hidden">
              <img
                src={originalImageUrl}
                alt="原始图片"
                className="w-full h-auto max-h-64 object-contain bg-gray-50"
              />
            </div>
          )}
          {originalImage && (
            <div className="text-sm text-gray-600 space-y-1">
              <p>文件名: {originalImage.name}</p>
              <p>文件大小: {formatFileSize(originalImage.size)}</p>
              <p>图片类型: {originalImage.type}</p>
            </div>
          )}
        </div>

        {/* 压缩后图片 */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">压缩后图片</h4>
          {compressedImage ? (
            <>
              <div className="border rounded-lg overflow-hidden">
                <img
                  src={compressedImage}
                  alt="压缩后图片"
                  className="w-full h-auto max-h-64 object-contain bg-gray-50"
                />
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>文件大小: {formatFileSize(getCompressedFileSize())}</p>
                <p>压缩比例: {compressionRatio}%</p>
                <p>图片类型: image/jpeg</p>
              </div>
              <button
                onClick={onDownload}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                下载压缩后的图片
              </button>
            </>
          ) : (
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center text-gray-500">
              <p>压缩后的图片将在这里显示</p>
            </div>
          )}
        </div>
      </div>

      {/* 压缩统计 */}
      {compressedImage && originalImage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-800 mb-2">压缩结果</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600">原始大小</p>
              <p className="font-semibold text-green-800">{formatFileSize(originalImage.size)}</p>
            </div>
            <div>
              <p className="text-gray-600">压缩后大小</p>
              <p className="font-semibold text-green-800">{formatFileSize(getCompressedFileSize())}</p>
            </div>
            <div>
              <p className="text-gray-600">节省空间</p>
              <p className="font-semibold text-green-800">{formatFileSize(originalImage.size - getCompressedFileSize())}</p>
            </div>
            <div>
              <p className="text-gray-600">压缩比例</p>
              <p className="font-semibold text-green-800">{compressionRatio}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}