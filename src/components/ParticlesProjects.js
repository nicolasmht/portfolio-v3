import React, { useEffect, useRef, useLoader } from 'react'
import * as THREE from "three";

import Image from '../images/02.jpg';

// Import shaders
import frag from '../shaders/fragmentshader';
import vert from '../shaders/vertexshader';

import { Shader } from '../shaders/shader';

class ParticlesProjects{

    constructor(scene) {

        console.log()

        var originalWidthImg = 1920,
          originalHeightImg = 1080;
    
        if (originalWidthImg > originalHeightImg) {
          this.widthImg = originalWidthImg / originalWidthImg;
          this.heightImg = originalHeightImg / originalWidthImg;
        } else {
          this.widthImg = originalWidthImg / originalHeightImg;
          this.heightImg = originalHeightImg / originalHeightImg;
        }

        this.geometry = new THREE.BufferGeometry();

        let nbParticles = 450;
        let vertices = new Float32Array(nbParticles * nbParticles * 3, 3);

        let spaceBetweenParticle = nbParticles / (nbParticles * nbParticles);
    
        for (let y = 0, y3 = 0; y < 1; y += spaceBetweenParticle, y3 += nbParticles * 3) {
          for (let x = 0, x3 = y3; x < 1; x += spaceBetweenParticle, x3 += 3) {
            vertices[x3 + 0] = x;
            vertices[x3 + 1] = y;
            vertices[x3 + 2] = 0;
          }
        }

        this.geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

        console.log(Image)

        let uniforms = {
            u_time: {
              type: "f",
              value: 0,
            },
            u_particleSize: {
              type: "f",
              value: 1.0, // this.particlesSettings.particleSize
            },
            u_texture: {
              type: "t",
              value: new THREE.TextureLoader().load(Image),
            },
            u_alpha: {
              type: "f",
              value: 1.0, // this.particlesSettings.alpha.min
            },
            u_scaleImage: {
              type: "f",
              value: 500.0, // this.particlesSettings.scaleImage
            },
            u_ratioWidth: {
              type: "f",
              value: this.widthImg,
            },
            u_ratioHeight: {
              type: "f",
              value: this.heightImg,
            },
            u_valueImageColor: {
              type: "f",
              value: 0.0,
            },
            u_amplitude: {
              type: "f",
              value: 1.45, // this.particlesSettings.amplitude.max
            },
        };
      
        this.shaderMaterial = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: Shader.vertexShader,
            fragmentShader: Shader.fragmentShader,
            transparent: false,
        });

        let ps = new THREE.Points(this.geometry, this.shaderMaterial);   
        
        scene.add(ps);
    }

    loadTexture(img) {
        return new Promise(resolve => {
            new THREE.TextureLoader().load(img, resolve);
        });
    }
}

export default ParticlesProjects;