import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, RotateCcw, Check, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { mockProducts } from '@/data/mockData';
import { toast } from 'sonner';
import ProductCard from '@/components/product/ProductCard';

export default function CameraPage() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognizedProducts, setRecognizedProducts] = useState<any[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // 检测是否为移动设备
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };
    checkMobile();
  }, []);

  // 启动摄像头
  useEffect(() => {
    const startCamera = async () => {
      // 移动端不自动启动摄像头，使用文件选择
      if (isMobile) {
        return;
      }

      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment', // 优先使用后置摄像头
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        
        setStream(mediaStream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error('无法访问摄像头:', error);
        setCameraError('无法访问摄像头，请检查权限设置');
        toast.error('无法访问摄像头，请检查权限设置');
      }
    };

    startCamera();

    // 清理函数
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isMobile]);

  // 拍照
  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // 设置canvas尺寸与视频一致
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // 绘制当前视频帧到canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 获取图片数据
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageData);

    // 停止摄像头
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }

    // 调用图片识别
    recognizeImage(imageData);
  };

  // 移动端文件选择
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result as string;
      setCapturedImage(imageData);
      recognizeImage(imageData);
    };
    reader.readAsDataURL(file);
  };

  // 模拟图片识别
  const recognizeImage = async (imageData: string) => {
    setIsProcessing(true);
    
    try {
      // 调用Edge Function进行图像识别
      const response = await fetch('https://app-9pjyq18643cx-supabase.appmiaoda.com/functions/v1/image-recognition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData })
      });

      if (!response.ok) {
        throw new Error('图像识别失败');
      }

      const data = await response.json();

      if (!data.success || !data.keywords || data.keywords.length === 0) {
        toast.error('未识别到商品，请重新拍照');
        setIsProcessing(false);
        return;
      }

      // 使用识别到的关键词搜索商品
      const keywords = data.keywords.map((item: any) => item.keyword);
      const searchResults = mockProducts.filter(product => {
        const searchText = `${product.name} ${product.description} ${product.category}`.toLowerCase();
        return keywords.some((keyword: string) => 
          searchText.includes(keyword.toLowerCase())
        );
      });

      // 如果没有匹配结果，显示随机商品
      const results = searchResults.length > 0 
        ? searchResults.slice(0, 5) 
        : mockProducts.slice(0, 5);
      
      setRecognizedProducts(results);
      setIsProcessing(false);
      
      toast.success(`识别成功！找到关键词：${keywords.slice(0, 3).join('、')}`, {
        duration: 3000
      });
    } catch (error) {
      console.error('识别错误:', error);
      toast.error('识别失败，请重试');
      setIsProcessing(false);
      
      // 降级：显示随机商品
      const fallbackResults = mockProducts.slice(0, 5);
      setRecognizedProducts(fallbackResults);
    }
  };

  // 重新拍照
  const handleRetake = async () => {
    setCapturedImage(null);
    setRecognizedProducts([]);
    setCameraError(null);

    if (isMobile) {
      // 移动端重新打开文件选择
      fileInputRef.current?.click();
    } else {
      // PC端重新启动摄像头
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        
        setStream(mediaStream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error('无法访问摄像头:', error);
        setCameraError('无法访问摄像头，请检查权限设置');
        toast.error('无法访问摄像头，请检查权限设置');
      }
    }
  };

  // 移动端拍照按钮
  const handleMobileCapture = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-50 bg-secondary text-secondary-foreground">
        <div className="flex items-center justify-between p-4">
          <Button
            size="icon"
            variant="ghost"
            className="text-secondary-foreground"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold">拍照识物</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* 提示卡片 */}
        <Card className="p-4 bg-gradient-to-r from-pdd-orange-light to-secondary/10 border-secondary/20">
          <div className="text-center space-y-2">
            <div className="text-4xl">📸</div>
            <p className="text-sm text-foreground font-medium">
              拍照识别商品，但请三思而后买
            </p>
            <p className="text-xs text-muted-foreground">
              {isMobile ? '点击下方按钮选择照片或拍照' : '对准商品拍照，系统会自动识别'}
            </p>
          </div>
        </Card>

        {/* 相机预览或拍摄结果 */}
        <Card className="overflow-hidden">
          {!capturedImage ? (
            <div className="relative aspect-[4/3] bg-muted">
              {isMobile ? (
                // 移动端：显示占位图和拍照按钮
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <Camera className="w-20 h-20 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">点击下方按钮拍照或选择图片</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </div>
              ) : (
                // PC端：显示摄像头预览
                <>
                  {cameraError ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-4">
                      <X className="w-20 h-20 text-destructive" />
                      <p className="text-sm text-destructive text-center">{cameraError}</p>
                      <Button onClick={handleRetake}>重试</Button>
                    </div>
                  ) : (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  )}
                </>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>
          ) : (
            // 显示拍摄的图片
            <div className="relative aspect-[4/3]">
              <img
                src={capturedImage}
                alt="拍摄的照片"
                className="w-full h-full object-cover"
              />
              {isProcessing && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-foreground">正在识别中...</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* 操作按钮 */}
        {!capturedImage ? (
          <div className="flex gap-3">
            {isMobile ? (
              <Button
                className="flex-1 h-14 pdd-button"
                onClick={handleMobileCapture}
              >
                <Camera className="w-5 h-5 mr-2" />
                拍照/选择图片
              </Button>
            ) : (
              <Button
                className="flex-1 h-14 pdd-button"
                onClick={handleCapture}
                disabled={!stream || !!cameraError}
              >
                <Camera className="w-5 h-5 mr-2" />
                拍照
              </Button>
            )}
          </div>
        ) : (
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleRetake}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              重新拍照
            </Button>
            <Button
              className="flex-1 pdd-button"
              onClick={() => navigate('/')}
            >
              <Check className="w-4 h-4 mr-2" />
              完成
            </Button>
          </div>
        )}

        {/* 识别结果 */}
        {recognizedProducts.length > 0 && (
          <div className="space-y-3">
            <Card className="p-4 bg-warning-yellow-light border-warning-yellow/20">
              <div className="flex items-start gap-3">
                <div className="text-2xl">⚠️</div>
                <div className="flex-1">
                  <p className="text-sm text-foreground font-medium mb-1">
                    识别到 {recognizedProducts.length} 个商品
                  </p>
                  <p className="text-sm text-muted-foreground">
                    但请冷静思考，这些真的是你需要的吗？
                  </p>
                </div>
              </div>
            </Card>

            <div>
              <h3 className="text-base font-bold text-foreground mb-3">识别结果</h3>
              <div className="grid grid-cols-2 gap-2">
                {recognizedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>

            {/* 劝败建议 */}
            <Card className="p-4 bg-merit-green-light border-merit-green/20">
              <h3 className="font-medium text-foreground mb-2">💡 理性消费建议</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 想买不等于需要买，冷静24小时再决定</li>
                <li>• 去"劝一刀"让价格涨到离谱</li>
                <li>• 把商品加入黑名单，远离诱惑</li>
                <li>• 想想这笔钱能买多少顿外卖</li>
              </ul>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
