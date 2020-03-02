const Shader = {
    vertexShader: `
        uniform float u_time;
        uniform float u_particleSize;
        uniform float u_scaleImage;
        uniform float u_ratioWidth;
        uniform float u_ratioHeight;
        uniform float u_amplitude;

        uniform sampler2D u_texture;
        
        varying vec3 v_position;
        
        float calculateWeights(vec3 color) {
            float zRange = 25.0;
            float weight = (color.r * 0.2126) + (color.g * 0.7152) + (color.b * 0.0722);
            return (zRange * 0.0) + (zRange * weight);
        }
        
        void main() {
        
            v_position = vec3(1.0, 1.0, 1.0);
        
            float scale = u_scaleImage;
        
            float ratioX = u_ratioWidth * scale;
            float ratioY = u_ratioHeight * scale;
        
            float positionX = (position.x * ratioX) - ratioX / 2.0;
            float positionY = (position.y * ratioY) - ratioY / 2.0;
            float positionZ = 0.0;
        
            vec4 textureColor = texture2D(u_texture, vec2(position.x, position.y));
            positionZ = calculateWeights(vec3(textureColor.r, textureColor.g, textureColor.b)) * u_amplitude;
        
            vec4 modelViewPosition = modelViewMatrix * vec4(vec3(positionX, positionY, positionZ * 0.0), 1.0);
            gl_Position = projectionMatrix * modelViewPosition;
            
            gl_PointSize = u_particleSize;
        }
    `,
    fragmentShader: `
        uniform sampler2D u_texture;
        uniform float u_valueImageColor;
        uniform float u_alpha;
        
        varying vec3 v_position;
        
        void main() {
        
            vec4 textureColorOriginal = texture2D(u_texture, vec2(v_position.x, v_position.y));
        
            // Convert color to grey
            float grey = 0.299 * textureColorOriginal.r + 0.587 * textureColorOriginal.g + 0.114 * textureColorOriginal.b;
            vec4 textureColorGrey = vec4(grey, grey, grey, 1.0) * u_alpha;
        
            //vec3 colorFinal = mix(vec3(grey, grey, grey), vec3(textureColorOriginal.r, textureColorOriginal.g, textureColorOriginal.b), u_valueImageColor);
        
            //gl_FragColor = textureColorGrey;
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        }
    `
}

export { Shader }
