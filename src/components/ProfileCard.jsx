function ProfileCard({ user, isFavorite, onToggleFavorite }) {
  const joinDate = new Date(user.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <div className="profile-card">
      <div className="profile-header">
        <img src={user.avatar_url} alt={user.login} className="avatar" />
        <div className="profile-info">
          <div className="profile-name-row">
            <h2>{user.name || user.login}</h2>
            <button
              className={`fav-btn ${isFavorite ? 'fav-active' : ''}`}
              onClick={onToggleFavorite}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorite ? '★' : '☆'}
            </button>
          </div>
          <a href={user.html_url} target="_blank" rel="noreferrer" className="username-link">
            @{user.login}
          </a>
          {user.bio && <p className="bio">{user.bio}</p>}
          {user.location && (
            <p className="location">📍 {user.location}</p>
          )}
          {user.company && <p className="company">🏢 {user.company}</p>}
          {user.blog && (
            <a href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
               target="_blank" rel="noreferrer" className="blog-link">
              🔗 {user.blog}
            </a>
          )}
          <p className="join-date">Joined {joinDate}</p>
        </div>
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{user.public_repos}</span>
          <span className="stat-label">Repositories</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{user.followers}</span>
          <span className="stat-label">Followers</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{user.following}</span>
          <span className="stat-label">Following</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{user.public_gists || 0}</span>
          <span className="stat-label">Gists</span>
        </div>
      </div>
    </div>
  )
}

export default ProfileCard
