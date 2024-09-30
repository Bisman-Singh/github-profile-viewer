import { useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const COLORS = [
  '#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6',
  '#06b6d4', '#ec4899', '#f97316', '#14b8a6', '#6366f1',
  '#84cc16', '#e879f9'
]

function LanguageChart({ repos }) {
  const langData = useMemo(() => {
    const counts = {}
    repos.forEach(repo => {
      if (repo.language) {
        counts[repo.language] = (counts[repo.language] || 0) + 1
      }
    })
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 12)
  }, [repos])

  if (langData.length === 0) {
    return <div className="empty-state">No language data available</div>
  }

  const total = langData.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="language-chart">
      <h2>Language Breakdown</h2>
      <p className="chart-subtitle">Distribution across {repos.length} repositories</p>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={langData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={150}
              paddingAngle={2}
              dataKey="value"
            >
              {langData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#1e1e2e', border: '1px solid #333', borderRadius: 8 }}
              itemStyle={{ color: '#e0e0e0' }}
              formatter={(value) => [`${value} repos (${((value / total) * 100).toFixed(1)}%)`, 'Count']}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="lang-list">
        {langData.map((lang, i) => (
          <div key={lang.name} className="lang-item">
            <span className="lang-dot" style={{ background: COLORS[i % COLORS.length] }} />
            <span className="lang-name">{lang.name}</span>
            <span className="lang-count">{lang.value} repos</span>
            <span className="lang-pct">{((lang.value / total) * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LanguageChart
