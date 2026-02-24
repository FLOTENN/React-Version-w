
import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getServices, getPublishedTestimonials, getActiveHeroSlides } from '../services/api';
import AnimatedButton from '../components/AnimatedButton';
import '../styles/home.css';

// Fallback data
const FALLBACK_SLIDES = [
    {
        image_url: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1600&q=80',
        subtitle: 'WELCOME TO FLOTENN',
        title: "PAINT PROTECTION.\nDETAILING.\nCUSTOM PAINT JOBS.\nALL UNDER *ONE ROOF.*",
        description: 'Trust Flotenn to bring back the beauty and shine your car deserves.',
    },
    {
        image_url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1600&q=80',
        subtitle: 'ULTIMATE PROTECTION',
        title: "PREMIUM\n*PAINT PROTECTION*\nFILM",
        description: "Shield your car's paint from scratches, chips, and UV damage with our industry-leading PPF solutions.",
    },
];

const FALLBACK_SERVICES = [
    { name: 'Paint Protection Film', slug: 'ppf', desc: 'Invisible shield against scratches and chips.', image_url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=80' },
    { name: 'Ceramic Coating', slug: 'ceramic-coating', desc: 'Long-lasting gloss and hydrophobic protection.', image_url: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=600&q=80' },
    { name: 'Car Detailing', slug: 'detailing', desc: 'Deep cleaning restoration for interior & exterior.', image_url: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&q=80' },
    { name: 'Custom Paint Jobs', slug: 'custom-paint', desc: 'Bespoke colors and finishes to match your style.', image_url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80' },
    { name: 'Car Wrapping', slug: 'wrapping', desc: 'Change your car\'s look with premium vinyl wraps.', image_url: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=600&q=80' },
];

// Parse title with *text* → <span class="text-primary">text</span>
function parseTitle(title) {
    if (!title) return [];
    const lines = title.split('\n');
    return lines.filter(l => l.trim()).map((line) => {
        const parts = [];
        const regex = /\*(.*?)\*/g;
        let lastIndex = 0;
        let match;
        while ((match = regex.exec(line)) !== null) {
            if (match.index > lastIndex) parts.push({ text: line.substring(lastIndex, match.index), primary: false });
            parts.push({ text: match[1], primary: true });
            lastIndex = match.index + match[0].length;
        }
        if (lastIndex < line.length) parts.push({ text: line.substring(lastIndex), primary: false });
        return parts;
    });
}

export default function Home() {
    const [slides, setSlides] = useState([]);
    const [services, setServices] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);

    const trackRef = useRef(null);
    const autoPlayRef = useRef(null);
    const testimonialTrackRef = useRef(null);
    const testimonialIndexRef = useRef(0);

    useEffect(() => {
        async function loadData() {
            try {
                const [slidesData, servicesData, testimonialsData] = await Promise.all([
                    getActiveHeroSlides().catch(() => null),
                    getServices().catch(() => null),
                    getPublishedTestimonials().catch(() => null),
                ]);
                setSlides(slidesData && slidesData.length > 0 ? slidesData : FALLBACK_SLIDES);
                setServices(servicesData && servicesData.length > 0 ? servicesData : FALLBACK_SERVICES);
                setTestimonials(testimonialsData && testimonialsData.length > 0 ? testimonialsData : []);
            } catch {
                setSlides(FALLBACK_SLIDES);
                setServices(FALLBACK_SERVICES);
                setTestimonials([]);
            }
        }
        loadData();
    }, []);

    // Hero Slider Logic
    const goToSlide = useCallback((index) => {
        setCurrentSlide(index);
    }, []);

    const nextSlide = useCallback(() => {
        setCurrentSlide(prev => (prev + 1) % (slides.length || 1));
    }, [slides.length]);

    const prevSlide = useCallback(() => {
        setCurrentSlide(prev => (prev - 1 + (slides.length || 1)) % (slides.length || 1));
    }, [slides.length]);

    // Auto-play hero slider
    useEffect(() => {
        if (slides.length === 0) return;
        autoPlayRef.current = setInterval(nextSlide, 5000);
        return () => clearInterval(autoPlayRef.current);
    }, [nextSlide, slides.length]);

    // Testimonial auto-scroll
    useEffect(() => {
        if (testimonials.length === 0) return;

        const getPerView = () => {
            if (window.innerWidth >= 1024) return 4;
            if (window.innerWidth >= 700) return 3;
            return 1;
        };

        const interval = setInterval(() => {
            if (window.innerWidth < 700) return;
            const track = testimonialTrackRef.current;
            if (!track) return;
            const slideEls = track.querySelectorAll('.testimonial-slide');
            if (!slideEls.length) return;

            const perView = getPerView();
            const maxIdx = slideEls.length - perView;
            testimonialIndexRef.current = testimonialIndexRef.current >= maxIdx ? 0 : testimonialIndexRef.current + 1;

            const gap = 30;
            const itemWidth = slideEls[0].offsetWidth;
            const moveAmount = (itemWidth + gap) * testimonialIndexRef.current;
            track.style.transform = `translateX(-${moveAmount}px)`;
        }, 3000);

        return () => clearInterval(interval);
    }, [testimonials]);

    // Duplicate testimonials for infinite scroll if few
    const displayTestimonials = testimonials.length > 0 && testimonials.length < 5
        ? [...testimonials, ...testimonials]
        : testimonials;

    return (
        <>
            <Helmet>
                <title>Flotenn — India&apos;s Leading Auto Detailing Studio</title>
                <meta name="description" content="Premium PPF, Ceramic Coating, Car Wrapping & Detailing services. Trust Flotenn for world-class vehicle protection." />
            </Helmet>

            {/* ====== HERO SLIDER ====== */}
            <section className="hero-slider-premium" id="heroSlider">
                <div className="slider-track" ref={trackRef} style={{ transform: `translateX(-${currentSlide * 100} %)` }}>
                    {slides.map((slide, i) => (
                        <div className={`slide - premium ${i === currentSlide ? 'active' : ''} `} key={i}>
                            <div className="slide-bg" style={{ backgroundImage: `url('${slide.image_url}')` }}></div>
                            <div className="slide-overlay-premium"></div>
                            <div className="container slide-content-premium">
                                {slide.subtitle && (
                                    <span className="slide-subtitle reveal-text">{slide.subtitle}</span>
                                )}
                                <h1>
                                    {parseTitle(slide.title).map((lineParts, li) => (
                                        <span className="line" key={li}>
                                            <span className="line-inner">
                                                {lineParts.map((part, pi) =>
                                                    part.primary
                                                        ? <span className="text-primary" key={pi}>{part.text}</span>
                                                        : <span key={pi}>{part.text}</span>
                                                )}
                                            </span>
                                        </span>
                                    ))}
                                </h1>
                                {slide.description && <p>{slide.description}</p>}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Dots */}
                <div className="slider-dots-premium" id="sliderDots">
                    {slides.map((_, i) => (
                        <button
                            className={`dot - premium ${i === currentSlide ? 'active' : ''} `}
                            key={i}
                            onClick={() => goToSlide(i)}
                        >
                            {String(i + 1).padStart(2, '0')}
                        </button>
                    ))}
                </div>

                {/* Arrow Controls */}
                <div className="slider-controls-premium">
                    <button className="slider-arrow-premium slider-prev" onClick={prevSlide}>
                        <i className="fas fa-chevron-left"></i>
                    </button>
                    <button className="slider-arrow-premium slider-next" onClick={nextSlide}>
                        <i className="fas fa-chevron-right"></i>
                    </button>
                </div>
            </section>

            {/* ====== TRUST SECTION ====== */}
            <section className="trust-section">
                <div className="container">
                    <div className="trust-wrapper">
                        <h4 className="trust-subtitle">
                            AT <span className="text-primary">FLOTENN</span>, WE DON&apos;T JUST FIX CARS &mdash;
                        </h4>
                        <h2 className="trust-title">
                            WE BUILD <span className="text-primary">TRUST</span>
                        </h2>
                        <div className="trust-divider"></div>
                        <h3 className="trust-heading">WHAT WE DO</h3>
                        <div className="trust-content-box">
                            <p>
                                At <span style={{ color: 'white', fontWeight: 600 }}>Flotenn</span>, we simply don&apos;t just &ldquo;detail&rdquo; cars. We restore emotions.
                                We provide expert paint correction, paint protection, and detailing services to enhance your car&apos;s appearance and protect its finish.
                                Our body shop handles repairs for dents and scratches, while customization options like custom colors and body kits add a personalized touch.
                                Experience holistic vehicle care with precision and attention to detail.
                            </p>
                            <div style={{ marginTop: '40px' }}>
                                <AnimatedButton to="/about" className="btn-glow" iconClass="fa-solid fa-arrow-right">DISCOVER MORE</AnimatedButton>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ====== PREMIUM SERVICES ====== */}
            <section className="services-section">
                <div className="container">
                    <h2 className="section-title">
                        CHOOSE FROM A RANGE OF <span className="text-primary">PREMIUM SERVICES</span>
                    </h2>
                    <div className="service-grid-premium">
                        {services.map((service, i) => {
                            const name = service.name || service.title || 'Service';
                            const slug = service.slug || '';
                            const desc = service.desc || service.short_description || 'Premium quality service for your vehicle.';
                            const imgUrl = service.image_url || FALLBACK_SERVICES[i % FALLBACK_SERVICES.length].image_url;

                            return (
                                <Link to={`/ service / ${slug} `} className="service-card-premium" key={i}>
                                    <div className="service-img-wrapper">
                                        <img src={imgUrl} alt={name} loading="lazy" />
                                    </div>
                                    <div className="service-content-premium">
                                        <div className="service-icon-premium">
                                            <i className="fas fa-arrow-right"></i>
                                        </div>
                                        <h3>{name}</h3>
                                        <p>{desc}</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ====== TESTIMONIALS ====== */}
            {displayTestimonials.length > 0 && (
                <section style={{ padding: '100px 0', background: '#0b0b0b', position: 'relative', overflow: 'hidden' }}>
                    <div className="container">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '50px' }}>
                            <div>
                                <h2 className="section-title" style={{ marginBottom: '10px' }}>
                                    WHAT OUR <span className="text-primary">CUSTOMERS SAY</span>
                                </h2>
                                <p style={{ color: 'var(--text-grey)' }}>Real feedback from our valued clients.</p>
                            </div>
                            <div className="hide-mobile">
                                <AnimatedButton href="https://g.page/r/CbGjCj_xXlVxEBM/review" target="_blank" rel="noreferrer" className="btn-glow" iconClass="fa-solid fa-star">
                                    Leave a Feedback
                                </AnimatedButton>
                            </div>
                        </div>

                        <div className="testimonial-slider-container" style={{ position: 'relative' }}>
                            <div className="testimonial-track" ref={testimonialTrackRef}>
                                {displayTestimonials.map((t, i) => (
                                    <div className="testimonial-slide" key={i}>
                                        <div className="testimonial-card">
                                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '25px' }}>
                                                <div style={{
                                                    width: '50px', height: '50px',
                                                    background: 'linear-gradient(135deg, #333, #1a1a1a)',
                                                    border: '1px solid var(--primary)',
                                                    borderRadius: '50%',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontWeight: 'bold', marginRight: '15px', color: 'var(--primary)',
                                                    fontSize: '1.2rem', boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
                                                }}>
                                                    {(t.name || 'A').charAt(0)}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 700, color: 'white', fontFamily: 'var(--font-heading)', fontSize: '1.1rem', letterSpacing: '0.02em' }}>
                                                        {t.name}
                                                    </div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-grey)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                        {t.vehicle_model || ''}
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ color: 'var(--primary)', fontSize: '1rem', marginBottom: '20px', letterSpacing: '2px' }}>
                                                {'★'.repeat(t.rating || 5)}
                                            </div>

                                            <p style={{ color: '#ddd', lineHeight: 1.7, fontSize: '1rem', fontWeight: 300 }}>
                                                &ldquo;{t.content}&rdquo;
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="show-mobile" style={{ textAlign: 'center', marginTop: '40px', display: 'none' }}>
                            <AnimatedButton href="https://g.page/r/CbGjCj_xXlVxEBM/review" target="_blank" rel="noreferrer" className="btn-glow" style={{ width: '100%' }} iconClass="fa-solid fa-star">
                                Leave a Feedback
                            </AnimatedButton>
                        </div>
                    </div>
                </section>
            )}

            {/* ====== STATS & SOCIAL ====== */}
            <section className="stats-social-section">
                <div className="glow-accent top-left"></div>
                <div className="glow-accent bottom-right"></div>

                <div className="container">
                    <div className="stats-grid-premium">
                        <div className="stat-card-premium">
                            <div className="stat-icon"><i className="fas fa-users"></i></div>
                            <div className="stat-number">10,000+</div>
                            <p>Happy Customers</p>
                        </div>
                        <div className="stat-card-premium">
                            <div className="stat-icon"><i className="fas fa-clock"></i></div>
                            <div className="stat-number">30,000+</div>
                            <p>Hours of Work</p>
                        </div>
                        <div className="stat-card-premium">
                            <div className="stat-icon"><i className="fas fa-car-side"></i></div>
                            <div className="stat-number">4,000+</div>
                            <p>Projects Handled</p>
                        </div>
                        <div className="stat-card-premium">
                            <div className="stat-icon"><i className="fas fa-trophy"></i></div>
                            <div className="stat-number">8+</div>
                            <p>Years of Experience</p>
                        </div>
                    </div>

                    <div className="section-separator"></div>

                    <div className="social-connect">
                        <h3 className="section-title" style={{ fontSize: '1.8rem', marginBottom: '40px' }}>
                            JOIN THE <span className="text-primary">FLOTENN</span> COMMUNITY
                        </h3>
                        <div className="social-icons-premium">
                            <a href="https://www.youtube.com/@brotomotiv" target="_blank" rel="noopener noreferrer" className="social-btn youtube">
                                <div className="icon-box"><i className="fab fa-youtube"></i></div>
                                <span>YouTube</span>
                            </a>
                            <a href="https://www.instagram.com/brotomotiv/" target="_blank" rel="noopener noreferrer" className="social-btn instagram">
                                <div className="icon-box"><i className="fab fa-instagram"></i></div>
                                <span>Instagram</span>
                            </a>
                            <a href="https://www.facebook.com/brotomotiv/" target="_blank" rel="noopener noreferrer" className="social-btn facebook">
                                <div className="icon-box"><i className="fab fa-facebook-f"></i></div>
                                <span>Facebook</span>
                            </a>
                            <a href="https://x.com/brotomotiv" target="_blank" rel="noopener noreferrer" className="social-btn x">
                                <div className="icon-box"><i className="fab fa-x-twitter"></i></div>
                                <span>X.com</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
