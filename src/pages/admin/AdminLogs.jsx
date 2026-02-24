import { useState, useEffect } from 'react';
import { getActivityLogs } from '../../services/api';
import { formatDateTime } from '../../utils/helpers';

export default function AdminLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getActivityLogs().then(d => { setLogs(d || []); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    return (
        <div className="card">
            <div className="card-header">
                <div className="card-title">Activity Logs</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-grey)' }}>{logs.length} entries</div>
            </div>
            <div style={{ overflowX: 'auto' }}>
                <table>
                    <thead><tr><th>ID</th><th>User</th><th>Action</th><th>Entity</th><th>Details</th><th>Date</th></tr></thead>
                    <tbody>
                        {loading ? <tr><td colSpan="6" style={{ textAlign: 'center', padding: 30, color: 'var(--text-grey)' }}>Loading...</td></tr> :
                            logs.length === 0 ? <tr><td colSpan="6" style={{ textAlign: 'center', padding: 30, color: 'var(--text-grey)' }}>No activity logs.</td></tr> :
                                logs.map(log => (
                                    <tr key={log.id}>
                                        <td style={{ color: 'var(--text-grey)' }}>#{log.id}</td>
                                        <td><strong>{log.user_name || 'System'}</strong></td>
                                        <td><span style={{ background: 'rgba(255,0,0,0.1)', color: 'var(--primary)', padding: '3px 8px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>{log.action}</span></td>
                                        <td>{log.entity_type || '-'}</td>
                                        <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-grey)', fontSize: '0.85rem' }}>{log.details || '-'}</td>
                                        <td style={{ color: 'var(--text-grey)', fontSize: '0.85rem' }}>{formatDateTime(log.created_at)}</td>
                                    </tr>
                                ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
