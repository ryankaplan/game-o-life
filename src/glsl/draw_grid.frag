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

// Shows some ugly markers on the canvas to aid debugging
uniform int showDebugUI;

bool between(vec2 value, vec2 bottom, vec2 top) {
    return value.x > bottom.x && value.x < top.x && value.y > bottom.y && value.y < top.y;
}

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

    if (showDebugUI == 1) {
        vec4 lightRed = vec4(1.0, 0.5, 0.5, 1.0);
        vec4 lightBlue = vec4(0.5, 0.5, 1.0, 1.0);
        vec4 lightGreen = vec4(0.5, 1.0, 0.5, 1.0);

        // Show a red 100x100 cell grid
        if (mod(gridPoint.x, 100.0) < 3.0 || mod(gridPoint.y, 100.0) < 3.0) {
            gl_FragColor = (lightRed + gl_FragColor) / 2.0;
        }

        // Show a green marker at (0, 0)
        if (between(gridPoint.xy, vec2(0.0, 0.0), vec2(10.0, 10.0))) {
            gl_FragColor = (lightGreen + gl_FragColor) / 2.0;
        }

        // Show a blue marker at (100, 100)
        if (between(gridPoint.xy, vec2(100.0, 100.0), vec2(110.0, 110.0))) {
            gl_FragColor = (lightBlue + gl_FragColor) / 2.0;
        }
    }
}