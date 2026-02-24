import { useEffect, useState } from 'react';

const ScrollIndicator = () => {
    const [scrollPercentage, setScrollPercentage] = useState(0);

    const handleScroll = () => {
        const scrolled = document.documentElement.scrollTop;
        const maxOffset = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const percentage = (scrolled / maxOffset) * 100;
        setScrollPercentage(percentage);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        // Initial call to set correct initial state
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="scroll-indicator-container">
            <div
                className="scroll-indicator-bar"
                style={{ height: `${scrollPercentage}%` }}
            ></div>
        </div>
    );
};

export default ScrollIndicator;
