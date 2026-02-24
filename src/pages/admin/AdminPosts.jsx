import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getAllPosts, getPostById, createPost, updatePost, deletePost } from '../../services/api';
import { slugify, formatDate } from '../../utils/helpers';

export function AdminPosts() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { getAllPosts().then(d => { setItems(d || []); setLoading(false); }).catch(() => setLoading(false)); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this post?')) return;
        try { await deletePost(id); setItems(p => p.filter(i => i.id !== id)); } catch { alert('Delete failed'); }
    };

    return (
        <div className="card">
            <div className="card-header">
                <div className="card-title">All Blog Posts</div>
                <Link to="/admin/posts/create" className="btn" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>+ Add New Post</Link>
            </div>
            <div style={{ overflowX: 'auto' }}>
                <table>
                    <thead><tr><th>ID</th><th>Title</th><th>Slug</th><th>Published</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                        {loading ? <tr><td colSpan="6" style={{ textAlign: 'center', padding: 30, color: 'var(--text-grey)' }}>Loading...</td></tr> :
                            items.length === 0 ? <tr><td colSpan="6" style={{ textAlign: 'center', padding: 30, color: 'var(--text-grey)' }}>No posts found.</td></tr> :
                                items.map(p => (
                                    <tr key={p.id}>
                                        <td>#{p.id}</td>
                                        <td><strong>{p.title}</strong></td>
                                        <td style={{ color: 'var(--text-grey)' }}>{p.slug}</td>
                                        <td style={{ fontSize: '0.85rem', color: 'var(--text-grey)' }}>{formatDate(p.published_at)}</td>
                                        <td><span className={`status-badge ${p.status === 'published' ? 'status-success' : 'status-warning'}`}>{p.status || 'draft'}</span></td>
                                        <td>
                                            <Link to={`/admin/posts/edit/${p.id}`} className="btn-outline" style={{ padding: '5px 10px', fontSize: '0.8rem', marginRight: 5 }}>Edit</Link>
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

export function AdminPostForm() {
    const { id } = useParams();
    const nav = useNavigate();
    const isEdit = Boolean(id);
    const [form, setForm] = useState({ title: '', slug: '', excerpt: '', content: '', featured_image: '', author: '', status: 'draft', published_at: '', meta_title: '', meta_description: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => { if (isEdit) getPostById(id).then(d => { if (d) setForm({ ...form, ...d }); }).catch(console.error); }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(p => ({ ...p, [name]: value }));
        if (name === 'title' && !isEdit) setForm(p => ({ ...p, slug: slugify(value) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); setSaving(true);
        try { isEdit ? await updatePost(id, form) : await createPost(form); nav('/admin/posts'); }
        catch (err) { alert('Save failed: ' + err.message); }
        finally { setSaving(false); }
    };

    return (
        <div className="card" style={{ maxWidth: 800, margin: '0 auto' }}>
            <div className="card-header"><div className="card-title">{isEdit ? 'Edit' : 'Create'} Blog Post</div></div>
            <form onSubmit={handleSubmit}>
                <div className="form-group"><label>Title</label><input type="text" name="title" required value={form.title} onChange={handleChange} /></div>
                <div className="form-group"><label>Slug</label><input type="text" name="slug" required value={form.slug} onChange={handleChange} /></div>
                <div className="form-group"><label>Author</label><input type="text" name="author" value={form.author || ''} onChange={handleChange} /></div>
                <div className="form-group"><label>Featured Image URL</label><input type="text" name="featured_image" value={form.featured_image || ''} onChange={handleChange} /></div>
                <div className="form-group"><label>Excerpt</label><textarea name="excerpt" rows="3" value={form.excerpt || ''} onChange={handleChange}></textarea></div>
                <div className="form-group"><label>Content (HTML)</label><textarea name="content" rows="12" value={form.content || ''} onChange={handleChange}></textarea></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div className="form-group"><label>Status</label><select name="status" value={form.status} onChange={handleChange}><option value="draft">Draft</option><option value="published">Published</option></select></div>
                    <div className="form-group"><label>Publish Date</label><input type="datetime-local" name="published_at" value={form.published_at ? form.published_at.slice(0, 16) : ''} onChange={handleChange} /></div>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '30px 0', paddingTop: 20 }}>
                    <h4 style={{ marginBottom: 20, color: 'var(--primary)' }}>SEO</h4>
                    <div className="form-group"><label>Meta Title</label><input type="text" name="meta_title" value={form.meta_title || ''} onChange={handleChange} /></div>
                    <div className="form-group"><label>Meta Description</label><textarea name="meta_description" rows="2" value={form.meta_description || ''} onChange={handleChange}></textarea></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 30 }}>
                    <Link to="/admin/posts" className="btn btn-outline">Cancel</Link>
                    <button type="submit" className="btn" disabled={saving}>{saving ? 'Saving...' : 'Save Post'}</button>
                </div>
            </form>
        </div>
    );
}
