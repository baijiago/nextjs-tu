interface CompressionControlsProps {
  quality: number;
  onQualityChange: (quality: number) => void;
  onCompress: () => void;
  isProcessing: boolean;
  disabled: boolean;
}

export default function CompressionControls({
  quality,
  onQualityChange,
  onCompress,
  isProcessing,
  disabled
}: CompressionControlsProps) {
  const getQualityLabel = (value: number): string => {
    if (value >= 90) return '极高质量';
    if (value >= 80) return '高质量';
    if (value >= 60) return '中等质量';
    if (value >= 40) return '低质量';
    return '极低质量';
  };

  const getQualityColor = (value: number): string => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const presetQualities = [
    { label: '极高质量', value: 95 },
    { label: '高质量', value: 85 },
    { label: '中等质量', value: 70 },
    { label: '低质量', value: 50 },
    { label: '极低质量', value: 30 }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">压缩设置</h3>

      <div className="space-y-4">
        {/* 质量滑块 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">
              压缩质量
            </label>
            <span className={`text-sm font-semibold ${getQualityColor(quality)}`}>
              {quality}% - {getQualityLabel(quality)}
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={quality}
            onChange={(e) => onQualityChange(parseInt(e.target.value))}
            disabled={disabled}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>最小压缩</span>
            <span>最大压缩</span>
          </div>
        </div>

        {/* 预设质量选项 */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            快速选择
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {presetQualities.map((preset) => (
              <button
                key={preset.value}
                onClick={() => onQualityChange(preset.value)}
                disabled={disabled}
                className={`px-3 py-2 text-xs rounded-md border transition-colors ${
                  quality === preset.value
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {preset.label}
                <br />
                <span className="text-xs opacity-75">{preset.value}%</span>
              </button>
            ))}
          </div>
        </div>

        {/* 压缩说明 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">压缩说明</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 质量越高，图片越清晰，但文件越大</li>
            <li>• 质量越低，文件越小，但图片可能有损失</li>
            <li>• 建议从 80% 开始尝试，根据效果调整</li>
            <li>• 压缩后的图片格式将转换为 JPEG</li>
          </ul>
        </div>

        {/* 压缩按钮 */}
        <button
          onClick={onCompress}
          disabled={disabled || isProcessing}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            disabled || isProcessing
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>压缩中...</span>
            </div>
          ) : (
            '开始压缩'
          )}
        </button>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}