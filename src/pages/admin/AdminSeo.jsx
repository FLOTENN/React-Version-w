import { useState, useEffect } from 'react';
import { getSettings, updateSetting } from '../../services/api';

export default function AdminSeo() {
    const [settings, setSettings] = useState({
        site_title: '', site_description: '', site_keywords: '',
        og_image: '', google_analytics_id: '', robots_txt: '',
    });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        getSettings().then(data => {
            if (data && typeof data === 'object') {
                setSettings(prev => ({ ...prev, ...data }));
            }
        }).catch(console.error);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
        setSaved(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); setSaving(true);
        try {
            const promises = Object.entries(settings).map(([key, value]) => updateSetting(key, value));
            await Promise.all(promises);
            setSaved(true);
        } catch { alert('Save failed'); }
        finally { setSaving(false); }
    };

    return (
        <div className="card" style={{ maxWidth: 800, margin: '0 auto' }}>
            <div className="card-header"><div className="card-title">SEO Settings</div></div>
            <form onSubmit={handleSubmit}>
                <div className="form-group"><label>Site Title</label><input type="text" name="site_title" value={settings.site_title || ''} onChange={handleChange} /></div>
                <div className="form-group"><label>Site Description</label><textarea name="site_description" rows="3" value={settings.site_description || ''} onChange={handleChange}></textarea></div>
                <div className="form-group"><label>Site Keywords</label><input type="text" name="site_keywords" value={settings.site_keywords || ''} onChange={handleChange} placeholder="Comma, separated" /></div>
                <div className="form-group"><label>OG Image URL</label><input type="text" name="og_image" value={settings.og_image || ''} onChange={handleChange} /></div>
                <div className="form-group"><label>Google Analytics ID</label><input type="text" name="google_analytics_id" value={settings.google_analytics_id || ''} onChange={handleChange} placeholder="G-XXXXXXXXXX" /></div>
                <div className="form-group"><label>Robots.txt Content</label><textarea name="robots_txt" rows="5" value={settings.robots_txt || ''} onChange={handleChange} style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}></textarea></div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 30 }}>
                    {saved && <span style={{ color: '#2ecc71', alignSelf: 'center', fontSize: '0.9rem' }}>✓ Saved successfully</span>}
                    <button type="submit" className="btn" disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</button>
                </div>
            </form>
        </div>
    );
}
