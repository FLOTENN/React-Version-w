import { Helmet } from 'react-helmet-async';
import '../styles/pages.css';

const founders = [
    {
        name: 'PARIKSHIT HANS',
        title: 'FOUNDER & CEO',
        bio: '"Driving the strategic vision and innovation behind Flotenn\'s rapid growth."',
        img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80'
    },
    {
        name: 'ANIL HANS',
        title: 'CO-FOUNDER & MENTOR',
        bio: '"Bringing decades of business wisdom and guiding the core values of the company."',
        img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80'
    },
    {
        name: 'RAGHAV HANS',
        title: 'CO-FOUNDER & COO',
        bio: '"Ensuring operational excellence and delivering the highest quality service standards."',
        img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80'
    }
];

const ventures = [
    {
        num: '01', name: 'EVOLVE', category: 'PREMIUM DIY CAR CARE', color: '#00ff88',
        img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
        desc: 'Revolutionizing car care with premium DIY products. Evolve is designed for enthusiasts who demand professional-grade results in their own garage. From ceramic sprays to interior detailers, we empower you to maintain that showroom shine.'
    },
    {
        num: '02', name: 'CARLAY', category: 'PRECERTIFIED LUXURY CARS', color: '#00ccff', reversed: true,
        img: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80',
        desc: 'Your trusted partner for buying and selling pre-owned luxury vehicles. We bring transparency, trust, and quality to the used car market, ensuring every vehicle passes our rigorous 200-point inspection before it reaches you.'
    },
    {
        num: '03', name: 'BARRICADE', category: 'ULTIMATE PAINT PROTECTION', color: '#ff0055',
        img: 'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800&q=80',
        desc: 'The ultimate defense for your vehicle. Barricade offers professional-grade paint protection films (PPF) and ceramic coatings engineered to withstand the harshest elements, keeping your car\'s finish flawless for years.'
    }
];

export default function About() {
    return (
        <>
            <Helmet>
                <title>About Us | Flotenn</title>
                <meta name="description" content="Learn about Flotenn - our story, founders, and ventures in premium automotive care." />
            </Helmet>

            {/* Hero */}
            <section className="page-hero tall" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=80')" }}>
                <div className="page-hero-overlay" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.95) 100%)' }}></div>
                <div className="page-hero-content">
                    <h1>ABOUT <span>US</span></h1>
                    <p style={{ color: '#aaa', letterSpacing: '0.2em', marginTop: '10px' }}>EST. 2016 • PUNE, INDIA</p>
                </div>
            </section>

            {/* Story */}
            <section className="section-premium">
                <div className="container">
                    <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '40px' }}>DRIVEN BY <span className="text-primary">PASSION</span></h2>
                    <div className="story-text">
                        At Flotenn, we specialize in paint protection, correction, and detailing services, offering a comprehensive approach to car care. From restoring your vehicle's finish to providing long-lasting protection, our expert team ensures every car gets the attention it deserves. We also offer body shop services, including repairs, customs, and restorations.
                    </div>
                    <div className="story-text" style={{ fontStyle: 'italic', color: 'var(--white)', fontWeight: 500 }}>
                        "We don't just fix cars; we restore the emotion attached to them."
                    </div>
                </div>
            </section>

            {/* Founders */}
            <section className="section-premium bg-dark-grey">
                <div className="container">
                    <h2 className="section-title">THE <span className="text-primary">VISIONARIES</span></h2>
                    <p style={{ color: '#777', marginBottom: '20px' }}>The driving force behind Flotenn's excellence.</p>
                    <div className="founders-grid">
                        {founders.map((f, i) => (
                            <div className="founder-card" key={i}>
                                <div className="founder-img-wrapper">
                                    <img src={f.img} alt={f.name} className="founder-img" />
                                    <div className="founder-info">
                                        <h3 className="founder-name">{f.name}</h3>
                                        <p className="founder-title">{f.title}</p>
                                        <p className="founder-bio">{f.bio}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Ventures */}
            <section className="section-premium" style={{ paddingBottom: '120px' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '80px', position: 'relative' }}>
                        <h2 className="section-title" style={{ marginBottom: '15px' }}>OUR <span className="text-primary">VENTURES</span></h2>
                        <div style={{ width: '80px', height: '4px', background: 'var(--primary)', margin: '0 auto', borderRadius: '2px', boxShadow: '0 0 15px var(--primary)' }}></div>
                    </div>

                    <div className="ventures-stack">
                        {ventures.map((v, i) => (
                            <div className={`venture-card-premium${v.reversed ? ' reversed' : ''}`} style={{ '--accent-color': v.color }} key={i}>
                                <div className="venture-img-box">
                                    <img src={v.img} alt={v.name} loading="lazy" />
                                    <div className="venture-overlay"></div>
                                </div>
                                <div className="venture-content">
                                    <div className="venture-index-bg">{v.num}</div>
                                    <h3 className="venture-name">{v.name}</h3>
                                    <p className="venture-category">{v.category}</p>
                                    <p className="venture-description">{v.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
