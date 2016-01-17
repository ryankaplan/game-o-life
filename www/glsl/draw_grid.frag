#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D cellGridTexture;

// Width and height of cellGridTexture
uniform vec2 gridSize;

// Offset and size of the viewport in grid space
uniform vec2 viewportOffset;
uniform vec2 viewportSize;

// Size of HTML canvas element
uniform vec2 canvasSize;

void main() {
    // uv co-ordinates of the pixel of the canvas that we're drawing
    vec2 canvasSpaceUv = gl_FragCoord.xy / canvasSize;

    // uv co-ordinates of the texture that we want to display in this pixel
    //
    // Think of this picture below, where the large square is the texture
    // and the small square is the viewport.
    //
    // When we start rendering the left of the viewport, the x-value of the
    // texture co-ordinate that we want to use is viewportOffset.x / gridSize.x
    //
    // And when we're rendering the right of the viewport, the x-value of the
    // texture co-ordinate that we want to use is
    //
    // viewportOffset.x / gridSize.x + canvasSpaceUv.x * viewportSize.x / gridSize
    //
    // Extrapolating this out for .y as well, and factoring our the gridSize term,
    // we get the formula below.
    //  _______________________________
    // |    _______________            |
    // |   |               |           |
    // |   |               |           |
    // |   |               |           |
    // |   |               |           |
    // |   |               |           |
    // |   |_______________|           |
    // |_______________________________|
    vec2 textureSpaceUv = (canvasSpaceUv * viewportSize + viewportOffset) / gridSize;
    gl_FragColor = texture2D(cellGridTexture, textureSpaceUv);

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