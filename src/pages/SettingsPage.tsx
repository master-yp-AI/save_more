import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Moon, Bell, Shield, HelpCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [dissuasionReminder, setDissuasionReminder] = useState(true);

  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked);
    toast.success(checked ? '已开启深色模式' : '已关闭深色模式');
  };

  const handleNotificationsToggle = (checked: boolean) => {
    setNotifications(checked);
    toast.success(checked ? '已开启通知' : '已关闭通知');
  };

  const handleDissuasionReminderToggle = (checked: boolean) => {
    setDissuasionReminder(checked);
    toast.success(checked ? '已开启劝败提醒' : '已关闭劝败提醒');
  };

  const settingsSections = [
    {
      title: '通用设置',
      items: [
        {
          id: 'dark-mode',
          label: '深色模式',
          icon: Moon,
          type: 'switch',
          value: darkMode,
          onChange: handleDarkModeToggle
        },
        {
          id: 'notifications',
          label: '消息通知',
          icon: Bell,
          type: 'switch',
          value: notifications,
          onChange: handleNotificationsToggle
        }
      ]
    },
    {
      title: '劝败设置',
      items: [
        {
          id: 'dissuasion-reminder',
          label: '劝败提醒',
          icon: Shield,
          type: 'switch',
          value: dissuasionReminder,
          onChange: handleDissuasionReminderToggle,
          description: '浏览商品时自动提醒理性消费'
        }
      ]
    },
    {
      title: '其他',
      items: [
        {
          id: 'help',
          label: '帮助与反馈',
          icon: HelpCircle,
          type: 'link',
          onClick: () => toast.info('功能开发中...')
        },
        {
          id: 'about',
          label: '关于省点吧',
          icon: Info,
          type: 'link',
          onClick: () => navigate('/about')
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold text-foreground">设置</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {settingsSections.map((section, sectionIndex) => (
          <Card key={sectionIndex} className="overflow-hidden">
            <div className="p-4 bg-muted/50">
              <h3 className="text-sm font-medium text-muted-foreground">
                {section.title}
              </h3>
            </div>
            <div className="divide-y divide-border">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <div key={item.id}>
                    {item.type === 'switch' ? (
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <Icon className="w-5 h-5 text-muted-foreground" />
                            <div className="flex-1">
                              <p className="text-foreground">{item.label}</p>
                              {item.description && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <Switch
                            checked={item.value}
                            onCheckedChange={item.onChange}
                          />
                        </div>
                      </div>
                    ) : (
                      <button
                        className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                        onClick={item.onClick}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-muted-foreground" />
                          <span className="text-foreground">{item.label}</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        ))}

        {/* 版本信息 */}
        <Card className="p-4 text-center bg-muted/50">
          <p className="text-sm text-muted-foreground mb-1">省点吧</p>
          <p className="text-xs text-muted-foreground">版本 v1.0.0</p>
          <Separator className="my-3" />
          <p className="text-xs text-muted-foreground">
            与其拼单，不如从源头切断消费欲望
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            © 2026 省点吧
          </p>
        </Card>

        {/* 退出登录按钮 */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => toast.info('退出登录功能开发中...')}
        >
          退出登录
        </Button>
      </div>
    </div>
  );
}
