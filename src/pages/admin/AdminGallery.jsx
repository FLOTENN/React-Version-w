import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getAllGalleryImages, getGalleryImageById, createGalleryImage, updateGalleryImage, deleteGalleryImage } from '../../services/api';

export function AdminGallery() {
    const [items, setItems] = useState([]); const [loading, setLoading] = useState(true);
    useEffect(() => { getAllGalleryImages().then(d => { setItems(d || []); setLoading(false); }).catch(() => setLoading(false)); }, []);
    const handleDelete = async (id) => { if (!window.confirm('Delete?')) return; try { await deleteGalleryImage(id); setItems(p => p.filter(i => i.id !== id)); } catch { alert('Delete failed'); } };

    return (
        <div className="card">
            <div className="card-header"><div className="card-title">Gallery Images</div><Link to="/admin/gallery/create" className="btn" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>+ Add Image</Link></div>
            <div style={{ overflowX: 'auto' }}>
                <table>
                    <thead><tr><th>ID</th><th>Preview</th><th>Title</th><th>Category</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                        {loading ? <tr><td colSpan="6" style={{ textAlign: 'center', padding: 30, color: 'var(--text-grey)' }}>Loading...</td></tr> :
                            items.length === 0 ? <tr><td colSpan="6" style={{ textAlign: 'center', padding: 30, color: 'var(--text-grey)' }}>No images found.</td></tr> :
                                items.map(img => (
                                    <tr key={img.id}>
                                        <td>#{img.id}</td>
                                        <td>{img.image_path ? <img src={img.image_path} alt="" style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }} /> : <div style={{ width: 60, height: 40, background: '#333', borderRadius: 4 }} />}</td>
                                        <td><strong>{img.title}</strong></td>
                                        <td style={{ color: 'var(--text-grey)' }}>{img.category || '-'}</td>
                                        <td><span className={`status-badge ${img.is_published ? 'status-success' : 'status-warning'}`}>{img.is_published ? 'Visible' : 'Hidden'}</span></td>
                                        <td>
                                            <Link to={`/admin/gallery/edit/${img.id}`} className="btn-outline" style={{ padding: '5px 10px', fontSize: '0.8rem', marginRight: 5 }}>Edit</Link>
                                            <button onClick={() => handleDelete(img.id)} className="btn-danger" style={{ padding: '5px 10px', fontSize: '0.8rem', cursor: 'pointer', border: 'none' }}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function AdminGalleryForm() {
    const { id } = useParams(); const nav = useNavigate(); const isEdit = Boolean(id);
    const [form, setForm] = useState({ title: '', image_path: '', category: '', description: '', sort_order: 0, is_published: true });
    const [saving, setSaving] = useState(false);
    useEffect(() => { if (isEdit) getGalleryImageById(id).then(d => { if (d) setForm({ ...form, ...d }); }).catch(console.error); }, [id]);
    const handleChange = (e) => { const { name, value, type, checked } = e.target; setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value })); };
    const handleSubmit = async (e) => { e.preventDefault(); setSaving(true); try { isEdit ? await updateGalleryImage(id, form) : await createGalleryImage(form); nav('/admin/gallery'); } catch (err) { alert('Save failed'); } finally { setSaving(false); } };

    return (
        <div className="card" style={{ maxWidth: 800, margin: '0 auto' }}>
            <div className="card-header"><div className="card-title">{isEdit ? 'Edit' : 'Add'} Gallery Image</div></div>
            <form onSubmit={handleSubmit}>
                <div className="form-group"><label>Title</label><input type="text" name="title" required value={form.title} onChange={handleChange} /></div>
                <div className="form-group"><label>Image URL</label><input type="text" name="image_path" required placeholder="https://..." value={form.image_path || ''} onChange={handleChange} /></div>
                {form.image_path && <div style={{ marginBottom: 20 }}><img src={form.image_path} alt="Preview" style={{ maxWidth: 300, maxHeight: 200, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }} /></div>}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div className="form-group"><label>Category</label><input type="text" name="category" value={form.category || ''} onChange={handleChange} placeholder="e.g. PPF, Detailing" /></div>
                    <div className="form-group"><label>Sort Order</label><input type="number" name="sort_order" value={form.sort_order || 0} onChange={handleChange} /></div>
                </div>
                <div className="form-group"><label>Description</label><textarea name="description" rows="3" value={form.description || ''} onChange={handleChange}></textarea></div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input type="checkbox" name="is_published" id="gl_pub" checked={form.is_published} onChange={handleChange} style={{ width: 'auto' }} />
                    <label htmlFor="gl_pub" style={{ margin: 0 }}>Visible on Gallery</label>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 30 }}>
                    <Link to="/admin/gallery" className="btn btn-outline">Cancel</Link>
                    <button type="submit" className="btn" disabled={saving}>{saving ? 'Saving...' : 'Save Image'}</button>
                </div>
            </form>
        </div>
    );
}
