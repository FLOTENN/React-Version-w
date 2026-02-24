import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getEnquiries, updateEnquiryStatus, deleteEnquiry } from '../../services/api';
import { formatDateTime } from '../../utils/helpers';

const statusColors = {
    new: { bg: 'rgba(52,152,219,0.2)', color: '#3498db' },
    urgent: { bg: 'rgba(231,76,60,0.2)', color: '#e74c3c' },
    contacted: { bg: 'rgba(241,196,15,0.2)', color: '#f1c40f' },
    closed: { bg: 'rgba(46,204,113,0.2)', color: '#2ecc71' },
    resolved: { bg: 'rgba(46,204,113,0.2)', color: '#2ecc71' },
};

export default function AdminEnquiries() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        getEnquiries().then(d => { setItems(d || []); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateEnquiryStatus(id, newStatus);
            setItems(prev => prev.map(i => i.id === id ? { ...i, status: newStatus } : i));
        } catch { alert('Status update failed'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this enquiry?')) return;
        try { await deleteEnquiry(id); setItems(p => p.filter(i => i.id !== id)); } catch { alert('Delete failed'); }
    };

    return (
        <div className="card">
            <div className="card-header">
                <div className="card-title">All Enquiries</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-grey)' }}>{items.length} total</div>
            </div>
            <div style={{ overflowX: 'auto' }}>
                <table>
                    <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Subject</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                        {loading ? <tr><td colSpan="8" style={{ textAlign: 'center', padding: 30, color: 'var(--text-grey)' }}>Loading...</td></tr> :
                            items.length === 0 ? <tr><td colSpan="8" style={{ textAlign: 'center', padding: 30, color: 'var(--text-grey)' }}>No enquiries yet.</td></tr> :
                                items.map(enq => {
                                    const status = enq.status || 'new';
                                    const sc = statusColors[status] || { bg: 'rgba(255,255,255,0.1)', color: '#fff' };
                                    return (
                                        <>
                                            <tr key={enq.id}>
                                                <td>#{enq.id}</td>
                                                <td><strong>{enq.name}</strong></td>
                                                <td style={{ color: 'var(--text-grey)', fontSize: '0.85rem' }}>{enq.email}</td>
                                                <td>{enq.phone}</td>
                                                <td>{enq.subject || '-'}</td>
                                                <td style={{ color: 'var(--text-grey)', fontSize: '0.85rem' }}>{formatDateTime(enq.created_at)}</td>
                                                <td>
                                                    <select
                                                        value={status}
                                                        onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                                                        style={{ background: sc.bg, color: sc.color, border: 'none', padding: '4px 8px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer' }}
                                                    >
                                                        <option value="new">New</option>
                                                        <option value="contacted">Contacted</option>
                                                        <option value="urgent">Urgent</option>
                                                        <option value="resolved">Resolved</option>
                                                        <option value="closed">Closed</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <button onClick={() => setExpanded(expanded === enq.id ? null : enq.id)} className="btn-outline" style={{ padding: '5px 10px', fontSize: '0.8rem', marginRight: 5 }}>
                                                        {expanded === enq.id ? 'Close' : 'View'}
                                                    </button>
                                                    <button onClick={() => handleDelete(enq.id)} className="btn-danger" style={{ padding: '5px 10px', fontSize: '0.8rem', cursor: 'pointer', border: 'none' }}>Delete</button>
                                                </td>
                                            </tr>
                                            {expanded === enq.id && (
                                                <tr key={`${enq.id}-detail`}>
                                                    <td colSpan="8" style={{ padding: '20px 30px', background: 'rgba(255,255,255,0.02)', borderLeft: '3px solid var(--primary)' }}>
                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 15 }}>
                                                            <div><strong style={{ color: '#888', fontSize: '0.8rem' }}>City:</strong> <span style={{ color: 'white' }}>{enq.city || '-'}</span></div>
                                                            <div><strong style={{ color: '#888', fontSize: '0.8rem' }}>Phone:</strong> <span style={{ color: 'white' }}>{enq.phone || '-'}</span></div>
                                                        </div>
                                                        <div><strong style={{ color: '#888', fontSize: '0.8rem' }}>Message:</strong></div>
                                                        <p style={{ color: '#ccc', lineHeight: 1.7, marginTop: 8, whiteSpace: 'pre-wrap' }}>{enq.message || 'No message provided.'}</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    );
                                })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
