import React, { useEffect, useRef } from 'react';
import '../styles/fonts.style.css';
import '../styles/particlesProjects.style.css';

import * as THREE from "three";

import ParticlesProjects from '../components/ParticlesProjects';

import Image from '../images/02.jpg';

function ParticlesProjectsPage() {

    const canvasRef = useRef();
    const requestRef = useRef();

    useEffect(() => {

        // === THREE.JS CODE START ===
        var scene = new THREE.Scene();
            scene.autoUpdate = true;
            scene.fog = null;

        var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setPixelRatio(window.devicePixelRatio || 1);
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.shadowMap.enabled = false;
            renderer.setClearColor(0x000000, 1); // the default
        
        canvasRef.current.appendChild(renderer.domElement);
        
        // var geometry = new THREE.BoxGeometry(1, 1, 1);
        // var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
        // var cube = new THREE.Mesh(geometry, material);

        // scene.add(cube);
        // camera.position.z = 350;

        let geometry, material, cube;

        console.log(Image)

        new THREE.TextureLoader().load('/static/media/02.3ebc5802.jpg', (texture) => {
            
            // texture.needsUpdate = true;

            geometry = new THREE.BoxGeometry( 20, 20, 20 );
            material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            cube = new THREE.Mesh( geometry, material );

            scene.add(cube);
        }, () => {
            console.log('error')
        });

        camera.position.z = 50;

        // new ParticlesProjects(scene);

        renderer.render(scene, camera);

        // document.addEventListener('wheel', (event) => scrolling.changeProject(event));
        
        // requestRef.current = scrolling.animate();
        // return () => cancelAnimationFrame(requestRef.current);
    }, []);
  
    return ( <div id="canvas" ref={canvasRef}></div> )
  
}

export default ParticlesProjectsPage;