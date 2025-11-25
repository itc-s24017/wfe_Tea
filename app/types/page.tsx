import { getTeaList, getComparisonList } from '../_libs/microcms';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

export const revalidate = 60;

export default async function TypesPage() {
  const teas = await getTeaList();
  const comparisons = await getComparisonList();
  
  // デバッグ: コンソールに出力
  console.log('取得した比較データ:', comparisons);
  console.log('比較データの数:', comparisons.length);
  
  // 産地（categories.name）別にグループ化
  const comparisonByOrigin = comparisons.reduce((acc, comp) => {
    const origin = comp.categories?.name || '未分類';
    console.log(`ブランド: ${comp.brand}, 産地: ${origin}`);
    if (!acc[origin]) {
      acc[origin] = [];
    }
    acc[origin].push(comp);
    return acc;
  }, {} as Record<string, typeof comparisons>);

  const origins = Object.keys(comparisonByOrigin);
  console.log('産地一覧:', origins);

  // ブランドでグループ化
  const comparisonByBrand = comparisons.reduce((acc, comp) => {
    if (!acc[comp.brand]) {
      acc[comp.brand] = [];
    }
    acc[comp.brand].push(comp);
    return acc;
  }, {} as Record<string, typeof comparisons>);

  return (
    <div className={styles.typesPage}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>紅茶の種類</h1>
        <p className={styles.pageDescription}>
          産地別に紅茶をご覧いただけます
        </p>
      </div>

      <div className={styles.content}>
        {/* 比較表セクション */}
        {comparisons.length > 0 && (
          <section className={styles.comparisonSection}>
            <h2 className={styles.sectionTitle}>紅茶比較表</h2>
            <div className={styles.tableWrapper}>
              <table className={styles.comparisonTable}>
                <thead>
                  <tr>
                    <th></th>
                    {Object.keys(comparisonByBrand).map((brand) => (
                      <th key={brand} colSpan={comparisonByBrand[brand].length}>
                        {brand}
                      </th>
                    ))}
                  </tr>
                  <tr>
                    <th></th>
                    {comparisons.map((comp) => (
                      <th key={comp.id} className={styles.typeHeader}>
                        {comp.type}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={styles.rowLabel}>香り</td>
                    {comparisons.map((comp) => (
                      <td key={comp.id}>{comp.aroma}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className={styles.rowLabel}>味</td>
                    {comparisons.map((comp) => (
                      <td key={comp.id}>{comp.taste}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className={styles.rowLabel}>紅茶の色<br />（水色）<br />のイメージ</td>
                    {comparisons.map((comp) => (
                      <td key={comp.id}>
                        <div 
                          className={styles.colorCircle}
                          style={{ backgroundColor: comp.colorCode }}
                        ></div>
                        <p className={styles.colorDesc}>{comp.colorDescription}</p>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className={styles.rowLabel}>おすすめの<br />飲み方</td>
                    {comparisons.map((comp) => (
                      <td key={comp.id}>
                        {comp.recommendedMethods && comp.recommendedMethods.map((method, idx) => (
                          <div key={idx} className={styles.methodItem}>
                            ☑ {method}
                          </div>
                        ))}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* 産地別比較データセクション */}
        {comparisons.length === 0 ? (
          <div className={styles.noData}>
            <p>比較データがまだ登録されていません。</p>
          </div>
        ) : origins.length === 0 ? (
          <div className={styles.noData}>
            <p>産地が設定されていません。microCMSでカテゴリーを設定してください。</p>
          </div>
        ) : (
          origins.map((origin) => (
            <section key={origin} className={styles.categorySection}>
              <h2 className={styles.categoryTitle}>{origin}</h2>
              <div className={styles.teaGrid}>
                {comparisonByOrigin[origin].map((comp) => (
                  <div key={comp.id} className={styles.teaCard}>
                    <div className={styles.teaInfo}>
                      <h3 className={styles.teaTitle}>{comp.brand}</h3>
                      {comp.type && <p className={styles.teaType}>{comp.type}</p>}
                      <p className={styles.teaAroma}>🌸 {comp.aroma}</p>
                      <p className={styles.teaTaste}>☕ {comp.taste}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}