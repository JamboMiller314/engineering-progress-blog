import { useEffect, useState } from "react";
import { BookOpen, CalendarDays, Hammer, RotateCcw, Search, Tag } from "lucide-react";
import { posts as starterPosts, stats } from "./data/posts.js";

const savedPostsKey = "engineering-progress-posts";

const emptyEntry = {
  title: "",
  summary: "",
  tags: ""
};

function App() {
  const [posts, setPosts] = useState(() => {
    const savedPosts = localStorage.getItem(savedPostsKey);

    if (!savedPosts) {
      return starterPosts;
    }

    try {
      return JSON.parse(savedPosts);
    } catch {
      return starterPosts;
    }
  });
  const [entry, setEntry] = useState(emptyEntry);
  const featuredPost = posts[0];
  const recentPosts = posts.slice(1);

  useEffect(() => {
    localStorage.setItem(savedPostsKey, JSON.stringify(posts));
  }, [posts]);

  function updateEntry(event) {
    const { name, value } = event.target;

    setEntry((currentEntry) => ({
      ...currentEntry,
      [name]: value
    }));
  }

  function addEntry(event) {
    event.preventDefault();

    const newPost = {
      id: crypto.randomUUID(),
      title: entry.title,
      date: new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }).format(new Date()),
      readTime: "2 min read",
      summary: entry.summary,
      tags: entry.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    };

    setPosts((currentPosts) => [newPost, ...currentPosts]);
    setEntry(emptyEntry);
  }

  function resetEntries() {
    setPosts(starterPosts);
    setEntry(emptyEntry);
  }

  const formIsIncomplete = !entry.title.trim() || !entry.summary.trim();

  return (
    <main className="app-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Engineering Progress Log">
          <Hammer size={20} aria-hidden="true" />
          <span>Progress Log</span>
        </a>

        <nav className="site-nav" aria-label="Main navigation">
          <a href="#posts">Posts</a>
          <a href="#projects">Projects</a>
          <a href="#learning">Learning</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Engineering notebook</p>
          <h1>Track what you build, break, learn, and improve.</h1>
          <p>
            A personal blog for documenting engineering progress in public:
            weekly updates, project notes, lessons learned, and the occasional
            victory lap after the bug finally gives up.
          </p>
        </div>

        <aside className="status-panel" aria-label="Current engineering status">
          <div>
            <span className="panel-label">Current focus</span>
            <strong>React foundations</strong>
          </div>
          <div>
            <span className="panel-label">This week</span>
            <strong>Components, props, and state</strong>
          </div>
          <div>
            <span className="panel-label">Next milestone</span>
            <strong>Publish the first project write-up</strong>
          </div>
        </aside>
      </section>

      <section className="stats-grid" aria-label="Blog stats">
        {stats.map((item) => (
          <article className="stat-card" key={item.label}>
            <span>{item.value}</span>
            <p>{item.label}</p>
          </article>
        ))}
      </section>

      <section className="content-grid" id="posts">
        <article className="featured-post">
          <div className="section-heading">
            <BookOpen size={20} aria-hidden="true" />
            <h2>Featured Log</h2>
          </div>
          <PostPreview post={featuredPost} featured />
        </article>

        <aside className="sidebar">
          <NewEntryForm
            entry={entry}
            formIsIncomplete={formIsIncomplete}
            onReset={resetEntries}
            onSubmit={addEntry}
            onUpdate={updateEntry}
          />
        </aside>
      </section>

      <section className="content-grid learning-section" id="learning">
        <aside className="sidebar">
          <div className="section-heading">
            <Search size={20} aria-hidden="true" />
            <h2>Learning Queue</h2>
          </div>
          <ul className="learning-list">
            <li>React component composition</li>
            <li>Reusable blog post data</li>
            <li>Filtering posts by topic</li>
            <li>Saving entries with a form</li>
          </ul>
        </aside>
      </section>

      <section className="post-list" id="projects">
        <div className="section-heading">
          <CalendarDays size={20} aria-hidden="true" />
          <h2>Recent Entries</h2>
        </div>
        <div className="post-grid">
          {recentPosts.map((post) => (
            <PostPreview post={post} key={post.id} />
          ))}
        </div>
      </section>
    </main>
  );
}

function NewEntryForm({ entry, formIsIncomplete, onReset, onSubmit, onUpdate }) {
  return (
    <form className="entry-form" onSubmit={onSubmit}>
      <div className="section-heading">
        <Hammer size={20} aria-hidden="true" />
        <h2>New Log Entry</h2>
      </div>

      <label>
        <span>Title</span>
        <input
          name="title"
          type="text"
          value={entry.title}
          onChange={onUpdate}
          placeholder="What did you work on?"
        />
      </label>

      <label>
        <span>Summary</span>
        <textarea
          name="summary"
          value={entry.summary}
          onChange={onUpdate}
          placeholder="What changed, broke, clicked, or needs another pass?"
          rows="5"
        />
      </label>

      <label>
        <span>Tags</span>
        <input
          name="tags"
          type="text"
          value={entry.tags}
          onChange={onUpdate}
          placeholder="React, debugging, project log"
        />
      </label>

      <button type="submit" disabled={formIsIncomplete}>
        Add Entry
      </button>

      <button className="secondary-button" type="button" onClick={onReset}>
        <RotateCcw size={16} aria-hidden="true" />
        Reset Starter Entries
      </button>
    </form>
  );
}

function PostPreview({ post, featured = false }) {
  return (
    <article className={featured ? "post-preview post-preview-featured" : "post-preview"}>
      <div className="post-meta">
        <span>{post.date}</span>
        <span>{post.readTime}</span>
      </div>
      <h3>{post.title}</h3>
      <p>{post.summary}</p>
      <div className="tag-row" aria-label="Post tags">
        {post.tags.map((tag) => (
          <span className="tag" key={tag}>
            <Tag size={13} aria-hidden="true" />
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}

export default App;
