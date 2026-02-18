// 哲学名言数据库
export const philosophyQuotes = [
  {
    quote: "一个人越是有许多事情能够放得下，他越是富有。",
    author: "梭罗《瓦尔登湖》",
    keywords: ["放下", "轻松", "自由", "简单"]
  },
  {
    quote: "真正的富有，不是拥有更多，而是需要更少。",
    author: "苏格拉底",
    keywords: ["富有", "需要", "欲望", "满足"]
  },
  {
    quote: "幸福不在于拥有得多，而在于计较得少。",
    author: "老子",
    keywords: ["幸福", "计较", "知足", "平静"]
  },
  {
    quote: "简单生活，高尚思考。",
    author: "威廉·华兹华斯",
    keywords: ["简单", "思考", "生活", "高尚"]
  },
  {
    quote: "我们买东西时，往往不是因为需要，而是因为别人有。",
    author: "叔本华",
    keywords: ["需要", "比较", "欲望", "理性"]
  },
  {
    quote: "节俭本身就是一宗财产。",
    author: "塞内加",
    keywords: ["节俭", "财产", "积累", "智慧"]
  },
  {
    quote: "拥有越少，越自由。",
    author: "极简主义",
    keywords: ["自由", "拥有", "轻盈", "解脱"]
  },
  {
    quote: "欲望是一切痛苦的根源。",
    author: "佛陀",
    keywords: ["欲望", "痛苦", "克制", "平和"]
  },
  {
    quote: "最好的东西往往是免费的：阳光、空气、爱与友谊。",
    author: "梭罗",
    keywords: ["免费", "珍贵", "简单", "美好"]
  },
  {
    quote: "知足者常乐，能忍者自安。",
    author: "曾国藩",
    keywords: ["知足", "快乐", "忍耐", "安宁"]
  },
  {
    quote: "物质的贫乏容易克服，心灵的贫乏却无药可救。",
    author: "蒙田",
    keywords: ["物质", "心灵", "贫乏", "富足"]
  },
  {
    quote: "少即是多。",
    author: "密斯·凡·德·罗",
    keywords: ["少", "多", "简约", "精华"]
  },
  {
    quote: "我们拥有的东西最终会拥有我们。",
    author: "《搏击俱乐部》",
    keywords: ["拥有", "束缚", "自由", "警醒"]
  },
  {
    quote: "真正的奢侈是时间和自由。",
    author: "现代哲学",
    keywords: ["奢侈", "时间", "自由", "珍贵"]
  },
  {
    quote: "克制是一种力量，节制是一种美德。",
    author: "亚里士多德",
    keywords: ["克制", "力量", "节制", "美德"]
  }
];

// 引导问题库
export const guidingQuestions = [
  "此刻，你感到的是失去了一件物品，还是赢回了一部分自己？",
  "这笔省下的钱，如果化作未来的一个自由午后，你会去哪里坐坐？",
  "想象十年后的你，会感谢今天这个克制的决定吗？",
  "如果把这次拒绝看作一次小小的胜利，你想对自己说什么？",
  "此刻的你，是否感受到了一种轻盈和自由？",
  "这个物品真的能填补你内心的空虚吗？还是只是暂时的麻醉？",
  "如果用这笔钱去做一件更有意义的事，会是什么？",
  "你觉得真正的富足是什么？是拥有更多，还是需要更少？",
  "这次断念，让你对自己有了什么新的认识？",
  "如果把省下的钱存起来，一年后你能实现什么小梦想？"
];

// 终极精神目标选项
export const spiritualGoals = [
  {
    id: "early-retirement",
    title: "提前一年退休",
    description: "用理性消费换取时间自由",
    targetAmount: 100000,
    image: "🏖️",
    requiredRefusals: 100
  },
  {
    id: "dali-living",
    title: "去大理旅居一个月",
    description: "在洱海边找回内心的平静",
    targetAmount: 10000,
    image: "🏔️",
    requiredRefusals: 50
  },
  {
    id: "reading-year",
    title: "买下一整年的阅读时间",
    description: "用省下的钱投资精神世界",
    targetAmount: 5000,
    image: "📚",
    requiredRefusals: 30
  },
  {
    id: "family-trip",
    title: "带父母去旅行",
    description: "把钱花在真正重要的人身上",
    targetAmount: 15000,
    image: "✈️",
    requiredRefusals: 60
  },
  {
    id: "skill-learning",
    title: "学一门新技能",
    description: "投资自己，而不是物品",
    targetAmount: 8000,
    image: "🎨",
    requiredRefusals: 40
  },
  {
    id: "emergency-fund",
    title: "建立应急基金",
    description: "真正的安全感来自储蓄",
    targetAmount: 30000,
    image: "🛡️",
    requiredRefusals: 150
  }
];

// AI 分析关键词匹配
export const analyzeFeeling = (text: string): typeof philosophyQuotes[0] => {
  const lowerText = text.toLowerCase();
  
  // 遍历所有名言，找到关键词匹配度最高的
  let bestMatch = philosophyQuotes[0];
  let maxScore = 0;
  
  philosophyQuotes.forEach(quote => {
    let score = 0;
    quote.keywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        score++;
      }
    });
    
    if (score > maxScore) {
      maxScore = score;
      bestMatch = quote;
    }
  });
  
  // 如果没有匹配到，返回随机一条
  if (maxScore === 0) {
    return philosophyQuotes[Math.floor(Math.random() * philosophyQuotes.length)];
  }
  
  return bestMatch;
};
