// 省点吧模拟数据

import type { Product, User, Achievement, DissuasionPost, DesertProgress, GuiltStats } from '@/types/app';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: '空气炸锅家用智能多功能大容量',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_164a1765-8ed7-4839-9a72-b4643a160f88.jpg',
    originalPrice: 299,
    currentPrice: 299,
    slashCount: 0,
    category: '电器',
    description: '买回家只会吃灰的厨房电器',
    isHot: true,
    couponCount: 1523,
    soldCount: 4280
  },
  {
    id: '2',
    name: '运动鞋男鞋透气跑步鞋',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_b5531928-a56f-49f7-b97c-7439538f8a67.jpg',
    originalPrice: 199,
    currentPrice: 199,
    slashCount: 0,
    category: '鞋包',
    description: '你已经有三双运动鞋了',
    couponCount: 856,
    soldCount: 2130
  },
  {
    id: '3',
    name: '智能手机5G全网通',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_e3185274-f6c5-4e85-b86c-94ce54a4d292.jpg',
    originalPrice: 2999,
    currentPrice: 2999,
    slashCount: 0,
    category: '手机',
    description: '你的手机还能再用两年',
    couponCount: 3240,
    soldCount: 1580
  },
  {
    id: '4',
    name: '婴儿奶瓶套装新生儿用品',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_d29349fe-4f64-432b-9956-af530837c099.jpg',
    originalPrice: 89,
    currentPrice: 89,
    slashCount: 0,
    category: '母婴',
    description: '孩子长得快，很快就用不上了',
    couponCount: 420,
    soldCount: 1820
  },
  {
    id: '5',
    name: '智能扫地机器人全自动家用',
    image: 'https://miaoda-image.cdn.bcebos.com/img/corpus/151fab45c04741469fc3d7eb1e2280ce.jpg',
    originalPrice: 1299,
    currentPrice: 1299,
    slashCount: 0,
    category: '电器',
    description: '手动扫地更健康，还能锻炼身体',
    couponCount: 2180,
    soldCount: 980
  },
  {
    id: '6',
    name: '时尚女士手提包真皮单肩包',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_b3d4c00f-213d-4f45-b64d-d5b138ae7a1a.jpg',
    originalPrice: 159,
    currentPrice: 159,
    slashCount: 0,
    category: '鞋包',
    description: '包包再多也装不下你的焦虑',
    couponCount: 670,
    soldCount: 1450
  },
  {
    id: '7',
    name: '机械键盘RGB背光游戏键盘',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_1b9fda35-0f7f-4dc2-a227-d426a3dc3af1.jpg',
    originalPrice: 599,
    currentPrice: 599,
    slashCount: 0,
    category: '电器',
    description: '键盘再贵也打不出好代码',
    isHot: true,
    couponCount: 1890,
    soldCount: 3560
  },
  {
    id: '8',
    name: '蓝牙无线耳机降噪运动耳机',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_7260220c-91ee-4729-bf0c-c524c02a6096.jpg',
    originalPrice: 399,
    currentPrice: 399,
    slashCount: 0,
    category: '手机',
    description: '有线耳机不会丢，还省电',
    couponCount: 1120,
    soldCount: 2890
  },
  {
    id: '9',
    name: '专业单反相机高清数码相机',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_531e0b78-acdb-4b3a-9daa-88cac39fe14b.jpg',
    originalPrice: 5999,
    currentPrice: 5999,
    slashCount: 0,
    category: '电器',
    description: '手机拍照已经够用了',
    isHot: true,
    couponCount: 4560,
    soldCount: 680
  },
  {
    id: '10',
    name: '健身瑜伽垫加厚防滑运动垫',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_b67b8209-7474-48e6-afa1-ae5382227386.jpg',
    originalPrice: 79,
    currentPrice: 79,
    slashCount: 0,
    category: '百货',
    description: '买了也不会去健身房',
    couponCount: 380,
    soldCount: 2650
  },
  {
    id: '11',
    name: '电动牙刷智能声波牙刷',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_dd3360bd-fb23-417f-8754-1d3714348c46.jpg',
    originalPrice: 299,
    currentPrice: 299,
    slashCount: 0,
    category: '百货',
    description: '普通牙刷一样能刷干净',
    couponCount: 920,
    soldCount: 1980
  },
  {
    id: '12',
    name: '意式咖啡机半自动咖啡机',
    image: 'https://miaoda-image.cdn.bcebos.com/img/corpus/928009c2a44547c99c66af5137ed552b.jpg',
    originalPrice: 1899,
    currentPrice: 1899,
    slashCount: 0,
    category: '电器',
    description: '速溶咖啡更方便实惠',
    isHot: true,
    couponCount: 2850,
    soldCount: 1240
  },
  {
    id: '13',
    name: '平板电脑iPad学习娱乐平板',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_42ee44dd-c920-4951-9ae8-1a211778f23a.jpg',
    originalPrice: 2499,
    currentPrice: 2499,
    slashCount: 0,
    category: '手机',
    description: '买了只会用来看视频',
    isHot: true,
    couponCount: 3680,
    soldCount: 2140
  },
  {
    id: '14',
    name: '智能手表运动手表心率监测',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_5b8711b8-7d21-49bf-b7f9-ee6b90dab295.jpg',
    originalPrice: 1299,
    currentPrice: 1299,
    slashCount: 0,
    category: '手机',
    description: '看时间用手机就够了',
    isHot: true,
    couponCount: 2340,
    soldCount: 1890
  },
  {
    id: '15',
    name: '化妆品护肤品套装女士礼盒',
    image: 'https://miaoda-image.cdn.bcebos.com/img/corpus/73508379f4574aeab1d924a1d63b8595.jpg',
    originalPrice: 599,
    currentPrice: 599,
    slashCount: 0,
    category: '百货',
    description: '真正的美来自内心',
    isHot: true,
    couponCount: 1780,
    soldCount: 3240
  },
  {
    id: '16',
    name: '儿童玩具乐高积木益智玩具',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_083c4063-1d11-4010-ab97-7599708a5e5c.jpg',
    originalPrice: 399,
    currentPrice: 399,
    slashCount: 0,
    category: '母婴',
    description: '孩子玩两天就腻了',
    couponCount: 1050,
    soldCount: 1560
  },
  {
    id: '17',
    name: '人体工学椅电脑椅办公椅',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_2a25454e-9475-4d85-9604-cd488b799310.jpg',
    originalPrice: 1599,
    currentPrice: 1599,
    slashCount: 0,
    category: '百货',
    description: '少坐多动才是健康之道',
    isHot: true,
    couponCount: 2560,
    soldCount: 890
  },
  {
    id: '18',
    name: '家用投影仪高清智能投影',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_142648e3-c8f9-47b3-aa18-fdf0c2753389.jpg',
    originalPrice: 2999,
    currentPrice: 2999,
    slashCount: 0,
    category: '电器',
    description: '电视机不香吗？',
    isHot: true,
    couponCount: 3920,
    soldCount: 760
  },
  {
    id: '19',
    name: '电热水壶不锈钢烧水壶',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_4fd008fb-3e8a-44b8-bd6c-9da07caf0cc7.jpg',
    originalPrice: 129,
    currentPrice: 129,
    slashCount: 0,
    category: '电器',
    description: '家里的水壶还能用',
    couponCount: 540,
    soldCount: 3180
  },
  {
    id: '20',
    name: '床上四件套纯棉床品套装',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_fc25f6c3-3b27-4d30-aa5d-2bd706ca393c.jpg',
    originalPrice: 299,
    currentPrice: 299,
    slashCount: 0,
    category: '百货',
    description: '旧的不去新的不来',
    couponCount: 890,
    soldCount: 2470
  },
  {
    id: '21',
    name: '行李箱旅行箱万向轮拉杆箱',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_1627628b-9bf8-48fe-9e6e-926d55cf44ed.jpg',
    originalPrice: 399,
    currentPrice: 399,
    slashCount: 0,
    category: '鞋包',
    description: '一年能出几次门？',
    couponCount: 1180,
    soldCount: 1340
  },
  {
    id: '22',
    name: '护眼台灯学习灯LED台灯',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/db4f9c27-4917-455b-a60a-36df21f0f362.jpg',
    originalPrice: 199,
    currentPrice: 199,
    slashCount: 0,
    category: '电器',
    description: '少玩手机才是真护眼',
    couponCount: 720,
    soldCount: 2280
  },
  {
    id: '23',
    name: '保温杯不锈钢保温水杯',
    image: 'https://miaoda-image.cdn.bcebos.com/img/corpus/d99255d576b4454dbc3be8d4f87b93d4.jpg',
    originalPrice: 89,
    currentPrice: 89,
    slashCount: 0,
    category: '百货',
    description: '家里的杯子够用了',
    couponCount: 360,
    soldCount: 4120
  },
  {
    id: '24',
    name: '宠物猫爬架猫树猫玩具',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_3fd7c5ba-e736-4a66-81b0-a5552da127df.jpg',
    originalPrice: 299,
    currentPrice: 299,
    slashCount: 0,
    category: '百货',
    description: '猫咪更喜欢纸箱子',
    couponCount: 980,
    soldCount: 1650
  },
  // 新增商品 - 电器类（8个）
  {
    id: '25',
    name: '智能电视4K超高清液晶电视机客厅家用',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_04c41f0e-d8e2-4440-a5a3-c504fa646fdf.jpg',
    originalPrice: 3999,
    currentPrice: 3999,
    slashCount: 0,
    category: '电器',
    description: '你的旧电视还能看，换它干嘛？',
    couponCount: 4280,
    soldCount: 520
  },
  {
    id: '26',
    name: '咖啡机全自动意式浓缩咖啡机家用',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_de15f962-df7d-420f-8e05-b32eee73d10f.jpg',
    originalPrice: 2299,
    currentPrice: 2299,
    slashCount: 0,
    category: '电器',
    description: '楼下咖啡店的咖啡更好喝',
    isHot: true,
    couponCount: 3150,
    soldCount: 1680
  },
  {
    id: '27',
    name: '电动牙刷声波震动充电式牙刷',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_170e9dd0-bf64-4f0f-af79-762b3cfb59f4.jpg',
    originalPrice: 399,
    currentPrice: 399,
    slashCount: 0,
    category: '电器',
    description: '手动牙刷刷得更仔细',
    couponCount: 1240,
    soldCount: 2560
  },
  {
    id: '28',
    name: '空气净化器家用除甲醛PM2.5',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_b427d4b4-2e82-4226-a4a1-f9cf0913a20f.jpg',
    originalPrice: 1599,
    currentPrice: 1599,
    slashCount: 0,
    category: '电器',
    description: '开窗通风是免费的',
    couponCount: 2470,
    soldCount: 1120
  },
  {
    id: '29',
    name: '电热水壶烧水壶自动断电',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_b2b69d05-50bb-4c62-b84c-b5c736d51d0c.jpg',
    originalPrice: 159,
    currentPrice: 159,
    slashCount: 0,
    category: '电器',
    description: '家里那个还能用三年',
    couponCount: 620,
    soldCount: 3890
  },
  {
    id: '30',
    name: '吹风机大功率负离子护发',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_e900e8ba-cfd2-439b-98b8-fce31f539053.jpg',
    originalPrice: 299,
    currentPrice: 299,
    slashCount: 0,
    category: '电器',
    description: '自然风干更健康',
    couponCount: 950,
    soldCount: 2340
  },
  {
    id: '31',
    name: '电饭煲智能预约多功能电饭锅',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_9f8f56dd-9068-4244-ad94-3fcbd891627f.jpg',
    originalPrice: 499,
    currentPrice: 499,
    slashCount: 0,
    category: '电器',
    description: '旧电饭煲煮的饭更香',
    couponCount: 1380,
    soldCount: 1950
  },
  {
    id: '32',
    name: '微波炉家用智能光波炉',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_53686984-5a86-4c86-b1fa-c2924eab6dd7.jpg',
    originalPrice: 599,
    currentPrice: 599,
    slashCount: 0,
    category: '电器',
    description: '用锅热饭更有烟火气',
    couponCount: 1560,
    soldCount: 1780
  },
  // 新增商品 - 百货类（7个）
  {
    id: '33',
    name: '保温杯不锈钢真空保温水杯',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_4914eadd-f974-4313-b0f7-b2586d6e7895.jpg',
    originalPrice: 129,
    currentPrice: 129,
    slashCount: 0,
    category: '百货',
    description: '喝热水用普通杯子就行',
    couponCount: 480,
    soldCount: 3650
  },
  {
    id: '34',
    name: '台灯护眼学习阅读LED台灯',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_29f384b5-1f60-4c44-85fd-9871a52533b0.jpg',
    originalPrice: 249,
    currentPrice: 249,
    slashCount: 0,
    category: '百货',
    description: '顶灯够亮了，别浪费钱',
    couponCount: 780,
    soldCount: 2180
  },
  {
    id: '35',
    name: '懒人沙发榻榻米单人小沙发',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_69af221c-f88e-454e-ac23-be8cbf92e725.jpg',
    originalPrice: 399,
    currentPrice: 399,
    slashCount: 0,
    category: '百货',
    description: '床不够舒服吗？',
    isHot: true,
    couponCount: 1420,
    soldCount: 2890
  },
  {
    id: '36',
    name: '收纳箱塑料整理箱衣物储物箱',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_eefdc364-6caf-4f8c-be15-a286f80c7362.jpg',
    originalPrice: 79,
    currentPrice: 79,
    slashCount: 0,
    category: '百货',
    description: '少买东西就不需要收纳了',
    couponCount: 320,
    soldCount: 4580
  },
  {
    id: '37',
    name: '雨伞自动折叠晴雨两用伞',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_e30d1d86-782a-40ca-b96a-a36cd6cc0fc3.jpg',
    originalPrice: 89,
    currentPrice: 89,
    slashCount: 0,
    category: '百货',
    description: '家里的伞还能用',
    couponCount: 410,
    soldCount: 3280
  },
  {
    id: '38',
    name: '毛巾纯棉吸水成人洗脸巾',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_5566a6d5-193e-4a18-ad21-cb04b39be3fe.jpg',
    originalPrice: 39,
    currentPrice: 39,
    slashCount: 0,
    category: '百货',
    description: '旧毛巾洗洗还能用',
    couponCount: 280,
    soldCount: 5120
  },
  {
    id: '39',
    name: '拖鞋居家防滑浴室拖鞋',
    image: 'https://miaoda-image.cdn.bcebos.com/img/corpus/32b6be515a274f0aa2c324a296c6dd6b.jpg',
    originalPrice: 29,
    currentPrice: 29,
    slashCount: 0,
    category: '百货',
    description: '拖鞋能穿就行，别讲究',
    couponCount: 180,
    soldCount: 6890
  },
  // 新增商品 - 手机类（4个）
  {
    id: '40',
    name: '平板电脑iPad学习办公娱乐',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_84418aac-71c0-4ed9-8123-877fab578d8b.jpg',
    originalPrice: 3299,
    currentPrice: 3299,
    slashCount: 0,
    category: '手机',
    description: '手机屏幕不够大吗？',
    isHot: true,
    couponCount: 3890,
    soldCount: 1340
  },
  {
    id: '41',
    name: '智能手表运动手环健康监测',
    image: 'https://miaoda-image.cdn.bcebos.com/img/corpus/0d25f01a444f452c909b24822493f46f.jpg',
    originalPrice: 999,
    currentPrice: 999,
    slashCount: 0,
    category: '手机',
    description: '手机就能看时间和步数',
    couponCount: 1680,
    soldCount: 2450
  },
  {
    id: '42',
    name: '移动电源大容量充电宝',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_35e10621-c502-4389-b844-73f70cb1cd94.jpg',
    originalPrice: 199,
    currentPrice: 199,
    slashCount: 0,
    category: '手机',
    description: '少玩手机就不用充电宝了',
    couponCount: 740,
    soldCount: 3560
  },
  {
    id: '43',
    name: '手机壳透明防摔保护套',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_01a6f1d7-7b2b-4b34-9545-413fe84509ec.jpg',
    originalPrice: 39,
    currentPrice: 39,
    slashCount: 0,
    category: '手机',
    description: '小心点用就不会摔',
    couponCount: 290,
    soldCount: 7240
  },
  // 新增商品 - 鞋包类（3个）
  {
    id: '44',
    name: '白色小白鞋女鞋平底板鞋',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_9d03de9c-8e23-4bbe-9fcf-cb1fd4724847.jpg',
    originalPrice: 159,
    currentPrice: 159,
    slashCount: 0,
    category: '鞋包',
    description: '鞋柜里还有好几双没穿过的',
    couponCount: 580,
    soldCount: 2780
  },
  {
    id: '45',
    name: '高跟鞋细跟女士单鞋',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/MiaoTu_2f1ff0ec-e56d-492e-b3d7-458d632fd6fe.jpg',
    originalPrice: 299,
    currentPrice: 299,
    slashCount: 0,
    category: '鞋包',
    description: '穿平底鞋更舒服健康',
    isHot: true,
    couponCount: 1120,
    soldCount: 1890
  },
  {
    id: '46',
    name: '双肩包女学生书包背包',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_33be8d15-ae6e-4a77-9f6d-eb1c22feef27.jpg',
    originalPrice: 199,
    currentPrice: 199,
    slashCount: 0,
    category: '鞋包',
    description: '旧包包还能背，别浪费',
    couponCount: 690,
    soldCount: 2340
  },
  // 新增商品 - 母婴类（2个）
  {
    id: '47',
    name: '婴儿推车轻便折叠宝宝推车',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_f60fe6b8-8186-4eb1-8f59-3cdf0e3132e1.jpg',
    originalPrice: 899,
    currentPrice: 899,
    slashCount: 0,
    category: '母婴',
    description: '孩子很快就不用推车了',
    couponCount: 1580,
    soldCount: 1120
  },
  {
    id: '48',
    name: '儿童玩具益智积木拼装玩具',
    image: 'https://miaoda-image.cdn.bcebos.com/img/corpus/6d78f40f3a9544c288cf9eaa0bcc42a1.jpg',
    originalPrice: 299,
    currentPrice: 299,
    slashCount: 0,
    category: '母婴',
    description: '玩具太多孩子反而不珍惜',
    couponCount: 890,
    soldCount: 1680
  }
];

export const mockAchievements: Achievement[] = [
  {
    id: 'iron-rooster',
    name: '铁公鸡',
    description: '连续7天未购物',
    icon: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_ffb7e458-c1ad-4b5e-9d37-f55ba09cbafb.jpg',
    unlocked: false
  },
  {
    id: 'dissuasion-master',
    name: '劝退大师',
    description: '成功劝退100人',
    icon: '🏆',
    unlocked: false
  },
  {
    id: 'desert-survivor',
    name: '荒漠求生者',
    description: '拔光所有欲望之草',
    icon: '🌵',
    unlocked: false
  },
  {
    id: 'new-year-saver',
    name: '春节守财奴',
    description: '春节期间零消费',
    icon: '🧧',
    unlocked: false
  }
];

export const mockUser: User = {
  id: 'user-001',
  name: '理性消费者',
  avatar: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_99660e51-280b-4edd-9ae7-47651d792a6c.jpg',
  meritPoints: 0,
  achievements: mockAchievements,
  blacklist: [],
  favorites: []
};

export const mockDissuasionPosts: DissuasionPost[] = [
  {
    id: 'post-1',
    userId: 'user-138',
    userName: '138****1234',
    productId: '1',
    productName: '空气炸锅',
    status: 'active',
    timestamp: Date.now() - 300000,
    dissuasionCount: 3
  },
  {
    id: 'post-2',
    userId: 'user-139',
    userName: '139****5678',
    productId: '2',
    productName: '运动鞋',
    status: 'active',
    timestamp: Date.now() - 600000,
    dissuasionCount: 5
  }
];

export const mockDesertProgress: DesertProgress = {
  grassCount: 100,
  totalGrass: 100,
  daysWithoutShopping: 0,
  lastCheckIn: Date.now()
};

export const mockGuiltStats: GuiltStats = {
  totalWasted: 0,
  cartValue: 0,
  equivalentMeals: 0,
  equivalentRetirementDays: 0
};

export const categories = [
  { id: 'hot', name: '热门', icon: '🔥' },
  { id: 'baby', name: '母婴', icon: '👶' },
  { id: 'general', name: '百货', icon: '🏪' },
  { id: 'phone', name: '手机', icon: '📱' },
  { id: 'car', name: '车品', icon: '🚗' },
  { id: 'appliance', name: '电器', icon: '📺' },
  { id: 'fashion', name: '鞋包', icon: '👜' }
];

export const dissuasionComments = [
  '这东西买回家只能吃灰',
  '你确定不买个垃圾桶配它吗',
  '冷静！你真的需要吗？',
  '这钱够你吃一个月外卖了',
  '你的工资卡余额正在偷偷哭泣',
  '买了就是浪费，不买就是赚到',
  '这是智商税，清醒一点',
  '你已经有类似的东西了',
  '省下这笔钱去旅游不香吗',
  '理性消费，从拒绝开始'
];
