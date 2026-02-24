import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats, getRecentEnquiries } from '../../services/api';
import { formatDateTime, getStatusBadgeClass } from '../../utils/helpers';

const statCards = [
    { key: 'enquiries', label: 'Total Enquiries', icon: 'fas fa-envelope', color: '#FF0000', bg: 'rgba(255,0,0,0.1)' },
    { key: 'services', label: 'Active Services', icon: 'fas fa-tools', color: '#28a745', bg: 'rgba(40,167,69,0.1)' },
    { key: 'posts', label: 'Published Posts', icon: 'fas fa-newspaper', color: '#17a2b8', bg: 'rgba(23,162,184,0.1)' },
];

const statusColors = {
    new: { bg: 'rgba(52,152,219,0.2)', color: '#3498db' },
    urgent: { bg: 'rgba(231,76,60,0.2)', color: '#e74c3c' },
    contacted: { bg: 'rgba(241,196,15,0.2)', color: '#f1c40f' },
    closed: { bg: 'rgba(46,204,113,0.2)', color: '#2ecc71' },
    resolved: { bg: 'rgba(46,204,113,0.2)', color: '#2ecc71' },
};

export default function AdminDashboard() {
    const [stats, setStats] = useState({ enquiries: 0, services: 0, posts: 0 });
    const [enquiries, setEnquiries] = useState([]);

    useEffect(() => {
        const load = async () => {
            try {
                const [s, e] = await Promise.all([
                    getDashboardStats().catch(() => ({ enquiries: 0, services: 0, posts: 0 })),
                    getRecentEnquiries(5).catch(() => []),
                ]);
                setStats(s || { enquiries: 0, services: 0, posts: 0 });
                setEnquiries(e || []);
            } catch (err) {
                console.error(err);
            }
        };
        load();
    }, []);

    return (
        <>
            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '25px', marginBottom: '40px' }}>
                {statCards.map(sc => (
                    <div className="card" key={sc.key} style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ width: 60, height: 60, background: sc.bg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: sc.color, fontSize: '1.5rem' }}>
                            <i className={sc.icon}></i>
                        </div>
                        <div>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'white' }}>{stats[sc.key] ?? 0}</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-grey)' }}>{sc.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Enquiries */}
            <div className="card">
                <div className="card-header">
                    <div className="card-title">Recent Enquiries</div>
                    <Link to="/admin/enquiries" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>View All</Link>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th><th>Name</th><th>Service Interest</th><th>Date</th><th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enquiries.length === 0 ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-grey)' }}>No enquiries yet.</td></tr>
                            ) : (
                                enquiries.map(enq => {
                                    const status = enq.status || 'new';
                                    const sc = statusColors[status] || { bg: 'rgba(255,255,255,0.1)', color: '#fff' };
                                    return (
                                        <tr key={enq.id}>
                                            <td style={{ color: 'var(--text-grey)' }}>#{enq.id}</td>
                                            <td style={{ fontWeight: 600 }}>{enq.name}</td>
                                            <td>{enq.subject || '-'}</td>
                                            <td style={{ color: 'var(--text-grey)', fontSize: '0.85rem' }}>{formatDateTime(enq.created_at)}</td>
                                            <td>
                                                <span style={{ background: sc.bg, color: sc.color, padding: '4px 8px', borderRadius: 4, fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>
                                                    {status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
