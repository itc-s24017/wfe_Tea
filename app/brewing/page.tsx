import { getTeaList, getBrewingList } from '../_libs/microcms';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

export const revalidate = 60;

export default async function BrewingPage() {
  const teas = await getTeaList();
  const brewingGuides = await getBrewingList();

  return (
    <div className={styles.brewingPage}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>紅茶の淹れ方</h1>
        <p className={styles.pageDescription}>
          美味しい紅茶を淹れるための基本と、各紅茶の淹れ方をご紹介します
        </p>
      </div>

      <div className={styles.content}>
        {/* 淹れ方ガイドセクション */}
        {brewingGuides && brewingGuides.length > 0 && (
          <section className={styles.guideSection}>
            {brewingGuides.map((guide) => (
              <article key={guide.id} className={styles.guideArticle}>
                {guide.image && (
                  <div className={styles.guideImage}>
                    <Image
                      src={guide.image.url}
                      alt={guide.name}
                      width={guide.image.width}
                      height={guide.image.height}
                      className={styles.image}
                    />
                  </div>
                )}

                <div className={styles.guideContent}>
                  <h2 className={styles.guideTitle}>{guide.name}</h2>
                  <div 
                    className={styles.guideBody}
                    dangerouslySetInnerHTML={{ __html: guide.content }}
                  />
                </div>
              </article>
            ))}
          </section>
        )}

        {/* 紅茶別の淹れ方セクション */}
        {teas && teas.length > 0 && (
          <section className={styles.teaBrewingSection}>
            <h2 className={styles.mainTitle}>各紅茶の淹れ方</h2>
            <div className={styles.brewingGrid}>
              {teas.map((tea) => {
                // 画像データがない場合はスキップ
                if (!tea.image || !tea.image.url) return null;
                
                return (
                  <Link 
                    href={`/tea/${tea.slug}`} 
                    key={tea.id}
                    className={styles.brewingCard}
                  >
                    <div className={styles.cardHeader}>
                      <div className={styles.imageWrapper}>
                        <Image
                          src={tea.image.url}
                          alt={tea.title}
                          width={tea.image.width}
                          height={tea.image.height}
                          className={styles.teaImage}
                        />
                      </div>
                      <div className={styles.titleSection}>
                        <h3 className={styles.teaTitle}>{tea.title}</h3>
                        <p className={styles.category}>{tea.category}</p>
                      </div>
                    </div>
                    
                    <div className={styles.brewingInfo}>
                      <div className={styles.infoItem}>
                        <span className={styles.label}>🌡️ 温度</span>
                        <span className={styles.value}>{tea.temperature}</span>
                      </div>
                      <div className={styles.method}>
                        <span className={styles.label}>☕ 淹れ方</span>
                        <p className={styles.methodText}>{tea.brewingMethod}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {(!teas || teas.length === 0) && (!brewingGuides || brewingGuides.length === 0) && (
          <div className={styles.noData}>
            <p>淹れ方情報がまだ登録されていません。</p>
          </div>
        )}
      </div>
    </div>
  );
}