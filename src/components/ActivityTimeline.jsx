import { useMemo } from 'react'

function ActivityTimeline({ repos, user }) {
  const activities = useMemo(() => {
    const items = []
    repos.slice(0, 30).forEach(repo => {
      items.push({
        id: `push-${repo.id}`,
        type: 'push',
        repo: repo.name,
        url: repo.html_url,
        date: repo.updated_at,
        description: repo.description || 'No description',
      })
      if (repo.created_at !== repo.updated_at) {
        items.push({
          id: `create-${repo.id}`,
          type: 'create',
          repo: repo.name,
          url: repo.html_url,
          date: repo.created_at,
          description: `Created repository ${repo.name}`,
        })
      }
    })
    return items.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 30)
  }, [repos])

  const typeIcons = { push: '📝', create: '🆕', fork: '🍴', star: '⭐' }
  const typeLabels = { push: 'Updated', create: 'Created', fork: 'Forked', star: 'Starred' }

  return (
    <div className="activity-timeline">
      <h2>Recent Activity</h2>
      <p className="chart-subtitle">Based on repository activity for {user.login}</p>
      <div className="timeline">
        {activities.map(act => (
          <div key={act.id} className="timeline-item">
            <div className="timeline-dot">{typeIcons[act.type]}</div>
            <div className="timeline-content">
              <div className="timeline-header">
                <span className="timeline-type">{typeLabels[act.type]}</span>
                <a href={act.url} target="_blank" rel="noreferrer" className="timeline-repo">
                  {act.repo}
                </a>
                <span className="timeline-date">
                  {new Date(act.date).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  })}
                </span>
              </div>
              <p className="timeline-desc">{act.description}</p>
            </div>
          </div>
        ))}
        {activities.length === 0 && <p className="no-results">No recent activity found</p>}
      </div>
    </div>
  )
}

export default ActivityTimeline
