import React, { useEffect, useRef } from 'react';
import '../styles/home.style.css';

import ScrollingText from './ScrollingText';

function Home() {

    const canvasRef = useRef();
    const requestRef = useRef();
    
    let scrolling = 0;

    useEffect(() => {

        scrolling = new ScrollingText(canvasRef.current);

        document.addEventListener('wheel', (event) => scrolling.start(event));
        
        requestRef.current = scrolling.animate();
        return () => cancelAnimationFrame(requestRef.current);
    }, []);
  
    return( <canvas id="canvas" ref={canvasRef}></canvas> )
  
}

export default Home;