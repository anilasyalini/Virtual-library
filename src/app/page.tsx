import Link from "next/link";
import Image from "next/image";
import { BookOpen, Upload, Search, Shield, GraduationCap, Users, Library } from "lucide-react";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className="container">
      <header style={{ padding: '2rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
          <BookOpen className="text-primary" />
          <span className="font-display">UniLib</span>
        </div>
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link href="/library" style={{ color: 'var(--text-muted)', fontWeight: '500' }}>
            Browse
          </Link>
          <Link href="/library" className="btn-primary">
            Get Started
          </Link>
        </nav>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={styles.glow} />
          <div className={styles.heroContent}>
            <h1 className={styles.title}>Knowledge Without Boundaries.</h1>
            <p className={styles.description}>
              The next-generation virtual library for the modern university.
              Seamlessly host, share, and discover educational assets in one premium ecosystem.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link href="/library" className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                <Search size={20} /> Explore Repository
              </Link>
            </div>
          </div>
          <div className={styles.heroImage}>
            <Image
              src="/hero.png"
              alt="UniLib Hero"
              width={600}
              height={500}
              priority
              style={{ objectFit: 'cover' }}
            />
          </div>
        </section>

        <section className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>15K+</span>
            <span className={styles.statLabel}>Resources</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>50+</span>
            <span className={styles.statLabel}>Departments</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>1.2M</span>
            <span className={styles.statLabel}>Downloads</span>
          </div>
        </section>

        <section className={styles.features}>
          <div className={`${styles.card} glass`}>
            <div className={styles.cardIcon}><Upload /></div>
            <h3 className={styles.cardTitle}>Instant Contribution</h3>
            <p className={styles.cardDesc}>Empower your peers by sharing verified lecture notes and research papers in real-time.</p>
          </div>
          <div className={`${styles.card} glass`}>
            <div className={styles.cardIcon}><Library /></div>
            <h3 className={styles.cardTitle}>Global Repository</h3>
            <p className={styles.cardDesc}>Access a curated collection of university-grade materials across all major academic disciplines.</p>
          </div>
          <div className={`${styles.card} glass`}>
            <div className={styles.cardIcon}><Users /></div>
            <h3 className={styles.cardTitle}>Collaborative Learning</h3>
            <p className={styles.cardDesc}>Built by students, for students. A community-driven platform for academic excellence.</p>
          </div>
        </section>
      </main>


      <footer style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>© 2026 UniLib. Supporting Education Everywhere.</p>
      </footer>
    </div>
  );
}

