import React from 'react';
import './PixelMap.css';

const PixelMap: React.FC = () => {
    return (
        <div className="pixel-map-container">
            <iframe
                src="/pixel-map.html"
                title="World Map"
                className="pixel-map-iframe"
                frameBorder="0"
            />
        </div>
    );
};

export default PixelMap;
