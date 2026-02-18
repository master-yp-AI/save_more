// 图像识别Edge Function
// 调用百度通用物体和场景识别API

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
    const { image } = await req.json();

    if (!image) {
      return new Response(
        JSON.stringify({ error: '缺少图片数据' }),
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

    // 去掉base64前缀（如果有）
    let imageData = image;
    if (image.includes('base64,')) {
      imageData = image.split('base64,')[1];
    }

    // 调用百度图像识别API
    const apiUrl = 'https://app-93vxdy5v8bnl-api-zYm4zKQoePjL-gateway.appmiaoda.com/rest/2.0/image-classify/v2/advanced_general';
    
    const formData = new URLSearchParams();
    formData.append('image', imageData);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Gateway-Authorization': `Bearer ${apiKey}`,
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API调用失败:', errorText);
      return new Response(
        JSON.stringify({ error: '图像识别失败', details: errorText }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();

    // 提取关键词
    const keywords = data.result?.map((item: any) => ({
      keyword: item.keyword,
      score: item.score,
      category: item.root
    })) || [];

    return new Response(
      JSON.stringify({
        success: true,
        keywords,
        result_num: data.result_num || 0
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
