import React, { useEffect, useState } from 'react';
import { Users, FileText, Activity, Clock, Plus } from 'lucide-react';

interface Interaction {
  id: number;
  hcp_name: string;
  interaction_type: string;
  date: string;
  sentiment: string;
  created_at: string;
}

interface DashboardProps {
  onNavigate: (view: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/interactions');
        if (response.ok) {
          const data = await response.json();
          setInteractions(data);
        }
      } catch (error) {
        console.error('Failed to fetch interactions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInteractions();
  }, []);

  const totalInteractions = interactions.length;
  const uniqueHCPs = new Set(interactions.map(i => i.hcp_name)).size;
  const positiveInteractions = interactions.filter(i => i.sentiment.toLowerCase() === 'positive').length;
  const positiveRate = totalInteractions > 0 ? Math.round((positiveInteractions / totalInteractions) * 100) : 0;

  const getSentimentBadge = (sentiment: string) => {
    const lower = sentiment.toLowerCase();
    if (lower === 'positive') return 'badge positive';
    if (lower === 'negative') return 'badge negative';
    return 'badge neutral';
  };

  if (loading) {
    return <div className="dashboard-container" style={{ justifyContent: 'center', alignItems: 'center' }}><Activity className="typing-indicator span" size={32} color="var(--primary)" /></div>;
  }

  return (
    <div className="dashboard-container">
      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="glass-panel kpi-card">
          <div className="kpi-icon indigo">
            <FileText size={28} />
          </div>
          <div className="kpi-info">
            <h4>Total Interactions</h4>
            <div className="kpi-value">{totalInteractions}</div>
          </div>
        </div>

        <div className="glass-panel kpi-card">
          <div className="kpi-icon emerald">
            <Users size={28} />
          </div>
          <div className="kpi-info">
            <h4>Unique HCPs</h4>
            <div className="kpi-value">{uniqueHCPs}</div>
          </div>
        </div>

        <div className="glass-panel kpi-card">
          <div className="kpi-icon amber">
            <Activity size={28} />
          </div>
          <div className="kpi-info">
            <h4>Positive Sentiment</h4>
            <div className="kpi-value">{positiveRate}%</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-panel recent-activity-card">
        <div className="recent-activity-header">
          <h3>Recent Activity</h3>
          <button className="btn-primary" onClick={() => onNavigate('interactions')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
            <Plus size={16} />
            <span>Log Interaction</span>
          </button>
        </div>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>HCP Name</th>
                <th>Type</th>
                <th>Date</th>
                <th>Sentiment</th>
                <th>Logged</th>
              </tr>
            </thead>
            <tbody>
              {interactions.length > 0 ? (
                interactions.slice(0, 8).map(interaction => (
                  <tr key={interaction.id}>
                    <td style={{ fontWeight: 600 }}>{interaction.hcp_name}</td>
                    <td>{interaction.interaction_type}</td>
                    <td>{interaction.date}</td>
                    <td><span className={getSentimentBadge(interaction.sentiment)}>{interaction.sentiment}</span></td>
                    <td style={{ color: 'var(--text-muted)' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                         <Clock size={14} />
                         {new Date(interaction.created_at).toLocaleDateString()}
                       </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No interactions found. Log one to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
