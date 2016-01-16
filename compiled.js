(function() {
  var __imul = Math.imul ? Math.imul : function(a, b) {
    return (a * (b >>> 16) << 16) + a * (b & 65535) | 0;
  };

  function main() {
    window.onload = function() {
      var canvas = document.getElementById('gol-canvas');
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      var simulation = new GameOfLife(canvas, cellSize);
      simulation.draw();
      simulation.start();
    };
  }

  function GameOfLife(canvas, cellSize) {
    this._canvas = null;
    this._igloo = null;
    this._programs = null;
    this._buffers = null;
    this._textures = null;
    this._framebuffers = null;
    this._canvasSize = null;
    this._cellGridSize = null;
    this._canvas = canvas;
    this._canvasSize = new Vector(this._canvas.width, this._canvas.height);
    this._cellGridSize = new Vector(this._canvas.width / cellSize | 0, this._canvas.height / cellSize | 0);
    this._igloo = new Igloo(canvas);
    console.log(this._igloo.defaultFramebuffer);

    if (this._igloo.gl == null) {
      throw 'TODO(ryan): handle this';
    }

    var gl = this._igloo.gl;
    gl.disable(gl.DEPTH_TEST);
    this._programs = in_StringMap.insert(in_StringMap.insert(in_StringMap.$new(), 'copy', this._igloo.program('glsl/quad.vert', 'glsl/copy.frag')), 'gol', this._igloo.program('glsl/quad.vert', 'glsl/gol.frag'));
    this._buffers = in_StringMap.insert(in_StringMap.$new(), 'quad', this._igloo.array(Igloo.QUAD2));
    this._textures = in_StringMap.insert(in_StringMap.insert(in_StringMap.$new(), 'front', this._igloo.texture(null, gl.RGBA, gl.REPEAT, gl.NEAREST).blank(this._cellGridSize.x | 0, this._cellGridSize.y | 0)), 'back', this._igloo.texture(null, gl.RGBA, gl.REPEAT, gl.NEAREST).blank(this._cellGridSize.x | 0, this._cellGridSize.y | 0));
    this._framebuffers = in_StringMap.insert(in_StringMap.$new(), 'step', this._igloo.framebuffer());

    // Initialize the cell grid with random values
    var randomGrid = new Uint8Array(this._cellGridSize.x * this._cellGridSize.y | 0);

    for (var i = 0, count = randomGrid.length; i < count; i = i + 1 | 0) {
      randomGrid[i] = Math.random() < 0.5 ? 1 : 0;
    }

    this.setCellGrid(randomGrid);
  }

  GameOfLife.prototype.setCellGrid = function(inputGrid) {
    var rgba = new Uint8Array(this._cellGridSize.x * this._cellGridSize.y * 4 | 0);

    for (var i = 0, count = inputGrid.length; i < count; i = i + 1 | 0) {
      var j = __imul(i, 4);
      rgba[j + 0 | 0] = inputGrid[i] == 1 ? 255 : 0;
      rgba[j + 1 | 0] = inputGrid[i] == 1 ? 255 : 0;
      rgba[j + 2 | 0] = inputGrid[i] == 1 ? 255 : 0;
      rgba[j + 3 | 0] = 255;
    }

    this._textures['front'].subset(rgba, 0, 0, this._cellGridSize.x | 0, this._cellGridSize.y | 0);
    return this;
  };

  GameOfLife.prototype.step = function() {
    // The current simulation state is always in the front
    // texture and we draw onto the back texture. So...
    //
    // 1. Bind the 'back' texture onto the framebuffer so
    //    that we'll draw onto it.
    //
    // 2. Bind the 'front' texture to index 0. This is
    //    passed to the shader by setting the
    //    cellGridTexture uniform below.
    //
    this._framebuffers['step'].attach(this._textures['back']);
    this._textures['front'].bind(0);
    this._igloo.gl.viewport(0, 0, this._cellGridSize.x | 0, this._cellGridSize.y | 0);
    this._programs['gol'].use().attrib('quad', this._buffers['quad'], 2).uniformi('cellGridTexture', 0).uniform('cellGridSize', this._cellGridSize.toFloatArray()).draw(this._igloo.gl.TRIANGLE_STRIP, 4);

    // Swap the front and back textures
    var tmp = this._textures['front'];
    this._textures['front'] = this._textures['back'];
    this._textures['back'] = tmp;
  };

  GameOfLife.prototype.draw = function() {
    // As per the comment at the top of 'step', the current grid
    // state is stored in the 'front' texture. So we bind that to
    // index 0 and pass that to the shader as cellGridTexture.
    this._igloo.defaultFramebuffer.bind();
    this._textures['front'].bind(0);
    this._igloo.gl.viewport(0, 0, this._canvasSize.x | 0, this._canvasSize.y | 0);
    this._programs['copy'].use().attrib('quad', this._buffers['quad'], 2).uniformi('cellGridTexture', 0).uniform('canvasSize', this._canvasSize.toFloatArray()).uniform('pageSize', new Float32Array([this._canvas.width, this._canvas.height])).draw(this._igloo.gl.TRIANGLE_STRIP, 4);
  };

  GameOfLife.prototype.start = function() {
    var self = this;
    setInterval(function() {
      self.step();
      self.draw();
    }, 60);
  };

  function Vector(x, y) {
    this.x = 0;
    this.y = 0;
    this.x = x;
    this.y = y;
  }

  Vector.prototype.toFloatArray = function() {
    return new Float32Array([this.x, this.y]);
  };

  var in_StringMap = {};

  in_StringMap.$new = function() {
    return Object.create(null);
  };

  in_StringMap.insert = function(self, key, value) {
    self[key] = value;
    return self;
  };

  var canvasSize = 512;
  var cellSize = 1;

  main();
})();
