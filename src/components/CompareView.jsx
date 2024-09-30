import { useState } from 'react'

function CompareView({ mainUser, mainRepos }) {
  const [compareQuery, setCompareQuery] = useState('')
  const [compareUser, setCompareUser] = useState(null)
  const [compareRepos, setCompareRepos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchCompare = async (e) => {
    e.preventDefault()
    if (!compareQuery.trim()) return
    setLoading(true)
    setError('')
    try {
      const [uRes, rRes] = await Promise.all([
        fetch(`https://api.github.com/users/${compareQuery.trim()}`),
        fetch(`https://api.github.com/users/${compareQuery.trim()}/repos?per_page=100`)
      ])
      if (!uRes.ok) throw new Error('User not found')
      setCompareUser(await uRes.json())
      const rd = await rRes.json()
      setCompareRepos(Array.isArray(rd) ? rd : [])
    } catch (err) {
      setError(err.message)
      setCompareUser(null)
      setCompareRepos([])
    } finally {
      setLoading(false)
    }
  }

  const getStats = (user, repos) => ({
    repos: user.public_repos,
    followers: user.followers,
    following: user.following,
    stars: repos.reduce((s, r) => s + (r.stargazers_count || 0), 0),
    forks: repos.reduce((s, r) => s + (r.forks_count || 0), 0),
    languages: [...new Set(repos.map(r => r.language).filter(Boolean))].length,
  })

  const mainStats = getStats(mainUser, mainRepos)
  const compStats = compareUser ? getStats(compareUser, compareRepos) : null

  const statRows = [
    { label: 'Repositories', key: 'repos' },
    { label: 'Followers', key: 'followers' },
    { label: 'Following', key: 'following' },
    { label: 'Total Stars', key: 'stars' },
    { label: 'Total Forks', key: 'forks' },
    { label: 'Languages', key: 'languages' },
  ]

  return (
    <div className="compare-view">
      <h2>Compare Users</h2>
      <form className="compare-form" onSubmit={fetchCompare}>
        <input
          type="text"
          placeholder="Enter username to compare..."
          value={compareQuery}
          onChange={(e) => setCompareQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-btn" disabled={loading}>
          {loading ? 'Loading...' : 'Compare'}
        </button>
      </form>
      {error && <div className="error-msg">{error}</div>}

      {compareUser && (
        <div className="compare-table">
          <div className="compare-header">
            <div className="compare-user">
              <img src={mainUser.avatar_url} alt={mainUser.login} className="compare-avatar" />
              <span>{mainUser.login}</span>
            </div>
            <div className="compare-vs">VS</div>
            <div className="compare-user">
              <img src={compareUser.avatar_url} alt={compareUser.login} className="compare-avatar" />
              <span>{compareUser.login}</span>
            </div>
          </div>
          {statRows.map(row => {
            const mVal = mainStats[row.key]
            const cVal = compStats[row.key]
            return (
              <div key={row.key} className="compare-row">
                <span className={`compare-val ${mVal > cVal ? 'winner' : ''}`}>{mVal.toLocaleString()}</span>
                <span className="compare-label">{row.label}</span>
                <span className={`compare-val ${cVal > mVal ? 'winner' : ''}`}>{cVal.toLocaleString()}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CompareView
