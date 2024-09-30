import { useState, useEffect, useCallback } from 'react'
import ProfileCard from './components/ProfileCard'
import RepoList from './components/RepoList'
import LanguageChart from './components/LanguageChart'
import ActivityTimeline from './components/ActivityTimeline'
import CompareView from './components/CompareView'
import Favorites from './components/Favorites'

const TABS = ['Profile', 'Repos', 'Languages', 'Activity', 'Compare', 'Favorites']

function App() {
  const [query, setQuery] = useState('')
  const [user, setUser] = useState(null)
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('Profile')
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('gh-favorites')) || [] }
    catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('gh-favorites', JSON.stringify(favorites))
  }, [favorites])

  const fetchUser = useCallback(async (username) => {
    if (!username.trim()) return
    setLoading(true)
    setError('')
    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username.trim()}`),
        fetch(`https://api.github.com/users/${username.trim()}/repos?per_page=100&sort=updated`)
      ])
      if (!userRes.ok) throw new Error('User not found')
      const userData = await userRes.json()
      const reposData = await reposRes.json()
      setUser(userData)
      setRepos(Array.isArray(reposData) ? reposData : [])
      setActiveTab('Profile')
    } catch (err) {
      setError(err.message)
      setUser(null)
      setRepos([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchUser(query)
  }

  const toggleFavorite = (username) => {
    setFavorites(prev =>
      prev.includes(username)
        ? prev.filter(f => f !== username)
        : [...prev, username]
    )
  }

  const isFavorite = user ? favorites.includes(user.login) : false

  return (
    <div className="app">
      <header className="header">
        <h1 className="logo">
          <svg width="28" height="28" viewBox="0 0 16 16" fill="#22c55e">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          GitHub Profile Viewer
        </h1>
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search GitHub username..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </header>

      {error && <div className="error-msg">{error}</div>}

      {user && (
        <>
          <nav className="tabs">
            {TABS.map(tab => (
              <button
                key={tab}
                className={`tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>

          <main className="main-content">
            {activeTab === 'Profile' && (
              <ProfileCard
                user={user}
                isFavorite={isFavorite}
                onToggleFavorite={() => toggleFavorite(user.login)}
              />
            )}
            {activeTab === 'Repos' && <RepoList repos={repos} />}
            {activeTab === 'Languages' && <LanguageChart repos={repos} />}
            {activeTab === 'Activity' && <ActivityTimeline repos={repos} user={user} />}
            {activeTab === 'Compare' && <CompareView mainUser={user} mainRepos={repos} />}
            {activeTab === 'Favorites' && (
              <Favorites
                favorites={favorites}
                onSelect={(username) => { setQuery(username); fetchUser(username) }}
                onRemove={(username) => toggleFavorite(username)}
              />
            )}
          </main>
        </>
      )}

      {!user && !loading && !error && (
        <div className="welcome">
          <svg width="80" height="80" viewBox="0 0 16 16" fill="#22c55e" opacity="0.3">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          <h2>Search for a GitHub user to get started</h2>
          <p>View profiles, repositories, language stats, and more</p>
        </div>
      )}
    </div>
  )
}

export default App
