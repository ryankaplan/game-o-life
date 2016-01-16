#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D cellGridTexture;
uniform vec2 canvasSize;
uniform vec2 pageSize;

void main() {
    gl_FragColor = texture2D(cellGridTexture, gl_FragCoord.xy / canvasSize);

    vec4 color = vec4(
        gl_FragCoord.x / pageSize.x,
        gl_FragCoord.y / pageSize.y,
        gl_FragCoord.y * 2.0 / pageSize.y,
        1.0
    );

    // If the cell is 'solid', it will have r == g == b == 1.0
    gl_FragColor = gl_FragColor.r > 0.5 ? color : vec4(0.13, 0.13, 0.13, 0.0);
}