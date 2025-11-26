import { getTeaList } from '../_libs/microcms';
import styles from './page.module.css';

export const revalidate = 60;

export default async function TypesPage() {
  const teas = await getTeaList();
  
  console.log('取得した紅茶データ:', teas);
  
  // 産地（categories.name）別にグループ化
  const teaByOrigin = teas.reduce((acc, tea) => {
    const origin = tea.categories?.name || '未分類';
    if (!acc[origin]) {
      acc[origin] = [];
    }
    acc[origin].push(tea);
    return acc;
  }, {} as Record<string, typeof teas>);

  const origins = Object.keys(teaByOrigin);

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
        {teas.length > 0 && (
          <section className={styles.comparisonSection}>
            <h2 className={styles.sectionTitle}>紅茶比較表</h2>
            <div className={styles.tableWrapper}>
              <table className={styles.comparisonTable}>
                <thead>
                  <tr>
                    <th className={styles.cornerCell}></th>
                    {origins.map((origin) => (
                      <th key={origin} colSpan={teaByOrigin[origin].length} className={styles.originHeader}>
                        {origin}
                      </th>
                    ))}
                  </tr>
                  <tr>
                    <th className={styles.cornerCell}></th>
                    {origins.map((origin) =>
                      teaByOrigin[origin].map((tea) => (
                        <th key={tea.id} className={styles.brandHeader}>
                          {tea.brand}
                          {tea.type && <div className={styles.typeText}>{tea.type}</div>}
                        </th>
                      ))
                    )}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={styles.rowLabel}>香り</td>
                    {origins.map((origin) =>
                      teaByOrigin[origin].map((tea) => (
                        <td key={tea.id}>{tea.aroma || '-'}</td>
                      ))
                    )}
                  </tr>
                  <tr>
                    <td className={styles.rowLabel}>味</td>
                    {origins.map((origin) =>
                      teaByOrigin[origin].map((tea) => (
                        <td key={tea.id}>{tea.taste || '-'}</td>
                      ))
                    )}
                  </tr>
                  <tr>
                    <td className={styles.rowLabel}>紅茶の色（水色）のイメージ</td>
                    {origins.map((origin) =>
                      teaByOrigin[origin].map((tea) => (
                        <td key={tea.id}>
                          {tea.colorCode && (
                            <div 
                              className={styles.colorCircle}
                              style={{ backgroundColor: tea.colorCode }}
                            ></div>
                          )}
                          {tea.colorDescription && (
                            <p className={styles.colorDesc}>{tea.colorDescription}</p>
                          )}
                          {!tea.colorCode && !tea.colorDescription && <p>-</p>}
                        </td>
                      ))
                    )}
                  </tr>
                  <tr>
                    <td className={styles.rowLabel}>おすすめの飲み方</td>
                    {origins.map((origin) =>
                      teaByOrigin[origin].map((tea) => (
                        <td key={tea.id}>
                          {tea.recommendedMethods && tea.recommendedMethods.map((method, idx) => (
                            <div key={idx} className={styles.methodItem}>
                              ☑ {method}
                            </div>
                          ))}
                          {(!tea.recommendedMethods || tea.recommendedMethods.length === 0) && <p>-</p>}
                        </td>
                      ))
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

        {teas.length === 0 && (
          <div className={styles.noData}>
            <p>紅茶データがまだ登録されていません。</p>
          </div>
        )}
      </div>
    </div>
  );
}