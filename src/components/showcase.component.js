import React, { useEffect, useRef } from 'react';
import * as THREE from "three";
import '../styles/fonts.style.css';
import '../styles/canvas.style.css';

import ShowcaseClass from '../class/Showcase';

function Showcase() {

    const containerRef = useRef();
    const requestRef = useRef();
    
    let showcaseClassRef = 0;

    useEffect(() => {
        
        /*canvasRef.current.appendChild(renderer.domElement);*/

        //scene.add(initAllParticlesProjects(scene, camera));
        
        // document.addEventListener('keyup', (event) => nextProject(event));

        /*camera.position.z = 300;*/

        // frameId = requestAnimationFrame(animate);
        
        showcaseClassRef = new ShowcaseClass(containerRef.current);

        requestRef.current = showcaseClassRef.animate();
        return () => cancelAnimationFrame(requestRef.current);
    }, []);
  
    return <div id="canvas-showcase" ref={containerRef}>
        <img className="myImg" href="https://placehold.it/300x300"/>
    </div>
  
}

export default Showcase;