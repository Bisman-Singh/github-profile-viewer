function Favorites({ favorites, onSelect, onRemove }) {
  if (favorites.length === 0) {
    return (
      <div className="empty-state">
        <h2>No Favorites Yet</h2>
        <p>Search for a user and click the star to add them to your favorites</p>
      </div>
    )
  }

  return (
    <div className="favorites">
      <h2>Favorite Users ({favorites.length})</h2>
      <div className="favorites-grid">
        {favorites.map(username => (
          <div key={username} className="favorite-card">
            <img
              src={`https://github.com/${username}.png`}
              alt={username}
              className="favorite-avatar"
            />
            <span className="favorite-name">{username}</span>
            <div className="favorite-actions">
              <button className="fav-action-btn view" onClick={() => onSelect(username)}>
                View
              </button>
              <button className="fav-action-btn remove" onClick={() => onRemove(username)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Favorites
