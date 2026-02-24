import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getPublishedPosts } from '../services/api';
import { formatDate, truncate, stripHtml } from '../utils/helpers';
import '../styles/pages.css';

export default function Blog() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getPublishedPosts();
                setPosts(data || []);
            } catch (err) {
                console.error('Error loading posts:', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <>
            <Helmet>
                <title>Blog | Flotenn</title>
                <meta name="description" content="Insights, tips, and news from the world of automotive perfection." />
            </Helmet>

            {/* Hero */}
            <section className="page-hero" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=80')" }}>
                <div className="page-hero-overlay"></div>
                <div className="page-hero-content">
                    <h1>OUR <span>BLOG</span></h1>
                    <p>Insights, tips, and news from the world of automotive perfection.</p>
                </div>
            </section>

            {/* Articles */}
            <section style={{ padding: '80px 0 120px', background: '#050505' }}>
                <div className="container" style={{ maxWidth: '1400px', width: '92%', margin: '0 auto' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '60px', color: '#777' }}>Loading articles...</div>
                    ) : posts.length === 0 ? (
                        <div className="empty-state">
                            <i className="far fa-newspaper"></i>
                            <p>No articles published yet.</p>
                        </div>
                    ) : (
                        <div className="article-grid">
                            {posts.map(post => {
                                const excerpt = post.excerpt || stripHtml(post.content || '');
                                return (
                                    <Link to={`/blog/${post.slug}`} className="blog-card-premium" key={post.id}>
                                        <div className="card-img-wrapper">
                                            {post.featured_image ? (
                                                <img src={post.featured_image} alt={post.title} loading="lazy" />
                                            ) : (
                                                <div className="placeholder-image">
                                                    <i className="fas fa-pen-nib"></i>
                                                </div>
                                            )}
                                            <div className="card-overlay"></div>
                                        </div>
                                        <div className="date-badge">
                                            {formatDate(post.published_at)}
                                        </div>
                                        <div className="card-content">
                                            <h3 className="card-title">{post.title}</h3>
                                            <div className="card-reveal-content">
                                                <p className="card-excerpt">{truncate(excerpt, 80)}...</p>
                                                <div className="card-action">
                                                    <span className="action-text">Read Article</span>
                                                    <span className="action-icon">→</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
