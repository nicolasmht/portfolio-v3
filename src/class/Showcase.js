import * as THREE from "three";
import anime from "animejs";

import TouchTexture from './TouchTexture';
import ImageToParticles from '../class/ImageToParticles';

import ProjetsJson from '../projects';

class Showcase{
    
    constructor(container) {

        this.container = container;

        this.clock = new THREE.Clock();

        this.imageToParticlesClass = new ImageToParticles();

        this.geometryPoints = this.imageToParticlesClass.createGeometryPoints();
        this.materialPoints = this.imageToParticlesClass.createMaterialPoints();

        this.geometryPlane = this.imageToParticlesClass.createGeometryPlane();
        this.materialPlane = this.imageToParticlesClass.createMaterialPlane();

        this.particlesGroup = new THREE.Group();
        this.state = { currentProject: 0, enabledParallax: true, openProject: false };

        this.distanceBetweenProject = 350;

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.tt = new TouchTexture();

        this.buildScene();
        this.initProjectsParticles();

        this.eventListener();

        this.parallaxID = anime.timeline();
    }

    eventListener() {
        document.addEventListener('keyup', (event) => this.manageProjects(event));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('click', event => this.openProject(event));
    }

    buildScene() {
        this.scene = new THREE.Scene();
        this.scene.autoUpdate = true;
        this.scene.fog = null;

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        this.camera.position.z = this.distanceBetweenProject;

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio || 1);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = false;
        this.renderer.setClearColor('#fff', 0);

        this.container.appendChild( this.renderer.domElement );
    }

    initProjectsParticles() {

        // Create plane for interaction
        var geometryPlane = new THREE.PlaneBufferGeometry(this.imageToParticlesClass.ratioWidthImg * 600, this.imageToParticlesClass.ratioHeightImg * 600, 125, 125);
        var materialShaderPlane = new THREE.ShaderMaterial({
            uniforms: {
                uMap: { type: 't', value: this.tt.texture }
            },
            vertexShader: this.tt.vertexShader(),
            fragmentShader: this.tt.fragmentShader(),
            transparent: true,
            opacity: 0
        });

        this.planeTouch = new THREE.Mesh(geometryPlane, materialShaderPlane);
        this.planeTouch.name = 'Plane';

        this.scene.add(this.planeTouch);

        ProjetsJson.forEach((currentProject, index) => {
		
            // Create particle system
            let particle = new THREE.Points(this.geometryPoints, this.materialPoints.clone());
            particle.material.uniforms.u_texture.value = new THREE.TextureLoader().load(currentProject.img);
            particle.material.uniforms.u_touch.value = this.tt.texture;
    
            // Set position
            // particle.position.z = index * this.distanceBetweenProject * -1;
    
            // Change visible for perf'
            particle.material.uniforms.u_alpha.value = (index == 0) ? 1.0 : 0.0;

            // let plane = this.imageToParticlesClass.createPlane(currentProject.img);

            let plane = new THREE.Mesh(this.geometryPlane, this.materialPlane.clone());
            plane.position.set(0, 0, -5)
            plane.material.map = new THREE.TextureLoader().load(currentProject.img);
            plane.material.needsUpdate = true;
            plane.visible = false;

            let object = new THREE.Group();
            object.position.z = index * this.distanceBetweenProject * -1;
            object.visible = (index == 0) ? true : false;
            object.add(particle, plane);

            this.particlesGroup.add(object);
        });

        this.scene.add(this.particlesGroup);
    }

    manageProjects(event) {
        
        switch(event.key) {
            case 'ArrowRight':
                this.nextProject();
            break;
            case 'ArrowLeft':
                this.previousProject();
            break;
        }
        
    }

    async nextProject() {

        let currentProjectGroup = this.particlesGroup.children[this.state.currentProject],
            currentProjectPoints = this.particlesGroup.children[this.state.currentProject].children[0],
            currentProjectPlane = this.particlesGroup.children[this.state.currentProject].children[1],
            nextProjectGroup = this.particlesGroup.children[this.state.currentProject + 1] || null,
            nextProjectPoints = this.particlesGroup.children[this.state.currentProject + 1].children[0] || null;

        if (nextProjectGroup == null || this.state.openProject) { return; }
        
        // await this.resetParallax();

        let timeline = anime.timeline();

        timeline
        .add(
            {
                targets: currentProjectPoints.material.uniforms.u_amplitude,
                value: currentProjectPoints.material.uniforms.u_amplitude.value + 10.0,
                easing: "easeInOutQuart",
                duration: 1000,
                begin: () => {
                    nextProjectGroup.visible = true;
                }
            },
            0
        )
        .add(
            {
                targets: this.camera.position,
                z: this.camera.position.z - this.distanceBetweenProject,
                easing: "easeOutSine",
                duration: 1000,
                complete: () => {
                    currentProjectGroup.visible = false;
                }
            },
            570
        )
        .add(
            {
                targets: this.planeTouch.position,
                z: this.planeTouch.position.z - this.distanceBetweenProject,
                easing: "easeOutSine",
                duration: 1000,
                complete: () => {
                    currentProjectGroup.visible = false;
                }
            },
            570
        )
        .add(
            {
                targets: nextProjectPoints.material.uniforms.u_alpha,
                value: [0.0, 1.0],
                easing: "linear",
                duration: 800,
                complete: () => {
                    this.state.enabledParallax = true;
                }
            },
            700
        );

        this.state.currentProject++;
    }

    async previousProject() {
        let currentProjectGroup = this.particlesGroup.children[this.state.currentProject],
            currentProjectPoints = this.particlesGroup.children[this.state.currentProject].children[0],
            currentProjectPlane = this.particlesGroup.children[this.state.currentProject].children[1],
            previousProjectGroup = this.particlesGroup.children[this.state.currentProject - 1] || null,
            previousProjectPoints = this.particlesGroup.children[this.state.currentProject - 1].children[0] || null;

        if (previousProjectGroup == null) { return; }

        await this.resetParallax();

        let timeline = anime.timeline();

        previousProjectGroup.visible = true;
        
        timeline
        .add(
            {
                targets: this.camera.position,
                z: this.camera.position.z + this.distanceBetweenProject,
                easing: "easeOutSine",
                duration: 1400,
                begin: () => {
                    previousProjectGroup.visible = true;
                }
            },
            0
        )
        .add(
            {
                targets: currentProjectPoints.material.uniforms.u_alpha,
                value: [1.0, 0.0],
                easing: "easeOutQuart",
                duration: 1200,
                complete: () => {
                    currentProjectGroup.visible = false;
                }
            },
            250
        )
        .add(
            {
                targets: previousProjectPoints.material.uniforms.u_amplitude,
                value: [10.0, previousProjectPoints.material.uniforms.u_amplitude.value - 10.0],
                easing: "easeOutQuart",
                duration: 1200,
                complete: () => {
                    this.state.enabledParallax = true;
                }
            },
            250
        );

        this.state.currentProject--;
    }

    handleMouseMove(event) {
        this.mouse = this.getNDCCoordinates(event);

        this.raycaster.setFromCamera(this.mouse, this.camera);
        this.intersects = this.raycaster.intersectObjects(this.scene.children);

        for ( var i = 0; i < this.intersects.length; i++ ) {
            if (this.intersects[i].object.name == 'Plane') {
                this.tt.addTouch(this.intersects[i].uv);
            }
        }

        this.parallax();
    }

    parallax() {

        if (!this.state.enabledParallax) { return; }

        let currentProjectGroup = this.particlesGroup.children[this.state.currentProject],
            currentProjectPoint = this.particlesGroup.children[this.state.currentProject].children[0];

        // Animation current ps
        // this.parallaxID.add({
        //     targets: currentProjectPoint.rotation,
        //     y: this.mouse.x * 0.2,
        //     x: -this.mouse.y * 0.2,
        //     duration: 600,
        //     easing: "easeOutQuint",
        // });

        // currentProjectPoint.rotation.y = ((this.mouse.x));
        // currentProjectPoint.rotation.x = ((-this.mouse.y));

        // Left Bottom

        let amplitude = Math.sqrt((this.mouse.x*this.mouse.x) + (this.mouse.y*this.mouse.y));

        // Change amplitude of Z with mouse position
        // anime({
        //     targets: currentProjectPoint.material.uniforms.u_amplitude,
        //     value: 1 + amplitude * 2.0,
        //     duration: 600,
        //     easing: "easeOutQuint",
        // });

        currentProjectPoint.material.uniforms.u_amplitude.value = 1.0 + amplitude * 0.5;

        // for (let i = 0; i < this.particlesGroup.children.length; i++) {

        //     if (i != this.state.currentProject) {
        //         this.particlesGroup.children[i].children[0].rotation.y = this.mouse.x * 0.2;
        //         this.particlesGroup.children[i].children[0].rotation.x = -this.mouse.y * 0.2;
        //     }
            
        // }
    }

    async resetParallax() {

        return new Promise(resolve => {
            
            let currentProjectPoint = this.particlesGroup.children[this.state.currentProject].children[0];

            this.state.enabledParallax = false;
            // this.parallaxID.pause();
            
            anime({
                targets: currentProjectPoint.rotation,
                y: 0,
                x: 0,
                duration: 300,
                easing: "linear",
                begin: () => {
                    // this.parallaxID.pause();
                },
                complete: () => {
                    resolve();
                }
            });
        });
        
    }

    async openProject() {

        let currentProjectPoint = this.particlesGroup.children[this.state.currentProject].children[0],
            currentProjectPlane = this.particlesGroup.children[this.state.currentProject].children[1];
        
        // await this.resetParallax();

        let timeline = anime.timeline();

        timeline
        .add(
            {
                targets: currentProjectPoint.material.uniforms.u_amplitude,
                value: 0.0,
                duration: 1000,
                easing: 'easeOutQuad'
            },
            0
        )
        .add(
            {
                targets: currentProjectPoint.material.uniforms.u_alpha,
                value: [1.0, 0.0],
                duration: 1000,
                easing: 'easeOutQuad',
                complete: () => {
                    currentProjectPoint.visible = false;
                }
            },
            750
        )
        .add(
            {
                targets: currentProjectPlane.material,
                opacity: 1.0,
                duration: 600,
                easing: 'easeOutQuad',
                begin: () => {
                    currentProjectPlane.visible = true;
                }
            }, 
            700
        );

        this.state.openProject = true;
    }

    animate = () => {

        this.tt.update();

        // let currentProjectPoint = this.particlesGroup.children[this.state.currentProject].children[0];

        // currentProjectPoint.rotation.y = this.mouse.x - (this.mouse.x * 0.2);
        // currentProjectPoint.rotation.x = -this.mouse.y * 0.2; 
        
        // currentProjectPoint.rotation.y = currentProjectPoint.rotation.y - (currentProjectPoint.rotation.y -this.mouse.x) * (this.clock.getDelta() * 10.1);
        // currentProjectPoint.rotation.x = currentProjectPoint.rotation.x - (currentProjectPoint.rotation.x + this.mouse.y) * (this.clock.getDelta() * 10.1);
        
        this.renderer.render(this.scene, this.camera);

        return requestAnimationFrame(this.animate);
    }

    easeInOutQuad(x, t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t + b;
        } else {
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        }
    }

    getNDCCoordinates(event) {
        const {
            clientHeight,
            clientWidth,
            offsetLeft,
            offsetTop,
        } = this.renderer.domElement;

        const xRelativePx = event.clientX - offsetLeft;
        const x = (xRelativePx / clientWidth) * 2 - 1;

        const yRelativePx = event.clientY - offsetTop;
        const y = -(yRelativePx / clientHeight) * 2 + 1;

        return {x, y};
    }
}

export default Showcase;