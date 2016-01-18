(function() {
  var __imul = Math.imul ? Math.imul : function(a, b) {
    return (a * (b >>> 16) << 16) + a * (b & 65535) | 0;
  };

  function assert(truth) {
    if (!truth) {
      throw Error('Assertion failed');
    }
  }

  function main() {
    window.onload = function() {
      var canvas = document.getElementById('gol-canvas');
      var controller = new Controller(canvas);
      controller.draw();
      controller.start();
    };
  }

  function Box(value) {
    this.value = value;
  }

  function Controller(canvas) {
    this._canvas = null;
    this._simulation = null;
    this._igloo = null;
    this._program = null;
    this._quadBuffer = null;
    this._mouseBehaviors = null;
    this.viewport = null;
    this._canvas = canvas;
    this.viewport = new Rect(0, 0, 512, 512);
    assert(this._canvas.width == this._canvas.height);
    this._igloo = new Igloo(canvas);

    if (this._igloo.gl == null) {
      document.getElementById('app-container').style.display = 'none';
      document.getElementById('webgl-error').style.display = null;

      throw new Error('Failed to initialize Igloo');
    }

    this._simulation = new Simulation(this._igloo, Controller.gridSize);
    this._igloo.gl.disable(this._igloo.gl.DEPTH_TEST);
    this._program = this._igloo.program('glsl/quad.vert', 'glsl/draw_grid.frag');
    this._quadBuffer = this._igloo.array(Igloo.QUAD2);
    this._mouseBehaviors = [new DragMouseBehavior(this), new ZoomMouseBehavior(this)];
    this._bindMouseBehaviors();
  }

  Controller.prototype.canvas = function() {
    return this._canvas;
  };

  Controller.prototype.draw = function() {
    // As per the comment at the top of 'step', the current grid
    // state is stored in the 'front' texture. So we bind that to
    // index 0 and pass that to the shader as cellGridTexture.
    this._igloo.defaultFramebuffer.bind();
    this._simulation.gridTexture().bind(0);
    this._igloo.gl.viewport(0, 0, this._canvas.width, this._canvas.height);
    this._program.use().attrib('quad', this._quadBuffer, 2).uniformi('cellGridTexture', 0).uniform('viewportOffset', this.viewport.origin.toFloat32Array()).uniform('viewportSize', this.viewport.size.toFloat32Array()).uniform('gridSize', new Float32Array([this._simulation.gridSize, this._simulation.gridSize])).uniform('canvasSize', new Float32Array([this._canvas.width, this._canvas.height])).draw(this._igloo.gl.TRIANGLE_STRIP, 4);
  };

  Controller.prototype.start = function() {
    var self = this;
    setInterval(function() {
      self._simulation.step();
      self.draw();
    }, 60);
  };

  Controller.prototype._bindMouseBehaviors = function() {
    var self = this;
    in_HTMLElement.addEventListener4(self._canvas, 'mousedown', function(e) {
      for (var i = 0, list = self._mouseBehaviors, count = in_List.count(list); i < count; i = i + 1 | 0) {
        var behavior = in_List.get(list, i);
        behavior.down(e.offsetX, e.offsetY);
      }
    });
    in_HTMLElement.addEventListener4(self._canvas, 'mousemove', function(e) {
      for (var i = 0, list = self._mouseBehaviors, count = in_List.count(list); i < count; i = i + 1 | 0) {
        var behavior = in_List.get(list, i);
        behavior.move(e.offsetX, e.offsetY);
      }
    });
    in_HTMLElement.addEventListener4(self._canvas, 'mouseup', function(e) {
      for (var i = 0, list = self._mouseBehaviors, count = in_List.count(list); i < count; i = i + 1 | 0) {
        var behavior = in_List.get(list, i);
        behavior.up(e.offsetX, e.offsetY);
      }
    });
    in_HTMLElement.addEventListener6(self._canvas, 'wheel', function(e) {
      for (var i = 0, list = self._mouseBehaviors, count = in_List.count(list); i < count; i = i + 1 | 0) {
        var behavior = in_List.get(list, i);
        behavior.scroll(e.deltaY);
      }
    });
  };

  function DragMouseBehavior(_controller) {
    this._controller = _controller;
    this._onDownGridSpace = null;
    this._onDownViewport = null;
  }

  DragMouseBehavior.prototype.down = function(x, y) {
    this._onDownViewport = new Box(this._controller.viewport.clone());
    this._onDownGridSpace = new Box(this._gridSpaceFromCanvasSpace(x, y));
  };

  DragMouseBehavior.prototype.move = function(x, y) {
    if (this._onDownGridSpace == null) {
      return;
    }

    var onMoveGridSpace = this._gridSpaceFromCanvasSpace(x, y);
    var delta = this._delta(onMoveGridSpace);
    this._controller.viewport.origin = this._onDownViewport.value.origin.add(delta);
  };

  DragMouseBehavior.prototype.up = function(x, y) {
    if (this._onDownGridSpace != null) {
      var onUpGridSpace = this._gridSpaceFromCanvasSpace(x, y);
      var delta = this._delta(onUpGridSpace);

      if (delta.length() > 10) {
        this._controller.viewport.origin = this._onDownViewport.value.origin.add(delta);
      }
    }

    this._reset();
  };

  DragMouseBehavior.prototype.scroll = function(delta) {
  };

  DragMouseBehavior.prototype._reset = function() {
    this._onDownGridSpace = null;
    this._onDownViewport = null;
  };

  DragMouseBehavior.prototype._gridSpaceFromCanvasSpace = function(x, y) {
    if (this._onDownViewport == null) {
      throw new Error('TODO(ryan)');
    }

    var canvasSize = new Vector(this._controller.canvas().width, this._controller.canvas().height);
    var canvasSpaceUv = new Vector(x, y).divide(canvasSize);
    return this._onDownViewport.value.pointAtUvCoordinate(canvasSpaceUv);
  };

  DragMouseBehavior.prototype._delta = function(newLocation) {
    if (this._onDownGridSpace == null) {
      throw new Error('TODO(ryan)');
    }

    var delta = this._onDownGridSpace.value.subtract(newLocation);
    delta.y *= -1;
    return delta;
  };

  function ZoomMouseBehavior(_controller) {
    this._controller = _controller;
  }

  ZoomMouseBehavior.prototype.down = function(x, y) {
  };

  ZoomMouseBehavior.prototype.move = function(x, y) {
  };

  ZoomMouseBehavior.prototype.up = function(x, y) {
  };

  ZoomMouseBehavior.prototype.scroll = function(delta_) {
    var delta = new Vector(delta_, delta_);
    var newOffset = this._controller.viewport.origin.subtract(delta.divide1(2));
    var newSize = this._controller.viewport.size.add(delta);

    if (newSize.x > ZoomMouseBehavior.minSize && newSize.y > ZoomMouseBehavior.minSize && newSize.x < ZoomMouseBehavior.maxSize && newSize.y < ZoomMouseBehavior.maxSize) {
      this._controller.viewport.origin = newOffset;
      this._controller.viewport.size = newSize;
    }
  };

  function Rect(left, top, width, height) {
    this.origin = Vector.new1();
    this.size = Vector.new1();
    this.origin = new Vector(left, top);
    this.size = new Vector(width, height);
  }

  Rect.prototype.clone = function() {
    return new Rect(this.origin.x, this.origin.y, this.size.x, this.size.y);
  };

  Rect.prototype.pointAtUvCoordinate = function(uv) {
    return this.origin.add(uv.multiply(this.size));
  };

  function Simulation(igloo, gridSize_) {
    this._igloo = null;
    this.gridSize = 0;
    this._program = null;
    this._quadBuffer = null;
    this._sourceTexture = null;
    this._destTexture = null;
    this._framebuffer = null;
    this._igloo = igloo;
    this.gridSize = gridSize_;
    var gl = this._igloo.gl;
    gl.disable(gl.DEPTH_TEST);
    this._program = this._igloo.program('glsl/quad.vert', 'glsl/game_of_life.frag');
    this._quadBuffer = igloo.array(Igloo.QUAD2);
    this._sourceTexture = this._igloo.texture(null, gl.RGBA, gl.REPEAT, gl.NEAREST).blank(this.gridSize, this.gridSize);
    this._destTexture = this._igloo.texture(null, gl.RGBA, gl.REPEAT, gl.NEAREST).blank(this.gridSize, this.gridSize);
    this._framebuffer = this._igloo.framebuffer();

    // Initialize the cell grid with random values
    var randomGrid = new Uint8Array(__imul(this.gridSize, this.gridSize));

    for (var i = 0, count = randomGrid.length; i < count; i = i + 1 | 0) {
      randomGrid[i] = Math.random() < 0.5 ? 1 : 0;
    }

    this.setCellGrid(randomGrid);
  }

  Simulation.prototype.gridTexture = function() {
    return this._sourceTexture;
  };

  Simulation.prototype.setCellGrid = function(inputGrid) {
    var rgba = new Uint8Array(__imul(__imul(this.gridSize, this.gridSize), 4));

    for (var i = 0, count = inputGrid.length; i < count; i = i + 1 | 0) {
      var j = __imul(i, 4);
      rgba[j + 0 | 0] = inputGrid[i] == 1 ? 255 : 0;
      rgba[j + 1 | 0] = inputGrid[i] == 1 ? 255 : 0;
      rgba[j + 2 | 0] = inputGrid[i] == 1 ? 255 : 0;
      rgba[j + 3 | 0] = 255;
    }

    this._sourceTexture.subset(rgba, 0, 0, this.gridSize, this.gridSize);
  };

  Simulation.prototype.step = function() {
    // The current simulation state is always in _sourceTexture
    // and we draw onto _destTexture. So...
    //
    // 1. Bind the _destTexture onto the framebuffer so that
    //    we'll draw onto it.
    //
    // 2. Bind _sourceTexture texture to index 0. This is
    //    passed to the shader by setting the
    //    cellGridTexture uniform below.
    //
    this._framebuffer.attach(this._destTexture);
    this._sourceTexture.bind(0);
    this._igloo.gl.viewport(0, 0, this.gridSize, this.gridSize);
    this._program.use().attrib('quad', this._quadBuffer, 2).uniformi('cellGridTexture', 0).uniform('cellGridSize', new Float32Array([this.gridSize, this.gridSize])).draw(this._igloo.gl.TRIANGLE_STRIP, 4);

    // Swap the source and destination textures
    var tmp = this._sourceTexture;
    this._sourceTexture = this._destTexture;
    this._destTexture = tmp;
  };

  function Vector(x, y) {
    this.x = 0;
    this.y = 0;
    this.x = x;
    this.y = y;
  }

  Vector.prototype.add = function(v) {
    return new Vector(this.x + v.x, this.y + v.y);
  };

  Vector.prototype.subtract = function(v) {
    return new Vector(this.x - v.x, this.y - v.y);
  };

  Vector.prototype.multiply = function(v) {
    return new Vector(this.x * v.x, this.y * v.y);
  };

  Vector.prototype.divide = function(v) {
    return new Vector(this.x / v.x, this.y / v.y);
  };

  Vector.prototype.divide1 = function(d) {
    return new Vector(this.x / d, this.y / d);
  };

  Vector.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  };

  Vector.prototype.toFloat32Array = function() {
    return new Float32Array([this.x, this.y]);
  };

  Vector.new1 = function() {
    return new Vector(0, 0);
  };

  var HTML = {};

  HTML.on = function(target, type, listener) {
    target.addEventListener(type, listener);
  };

  var in_List = {};

  in_List.get = function(self, index) {
    assert(0 <= index && index < in_List.count(self));
    return self[index];
  };

  in_List.count = function(self) {
    return self.length;
  };

  var in_HTMLElement = {};

  in_HTMLElement.addEventListener4 = function(self, type, listener) {
    HTML.on(self, type, listener);
  };

  in_HTMLElement.addEventListener6 = function(self, type, listener) {
    HTML.on(self, type, listener);
  };

  Controller.gridSize = 1024;
  ZoomMouseBehavior.minSize = 15;
  ZoomMouseBehavior.maxSize = 2500;

  main();
})();
