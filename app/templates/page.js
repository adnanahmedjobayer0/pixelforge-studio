import Link from 'next/link';

const templateData = [
  { name: 'Instagram Promo', type: 'Social', usage: '3.8k' },
  { name: 'Eid Banner', type: 'Campaign', usage: '2.4k' },
  { name: 'Luxury Logo', type: 'Brand', usage: '1.6k' },
  { name: 'Travel Poster', type: 'Travel', usage: '951' },
];

export default function TemplatesPage() {
  return (
    <main className="library-shell">
      <header className="library-header">
        <div>
          <p className="eyebrow">Marketplace</p>
          <h1>Templates</h1>
        </div>
        <Link href="/editor" className="primary-btn">
          Open Editor
        </Link>
      </header>

      <section className="library-grid">
        {templateData.map((template) => (
          <article key={template.name} className="library-card">
            <div className="library-thumb" />
            <div className="library-meta">
              <div>
                <strong>{template.name}</strong>
                <p>{template.type}</p>
              </div>
              <span>{template.usage} uses</span>
            </div>
            <button className="pill-button">Use Template</button>
          </article>
        ))}
      </section>

      <nav className="bottom-nav">
        <Link href="/">Home</Link>
        <Link href="/editor">Editor</Link>
        <Link href="/templates" className="active">Templates</Link>
        <Link href="/resources">Resources</Link>
        <Link href="/profile">Profile</Link>
      </nav>
    </main>
  );
}
