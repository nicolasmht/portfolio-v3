export default `
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

    v_position = vec3(1.0, 1.0, 1.0);

    float scale = u_scaleImage;

    float ratioX = u_ratioWidth * scale;
    float ratioY = u_ratioHeight * scale;

    float positionX = (position.x * ratioX) - ratioX / 2.0;
    float positionY = (position.y * ratioY) - ratioY / 2.0;
    float positionZ = 0.0;

    //vec4 textureColor = texture2D(u_texture, vec2(position.x, position.y));
    //positionZ = calculateWeights(vec3(textureColor.r, textureColor.g, textureColor.b)) * u_amplitude;

    vec4 modelViewPosition = modelViewMatrix * vec4(vec3(positionX, positionY, positionZ), 1.0);
    gl_Position = projectionMatrix * modelViewPosition;
    
    gl_PointSize = u_particleSize;
}
`