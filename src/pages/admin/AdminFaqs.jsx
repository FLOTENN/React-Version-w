import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getAllFaqs, getFaqById, createFaq, updateFaq, deleteFaq } from '../../services/api';

export function AdminFaqs() {
    const [items, setItems] = useState([]); const [loading, setLoading] = useState(true);
    useEffect(() => { getAllFaqs().then(d => { setItems(d || []); setLoading(false); }).catch(() => setLoading(false)); }, []);
    const handleDelete = async (id) => { if (!window.confirm('Delete this FAQ?')) return; try { await deleteFaq(id); setItems(p => p.filter(i => i.id !== id)); } catch { alert('Delete failed'); } };

    return (
        <div className="card">
            <div className="card-header"><div className="card-title">All FAQs</div><Link to="/admin/faqs/create" className="btn" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>+ Add FAQ</Link></div>
            <div style={{ overflowX: 'auto' }}>
                <table>
                    <thead><tr><th>ID</th><th>Question</th><th>Category</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                        {loading ? <tr><td colSpan="5" style={{ textAlign: 'center', padding: 30, color: 'var(--text-grey)' }}>Loading...</td></tr> :
                            items.length === 0 ? <tr><td colSpan="5" style={{ textAlign: 'center', padding: 30, color: 'var(--text-grey)' }}>No FAQs found.</td></tr> :
                                items.map(f => (
                                    <tr key={f.id}>
                                        <td>#{f.id}</td><td><strong>{f.question}</strong></td><td style={{ color: 'var(--text-grey)' }}>{f.category || 'General'}</td>
                                        <td><span className={`status-badge ${f.is_published ? 'status-success' : 'status-warning'}`}>{f.is_published ? 'Published' : 'Draft'}</span></td>
                                        <td>
                                            <Link to={`/admin/faqs/edit/${f.id}`} className="btn-outline" style={{ padding: '5px 10px', fontSize: '0.8rem', marginRight: 5 }}>Edit</Link>
                                            <button onClick={() => handleDelete(f.id)} className="btn-danger" style={{ padding: '5px 10px', fontSize: '0.8rem', cursor: 'pointer', border: 'none' }}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function AdminFaqForm() {
    const { id } = useParams(); const nav = useNavigate(); const isEdit = Boolean(id);
    const [form, setForm] = useState({ question: '', answer: '', category: '', sort_order: 0, is_published: true });
    const [saving, setSaving] = useState(false);
    useEffect(() => { if (isEdit) getFaqById(id).then(d => { if (d) setForm({ ...form, ...d }); }).catch(console.error); }, [id]);
    const handleChange = (e) => { const { name, value, type, checked } = e.target; setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value })); };
    const handleSubmit = async (e) => { e.preventDefault(); setSaving(true); try { isEdit ? await updateFaq(id, form) : await createFaq(form); nav('/admin/faqs'); } catch (err) { alert('Save failed'); } finally { setSaving(false); } };

    return (
        <div className="card" style={{ maxWidth: 800, margin: '0 auto' }}>
            <div className="card-header"><div className="card-title">{isEdit ? 'Edit' : 'Add'} FAQ</div></div>
            <form onSubmit={handleSubmit}>
                <div className="form-group"><label>Question</label><input type="text" name="question" required value={form.question} onChange={handleChange} /></div>
                <div className="form-group"><label>Answer</label><textarea name="answer" rows="6" required value={form.answer || ''} onChange={handleChange}></textarea></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div className="form-group"><label>Category</label><input type="text" name="category" value={form.category || ''} onChange={handleChange} placeholder="e.g. PPF, General" /></div>
                    <div className="form-group"><label>Sort Order</label><input type="number" name="sort_order" value={form.sort_order || 0} onChange={handleChange} /></div>
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input type="checkbox" name="is_published" id="fq_pub" checked={form.is_published} onChange={handleChange} style={{ width: 'auto' }} />
                    <label htmlFor="fq_pub" style={{ margin: 0 }}>Published</label>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 30 }}>
                    <Link to="/admin/faqs" className="btn btn-outline">Cancel</Link>
                    <button type="submit" className="btn" disabled={saving}>{saving ? 'Saving...' : 'Save FAQ'}</button>
                </div>
            </form>
        </div>
    );
}
