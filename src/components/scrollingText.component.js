import React, { useEffect, useRef } from 'react';
import '../styles/fonts.style.css';
import '../styles/canvas.style.css';

import ScrollingTextClass from '../class/ScrollingText';

function ScrollingText() {

    const canvasRef = useRef();
    const requestRef = useRef();
    
    let scrollingRef = 0;

    useEffect(() => {

        scrollingRef = new ScrollingTextClass(canvasRef.current);

        document.addEventListener('keyup', (event) => {
            scrollingRef.changeProject(event)
        });
        
        requestRef.current = scrollingRef.animate();
        return () => cancelAnimationFrame(requestRef.current);
    }, []);
  
    return <canvas id="canvas-scrollingText" ref={canvasRef}></canvas>
  
}

export default ScrollingText;