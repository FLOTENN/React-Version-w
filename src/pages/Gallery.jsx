import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { getPublishedGalleryImages } from '../services/api';
import '../styles/pages.css';

const fallbackProjects = [
    { img: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800&q=80', title: 'Mercedes AMG GT', cat: 'Full Body PPF' },
    { img: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80', title: 'McLaren 720S', cat: 'Ceramic Coating' },
    { img: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80', title: 'Porsche 911 GT3', cat: 'Detailing' },
    { img: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80', title: 'Engine Bay Detail', cat: 'Restoration' },
    { img: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800&q=80', title: 'Tesla Model S', cat: 'Paint Correction' },
    { img: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80', title: 'Mercedes G-Wagon', cat: 'Matte PPF' },
    { img: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80', title: 'BMW M4 Competition', cat: 'Vinyl Wrap' },
    { img: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&q=80', title: 'Luxury Interior', cat: 'Deep Cleaning' },
    { img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80', title: 'Ferrari 488 Pista', cat: 'Ultimate Package' }
];

export default function Gallery() {
    const [projects, setProjects] = useState(fallbackProjects);
    const [lightbox, setLightbox] = useState({ active: false, index: 0 });

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getPublishedGalleryImages();
                if (data && data.length > 0) {
                    setProjects(data.map(img => ({
                        img: img.image_path,
                        title: img.title,
                        cat: img.category
                    })));
                }
            } catch (err) {
                console.error('Error loading gallery:', err);
            }
        };
        load();
    }, []);

    const openLightbox = (index) => {
        setLightbox({ active: true, index });
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setLightbox({ active: false, index: 0 });
        document.body.style.overflow = '';
    };

    const changeImage = useCallback((direction) => {
        setLightbox(prev => {
            let newIndex = prev.index + direction;
            if (newIndex < 0) newIndex = projects.length - 1;
            if (newIndex >= projects.length) newIndex = 0;
            return { ...prev, index: newIndex };
        });
    }, [projects.length]);

    useEffect(() => {
        const handleKey = (e) => {
            if (!lightbox.active) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') changeImage(-1);
            if (e.key === 'ArrowRight') changeImage(1);
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [lightbox.active, changeImage]);

    const currentProject = projects[lightbox.index] || {};

    return (
        <>
            <Helmet>
                <title>Gallery | Flotenn</title>
                <meta name="description" content="A curated showcase of our premium automotive work." />
            </Helmet>

            {/* Hero */}
            <section className="page-hero" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=1600&q=80')" }}>
                <div className="page-hero-overlay" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.95) 100%)' }}></div>
                <div className="page-hero-content">
                    <h1>OUR <span>WORK</span></h1>
                    <p style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}>A curated showcase of automotive perfection</p>
                </div>
            </section>

            {/* Gallery Grid */}
            <section className="gallery-section">
                <div className="container">
                    <div className="masonry-grid">
                        {projects.map((proj, index) => (
                            <div className="gallery-card" key={index} onClick={() => openLightbox(index)} style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="gallery-img-wrapper">
                                    <img src={proj.img} alt={proj.title} loading="lazy" />
                                </div>
                                <div className="gallery-card-overlay">
                                    <div className="project-info">
                                        <span className="project-category">{proj.cat}</span>
                                        <h3 className="project-title">{proj.title}</h3>
                                    </div>
                                </div>
                                <div className="zoom-indicator">
                                    <span>+</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Lightbox */}
            <div className={`lightbox${lightbox.active ? ' active' : ''}`} onClick={(e) => {
                if (e.target.classList.contains('lightbox') || e.target.classList.contains('lightbox-content-wrapper') || e.target.classList.contains('lightbox-backdrop')) {
                    closeLightbox();
                }
            }}>
                <div className="lightbox-backdrop"></div>
                <button className="lightbox-close" onClick={closeLightbox}>×</button>
                <div className="lightbox-content-wrapper">
                    <button className="nav-btn nav-prev" onClick={() => changeImage(-1)}>‹</button>
                    <img src={currentProject.img} alt={currentProject.title} className="lightbox-img" />
                    <button className="nav-btn nav-next" onClick={() => changeImage(1)}>›</button>
                </div>
                <div className="lightbox-caption">
                    <span className="lightbox-cat">{currentProject.cat}</span>
                    <h3 className="lightbox-title">{currentProject.title}</h3>
                </div>
            </div>
        </>
    );
}
