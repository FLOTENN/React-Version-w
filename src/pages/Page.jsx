import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getPageBySlug } from '../services/api';
import '../styles/pages.css';

export default function Page() {
    const { slug } = useParams();
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getPageBySlug(slug);
                setPage(data);
            } catch (err) {
                console.error('Error loading page:', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [slug]);

    if (loading) {
        return <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#777' }}>Loading...</div>;
    }

    if (!page) {
        return (
            <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#777' }}>
                <h2>Page Not Found</h2>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{page.title} | Flotenn</title>
                <meta name="description" content={page.meta_description || page.title} />
            </Helmet>

            <section className="page-hero" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1600&q=80')", height: '40vh', minHeight: '300px' }}>
                <div className="page-hero-overlay"></div>
                <div className="page-hero-content">
                    <h1>{page.title}</h1>
                </div>
            </section>

            <section style={{ padding: '80px 0', background: 'var(--black)' }}>
                <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <div style={{ color: '#ccc', lineHeight: 1.8, fontSize: '1.05rem' }} dangerouslySetInnerHTML={{ __html: page.content }}></div>
                </div>
            </section>
        </>
    );
}
