import { createClient } from 'microcms-js-sdk';

// 紅茶データの型定義
export type Tea = {
  id: string;
  brand: string;
  type?: string;
  aroma: string;
  taste: string;
  colorDescription: string;
  colorCode?: string;
  recommendedMethods?: string[];
  categories?: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    revisedAt: string;
  };
  // 以下は詳細ページ用（あれば）
  title?: string;
  slug?: string;
  image?: {
    url: string;
    height: number;
    width: number;
  };
  description?: string;
  origin?: string;
  flavor?: string;
  brewingMethod?: string;
  temperature?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

// ニュースの型定義
export type News = {
  id: string;
  title: string;
  category: string; // プレスリリース、お知らせ
  date: string;
  image?: {
    url: string;
    height: number;
    width: number;
  };
  content: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

// 紅茶比較表の型定義
export type TeaComparison = {
  id: string;
  brand: string;
  type: string;
  aroma: string;
  taste: string;
  colorDescription: string;
  colorCode: string;
  recommendedMethods: string[]; // 複数選択（配列）
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

// 淹れ方ガイドの型定義（リッチエディタ形式）
export type BrewingGuide = {
  id: string;
  name: string;
  content: string; // リッチエディタの内容
  image?: {
    url: string;
    height: number;
    width: number;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export type GuideStep = {
  fieldId: string;
  stepNumber: number;
  stepTitle: string;
  stepDescription: string;
};

export type GuideTip = {
  fieldId: string;
  tipTitle: string;
  tipDescription: string;
};

export type Guide = {
  id: string;
  title: string;
  description: string;
  steps: GuideStep[];
  tips: GuideTip[];
  image?: {
    url: string;
    height: number;
    width: number;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

// microCMSクライアントの作成
export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN || '',
  apiKey: process.env.MICROCMS_API_KEY || '',
});

// 紅茶一覧を取得
export const getTeaList = async () => {
  try {
    const data = await client.get({
      endpoint: 'tea',
      queries: {
        limit: 20, 
      },
    });
    return data.contents as Tea[];
  } catch (error) {
    console.error('紅茶一覧の取得に失敗しました:', error);
    return [];
  }
};

// 紅茶詳細を取得
export const getTeaDetail = async (slug: string) => {
  try {
    const data = await client.get({
      endpoint: 'tea',
      queries: {
        filters: `slug[equals]${slug}`,
      },
    });
    return data.contents[0] as Tea;
  } catch (error) {
    console.error('紅茶詳細の取得に失敗しました:', error);
    return null;
  }
};

// 淹れ方ガイド一覧を取得
export const getGuideList = async () => {
  try {
    const data = await client.get({
      endpoint: 'guide',
    });
    return data.contents as Guide[];
  } catch (error) {
    console.error('ガイド一覧の取得に失敗しました:', error);
    return [];
  }
};

// 淹れ方（brewing）一覧を取得
export const getBrewingList = async () => {
  try {
    const data = await client.get({
      endpoint: 'brewing',
    });
    return data.contents as BrewingGuide[];
  } catch (error) {
    console.error('淹れ方一覧の取得に失敗しました:', error);
    return [];
  }
};

// 紅茶比較表を取得
export const getComparisonList = async () => {
  try {
    const data = await client.get({
      endpoint: 'comparison',
    });
    return data.contents as TeaComparison[];
  } catch (error) {
    console.error('比較表の取得に失敗しました:', error);
    return [];
  }
};

// // ニュース一覧を取得
// export const getNewsList = async () => {
//   try {
//     const data = await client.get({
//       endpoint: 'news',
//       queries: {
//         orders: '-date', // 日付の降順
//       },
//     });
//     return data.contents as News[];
//   } catch (error) {
//     console.error('ニュースの取得に失敗しました:', error);
//     return [];
//   }
// };