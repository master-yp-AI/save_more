// AI购物车分析Edge Function
// 使用文心大模型分析购物车，生成劝败文案

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // 处理CORS预检请求
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 获取请求数据
    const { cartItems } = await req.json();

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return new Response(
        JSON.stringify({ error: '购物车为空' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // 获取API密钥
    const apiKey = Deno.env.get('INTEGRATIONS_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API密钥未配置' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // 计算购物车总价
    const totalPrice = cartItems.reduce((sum: number, item: any) => 
      sum + (item.currentPrice * item.quantity), 0
    );

    // 构建商品列表描述
    const itemsDescription = cartItems.map((item: any) => 
      `${item.name}（¥${item.currentPrice} × ${item.quantity}）`
    ).join('、');

    // 构建AI提示词
    const systemPrompt = `你是一个理性消费顾问，擅长用幽默又犀利的方式劝人省钱。你的任务是分析用户的购物车，用生动的场景描述让用户意识到这些钱的价值。

要求：
1. 语气要幽默但不失真诚，让人会心一笑又能反思
2. 用具体的生活场景描述这笔钱的价值（如退休生活、旅行、美食等）
3. 不要说教，要用对比和想象激发用户的思考
4. 控制在150字以内
5. 不要使用"您"这样正式的称呼，用"你"更亲切`;

    const userPrompt = `购物车里有：${itemsDescription}，总价¥${totalPrice}。

请生成一段劝败文案，让用户意识到这笔钱的价值。要包含：
1. 这笔钱能换来什么更有价值的东西
2. 一个生动的场景描述
3. 一句点睛的反思`;

    // 调用文心大模型API
    const apiUrl = 'https://app-9pjyq18643cx-api-zYkZz8qovQ1L-gateway.appmiaoda.com/v2/chat/completions';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Gateway-Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API调用失败:', errorText);
      return new Response(
        JSON.stringify({ error: 'AI分析失败', details: errorText }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();

    // 提取AI生成的内容
    let aiContent = '';
    if (data.choices && data.choices.length > 0) {
      aiContent = data.choices[0].delta?.content || data.choices[0].message?.content || '';
    }

    if (!aiContent) {
      // 降级：返回默认文案
      aiContent = `这¥${totalPrice}，够你在退休后喝${Math.floor(totalPrice / 50)}天的稀饭了。想象一下，60岁的你坐在小区门口，手里端着一碗热粥，看着年轻人背着你现在想买的这些东西匆匆走过。那时候的你，会感谢现在克制的自己。`;
    }

    return new Response(
      JSON.stringify({
        success: true,
        analysis: aiContent,
        totalPrice,
        itemCount: cartItems.length
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Edge Function错误:', error);
    return new Response(
      JSON.stringify({ 
        error: '服务器错误', 
        message: error instanceof Error ? error.message : '未知错误' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
