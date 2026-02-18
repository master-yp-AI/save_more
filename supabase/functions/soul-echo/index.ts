// AI灵魂共鸣Edge Function
// 使用文心大模型分析用户感受，推荐哲学名言

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
    const { feeling, productName, savedAmount } = await req.json();

    if (!feeling || feeling.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: '感受内容不能为空' }),
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

    // 构建AI提示词
    const systemPrompt = `你是一位博学的哲学导师，精通古今中外的哲学思想。你的任务是根据用户的感受，从哲学文献中找到最能引起共鸣的名言。

要求：
1. 推荐的名言要与用户的感受高度契合
2. 必须注明名言的出处和作者
3. 用简短的话（30字内）解释为什么这句话适合用户此刻的心境
4. 语气要温暖、鼓励，让用户感到被理解
5. 优先选择关于简朴、自由、克制、智慧的名言`;

    const userPrompt = `用户刚刚拒绝购买"${productName}"，省下了¥${savedAmount}。

用户的感受是：
"${feeling}"

请推荐一句最能引起共鸣的哲学名言，并说明为什么。

返回格式：
名言：[具体名言]
出处：[作者/书籍]
共鸣点：[为什么这句话适合用户]`;

    // 调用文心大模型API
    const apiUrl = 'https://app-93vxdy5v8bnl-api-zYkZz8qovQ1L-gateway.appmiaoda.com/v2/chat/completions';
    
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
      // 降级：返回默认名言
      aiContent = `名言：一个人越是有许多事情能够放得下，他越是富有。
出处：梭罗《瓦尔登湖》
共鸣点：你选择了放下物欲，这是真正的富足。`;
    }

    return new Response(
      JSON.stringify({
        success: true,
        quote: aiContent
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
