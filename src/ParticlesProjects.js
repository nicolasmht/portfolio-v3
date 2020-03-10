import React, { useEffect, useRef, useLoader } from 'react'
import * as THREE from "three";
import anime from "animejs";

import Projets from './projects';

import ImageToParticles from './class/ImageToParticles';

let scene, camera;

let allParticles = new THREE.Group();
let state = { currentProject: 0 };

let distanceBetweenProject = 200;

let geometry = ImageToParticles.createGeometry();
let material = ImageToParticles.createMaterial();

export const initAllParticlesProjects = (s, c) => {

	scene = s;
	camera = c;

	Projets.forEach((currentProject, index) => {
		
		// Create particle system
		let particle = new THREE.Points(geometry, material.clone());
		particle.material.uniforms.u_texture.value = new THREE.TextureLoader().load(currentProject.img);

		// Set position
		particle.position.z = index * distanceBetweenProject * -1;

		// Change visible for perf'
		particle.visible = (index == 0) ? true : false;
		particle.material.uniforms.u_alpha.value = (index == 0) ? 1.0 : 0.0;

		allParticles.add(particle);
	});

	return allParticles;
}

export const nextProject = (event) => {

	if (event.key != 'ArrowRight') { return; }

	let currentProject = allParticles.children[state.currentProject],
		previousProject = allParticles.children[state.currentProject - 1] || null,
		nextProject = allParticles.children[state.currentProject + 1] || null;

	if (nextProject == null) { return; }

	let timeline = anime.timeline();
	
	timeline
	.add(
		{
			targets: currentProject.material.uniforms.u_amplitude,
			value: currentProject.material.uniforms.u_amplitude.value + 10.0,
			easing: "easeInOutQuart",
			duration: 1000
		},
		0
	)
	.add(
		{
			targets: camera.position,
			z: camera.position.z - distanceBetweenProject,
			easing: "easeOutSine",
			duration: 1000,
			complete: () => {
				currentProject.visible = false;
			}
		},
		570
	)
	.add(
		{
			targets: nextProject.material.uniforms.u_alpha,
			value: [0.0, 1.0],
			easing: "linear",
			duration: 800
		},
		700
	);
	
	nextProject.visible = true;

	state.currentProject++;
}
