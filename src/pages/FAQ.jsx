import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getPublishedFaqs } from '../services/api';
import '../styles/pages.css';

export default function FAQ() {
    const [groupedFaqs, setGroupedFaqs] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(null);
    const contentRefs = useRef({});

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getPublishedFaqs();
                if (data && data.length > 0) {
                    const grouped = {};
                    data.forEach(faq => {
                        const cat = faq.category || 'General';
                        if (!grouped[cat]) grouped[cat] = [];
                        grouped[cat].push(faq);
                    });
                    setGroupedFaqs(grouped);
                }
            } catch (err) {
                console.error('Error loading FAQs:', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const toggleAccordion = (index) => {
        const newIndex = activeIndex === index ? null : index;
        setActiveIndex(newIndex);
    };

    let globalIndex = 0;

    return (
        <>
            <Helmet>
                <title>FAQ | Flotenn</title>
                <meta name="description" content="Frequently asked questions about our premium automotive services." />
            </Helmet>

            {/* Hero */}
            <section className="page-hero" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=1600&q=80')" }}>
                <div className="page-hero-overlay"></div>
                <div className="page-hero-content">
                    <h1>FREQUENTLY ASKED <span>QUESTIONS</span></h1>
                    <p className="hero-subtitle">EVERYTHING YOU NEED TO KNOW ABOUT OUR PREMIUM SERVICES</p>
                </div>
                <div className="scroll-indicator">
                    <span>SCROLL</span>
                    <div className="line-scroll"></div>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="faq-section">
                <div className="ambient-glow glow-top-left"></div>
                <div className="ambient-glow glow-bottom-right"></div>

                <div className="container" style={{ maxWidth: '1000px', width: '90%', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '60px', color: '#777' }}>Loading FAQs...</div>
                    ) : Object.keys(groupedFaqs).length === 0 ? (
                        <div className="empty-state">
                            <i className="fas fa-question-circle"></i>
                            <p>No FAQs available at the moment.</p>
                        </div>
                    ) : (
                        Object.entries(groupedFaqs).map(([category, items]) => (
                            <div className="faq-category-group" key={category}>
                                <div className="category-header">
                                    <span className="category-indicator"></span>
                                    <h2>{category}</h2>
                                </div>
                                <div className="accordion-wrapper">
                                    {items.map((faq) => {
                                        const idx = globalIndex++;
                                        const isActive = activeIndex === idx;
                                        return (
                                            <div className={`premium-accordion-item${isActive ? ' active' : ''}`} key={faq.id || idx}>
                                                <button className="premium-accordion-header" onClick={() => toggleAccordion(idx)}>
                                                    <span className="question-text">{faq.question}</span>
                                                    <div className="icon-wrapper">
                                                        <span className="icon-line line-horizontal"></span>
                                                        <span className="icon-line line-vertical"></span>
                                                    </div>
                                                </button>
                                                <div
                                                    className="premium-accordion-content"
                                                    ref={el => contentRefs.current[idx] = el}
                                                    style={{ maxHeight: isActive ? (contentRefs.current[idx]?.scrollHeight || 500) + 'px' : '0px' }}
                                                >
                                                    <div className="content-inner">
                                                        <p dangerouslySetInnerHTML={{ __html: faq.answer.replace(/\n/g, '<br/>') }}></p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    )}

                    {/* CTA */}
                    <div className="faq-cta">
                        <h3>Still have questions?</h3>
                        <p>Our experts are ready to help you with any specific queries.</p>
                        <Link to="/contact" className="btn-glow">Contact Us</Link>
                    </div>
                </div>
            </section>
        </>
    );
}
