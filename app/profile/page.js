import Link from 'next/link';

const stats = [
  { label: 'Projects', value: '128' },
  { label: 'Downloads', value: '3.4k' },
  { label: 'Favorites', value: '576' },
  { label: 'Uploads', value: '24' },
];

export default function ProfilePage() {
  return (
    <main className="library-shell">
      <header className="library-header">
        <div>
          <p className="eyebrow">Account</p>
          <h1>Profile</h1>
        </div>
        <button className="primary-btn">Edit Profile</button>
      </header>

      <section className="profile-header">
        <div className="avatar" />
        <div>
          <h2>@creatorstudio</h2>
          <p>Design creator • social media • branding</p>
        </div>
      </section>

      <section className="stat-grid">
        {stats.map((stat) => (
          <article key={stat.label} className="stat-card">
            <strong>{stat.value}</strong>
            <p>{stat.label}</p>
          </article>
        ))}
      </section>

      <nav className="bottom-nav">
        <Link href="/">Home</Link>
        <Link href="/editor">Editor</Link>
        <Link href="/templates">Templates</Link>
        <Link href="/resources">Resources</Link>
        <Link href="/profile" className="active">Profile</Link>
      </nav>
    </main>
  );
}
