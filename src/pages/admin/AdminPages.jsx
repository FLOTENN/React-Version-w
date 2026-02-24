import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getAllPages, getPageById, createPage, updatePage, deletePage } from '../../services/api';
import { slugify } from '../../utils/helpers';

export function AdminPages() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => { getAllPages().then(d => { setItems(d || []); setLoading(false); }).catch(() => setLoading(false)); }, []);
    const handleDelete = async (id) => { if (!window.confirm('Delete this page?')) return; try { await deletePage(id); setItems(p => p.filter(i => i.id !== id)); } catch { alert('Delete failed'); } };

    return (
        <div className="card">
            <div className="card-header"><div className="card-title">All Pages</div><Link to="/admin/pages/create" className="btn" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>+ Add Page</Link></div>
            <div style={{ overflowX: 'auto' }}>
                <table>
                    <thead><tr><th>ID</th><th>Title</th><th>Slug</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                        {loading ? <tr><td colSpan="5" style={{ textAlign: 'center', padding: 30, color: 'var(--text-grey)' }}>Loading...</td></tr> :
                            items.length === 0 ? <tr><td colSpan="5" style={{ textAlign: 'center', padding: 30, color: 'var(--text-grey)' }}>No pages found.</td></tr> :
                                items.map(p => (
                                    <tr key={p.id}>
                                        <td>#{p.id}</td><td><strong>{p.title}</strong></td><td style={{ color: 'var(--text-grey)' }}>{p.slug}</td>
                                        <td><span className={`status-badge ${p.is_published ? 'status-success' : 'status-warning'}`}>{p.is_published ? 'Published' : 'Draft'}</span></td>
                                        <td>
                                            <Link to={`/admin/pages/edit/${p.id}`} className="btn-outline" style={{ padding: '5px 10px', fontSize: '0.8rem', marginRight: 5 }}>Edit</Link>
                                            <button onClick={() => handleDelete(p.id)} className="btn-danger" style={{ padding: '5px 10px', fontSize: '0.8rem', cursor: 'pointer', border: 'none' }}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function AdminPageForm() {
    const { id } = useParams(); const nav = useNavigate(); const isEdit = Boolean(id);
    const [form, setForm] = useState({ title: '', slug: '', content: '', is_published: true, meta_title: '', meta_description: '' });
    const [saving, setSaving] = useState(false);
    useEffect(() => { if (isEdit) getPageById(id).then(d => { if (d) setForm({ ...form, ...d }); }).catch(console.error); }, [id]);
    const handleChange = (e) => { const { name, value, type, checked } = e.target; setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value })); if (name === 'title' && !isEdit) setForm(p => ({ ...p, slug: slugify(value) })); };
    const handleSubmit = async (e) => { e.preventDefault(); setSaving(true); try { isEdit ? await updatePage(id, form) : await createPage(form); nav('/admin/pages'); } catch (err) { alert('Save failed: ' + err.message); } finally { setSaving(false); } };

    return (
        <div className="card" style={{ maxWidth: 800, margin: '0 auto' }}>
            <div className="card-header"><div className="card-title">{isEdit ? 'Edit' : 'Create'} Page</div></div>
            <form onSubmit={handleSubmit}>
                <div className="form-group"><label>Title</label><input type="text" name="title" required value={form.title} onChange={handleChange} /></div>
                <div className="form-group"><label>Slug</label><input type="text" name="slug" required value={form.slug} onChange={handleChange} /></div>
                <div className="form-group"><label>Content (HTML)</label><textarea name="content" rows="15" value={form.content || ''} onChange={handleChange}></textarea></div>
                <div className="form-group"><label>Meta Title</label><input type="text" name="meta_title" value={form.meta_title || ''} onChange={handleChange} /></div>
                <div className="form-group"><label>Meta Description</label><textarea name="meta_description" rows="2" value={form.meta_description || ''} onChange={handleChange}></textarea></div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input type="checkbox" name="is_published" id="pg_pub" checked={form.is_published} onChange={handleChange} style={{ width: 'auto' }} />
                    <label htmlFor="pg_pub" style={{ margin: 0 }}>Published</label>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 30 }}>
                    <Link to="/admin/pages" className="btn btn-outline">Cancel</Link>
                    <button type="submit" className="btn" disabled={saving}>{saving ? 'Saving...' : 'Save Page'}</button>
                </div>
            </form>
        </div>
    );
}
