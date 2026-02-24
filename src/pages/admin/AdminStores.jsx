import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getStores, createStore, deleteStore, getStoreById, updateStore } from '../../services/api';

export function AdminStores() {
    const [items, setItems] = useState([]); const [loading, setLoading] = useState(true);
    useEffect(() => { getStores().then(d => { setItems(d || []); setLoading(false); }).catch(() => setLoading(false)); }, []);
    const handleDelete = async (id) => { if (!window.confirm('Delete this store?')) return; try { await deleteStore(id); setItems(p => p.filter(i => i.id !== id)); } catch { alert('Failed to delete'); } };

    return (
        <div className="card">
            <div className="card-header"><div className="card-title">Store Locations</div><Link to="/admin/stores/create" className="btn" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>+ Add Store</Link></div>
            <div style={{ overflowX: 'auto' }}>
                <table>
                    <thead><tr><th>ID</th><th>Name</th><th>City</th><th>Phone</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                        {loading ? <tr><td colSpan="6" style={{ textAlign: 'center', padding: 30, color: 'var(--text-grey)' }}>Loading...</td></tr> :
                            items.length === 0 ? <tr><td colSpan="6" style={{ textAlign: 'center', padding: 30, color: 'var(--text-grey)' }}>No stores found.</td></tr> :
                                items.map(s => (
                                    <tr key={s.id}>
                                        <td>#{s.id}</td><td><strong>{s.name}</strong></td><td>{s.city || '-'}</td><td style={{ color: 'var(--text-grey)' }}>{s.phone || '-'}</td>
                                        <td><span className={`status-badge ${s.is_active ? 'status-success' : 'status-warning'}`}>{s.is_active ? 'Active' : 'Inactive'}</span></td>
                                        <td>
                                            <div className="action-buttons">
                                                <Link to={`/admin/stores/edit/${s.id}`} className="admin-btn-outline" style={{ padding: '5px 10px', fontSize: '0.8rem' }}>Edit</Link>
                                                <button onClick={() => handleDelete(s.id)} className="btn-danger" style={{ padding: '5px 10px', fontSize: '0.8rem', cursor: 'pointer', border: 'none' }}>Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function AdminStoreForm() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const nav = useNavigate();
    const [form, setForm] = useState({ name: '', address: '', city: '', state: '', pincode: '', phone: '', email: '', google_map_link: '', is_active: true });
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(isEdit);

    useEffect(() => {
        if (isEdit) {
            getStoreById(id).then(data => {
                setForm(data);
                setLoading(false);
            }).catch(() => { alert('Store not found'); nav('/admin/stores'); });
        }
    }, [id, isEdit, nav]);

    const handleChange = (e) => { const { name, value, type, checked } = e.target; setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value })); };
    const handleSubmit = async (e) => {
        e.preventDefault(); setSaving(true);
        try {
            if (isEdit) { await updateStore(id, form); }
            else { await createStore(form); }
            nav('/admin/stores');
        } catch (err) { alert('Save failed: ' + (err.message || 'Unknown error')); } finally { setSaving(false); }
    };

    if (loading) return <div style={{ padding: 30, color: 'var(--text-grey)', textAlign: 'center' }}>Loading...</div>;

    return (
        <div className="card" style={{ maxWidth: 800, margin: '0 auto' }}>
            <div className="card-header"><div className="card-title">{isEdit ? 'Edit Store' : 'Add Store'}</div></div>
            <form onSubmit={handleSubmit}>
                <div className="form-group"><label>Store Name</label><input type="text" name="name" required value={form.name} onChange={handleChange} /></div>
                <div className="form-group"><label>Address</label><textarea name="address" rows="2" value={form.address || ''} onChange={handleChange}></textarea></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
                    <div className="form-group"><label>City</label><input type="text" name="city" value={form.city || ''} onChange={handleChange} /></div>
                    <div className="form-group"><label>State</label><input type="text" name="state" value={form.state || ''} onChange={handleChange} /></div>
                    <div className="form-group"><label>Pincode</label><input type="text" name="pincode" value={form.pincode || ''} onChange={handleChange} /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div className="form-group"><label>Phone</label><input type="text" name="phone" value={form.phone || ''} onChange={handleChange} /></div>
                    <div className="form-group"><label>Email</label><input type="email" name="email" value={form.email || ''} onChange={handleChange} /></div>
                </div>
                <div className="form-group"><label>Google Map Link</label><input type="text" name="google_map_link" value={form.google_map_link || ''} onChange={handleChange} /></div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input type="checkbox" name="is_active" id="st_act" checked={form.is_active} onChange={handleChange} style={{ width: 'auto' }} />
                    <label htmlFor="st_act" style={{ margin: 0 }}>Active</label>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 30 }}>
                    <Link to="/admin/stores" className="btn btn-outline">Cancel</Link>
                    <button type="submit" className="btn" disabled={saving}>{saving ? 'Saving...' : (isEdit ? 'Update Store' : 'Save Store')}</button>
                </div>
            </form>
        </div>
    );
}
