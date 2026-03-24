import { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card } from '@/components/ui/card';

const banners = [
  {
    id: '1',
    image: 'https://miaoda-image.cdn.bcebos.com/img/corpus/d097e8ee7dbb4a3483e51c7f33e0fabc.jpg',
    title: '与其拼单，不如从源头切断消费欲望',
    subtitle: '春节特辑 - 理性消费从现在开始'
  },
  {
    id: '2',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_99660e51-280b-4edd-9ae7-47651d792a6c.jpg',
    title: '压岁钱防火墙',
    subtitle: '守护你的钱包，拒绝冲动消费'
  },
  {
    id: '3',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_ffb7e458-c1ad-4b5e-9d37-f55ba09cbafb.jpg',
    title: '铁公鸡勋章等你来拿',
    subtitle: '连续7天不购物即可解锁'
  }
];

export default function BannerCarousel() {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="relative px-4 lg:px-6 py-3">
      <Carousel
        setApi={setApi}
        opts={{
          align: 'start',
          loop: true
        }}
        className="w-full"
      >
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              <Card className="overflow-hidden">
                <div className="relative aspect-[2/1] bg-gradient-to-br from-secondary/20 to-primary/20">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-t from-background/80 to-transparent">
                    <h2 className="text-xl font-bold text-foreground mb-2">
                      {banner.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {banner.subtitle}
                    </p>
                  </div>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
      <div className="flex justify-center gap-2 mt-3">
        {banners.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full transition-all ${
              index === current ? 'w-6 bg-secondary' : 'w-1.5 bg-muted'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
