import Link from 'next/link';

const resourceData = [
  { name: 'Islamic Sticker Pack', type: 'Stickers', downloads: '12.3k' },
  { name: 'Bengali Font Set', type: 'Fonts', downloads: '8.9k' },
  { name: 'Dark Background Lab', type: 'Backgrounds', downloads: '6.1k' },
  { name: 'Brand Theme Kit', type: 'Themes', downloads: '4.2k' },
];

export default function ResourcesPage() {
  return (
    <main className="library-shell">
      <header className="library-header">
        <div>
          <p className="eyebrow">Community</p>
          <h1>Resources</h1>
        </div>
        <Link href="/editor" className="primary-btn">
          Import Asset
        </Link>
      </header>

      <section className="library-grid">
        {resourceData.map((resource) => (
          <article key={resource.name} className="library-card">
            <div className="library-thumb" />
            <div className="library-meta">
              <div>
                <strong>{resource.name}</strong>
                <p>{resource.type}</p>
              </div>
              <span>{resource.downloads}</span>
            </div>
            <button className="pill-button">Download</button>
          </article>
        ))}
      </section>

      <nav className="bottom-nav">
        <Link href="/">Home</Link>
        <Link href="/editor">Editor</Link>
        <Link href="/templates">Templates</Link>
        <Link href="/resources" className="active">Resources</Link>
        <Link href="/profile">Profile</Link>
      </nav>
    </main>
  );
}
