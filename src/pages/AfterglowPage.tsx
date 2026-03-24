import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Heart, BookOpen, Share2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { guidingQuestions, analyzeFeeling, spiritualGoals } from '@/data/philosophyData';

export default function AfterglowPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const productName = location.state?.productName || '这件商品';
  const savedAmount = location.state?.savedAmount || 0;
  
  const [step, setStep] = useState(1); // 1: 引导问题, 2: 输入感受, 3: AI共鸣, 4: 自由进度条
  const [question, setQuestion] = useState('');
  const [feeling, setFeeling] = useState('');
  const [soulQuote, setSoulQuote] = useState<any>(null);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [refusalCount, setRefusalCount] = useState(0);
  const [totalSaved, setTotalSaved] = useState(0);
  const [showBookmark, setShowBookmark] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    // 从 localStorage 加载数据
    const saved = localStorage.getItem('afterglow_data');
    if (saved) {
      const data = JSON.parse(saved);
      setRefusalCount(data.refusalCount || 0);
      setTotalSaved(data.totalSaved || 0);
      setSelectedGoal(data.selectedGoal || null);
    }
    
    // 随机选择一个引导问题
    const randomQuestion = guidingQuestions[Math.floor(Math.random() * guidingQuestions.length)];
    setQuestion(randomQuestion);
  }, []);

  const handleNextStep = async () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!feeling.trim()) {
        toast.error('请写下你的感受');
        return;
      }
      
      setIsAnalyzing(true);
      
      try {
        // 调用AI灵魂共鸣Edge Function
        const response = await fetch('https://app-9pjyq18643cx-supabase.appmiaoda.com/functions/v1/soul-echo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            feeling,
            productName,
            savedAmount
          })
        });

        if (!response.ok) {
          throw new Error('AI分析失败');
        }

        const data = await response.json();

        if (data.success) {
          setSoulQuote({ text: data.quote });
        } else {
          throw new Error('分析结果异常');
        }
      } catch (error) {
        console.error('AI共鸣错误:', error);
        toast.error('AI分析失败，使用默认名言');
        
        // 降级：使用本地分析
        const quote = analyzeFeeling(feeling);
        setSoulQuote(quote);
      } finally {
        setIsAnalyzing(false);
      }
      
      setStep(3);
      
      // 更新统计数据
      const newRefusalCount = refusalCount + 1;
      const newTotalSaved = totalSaved + savedAmount;
      setRefusalCount(newRefusalCount);
      setTotalSaved(newTotalSaved);
      
      // 保存到 localStorage
      const data = {
        refusalCount: newRefusalCount,
        totalSaved: newTotalSaved,
        selectedGoal,
        lastRefusal: {
          date: new Date().toISOString(),
          productName,
          savedAmount,
          feeling
        }
      };
      localStorage.setItem('afterglow_data', JSON.stringify(data));
    } else if (step === 3) {
      setShowBookmark(true);
      setTimeout(() => {
        setStep(4);
      }, 3000);
    }
  };

  const handleSelectGoal = (goal: any) => {
    setSelectedGoal(goal);
    const data = JSON.parse(localStorage.getItem('afterglow_data') || '{}');
    data.selectedGoal = goal;
    localStorage.setItem('afterglow_data', JSON.stringify(data));
    toast.success(`已设定目标：${goal.title}`);
  };

  const handleShare = () => {
    toast.success('断念书签已生成，可以分享给朋友了！');
  };

  const goalProgress = selectedGoal 
    ? Math.min((refusalCount / selectedGoal.requiredRefusals) * 100, 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-merit-green/5 relative overflow-hidden">
      {/* 顶部返回按钮 */}
      <div className="fixed top-0 left-0 right-0 z-50 p-4">
        <Button
          size="icon"
          variant="ghost"
          className="bg-card/80 backdrop-blur-sm hover:bg-card"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      {/* 动态背景 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-merit-green/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6 pt-20">{/* 增加顶部padding避免被返回按钮遮挡 */}
        {/* Step 1: 引导问题 */}
        {step === 1 && (
          <div className="w-full max-w-2xl space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <div className="text-6xl mb-6 animate-bounce">✨</div>
              <h1 className="text-3xl font-bold text-foreground mb-4">
                断念后的余韵
              </h1>
              <p className="text-muted-foreground">
                恭喜你，成功拒绝了 <span className="text-secondary font-medium">{productName}</span>
              </p>
              <p className="text-lg text-merit-green font-medium">
                省下了 ¥{savedAmount}
              </p>
            </div>

            <Card className="p-8 bg-card/80 backdrop-blur-sm border-primary/20">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-foreground mb-3">
                      灵魂赎回笔录
                    </h3>
                    <p className="text-base text-foreground leading-relaxed italic">
                      "{question}"
                    </p>
                  </div>
                </div>

                <Button
                  className="w-full h-12 text-base"
                  onClick={handleNextStep}
                >
                  <Heart className="w-5 h-5 mr-2" />
                  记录此刻的感受
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Step 2: 输入感受 */}
        {step === 2 && (
          <div className="w-full max-w-2xl space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <div className="text-6xl mb-6">🌙</div>
              <h2 className="text-2xl font-bold text-foreground">
                写下你的感受
              </h2>
              <p className="text-muted-foreground">
                这些文字只属于你自己，诚实地面对内心
              </p>
            </div>

            <Card className="p-8 bg-card/80 backdrop-blur-sm">
              <div className="space-y-6">
                <div className="text-sm text-muted-foreground mb-2">
                  {question}
                </div>
                <Textarea
                  placeholder="在这里写下你的感受..."
                  value={feeling}
                  onChange={(e) => setFeeling(e.target.value)}
                  className="min-h-40 text-base resize-none bg-background/50"
                  autoFocus
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>已输入 {feeling.length} 字</span>
                  <span>建议至少 20 字</span>
                </div>
                <Button
                  className="w-full h-12 text-base"
                  onClick={handleNextStep}
                  disabled={feeling.length < 20 || isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      AI 正在分析...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      让 AI 为你找到共鸣
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Step 3: AI 灵魂共鸣 */}
        {step === 3 && soulQuote && (
          <div className="w-full max-w-2xl space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <div className="text-6xl mb-6 animate-pulse">🌟</div>
              <h2 className="text-2xl font-bold text-foreground">
                灵魂共鸣
              </h2>
              <p className="text-muted-foreground">
                AI 从人类文明的哲学库中为你找到了这句话
              </p>
            </div>

            {/* 断念书签 */}
            {showBookmark ? (
              <Card className="p-8 bg-gradient-to-br from-primary/10 via-card to-merit-green/10 backdrop-blur-sm border-primary/30 shadow-2xl animate-scale-in">
                <div className="space-y-6 text-center">
                  <div className="text-4xl mb-4">📖</div>
                  <h3 className="text-xl font-bold text-foreground">
                    断念书签
                  </h3>
                  <div className="bg-background/50 p-6 rounded-lg space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <p className="text-base text-foreground leading-relaxed">
                      {feeling}
                    </p>
                    <div className="border-t border-border pt-4 mt-4">
                      <div className="text-base text-primary leading-relaxed whitespace-pre-wrap">
                        {soulQuote.text}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    分享断念书签
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="p-8 bg-card/80 backdrop-blur-sm">
                <div className="space-y-6">
                  <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
                    <div className="text-lg text-primary leading-relaxed whitespace-pre-wrap">
                      {soulQuote.text}
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground text-center">
                      你的"抠门"不是寒酸，而是在与先贤同行
                    </p>
                  </div>

                  <Button
                    className="w-full h-12 text-base"
                    onClick={handleNextStep}
                  >
                    生成断念书签
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Step 4: 自由进度条 */}
        {step === 4 && (
          <div className="w-full max-w-2xl space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <div className="text-6xl mb-6">🗺️</div>
              <h2 className="text-2xl font-bold text-foreground">
                自由进度条
              </h2>
              <p className="text-muted-foreground">
                用一个大而美的未来，对抗小而碎的物欲
              </p>
            </div>

            {/* 当前进度 */}
            <Card className="p-6 bg-card/80 backdrop-blur-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-foreground">你的成就</h3>
                  <Badge className="bg-merit-green text-white">
                    第 {refusalCount} 次断念
                  </Badge>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-muted/30 p-4 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">累计拒绝</p>
                    <p className="text-3xl font-bold text-foreground">{refusalCount}</p>
                    <p className="text-xs text-muted-foreground">次</p>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">累计省下</p>
                    <p className="text-3xl font-bold text-merit-green">¥{totalSaved}</p>
                    <p className="text-xs text-muted-foreground">元</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* 选择目标 */}
            {!selectedGoal ? (
              <Card className="p-6 bg-card/80 backdrop-blur-sm">
                <h3 className="font-medium text-foreground mb-4">
                  设定你的终极精神目标
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {spiritualGoals.map((goal) => (
                    <button
                      key={goal.id}
                      onClick={() => handleSelectGoal(goal)}
                      className="p-4 bg-muted/30 hover:bg-muted/50 rounded-lg text-left transition-colors border border-transparent hover:border-primary/30"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{goal.image}</div>
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground mb-1">
                            {goal.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {goal.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            需要 {goal.requiredRefusals} 次断念 · 目标金额 ¥{goal.targetAmount}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            ) : (
              <Card className="p-6 bg-gradient-to-br from-merit-green/10 to-primary/10 backdrop-blur-sm border-merit-green/30">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-6xl mb-4">{selectedGoal.image}</div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {selectedGoal.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedGoal.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">断念进度</span>
                      <span className="text-foreground font-medium">
                        {refusalCount} / {selectedGoal.requiredRefusals} 次
                      </span>
                    </div>
                    <Progress value={goalProgress} className="h-3" />
                    <p className="text-xs text-muted-foreground text-center">
                      还需 {Math.max(0, selectedGoal.requiredRefusals - refusalCount)} 次断念
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">金额进度</span>
                      <span className="text-foreground font-medium">
                        ¥{totalSaved} / ¥{selectedGoal.targetAmount}
                      </span>
                    </div>
                    <Progress 
                      value={Math.min((totalSaved / selectedGoal.targetAmount) * 100, 100)} 
                      className="h-3" 
                    />
                    <p className="text-xs text-muted-foreground text-center">
                      还需 ¥{Math.max(0, selectedGoal.targetAmount - totalSaved)}
                    </p>
                  </div>

                  {goalProgress >= 100 && (
                    <div className="bg-merit-green/20 p-4 rounded-lg text-center border border-merit-green/30">
                      <p className="text-lg font-bold text-merit-green mb-2">
                        🎉 目标达成！
                      </p>
                      <p className="text-sm text-muted-foreground">
                        恭喜你，离彻底自由又近了一步
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
              >
                返回首页
              </Button>
              <Button
                className="bg-merit-green hover:bg-merit-green/90 text-white"
                onClick={() => navigate('/profile')}
              >
                查看我的成就
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 自定义动画样式 */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
