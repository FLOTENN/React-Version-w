import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getAllServices, getServiceById, createService, updateService, deleteService } from '../../services/api';
import { slugify } from '../../utils/helpers';

// ===== Services List =====
export function AdminServices() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getAllServices().then(data => { setItems(data || []); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this service?')) return;
        try { await deleteService(id); setItems(prev => prev.filter(i => i.id !== id)); } catch (err) { alert('Delete failed'); }
    };

    return (
        <div className="card">
            <div className="card-header">
                <div className="card-title">All Services</div>
                <Link to="/admin/services/create" className="btn" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>+ Add New Service</Link>
            </div>
            <div style={{ overflowX: 'auto' }}>
                <table>
                    <thead><tr><th>ID</th><th>Image</th><th>Name</th><th>Slug</th><th>Price From</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                        {loading ? <tr><td colSpan="7" style={{ textAlign: 'center', padding: 30, color: 'var(--text-grey)' }}>Loading...</td></tr> :
                            items.length === 0 ? <tr><td colSpan="7" style={{ textAlign: 'center', padding: 30, color: 'var(--text-grey)' }}>No services found.</td></tr> :
                                items.map(s => (
                                    <tr key={s.id}>
                                        <td>#{s.id}</td>
                                        <td>{s.image_url ? <img src={s.image_url} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} /> : <div style={{ width: 40, height: 40, background: '#333', borderRadius: 4 }} />}</td>
                                        <td><strong>{s.name}</strong></td>
                                        <td style={{ color: 'var(--text-grey)' }}>{s.slug}</td>
                                        <td>{s.price_from || '-'}</td>
                                        <td><span className={`status-badge ${s.is_published ? 'status-success' : 'status-warning'}`}>{s.is_published ? 'Published' : 'Draft'}</span></td>
                                        <td>
                                            <Link to={`/admin/services/edit/${s.id}`} className="btn-outline" style={{ padding: '5px 10px', fontSize: '0.8rem', marginRight: 5 }}>Edit</Link>
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

// ===== Services Form (Create / Edit) =====
export function AdminServiceForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);
    const [form, setForm] = useState({ name: '', slug: '', price_from: '', image_url: '', short_description: '', description: '', meta_title: '', meta_description: '', meta_keywords: '', is_published: true });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isEdit) {
            getServiceById(id).then(data => { if (data) setForm({ ...form, ...data }); }).catch(console.error);
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        if (name === 'name' && !isEdit) setForm(prev => ({ ...prev, slug: slugify(value) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (isEdit) await updateService(id, form);
            else await createService(form);
            navigate('/admin/services');
        } catch (err) { alert('Save failed: ' + err.message); }
        finally { setSaving(false); }
    };

    return (
        <div className="card" style={{ maxWidth: 800, margin: '0 auto' }}>
            <div className="card-header"><div className="card-title">{isEdit ? 'Edit' : 'Add New'} Service</div></div>
            <form onSubmit={handleSubmit}>
                <div className="form-group"><label>Service Name</label><input type="text" name="name" required placeholder="e.g. Ceramic Coating" value={form.name} onChange={handleChange} /></div>
                <div className="form-group"><label>Slug (URL)</label><input type="text" name="slug" required placeholder="e.g. ceramic-coating" value={form.slug} onChange={handleChange} /></div>
                <div className="form-group"><label>Price From (₹)</label><input type="number" name="price_from" step="0.01" placeholder="0.00" value={form.price_from || ''} onChange={handleChange} /></div>
                <div className="form-group"><label>Featured Image URL</label><input type="text" name="image_url" placeholder="https://..." value={form.image_url || ''} onChange={handleChange} /></div>
                <div className="form-group"><label>Short Description</label><textarea name="short_description" rows="3" placeholder="Brief summary..." value={form.short_description || ''} onChange={handleChange}></textarea></div>
                <div className="form-group"><label>Full Description</label><textarea name="description" rows="10" placeholder="Detailed description..." value={form.description || ''} onChange={handleChange}></textarea></div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '30px 0', paddingTop: 20 }}>
                    <h4 style={{ marginBottom: 20, color: 'var(--primary)' }}>SEO & Settings</h4>
                    <div className="form-group"><label>Meta Title</label><input type="text" name="meta_title" placeholder="SEO Title" value={form.meta_title || ''} onChange={handleChange} /></div>
                    <div className="form-group"><label>Meta Description</label><textarea name="meta_description" rows="2" placeholder="SEO Description" value={form.meta_description || ''} onChange={handleChange}></textarea></div>
                    <div className="form-group"><label>Meta Keywords</label><input type="text" name="meta_keywords" placeholder="Comma, separated" value={form.meta_keywords || ''} onChange={handleChange} /></div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <input type="checkbox" name="is_published" id="is_published" checked={form.is_published} onChange={handleChange} style={{ width: 'auto' }} />
                        <label htmlFor="is_published" style={{ margin: 0, cursor: 'pointer' }}>Publish Service</label>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 30 }}>
                    <Link to="/admin/services" className="btn btn-outline">Cancel</Link>
                    <button type="submit" className="btn" disabled={saving}>{saving ? 'Saving...' : 'Save Service'}</button>
                </div>
            </form>
        </div>
    );
}
