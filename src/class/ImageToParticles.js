import * as THREE from 'three';

class ImageToParticles {

	constructor(widthOfOriginalImg = 1920, heightOfOriginalImg = 1080) {
		
		this.widthOfOriginalImg = widthOfOriginalImg;
		this.heightOfOriginalImg = heightOfOriginalImg
	
		this.ratioWidthImg = 0;
		this.ratioHeightImg = 0;

		if (this.widthOfOriginalImg > this.heightOfOriginalImg) {
			this.ratioWidthImg = this.widthOfOriginalImg / this.widthOfOriginalImg;
			this.ratioHeightImg = this.heightOfOriginalImg / this.widthOfOriginalImg;
		} else {
			this.ratioWidthImg = this.widthOfOriginalImg / this.heightOfOriginalImg;
			this.ratioHeightImg = this.heightOfOriginalImg / this.heightOfOriginalImg;
		}
	}

	createGeometryPoints() {

		let geometry = new THREE.BufferGeometry();

		let nbParticles = 1000;
		let vertices = new Float32Array(nbParticles * nbParticles * 3, 3);

		let spaceBetweenParticle = nbParticles / (nbParticles * nbParticles);

		for (let y = 0, y3 = 0; y < 1; y += spaceBetweenParticle, y3 += nbParticles * 3) {
				for (let x = 0, x3 = y3; x < 1; x += spaceBetweenParticle, x3 += 3) {
						vertices[x3 + 0] = x;
						vertices[x3 + 1] = y;
						vertices[x3 + 2] = 0;
				}
		}

		geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

		return geometry;
	}

	createMaterialPoints() {
		
		let uniforms = {
			u_time: {
				type: "f",
				value: 0,
			},
			u_particleSize: {
				type: "f",
				value: 1.6,
			},
			u_texture: {
				type: "t",
				value: 0,
			},
			u_alpha: {
				type: "f",
				value: 0.0,
			},
			u_scaleImage: {
				type: "f",
				value: 600.0,
			},
			u_ratioWidth: {
				type: "f",
				value: this.ratioWidthImg,
			},
			u_ratioHeight: {
				type: "f",
				value: this.ratioHeightImg,
			},
			u_valueImageColor: {
				type: "f",
				value: 0.0,
			},
			u_amplitude: {
				type: "f",
				value: 1.45,
			}
		};

		let material = new THREE.ShaderMaterial({
			uniforms: uniforms,
			vertexShader: this.vertexShader(),
			fragmentShader: this.fragmentShader(),
			transparent: true,
		});

		return material;
	}

	vertexShader() {
		return `
			uniform float u_time;
			uniform float u_particleSize;
			uniform sampler2D u_texture;
			uniform float u_scaleImage;
			uniform float u_ratioWidth;
			uniform float u_ratioHeight;
			uniform float u_amplitude;
			
			varying vec3 v_position;
			
			float calculateWeights(vec3 color) {
				float zRange = 25.0;
				float weight = (color.r * 0.2126) + (color.g * 0.7152) + (color.b * 0.0722);
				return (zRange * 0.0) + (zRange * weight);
			}
			
			void main() {
			
				v_position = position;
		
				float scale = u_scaleImage;
		
				float ratioX = u_ratioWidth * scale;
				float ratioY = u_ratioHeight * scale;
		
				float positionX = (position.x * ratioX) - ratioX / 2.0;
				float positionY = (position.y * ratioY) - ratioY / 2.0;
				float positionZ = 0.0;
		
				vec4 textureColor = texture2D(u_texture, vec2(position.x, position.y));
		
				positionZ = calculateWeights(vec3(textureColor.r, textureColor.g, textureColor.b)) * u_amplitude;
		
				vec4 modelViewPosition = modelViewMatrix * vec4(vec3(positionX, positionY, positionZ), 1.0);
				gl_Position = projectionMatrix * modelViewPosition;
				gl_PointSize = u_particleSize;
			}
		`;
	}

	fragmentShader() {
		return `
			uniform sampler2D u_texture;
			uniform float u_valueImageColor;
			uniform float u_alpha;
			
			varying vec3 v_position;
			
			void main() {
			
				vec4 textureColorOriginal = texture2D(u_texture, vec2(v_position.x, v_position.y));
		
				// Convert color to grey
				float grey = 0.299 * textureColorOriginal.r + 0.587 * textureColorOriginal.g + 0.114 * textureColorOriginal.b;
				vec4 textureColorGrey = vec4(grey, grey, grey, u_alpha);
		
				vec3 colorFinal = mix(vec3(grey, grey, grey), vec3(textureColorOriginal.r, textureColorOriginal.g, textureColorOriginal.b), u_valueImageColor);
		
				gl_FragColor = textureColorGrey;
			}
		`;
	}

	createGeometryPlane() {
		return new THREE.PlaneGeometry( this.ratioWidthImg * 600, this.ratioHeightImg * 600, 1 );
	}

	createMaterialPlane() {
		return new THREE.MeshBasicMaterial({
			map: null, 
			side: THREE.FrontSide, 
			opacity: 0.0, 
			transparent: true, 
			wireframe: false
		});
	}
}

export default ImageToParticles;