import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function NotFound() {
    return (
        <>
            <Helmet>
                <title>404 - Page Not Found | Flotenn</title>
            </Helmet>

            <section style={{
                minHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--black)',
                position: 'relative',
                overflow: 'hidden',
                textAlign: 'center',
                padding: '40px 20px'
            }}>
                {/* Background glow */}
                <div style={{
                    position: 'absolute',
                    width: '600px', height: '600px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,0,0,0.1) 0%, transparent 70%)',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none'
                }}></div>

                <h1 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(8rem, 15vw, 15rem)',
                    fontWeight: 800,
                    color: 'transparent',
                    WebkitTextStroke: '2px rgba(255,255,255,0.1)',
                    lineHeight: 0.9,
                    margin: 0,
                    position: 'relative'
                }}>404</h1>

                <h2 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'white',
                    marginTop: '-20px',
                    marginBottom: '20px',
                    position: 'relative'
                }}>
                    PAGE NOT <span style={{ color: 'var(--primary)' }}>FOUND</span>
                </h2>

                <p style={{ color: '#888', maxWidth: '500px', marginBottom: '40px', position: 'relative' }}>
                    The page you're looking for doesn't exist or has been moved.
                </p>

                <Link to="/" className="btn-glow" style={{ position: 'relative' }}>
                    Back to Home
                </Link>
            </section>
        </>
    );
}
