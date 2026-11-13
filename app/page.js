import Link from 'next/link';

const quickActions = [
  { title: 'New Design', subtitle: 'Start from blank', accent: 'purple' },
  { title: 'Templates', subtitle: 'Explore ready-made layouts', accent: 'blue' },
  { title: 'My Projects', subtitle: 'Continue work', accent: 'green' },
];

const recentProjects = [
  { name: 'Instagram Promo', type: 'Social', updated: '2h ago', progress: '92%' },
  { name: 'Eid Banner', type: 'Campaign', updated: '5h ago', progress: '74%' },
  { name: 'Luxury Logo', type: 'Brand', updated: 'Yesterday', progress: '48%' },
];

const trendingFonts = ['Poppins', 'Hind Siliguri', 'Montserrat', 'Lora'];
const stickerSets = ['Islamic', 'Emoji', 'Nature', 'Shapes'];

export default function HomePage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Studio Dashboard</p>
          <h1>PixelForge Studio</h1>
        </div>
        <Link href="/editor" className="primary-btn">
          Open Editor
        </Link>
      </header>

      <section className="search-panel">
        <span>Search templates, fonts, stickers, themes</span>
        <button className="secondary-btn">Find Assets</button>
      </section>

      <section className="quick-grid">
        {quickActions.map((action) => (
          <article key={action.title} className={`action-card ${action.accent}`}>
            <span className="tag">Quick Action</span>
            <h3>{action.title}</h3>
            <p>{action.subtitle}</p>
          </article>
        ))}
      </section>

      <section className="content-grid">
        <div className="panel">
          <div className="panel-header">
            <h2>Recent Projects</h2>
            <Link href="/editor">View all</Link>
          </div>
          <div className="stack-list">
            {recentProjects.map((project) => (
              <div key={project.name} className="project-row">
                <div className="project-thumb" />
                <div>
                  <strong>{project.name}</strong>
                  <small>{project.type}</small>
                </div>
                <span>{project.updated}</span>
                <em>{project.progress}</em>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>Trending Fonts</h2>
            <Link href="/editor">Explore</Link>
          </div>
          <div className="chip-list">
            {trendingFonts.map((font) => (
              <span key={font} className="chip">{font}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="panel full-width">
        <div className="panel-header">
          <h2>Popular Sticker Packs</h2>
          <Link href="/editor">Browse</Link>
        </div>
        <div className="chip-list">
          {stickerSets.map((sticker) => (
            <span key={sticker} className="chip sticker-chip">{sticker}</span>
          ))}
        </div>
      </section>

      <nav className="bottom-nav">
        <Link href="/" className="active">Home</Link>
        <Link href="/editor">Editor</Link>
        <Link href="/editor">Templates</Link>
        <Link href="/editor">Resources</Link>
        <Link href="/editor">Profile</Link>
      </nav>
    </main>
  );
}
