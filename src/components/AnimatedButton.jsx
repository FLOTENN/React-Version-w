import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';

export default function AnimatedButton({
    children,
    to,
    href,
    onClick,
    type,
    className = "",
    iconClass = "fa-solid fa-paper-plane",
    disabled = false,
    ...rest
}) {
    const iconRef = useRef(null);
    const navigate = useNavigate();

    const handleAnimate = () => {
        if (!iconRef.current) return;

        const tl = gsap.timeline();

        tl.to(iconRef.current, {
            x: -12,
            y: 12,
            scale: 0.8,
            duration: 0.2,
            ease: "power2.out"
        })
            .to(iconRef.current, {
                x: 150,
                y: -150,
                opacity: 0,
                duration: 0.4,
                ease: "power3.in"
            })
            .set(iconRef.current, {
                x: -100,
                y: 100,
                opacity: 0
            })
            .to(iconRef.current, {
                x: 0,
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.5,
                ease: "back.out(1.5)"
            });
    };

    const handleClick = (e) => {
        handleAnimate();

        if (onClick) {
            onClick(e);
        }

        if (to && !onClick) {
            e.preventDefault();
            setTimeout(() => navigate(to), 400); // Let animation play out partially before navigating
        } else if (href && !onClick) {
            e.preventDefault();
            setTimeout(() => window.location.href = href, 400);
        }
    };

    const combinedClassName = `btn-animated ${className}`.trim();

    // If we receive "submitting" text, we can swap out the icon, or just use paper plane
    const renderContent = () => (
        <>
            <span className="btn-animated-text">{children}</span>
            <span className="btn-animated-icon">
                <i className={iconClass} ref={iconRef}></i>
            </span>
        </>
    );

    if (to) {
        return (
            <Link to={to} className={combinedClassName} onClick={handleClick} {...rest}>
                {renderContent()}
            </Link>
        );
    }

    if (href) {
        return (
            <a href={href} className={combinedClassName} onClick={handleClick} {...rest}>
                {renderContent()}
            </a>
        );
    }

    return (
        <button type={type || "button"} className={combinedClassName} onClick={handleClick} disabled={disabled} {...rest}>
            {renderContent()}
        </button>
    );
}
