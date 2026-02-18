import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { mockDissuasionPosts, dissuasionComments } from '@/data/mockData';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

export default function DissuasionPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState(mockDissuasionPosts);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [customComment, setCustomComment] = useState('');
  const [meritPoints, setMeritPoints] = useState(0);

  const handleDissuade = (post: any) => {
    setSelectedPost(post);
    setShowDialog(true);
  };

  const sendDissuasion = (comment: string) => {
    if (selectedPost) {
      setPosts(posts.map(p => 
        p.id === selectedPost.id 
          ? { ...p, dissuasionCount: p.dissuasionCount + 1 }
          : p
      ));
      setMeritPoints(meritPoints + 10);
      toast.success('劝退成功！功德值 +10');
      setShowDialog(false);
      setCustomComment('');
    }
  };

  const getTimeAgo = (timestamp: number) => {
    const minutes = Math.floor((Date.now() - timestamp) / 60000);
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}小时前`;
    return `${Math.floor(hours / 24)}天前`;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-50 bg-primary text-primary-foreground">
        <div className="flex items-center justify-between p-4">
          <Button
            size="icon"
            variant="ghost"
            className="text-primary-foreground"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold">去劝退</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* 功德值展示 */}
        <Card className="p-4 bg-gradient-to-r from-merit-green-light to-merit-green/10 border-merit-green/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">我的功德值</p>
              <p className="text-3xl font-bold text-merit-green">{meritPoints}</p>
            </div>
            <div className="text-5xl">🏅</div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            每成功劝退一人，功德值 +10
          </p>
        </Card>

        {/* 劝退动态流 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">实时动态</h2>
            <Badge variant="secondary" className="animate-pulse">
              <TrendingUp className="w-3 h-3 mr-1" />
              热门
            </Badge>
          </div>

          {posts.map((post) => (
            <Card key={post.id} className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Avatar className="w-10 h-10 bg-muted" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground">
                      {post.userName}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {getTimeAgo(post.timestamp)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    正在犹豫要不要买{' '}
                    <span className="text-foreground font-medium">{post.productName}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={post.status === 'active' ? 'default' : 'secondary'}
                      className={post.status === 'active' ? 'bg-destructive' : ''}
                    >
                      {post.status === 'active' ? '犹豫中' : '已劝退'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {post.dissuasionCount} 人已劝退
                    </span>
                  </div>
                </div>
              </div>

              {post.status === 'active' && (
                <Button
                  className="w-full pdd-button"
                  onClick={() => handleDissuade(post)}
                >
                  <Send className="w-4 h-4 mr-2" />
                  点此发送解毒评论
                </Button>
              )}
            </Card>
          ))}
        </div>

        {/* 说明 */}
        <Card className="p-4 bg-muted/50">
          <h3 className="font-medium text-foreground mb-2">活动说明</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• 看到有人想买东西，赶紧去劝退</li>
            <li>• 可以选择预设评论或自定义评论</li>
            <li>• 每成功劝退一人，功德值 +10</li>
            <li>• 功德值可以解锁更多成就和勋章</li>
            <li>• 帮助他人理性消费，功德无量</li>
          </ul>
        </Card>
      </div>

      {/* 劝退弹窗 */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>发送劝退评论</DialogTitle>
            <DialogDescription>
              帮助 {selectedPost?.userName} 认清现实，理性消费
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* 预设评论 */}
            <div>
              <p className="text-sm font-medium text-foreground mb-2">快速选择</p>
              <div className="grid grid-cols-1 gap-2">
                {dissuasionComments.slice(0, 5).map((comment, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start text-left h-auto py-2 px-3"
                    onClick={() => sendDissuasion(comment)}
                  >
                    <span className="text-sm">{comment}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* 自定义评论 */}
            <div>
              <p className="text-sm font-medium text-foreground mb-2">自定义评论</p>
              <Textarea
                placeholder="输入你的劝退理由..."
                value={customComment}
                onChange={(e) => setCustomComment(e.target.value)}
                className="min-h-20"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              取消
            </Button>
            <Button
              className="pdd-button"
              onClick={() => sendDissuasion(customComment || '理性消费，从现在开始')}
              disabled={!customComment && customComment.length === 0}
            >
              发送
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
