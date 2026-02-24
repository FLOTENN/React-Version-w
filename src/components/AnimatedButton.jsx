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
    iconClass = "fa-solid fa-arrow-right",
    disabled = false,
    ...rest
}) {
    const iconRef = useRef(null);
    const navigate = useNavigate();

    const handleAnimate = () => {
        if (!iconRef.current) return;

        // The user's exact GSAP animation timeline
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

        // Handle routing logic after animation starts
        if (to && !onClick) {
            e.preventDefault();
            // Short delay to let the icon blast off before navigating
            setTimeout(() => navigate(to), 300);
        } else if (href && !onClick) {
            if (rest.target === "_blank") {
                // Don't delay blank targets natively, just animate visually
            } else {
                e.preventDefault();
                setTimeout(() => window.location.href = href, 300);
            }
        }
    };

    const combinedClassName = `animated-premium-btn ${className}`.trim();

    // The custom layout: text left, icon right inside a circle
    const renderContent = () => (
        <>
            <span className="btn-text">{children}</span>
            <span className="btn-icon">
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
