import React, { useEffect, useRef } from 'react';
import '../styles/fonts.style.css';
import '../styles/particlesProjects.style.css';

import * as THREE from "three";

import { initAllParticlesProjects, nextProject } from '../components/ParticlesProjects';

function ParticlesProjectsPage() {

    const canvasRef = useRef();
    const requestRef = useRef();

    let frameId;

    let scene, camera, renderer;

    useEffect(() => {

        // === THREE.JS CODE START ===
        scene = new THREE.Scene();
        scene.autoUpdate = true;
        scene.fog = null;

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio || 1);
        renderer.setSize(window.innerWidth, window.innerHeight);
        //renderer.shadowMap.enabled = false;
        renderer.setClearColor('#000000')
        
        canvasRef.current.appendChild(renderer.domElement);

        // var loader = new THREE.TextureLoader();
        // loader.load(Image, (texture) => {
            
        //     geometry = new THREE.BoxGeometry(1920/24, 1080/24, 1);
        //     material = new THREE.MeshBasicMaterial({ map: texture });
        //     cube = new THREE.Mesh(geometry, material);
        //     scene.add(cube)

        // }, undefined, (error) => {
        //     console.log(error)
        // });

        scene.add(initAllParticlesProjects(scene, camera));
        
        document.addEventListener('keyup', (event) => nextProject(event));

        // geometry = new THREE.BoxGeometry(1920/12, 1080/12, 1);
        // material = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(Image) });
        // cube = new THREE.Mesh(geometry, material);
        // scene.add(cube)

        camera.position.z = 300;

        // new ParticlesProjects(scene);



        // renderer.render(scene, camera);

        frameId = requestAnimationFrame(animate);

        // document.addEventListener('wheel', (event) => scrolling.changeProject(event));
        
        // requestRef.current = scrolling.animate();
        // return () => cancelAnimationFrame(requestRef.current);

        //return cancelAnimationFrame(frameId);
    }, []);

    const animate = () => {
        frameId = window.requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
  
    return ( <div id="canvas" ref={canvasRef}></div> )
  
}

export default ParticlesProjectsPage;