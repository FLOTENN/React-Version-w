import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getAllHeroSlides, getHeroSlideById, createHeroSlide, updateHeroSlide, deleteHeroSlide } from '../../services/api';

export function AdminHero() {
    const [items, setItems] = useState([]); const [loading, setLoading] = useState(true);
    useEffect(() => { getAllHeroSlides().then(d => { setItems(d || []); setLoading(false); }).catch(() => setLoading(false)); }, []);
    const handleDelete = async (id) => { if (!window.confirm('Delete?')) return; try { await deleteHeroSlide(id); setItems(p => p.filter(i => i.id !== id)); } catch { alert('Delete failed'); } };

    return (
        <div className="card">
            <div className="card-header"><div className="card-title">Hero Slides</div><Link to="/admin/hero/create" className="btn" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>+ Add Slide</Link></div>
            <div style={{ overflowX: 'auto' }}>
                <table>
                    <thead><tr><th>ID</th><th>Preview</th><th>Title</th><th>Order</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                        {loading ? <tr><td colSpan="6" style={{ textAlign: 'center', padding: 30, color: 'var(--text-grey)' }}>Loading...</td></tr> :
                            items.length === 0 ? <tr><td colSpan="6" style={{ textAlign: 'center', padding: 30, color: 'var(--text-grey)' }}>No slides found.</td></tr> :
                                items.map(s => (
                                    <tr key={s.id}>
                                        <td>#{s.id}</td>
                                        <td>{s.image_url ? <img src={s.image_url} alt="" style={{ width: 80, height: 40, objectFit: 'cover', borderRadius: 4 }} /> : <div style={{ width: 80, height: 40, background: '#333', borderRadius: 4 }} />}</td>
                                        <td><strong>{s.title?.substring(0, 50) || 'Untitled'}</strong></td>
                                        <td>{s.sort_order || 0}</td>
                                        <td><span className={`status-badge ${s.is_active ? 'status-success' : 'status-warning'}`}>{s.is_active ? 'Active' : 'Hidden'}</span></td>
                                        <td>
                                            <Link to={`/admin/hero/edit/${s.id}`} className="btn-outline" style={{ padding: '5px 10px', fontSize: '0.8rem', marginRight: 5 }}>Edit</Link>
                                            <button onClick={() => handleDelete(s.id)} className="btn-danger" style={{ padding: '5px 10px', fontSize: '0.8rem', cursor: 'pointer', border: 'none' }}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function AdminHeroForm() {
    const { id } = useParams(); const nav = useNavigate(); const isEdit = Boolean(id);
    const [form, setForm] = useState({ title: '', subtitle: '', description: '', image_url: '', button_text: '', button_link: '', sort_order: 0, is_active: true });
    const [saving, setSaving] = useState(false);
    useEffect(() => { if (isEdit) getHeroSlideById(id).then(d => { if (d) setForm({ ...form, ...d }); }).catch(console.error); }, [id]);
    const handleChange = (e) => { const { name, value, type, checked } = e.target; setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value })); };
    const handleSubmit = async (e) => { e.preventDefault(); setSaving(true); try { isEdit ? await updateHeroSlide(id, form) : await createHeroSlide(form); nav('/admin/hero'); } catch (err) { alert('Save failed'); } finally { setSaving(false); } };

    return (
        <div className="card" style={{ maxWidth: 800, margin: '0 auto' }}>
            <div className="card-header"><div className="card-title">{isEdit ? 'Edit' : 'Add'} Hero Slide</div></div>
            <form onSubmit={handleSubmit}>
                <div className="form-group"><label>Subtitle</label><input type="text" name="subtitle" value={form.subtitle || ''} onChange={handleChange} placeholder="e.g. WELCOME TO FLOTENN" /></div>
                <div className="form-group"><label>Title (use *text* for red highlights, \n for line breaks)</label><textarea name="title" rows="4" required value={form.title} onChange={handleChange}></textarea></div>
                <div className="form-group"><label>Description</label><textarea name="description" rows="3" value={form.description || ''} onChange={handleChange}></textarea></div>
                <div className="form-group"><label>Background Image URL</label><input type="text" name="image_url" required placeholder="https://..." value={form.image_url || ''} onChange={handleChange} /></div>
                {form.image_url && <div style={{ marginBottom: 20 }}><img src={form.image_url} alt="Preview" style={{ maxWidth: 400, maxHeight: 200, objectFit: 'cover', borderRadius: 8 }} /></div>}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div className="form-group"><label>Button Text</label><input type="text" name="button_text" value={form.button_text || ''} onChange={handleChange} /></div>
                    <div className="form-group"><label>Button Link</label><input type="text" name="button_link" value={form.button_link || ''} onChange={handleChange} /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div className="form-group"><label>Sort Order</label><input type="number" name="sort_order" value={form.sort_order || 0} onChange={handleChange} /></div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 30 }}>
                        <input type="checkbox" name="is_active" id="hr_act" checked={form.is_active} onChange={handleChange} style={{ width: 'auto' }} />
                        <label htmlFor="hr_act" style={{ margin: 0 }}>Active</label>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 30 }}>
                    <Link to="/admin/hero" className="btn btn-outline">Cancel</Link>
                    <button type="submit" className="btn" disabled={saving}>{saving ? 'Saving...' : 'Save Slide'}</button>
                </div>
            </form>
        </div>
    );
}
