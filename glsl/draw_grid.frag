#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D cellGridTexture;

// Width and height of cellGridTexture
uniform vec2 gridSize;

// Size of HTML canvas element
uniform vec2 canvasSize;

// Offset and size of the viewport in grid space
uniform vec2 viewportOffset;
uniform vec2 viewportSize;

void main() {
    // UV co-ordinates of the pixel we're drawing in canvas space
    vec2 canvasSpaceUv = gl_FragCoord.xy / canvasSize;

    // Use that to find the grid point that we're drawing
    vec2 gridPoint = viewportOffset + viewportSize * canvasSpaceUv;

    // UV co-ordinates of the cell that we're drawing in grid-space
    vec2 gridUv = gridPoint / gridSize;

    gl_FragColor = texture2D(cellGridTexture, gridUv);

    // Color the grid
    vec4 color = vec4(
        gl_FragCoord.x / canvasSize.x,
        gl_FragCoord.y / canvasSize.y,
        gl_FragCoord.y * 2.0 / canvasSize.y,
        1.0
    );

    // If the cell is 'solid', it will have r == g == b == 1.0
    gl_FragColor = gl_FragColor.r > 0.5 ? color : vec4(0.13, 0.13, 0.13, 0.0);

}