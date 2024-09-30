import { useState, useMemo } from 'react'

function RepoList({ repos }) {
  const [sortBy, setSortBy] = useState('updated')
  const [filter, setFilter] = useState('')

  const sorted = useMemo(() => {
    let filtered = repos.filter(r =>
      r.name.toLowerCase().includes(filter.toLowerCase()) ||
      (r.description || '').toLowerCase().includes(filter.toLowerCase())
    )
    return filtered.sort((a, b) => {
      if (sortBy === 'stars') return (b.stargazers_count || 0) - (a.stargazers_count || 0)
      if (sortBy === 'forks') return (b.forks_count || 0) - (a.forks_count || 0)
      return new Date(b.updated_at) - new Date(a.updated_at)
    })
  }, [repos, sortBy, filter])

  return (
    <div className="repo-list">
      <div className="repo-controls">
        <input
          type="text"
          placeholder="Filter repositories..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-input"
        />
        <div className="sort-btns">
          {['updated', 'stars', 'forks'].map(s => (
            <button
              key={s}
              className={`sort-btn ${sortBy === s ? 'active' : ''}`}
              onClick={() => setSortBy(s)}
            >
              {s === 'updated' ? '🕐 Recent' : s === 'stars' ? '⭐ Stars' : '🍴 Forks'}
            </button>
          ))}
        </div>
      </div>
      <div className="repo-grid">
        {sorted.map(repo => (
          <a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noreferrer"
            className="repo-card"
          >
            <h3 className="repo-name">{repo.name}</h3>
            <p className="repo-desc">{repo.description || 'No description'}</p>
            <div className="repo-meta">
              {repo.language && (
                <span className="repo-lang">
                  <span className="lang-dot" style={{ background: getLangColor(repo.language) }} />
                  {repo.language}
                </span>
              )}
              <span>⭐ {repo.stargazers_count}</span>
              <span>🍴 {repo.forks_count}</span>
              <span>Updated {timeAgo(repo.updated_at)}</span>
            </div>
          </a>
        ))}
        {sorted.length === 0 && <p className="no-results">No repositories found</p>}
      </div>
    </div>
  )
}

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)
  const intervals = [
    { label: 'y', seconds: 31536000 },
    { label: 'mo', seconds: 2592000 },
    { label: 'd', seconds: 86400 },
    { label: 'h', seconds: 3600 },
    { label: 'm', seconds: 60 },
  ]
  for (const i of intervals) {
    const count = Math.floor(seconds / i.seconds)
    if (count > 0) return `${count}${i.label} ago`
  }
  return 'just now'
}

const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
  Java: '#b07219', Go: '#00ADD8', Rust: '#dea584', Ruby: '#701516',
  'C++': '#f34b7d', C: '#555555', 'C#': '#178600', PHP: '#4F5D95',
  Swift: '#F05138', Kotlin: '#A97BFF', Dart: '#00B4AB', HTML: '#e34c26',
  CSS: '#563d7c', Shell: '#89e051', Vue: '#41b883', Svelte: '#ff3e00',
}

function getLangColor(lang) {
  return LANG_COLORS[lang] || '#8b8b8b'
}

export default RepoList
