import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getAllTestimonials, getTestimonialById, createTestimonial, updateTestimonial, deleteTestimonial } from '../../services/api';

export function AdminTestimonials() {
    const [items, setItems] = useState([]); const [loading, setLoading] = useState(true);
    useEffect(() => { getAllTestimonials().then(d => { setItems(d || []); setLoading(false); }).catch(() => setLoading(false)); }, []);
    const handleDelete = async (id) => { if (!window.confirm('Delete?')) return; try { await deleteTestimonial(id); setItems(p => p.filter(i => i.id !== id)); } catch { alert('Delete failed'); } };

    return (
        <div className="card">
            <div className="card-header"><div className="card-title">All Testimonials</div><Link to="/admin/testimonials/create" className="btn" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>+ Add Testimonial</Link></div>
            <div style={{ overflowX: 'auto' }}>
                <table>
                    <thead><tr><th>ID</th><th>Name</th><th>Vehicle</th><th>Rating</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                        {loading ? <tr><td colSpan="6" style={{ textAlign: 'center', padding: 30, color: 'var(--text-grey)' }}>Loading...</td></tr> :
                            items.length === 0 ? <tr><td colSpan="6" style={{ textAlign: 'center', padding: 30, color: 'var(--text-grey)' }}>No testimonials found.</td></tr> :
                                items.map(t => (
                                    <tr key={t.id}>
                                        <td>#{t.id}</td><td><strong>{t.name}</strong></td><td style={{ color: 'var(--text-grey)' }}>{t.vehicle_model || '-'}</td>
                                        <td style={{ color: 'var(--primary)' }}>{'★'.repeat(t.rating || 5)}</td>
                                        <td><span className={`status-badge ${t.is_published ? 'status-success' : 'status-warning'}`}>{t.is_published ? 'Published' : 'Hidden'}</span></td>
                                        <td>
                                            <Link to={`/admin/testimonials/edit/${t.id}`} className="btn-outline" style={{ padding: '5px 10px', fontSize: '0.8rem', marginRight: 5 }}>Edit</Link>
                                            <button onClick={() => handleDelete(t.id)} className="btn-danger" style={{ padding: '5px 10px', fontSize: '0.8rem', cursor: 'pointer', border: 'none' }}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function AdminTestimonialForm() {
    const { id } = useParams(); const nav = useNavigate(); const isEdit = Boolean(id);
    const [form, setForm] = useState({ name: '', vehicle_model: '', content: '', rating: 5, is_published: true });
    const [saving, setSaving] = useState(false);
    useEffect(() => { if (isEdit) getTestimonialById(id).then(d => { if (d) setForm({ ...form, ...d }); }).catch(console.error); }, [id]);
    const handleChange = (e) => { const { name, value, type, checked } = e.target; setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) || 0 : value })); };
    const handleSubmit = async (e) => { e.preventDefault(); setSaving(true); try { isEdit ? await updateTestimonial(id, form) : await createTestimonial(form); nav('/admin/testimonials'); } catch (err) { alert('Save failed'); } finally { setSaving(false); } };

    return (
        <div className="card" style={{ maxWidth: 800, margin: '0 auto' }}>
            <div className="card-header"><div className="card-title">{isEdit ? 'Edit' : 'Add'} Testimonial</div></div>
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div className="form-group"><label>Customer Name</label><input type="text" name="name" required value={form.name} onChange={handleChange} /></div>
                    <div className="form-group"><label>Vehicle Model</label><input type="text" name="vehicle_model" value={form.vehicle_model || ''} onChange={handleChange} /></div>
                </div>
                <div className="form-group"><label>Testimonial Content</label><textarea name="content" rows="5" required value={form.content || ''} onChange={handleChange}></textarea></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div className="form-group"><label>Rating (1-5)</label><input type="number" name="rating" min="1" max="5" value={form.rating} onChange={handleChange} /></div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 30 }}>
                        <input type="checkbox" name="is_published" id="tm_pub" checked={form.is_published} onChange={handleChange} style={{ width: 'auto' }} />
                        <label htmlFor="tm_pub" style={{ margin: 0 }}>Published</label>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 30 }}>
                    <Link to="/admin/testimonials" className="btn btn-outline">Cancel</Link>
                    <button type="submit" className="btn" disabled={saving}>{saving ? 'Saving...' : 'Save Testimonial'}</button>
                </div>
            </form>
        </div>
    );
}
