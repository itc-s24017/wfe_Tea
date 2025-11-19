import { getTeaDetail, getTeaList } from '../../_libs/microcms';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from './page.module.css';

type Props = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const teas = await getTeaList();
  return teas.map((tea) => ({
    slug: tea.slug,
  }));
}

export default async function TeaDetailPage({ params }: Props) {
  const tea = await getTeaDetail(params.slug);

  if (!tea) {
    notFound();
  }

  return (
    <div className={styles.teaDetailPage}>
      <div className={styles.backLink}>
        <Link href="/tea">← 一覧に戻る</Link>
      </div>

      <article className={styles.teaDetail}>
        <div className={styles.teaHeader}>
          <div className={styles.teaHeaderContent}>
            <div className={styles.teaImageContainer}>
              <Image
                src={tea.image.url}
                alt={tea.title}
                width={tea.image.width}
                height={tea.image.height}
                className={styles.teaDetailImage}
                priority
              />
            </div>
            <div className={styles.teaInfo}>
              <div className={styles.categoryTag}>{tea.category}</div>
              <h1 className={styles.teaName}>{tea.title}</h1>
              <p className={styles.teaOriginDetail}>🌍 {tea.origin}</p>
              <p className={styles.teaDescriptionDetail}>{tea.description}</p>
            </div>
          </div>
        </div>

        <div className={styles.teaSections}>
          <section className={styles.teaSection}>
            <h2 className={styles.sectionTitle}>🍃 風味の特徴</h2>
            <p className={styles.sectionContent}>{tea.flavor}</p>
          </section>

          <section className={styles.teaSection}>
            <h2 className={styles.sectionTitle}>☕ 淹れ方</h2>
            <p className={styles.sectionContent}>{tea.brewingMethod}</p>
            <div className={styles.temperatureBox}>
              <span className={styles.tempLabel}>推奨温度</span>
              <span className={styles.tempValue}>{tea.temperature}</span>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}