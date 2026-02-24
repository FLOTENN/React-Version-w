import { useState, useEffect } from 'react';
import { getBookings, updateBookingStatus, deleteBooking } from '../../services/api';
import { formatDateTime } from '../../utils/helpers';

const statusColors = {
    pending: { bg: 'rgba(241,196,15,0.2)', color: '#f1c40f' },
    confirmed: { bg: 'rgba(52,152,219,0.2)', color: '#3498db' },
    in_progress: { bg: 'rgba(255,165,0,0.2)', color: '#ffa500' },
    completed: { bg: 'rgba(46,204,113,0.2)', color: '#2ecc71' },
    cancelled: { bg: 'rgba(231,76,60,0.2)', color: '#e74c3c' },
};

export default function AdminBookings() {
    const [items, setItems] = useState([]); const [loading, setLoading] = useState(true);
    useEffect(() => { getBookings().then(d => { setItems(d || []); setLoading(false); }).catch(() => setLoading(false)); }, []);

    const handleStatus = async (id, s) => {
        try { await updateBookingStatus(id, s); setItems(p => p.map(i => i.id === id ? { ...i, status: s } : i)); } catch { alert('Failed'); }
    };
    const handleDelete = async (id) => { if (!window.confirm('Delete?')) return; try { await deleteBooking(id); setItems(p => p.filter(i => i.id !== id)); } catch { alert('Failed'); } };

    return (
        <div className="card">
            <div className="card-header"><div className="card-title">All Bookings</div><div style={{ fontSize: '0.85rem', color: 'var(--text-grey)' }}>{items.length} total</div></div>
            <div style={{ overflowX: 'auto' }}>
                <table>
                    <thead><tr><th>ID</th><th>Customer</th><th>Service</th><th>Vehicle</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                        {loading ? <tr><td colSpan="7" style={{ textAlign: 'center', padding: 30, color: 'var(--text-grey)' }}>Loading...</td></tr> :
                            items.length === 0 ? <tr><td colSpan="7" style={{ textAlign: 'center', padding: 30, color: 'var(--text-grey)' }}>No bookings found.</td></tr> :
                                items.map(b => {
                                    const s = b.status || 'pending';
                                    const sc = statusColors[s] || { bg: 'rgba(255,255,255,0.1)', color: '#fff' };
                                    return (
                                        <tr key={b.id}>
                                            <td>#{b.id}</td><td><strong>{b.customer_name}</strong></td><td>{b.service_type || '-'}</td><td style={{ color: 'var(--text-grey)' }}>{b.vehicle_details || '-'}</td>
                                            <td style={{ fontSize: '0.85rem', color: 'var(--text-grey)' }}>{formatDateTime(b.booking_date || b.created_at)}</td>
                                            <td>
                                                <select value={s} onChange={e => handleStatus(b.id, e.target.value)}
                                                    style={{ background: sc.bg, color: sc.color, border: 'none', padding: '4px 8px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer' }}>
                                                    <option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="in_progress">In Progress</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                            <td><button onClick={() => handleDelete(b.id)} className="btn-danger" style={{ padding: '5px 10px', fontSize: '0.8rem', cursor: 'pointer', border: 'none' }}>Delete</button></td>
                                        </tr>
                                    );
                                })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
