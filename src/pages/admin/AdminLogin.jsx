import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabaseClient';

export default function AdminLogin() {
    const { user, signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForgot, setShowForgot] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotMsg, setForgotMsg] = useState('');

    if (user) return <Navigate to="/admin/dashboard" replace />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { error: err } = await signIn(email, password);
            if (err) setError(err.message || 'Invalid credentials');
        } catch (err) {
            setError('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setForgotMsg('');
        setError('');
        setLoading(true);
        try {
            const { error: err } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
                redirectTo: `${window.location.origin}/admin/login`
            });
            if (err) throw err;
            setForgotMsg('Password reset link sent! Check your email.');
        } catch (err) {
            setError(err.message || 'Failed to send reset link.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet><title>Admin Login - Flotenn</title></Helmet>
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: '100vh', background: '#080808', fontFamily: 'var(--font-body)'
            }}>
                <div style={{
                    background: '#0e0e0e', padding: '50px 40px', borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center'
                }}>
                    <h1 style={{
                        fontFamily: 'var(--font-heading)', marginBottom: '30px', color: 'white',
                        fontSize: '2rem', textTransform: 'uppercase', letterSpacing: '-0.02em'
                    }}>
                        FLO<span style={{ color: 'var(--primary)' }}>TENN</span>
                    </h1>

                    {error && (
                        <div style={{
                            color: '#ff4444', marginBottom: '20px', fontSize: '0.9rem',
                            background: 'rgba(255,0,0,0.1)', padding: '10px', borderRadius: '4px'
                        }}>{error}</div>
                    )}
                    {forgotMsg && (
                        <div style={{
                            color: '#44ff44', marginBottom: '20px', fontSize: '0.9rem',
                            background: 'rgba(0,255,0,0.1)', padding: '10px', borderRadius: '4px'
                        }}>{forgotMsg}</div>
                    )}

                    {showForgot ? (
                        <form onSubmit={handleForgotPassword}>
                            <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '20px' }}>
                                Enter your email to receive a password reset link.
                            </p>
                            <input
                                type="email" placeholder="Email Address" required
                                value={forgotEmail} onChange={e => setForgotEmail(e.target.value)}
                                style={{
                                    width: '100%', padding: '14px', marginBottom: '20px',
                                    background: '#080808', border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '6px', boxSizing: 'border-box', color: 'white',
                                    fontFamily: 'var(--font-body)', fontSize: '0.95rem', outline: 'none'
                                }}
                            />
                            <button
                                type="submit" disabled={loading}
                                style={{
                                    width: '100%', padding: '14px', background: 'var(--primary)', color: 'white',
                                    border: '2px solid var(--primary)', borderRadius: '6px', cursor: 'pointer',
                                    fontSize: '0.95rem', fontFamily: 'var(--font-heading)', fontWeight: 700,
                                    textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'all 0.3s ease'
                                }}
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                            <button
                                type="button" onClick={() => { setShowForgot(false); setForgotMsg(''); setError(''); }}
                                style={{
                                    display: 'block', width: '100%', marginTop: '15px', color: '#a8a8a8',
                                    fontSize: '0.85rem', background: 'none', border: 'none', cursor: 'pointer'
                                }}
                            >← Back to Login</button>
                        </form>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <input
                                type="email" placeholder="Email Address" required
                                value={email} onChange={e => setEmail(e.target.value)}
                                style={{
                                    width: '100%', padding: '14px', marginBottom: '20px',
                                    background: '#080808', border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '6px', boxSizing: 'border-box', color: 'white',
                                    fontFamily: 'var(--font-body)', fontSize: '0.95rem', outline: 'none'
                                }}
                            />
                            <input
                                type="password" placeholder="Password" required
                                value={password} onChange={e => setPassword(e.target.value)}
                                style={{
                                    width: '100%', padding: '14px', marginBottom: '20px',
                                    background: '#080808', border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '6px', boxSizing: 'border-box', color: 'white',
                                    fontFamily: 'var(--font-body)', fontSize: '0.95rem', outline: 'none'
                                }}
                            />
                            <button
                                type="submit" disabled={loading}
                                style={{
                                    width: '100%', padding: '14px', background: 'var(--primary)', color: 'white',
                                    border: '2px solid var(--primary)', borderRadius: '6px', cursor: 'pointer',
                                    fontSize: '0.95rem', fontFamily: 'var(--font-heading)', fontWeight: 700,
                                    textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'all 0.3s ease'
                                }}
                            >
                                {loading ? 'Signing in...' : 'Login'}
                            </button>
                            <button
                                type="button" onClick={() => { setShowForgot(true); setError(''); }}
                                style={{
                                    display: 'block', width: '100%', marginTop: '15px', color: 'var(--primary)',
                                    fontSize: '0.85rem', background: 'none', border: 'none', cursor: 'pointer'
                                }}
                            >Forgot Password?</button>
                        </form>
                    )}
                    <Link to="/" style={{
                        display: 'block', marginTop: '20px', color: '#a8a8a8',
                        fontSize: '0.85rem', textDecoration: 'none'
                    }}>← Back to Website</Link>
                </div>
            </div>
        </>
    );
}
