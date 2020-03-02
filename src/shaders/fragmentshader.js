export default `
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

    gl_FragColor = textureColorGrey;
}
`