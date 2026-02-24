import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../../services/api';
import { formatDate } from '../../utils/helpers';

export function AdminUsers() {
    const [items, setItems] = useState([]); const [loading, setLoading] = useState(true);
    useEffect(() => { getUsers().then(d => { setItems(d || []); setLoading(false); }).catch(() => setLoading(false)); }, []);
    const handleDelete = async (id) => { if (!window.confirm('Delete this user?')) return; try { await deleteUser(id); setItems(p => p.filter(i => i.id !== id)); } catch { alert('Delete failed'); } };

    const roleColors = {
        super_admin: { bg: 'rgba(255,0,0,0.2)', color: '#ff4444' },
        admin: { bg: 'rgba(52,152,219,0.2)', color: '#3498db' },
        editor: { bg: 'rgba(46,204,113,0.2)', color: '#2ecc71' },
        viewer: { bg: 'rgba(241,196,15,0.2)', color: '#f1c40f' },
    };

    return (
        <div className="card">
            <div className="card-header"><div className="card-title">All Users</div><Link to="/admin/users/create" className="btn" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>+ Add User</Link></div>
            <div style={{ overflowX: 'auto' }}>
                <table>
                    <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr></thead>
                    <tbody>
                        {loading ? <tr><td colSpan="6" style={{ textAlign: 'center', padding: 30, color: 'var(--text-grey)' }}>Loading...</td></tr> :
                            items.length === 0 ? <tr><td colSpan="6" style={{ textAlign: 'center', padding: 30, color: 'var(--text-grey)' }}>No users found.</td></tr> :
                                items.map(u => {
                                    const rc = roleColors[u.role] || { bg: 'rgba(255,255,255,0.1)', color: '#fff' };
                                    return (
                                        <tr key={u.id}>
                                            <td>#{u.id}</td>
                                            <td><strong>{u.name}</strong></td>
                                            <td style={{ color: 'var(--text-grey)' }}>{u.email}</td>
                                            <td><span style={{ background: rc.bg, color: rc.color, padding: '4px 8px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>{u.role}</span></td>
                                            <td style={{ fontSize: '0.85rem', color: 'var(--text-grey)' }}>{formatDate(u.created_at)}</td>
                                            <td>
                                                <Link to={`/admin/users/edit/${u.id}`} className="btn-outline" style={{ padding: '5px 10px', fontSize: '0.8rem', marginRight: 5 }}>Edit</Link>
                                                <button onClick={() => handleDelete(u.id)} className="btn-danger" style={{ padding: '5px 10px', fontSize: '0.8rem', cursor: 'pointer', border: 'none' }}>Delete</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function AdminUserForm() {
    const { id } = useParams(); const nav = useNavigate(); const isEdit = Boolean(id);
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'editor' });
    const [saving, setSaving] = useState(false);
    useEffect(() => { if (isEdit) getUserById(id).then(d => { if (d) setForm({ ...form, ...d, password: '' }); }).catch(console.error); }, [id]);
    const handleChange = (e) => { const { name, value } = e.target; setForm(p => ({ ...p, [name]: value })); };
    const handleSubmit = async (e) => {
        e.preventDefault(); setSaving(true);
        try {
            const payload = { ...form };
            if (isEdit && !payload.password) delete payload.password;
            isEdit ? await updateUser(id, payload) : await createUser(payload);
            nav('/admin/users');
        } catch (err) { alert('Save failed: ' + err.message); }
        finally { setSaving(false); }
    };

    return (
        <div className="card" style={{ maxWidth: 600, margin: '0 auto' }}>
            <div className="card-header"><div className="card-title">{isEdit ? 'Edit' : 'Add'} User</div></div>
            <form onSubmit={handleSubmit}>
                <div className="form-group"><label>Full Name</label><input type="text" name="name" required value={form.name} onChange={handleChange} /></div>
                <div className="form-group"><label>Email</label><input type="email" name="email" required value={form.email} onChange={handleChange} /></div>
                <div className="form-group"><label>{isEdit ? 'New Password (leave blank to keep)' : 'Password'}</label><input type="password" name="password" value={form.password || ''} onChange={handleChange} {...(!isEdit && { required: true })} /></div>
                <div className="form-group">
                    <label>Role</label>
                    <select name="role" value={form.role} onChange={handleChange}>
                        <option value="super_admin">Super Admin</option>
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                        <option value="viewer">Viewer</option>
                    </select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 30 }}>
                    <Link to="/admin/users" className="btn btn-outline">Cancel</Link>
                    <button type="submit" className="btn" disabled={saving}>{saving ? 'Saving...' : 'Save User'}</button>
                </div>
            </form>
        </div>
    );
}
