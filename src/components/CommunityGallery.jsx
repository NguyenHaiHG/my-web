import React, { useEffect, useRef, useState } from 'react';
import './CommunityGallery.css';

// images: array of image URLs
export default function CommunityGallery({ images = [], interval = 3000 }) {
    const [current, setCurrent] = useState(0);
    const timeoutRef = useRef();

    useEffect(() => {
        if (images.length < 2) return;
        timeoutRef.current = setTimeout(() => {
            setCurrent((c) => (c + 1) % images.length);
        }, interval);
        return () => clearTimeout(timeoutRef.current);
    }, [current, images, interval]);

    if (!images.length) return null;

    return (
        <div className="community-gallery">
            {images.map((img, i) => (
                <img
                    key={i}
                    src={img}
                    alt={`Ảnh cộng đồng ${i + 1}`}
                    className={`cg-img${i === current ? ' cg-img-active' : ''}`}
                    style={{ zIndex: i === current ? 2 : 1, opacity: i === current ? 1 : 0, transition: 'opacity 1s' }}
                />
            ))}
            <div className="cg-dots">
                {images.map((_, i) => (
                    <span key={i} className={`cg-dot${i === current ? ' cg-dot-active' : ''}`} />
                ))}
            </div>
        </div>
    );
}
