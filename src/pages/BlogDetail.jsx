import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getPostBySlug } from '../services/api';
import { formatDate } from '../utils/helpers';
import '../styles/pages.css';
import AnimatedButton from '../components/AnimatedButton';

export default function BlogDetail() {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getPostBySlug(slug);
                setPost(data);
            } catch (err) {
                console.error('Error loading blog post:', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [slug]);

    if (loading) {
        return <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#777' }}>Loading...</div>;
    }

    if (!post) {
        return (
            <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#777', gap: '20px' }}>
                <h2>Article Not Found</h2>
                <AnimatedButton to="/blog" iconClass="fa-solid fa-arrow-left">Back to Blog</AnimatedButton>
            </div>
        );
    }

    const heroImg = post.featured_image || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=80';

    return (
        <>
            <Helmet>
                <title>{post.title} | Flotenn Blog</title>
                <meta name="description" content={post.excerpt || `Read ${post.title} on the Flotenn blog.`} />
            </Helmet>

            {/* Hero */}
            <section className="blog-detail-hero" style={{ backgroundImage: `url('${heroImg}')` }}>
                <div className="page-hero-overlay"></div>
                <div className="page-hero-content">
                    <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>{post.title}</h1>
                </div>
            </section>

            {/* Content */}
            <section className="blog-detail-content">
                <div className="container">
                    <div className="blog-meta">
                        <span><i className="far fa-calendar-alt"></i> {formatDate(post.published_at)}</span>
                        {post.author && <span><i className="far fa-user"></i> {post.author}</span>}
                    </div>
                    <div className="blog-body" dangerouslySetInnerHTML={{ __html: post.content }}></div>

                    {/* Back to Blog */}
                    <div style={{ textAlign: 'center', marginTop: '60px' }}>
                        <Link to="/blog" style={{ color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.9rem' }}>
                            ← Back to Blog
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
