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
      var canvas = document.getElementById('game-of-life-canvas');
      var controller = new Controller(canvas);
      controller.draw();
      controller.start();

      if (!RELEASE) {
        // Expose this for in-browser debugging
        window.controller = controller;
      }

      if (isTouchDevice()) {
        document.getElementById('instructions').innerHTML = 'Pinch and drag to move around.';
      }
    };
  }

  function canvasSpaceToGridSpace1(canvasPosition, canvasSize, viewport) {
    var canvasSpaceUv = canvasPosition.divide(canvasSize);
    return viewport.pointAtUvCoordinate(canvasSpaceUv);
  }

  function Box(value) {
    this.value = value;
  }

  function Controller(canvas) {
    var self = this;
    self._canvas = null;
    self._simulation = null;
    self._igloo = null;
    self._program = null;
    self._quadBuffer = null;
    self._mouseBehaviors = null;
    self._touchHandlers = null;
    self.viewport = null;
    self._canvas = canvas;
    self.viewport = new Rect(0, 0, 700, 700);
    self._igloo = new Igloo(canvas);

    if (self._igloo.gl == null) {
      document.getElementById('app-container').style.display = 'none';
      document.getElementById('webgl-error').style.display = null;

      throw new Error('Failed to initialize Igloo');
    }

    self._simulation = new Simulation(self._igloo, Controller.gridSize);
    self._igloo.gl.disable(self._igloo.gl.DEPTH_TEST);
    self._program = self._igloo.program('glsl/quad.vert', 'glsl/draw_grid.frag');
    self._quadBuffer = self._igloo.array(Igloo.QUAD2);
    self._mouseBehaviors = [new DragMouseBehavior(self), new ZoomMouseBehavior(self)];
    self._touchHandlers = [new PanTouchHandler(self), new ZoomTouchHandler(self)];
    self._bindMouseBehaviors();
    self._onResize();
    in_HTMLWindow.addEventListener1(window, 'resize', function() {
      self._onResize();
    });
  }

  Controller.prototype._onResize = function() {
    var canvasContainer = document.getElementById('canvas-container');
    this._canvas.width = canvasContainer.offsetWidth;
    this._canvas.height = canvasContainer.offsetHeight;

    // Constrain the viewport size to the same aspect ratio
    // as the canvas
    this.viewport.size.constrainToAspectRatio(new Vector(this._canvas.width, this._canvas.height), Axis.Y);

    if (!RELEASE) {
      var viewportAspectRatio = this.viewport.size.y / this.viewport.size.x;
      var canvasAspectRatio = this._canvas.height / this._canvas.width;
      assert(viewportAspectRatio - canvasAspectRatio < 0.001);
    }
  };

  Controller.prototype.canvas = function() {
    return this._canvas;
  };

  Controller.prototype.canvasSize = function() {
    return new Vector(this._canvas.width, this._canvas.height);
  };

  Controller.prototype.draw = function() {
    // As per the comment at the top of 'step', the current grid
    // state is stored in the 'front' texture. So we bind that to
    // index 0 and pass that to the shader as cellGridTexture.
    this._igloo.defaultFramebuffer.bind();
    this._simulation.gridTexture().bind(0);
    this._igloo.gl.viewport(0, 0, this._canvas.width, this._canvas.height);
    this._program.use().attrib('quad', this._quadBuffer, 2).uniformi('cellGridTexture', 0).uniform('viewportOffset', this.viewport.origin.toFloat32Array()).uniform('viewportSize', this.viewport.size.toFloat32Array()).uniform('canvasSize', new Float32Array([this._canvas.width, this._canvas.height])).uniform('gridSize', new Float32Array([this._simulation.gridSize, this._simulation.gridSize])).uniform('showDebugUI', !RELEASE, true).draw(this._igloo.gl.TRIANGLE_STRIP, 4);
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
    in_HTMLElement.addEventListener4(self._canvas, 'mouseleave', function(e) {
      for (var i = 0, list = self._mouseBehaviors, count = in_List.count(list); i < count; i = i + 1 | 0) {
        var behavior = in_List.get(list, i);
        behavior.up(e.offsetX, e.offsetY);
      }
    });
    in_HTMLElement.addEventListener6(self._canvas, 'wheel', function(e) {
      for (var i = 0, list = self._mouseBehaviors, count = in_List.count(list); i < count; i = i + 1 | 0) {
        var behavior = in_List.get(list, i);
        behavior.scroll(e.offsetX, e.offsetY, e.deltaY);
      }
    });
    in_HTMLElement.addEventListener5(self._canvas, 'touchstart', function(e) {
      for (var i = 0, list = self._touchHandlers, count = in_List.count(list); i < count; i = i + 1 | 0) {
        var touchHandler = in_List.get(list, i);
        touchHandler.touchStart(e);
      }
    });
    in_HTMLElement.addEventListener5(self._canvas, 'touchmove', function(e) {
      for (var i = 0, list = self._touchHandlers, count = in_List.count(list); i < count; i = i + 1 | 0) {
        var touchHandler = in_List.get(list, i);
        touchHandler.touchMove(e);
      }
    });
    in_HTMLElement.addEventListener5(self._canvas, 'touchend', function(e) {
      for (var i = 0, list = self._touchHandlers, count = in_List.count(list); i < count; i = i + 1 | 0) {
        var touchHandler = in_List.get(list, i);
        touchHandler.touchEnd(e);
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
    this._onDownGridSpace = new Box(this._canvasSpaceToGridSpace(x, y));
  };

  DragMouseBehavior.prototype.move = function(x, y) {
    if (this._onDownGridSpace == null) {
      return;
    }

    var onMoveGridSpace = this._canvasSpaceToGridSpace(x, y);
    var delta = this._delta(onMoveGridSpace);
    this._controller.viewport.origin = this._onDownViewport.value.origin.add(delta);
  };

  DragMouseBehavior.prototype.up = function(x, y) {
    if (this._onDownGridSpace != null) {
      var onUpGridSpace = this._canvasSpaceToGridSpace(x, y);
      var delta = this._delta(onUpGridSpace);

      if (delta.length() > 10) {
        this._controller.viewport.origin = this._onDownViewport.value.origin.add(delta);
      }
    }

    this._reset();
  };

  DragMouseBehavior.prototype.scroll = function(x, y, delta) {
  };

  DragMouseBehavior.prototype._reset = function() {
    this._onDownGridSpace = null;
    this._onDownViewport = null;
  };

  DragMouseBehavior.prototype._canvasSpaceToGridSpace = function(x, y) {
    if (this._onDownViewport == null) {
      throw new Error("Shouldn't call _gridSpaceFromCanvasSpace unless _onDownViewport is set");
    }

    return canvasSpaceToGridSpace1(new Vector(x, y), new Vector(this._controller.canvas().width, this._controller.canvas().height), this._onDownViewport.value);
  };

  DragMouseBehavior.prototype._delta = function(newLocation) {
    if (this._onDownGridSpace == null) {
      throw new Error("Shouldn't call _delta unless _onDownGridSpace is set");
    }

    var delta = this._onDownGridSpace.value.subtract(newLocation);
    delta.y *= -1;
    return delta;
  };

  var Zoom = {};

  // Zooms in viewport by delta around canvasSpaceCenter. canvasSize is the size
  // of the canvas HTML element. viewport is in grid space.
  Zoom.zoomViewport = function(viewport, delta, canvasSpaceCenter, canvasSize) {
    var center = canvasSpaceCenter.clone();

    // Flip HTML canvas co-ordinates so that they match graphics context
    // co-ordinates. When the mouse is on the bottom of the canvas its
    // y-value should be 0. When it's at the top its value should be
    // canvasSize.y
    center.y = (canvasSize.y | 0) - center.y;
    var gridSpaceCenter = canvasSpaceToGridSpace1(center, canvasSize, viewport);

    // First, let's figure out the size of the new viewport. To maintain
    // the viewport aspect ratio we make sure that delta has the same
    // aspect ratio.
    var viewportAspectRatio = viewport.size.y / viewport.size.x;
    var aspectDelta = new Vector(delta, delta * viewportAspectRatio);
    var newSize = viewport.size.add(aspectDelta);

    // Now we want to figure out the origin of the new viewport such that
    // the cursor points to the same location on the grid. How do we do that?
    //
    // Well, the cursor is at (x, y) in canvas space. And it will
    // still be at (x, y) in canvas space when we're done zooming.
    // We can use this. If you unbundle the logic of the
    // canvasSpaceToGridSpace above, you'll see that it breaks down
    // to the following formula:
    //
    // gridSpacePosition = viewport.origin + (canvasSpacePosition / canvasSize) * viewport.size
    //
    // Re-working it to put viewport.origin on the left, we get
    //
    // viewport.origin = gridSpacePosition - (canvasSpacePosition / canvasSize) * viewport.size
    //
    var newOrigin = gridSpaceCenter.subtract(center.divide(canvasSize).multiply(newSize));

    if (newSize.x > Zoom.minSize && newSize.y > Zoom.minSize && newSize.x < Zoom.maxSize && newSize.y < Zoom.maxSize) {
      return Rect.withOriginAndSize(newOrigin, newSize);
    }

    return viewport;
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

  ZoomMouseBehavior.prototype.scroll = function(x, y, delta) {
    this._controller.viewport = Zoom.zoomViewport(this._controller.viewport, delta, new Vector(x, y), this._controller.canvasSize());
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

  Rect.withOriginAndSize = function(origin, size) {
    return new Rect(origin.x, origin.y, size.x, size.y);
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

  function PanTouchHandler(_controller) {
    this._controller = _controller;
    this._panning = false;
    this._dragBehavior = null;
  }

  PanTouchHandler.prototype.touchStart = function(e) {
    if (in_List.count(in_HTMLTouchEvent.touches(e)) == 1) {
      this._panning = true;
      this._dragBehavior = new DragMouseBehavior(this._controller);
      this._dragBehavior.down(in_List.get(in_HTMLTouchEvent.touches(e), 0).clientX, in_List.get(in_HTMLTouchEvent.touches(e), 0).clientY);
    }

    in_HTMLEvent.preventDefault(e);
  };

  PanTouchHandler.prototype.touchMove = function(e) {
    if (this._panning && in_List.count(in_HTMLTouchEvent.touches(e)) == 1) {
      this._dragBehavior.move(in_List.get(in_HTMLTouchEvent.touches(e), 0).clientX, in_List.get(in_HTMLTouchEvent.touches(e), 0).clientY);
    }

    in_HTMLEvent.preventDefault(e);
  };

  PanTouchHandler.prototype.touchEnd = function(e) {
    if (this._panning && in_List.count(in_HTMLTouchEvent.touches(e)) == 1) {
      this._dragBehavior.up(in_List.get(in_HTMLTouchEvent.touches(e), 0).clientX, in_List.get(in_HTMLTouchEvent.touches(e), 0).clientY);
    }

    in_HTMLEvent.preventDefault(e);
  };

  function ZoomTouchHandler(_controller) {
    this._controller = _controller;
    this._scaling = false;
    this._onStartDistance = null;
    this._onStartViewport = null;
  }

  ZoomTouchHandler.prototype.touchStart = function(e) {
    if (in_List.count(in_HTMLTouchEvent.touches(e)) == 2) {
      this._scaling = true;
      this._onStartViewport = this._controller.viewport;
      this._onStartDistance = new Box(this._distanceBetweenTouches(e));
    }
  };

  ZoomTouchHandler.prototype.touchMove = function(e) {
    if (this._onStartViewport != null && in_List.count(in_HTMLTouchEvent.touches(e)) == 2) {
      this._onZoom(e);
    }
  };

  ZoomTouchHandler.prototype.touchEnd = function(e) {
    if (this._onStartViewport != null && in_List.count(in_HTMLTouchEvent.touches(e)) == 2) {
      this._onZoom(e);
      this._onStartViewport = null;
    }
  };

  ZoomTouchHandler.prototype._distanceBetweenTouches = function(e) {
    var aTouch = in_List.get(in_HTMLTouchEvent.touches(e), 0);
    var bTouch = in_List.get(in_HTMLTouchEvent.touches(e), 1);
    var a = new Vector(aTouch.clientX, aTouch.clientY);
    var b = new Vector(bTouch.clientX, bTouch.clientY);
    return a.distanceTo(b);
  };

  ZoomTouchHandler.prototype._touchCenter = function(e) {
    var aTouch = in_List.get(in_HTMLTouchEvent.touches(e), 0);
    var bTouch = in_List.get(in_HTMLTouchEvent.touches(e), 1);
    var a = new Vector(aTouch.clientX, aTouch.clientY);
    var b = new Vector(bTouch.clientX, bTouch.clientY);
    return a.add(b).divide1(2);
  };

  ZoomTouchHandler.prototype._onZoom = function(e) {
    assert(this._onStartViewport != null);
    assert(this._onStartDistance != null);
    this._controller.viewport = Zoom.zoomViewport(this._onStartViewport, this._distanceBetweenTouches(e) - this._onStartDistance.value, this._touchCenter(e), this._controller.canvasSize());
  };

  var Axis = {
    X: 0,
    Y: 1
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

  Vector.prototype.distanceTo = function(v) {
    return this.subtract(v).length();
  };

  Vector.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  };

  Vector.prototype.clone = function() {
    return new Vector(this.x, this.y);
  };

  Vector.prototype.toFloat32Array = function() {
    return new Float32Array([this.x, this.y]);
  };

  Vector.prototype.constrainToAspectRatio = function(other, freeAxis) {
    // TODO(ryan): change this to a switch statement once the skew
    // compiler is fixed
    if (freeAxis == Axis.X) {
      this.x = this.y * other.x / other.y;
    }

    else {
      this.y = this.x * other.y / other.x;
    }
  };

  Vector.new1 = function() {
    return new Vector(0, 0);
  };

  var HTML = {};

  HTML.asList = function(listLike) {
    var list = [];

    for (var i = 0, count = listLike.length; i < count; i = i + 1 | 0) {
      list.push(listLike[i]);
    }

    return list;
  };

  HTML.on = function(target, type, listener) {
    target.addEventListener(type, listener);
  };

  HTML.preventDefault = function(event) {
    event.preventDefault();
  };

  var in_List = {};

  in_List.get = function(self, index) {
    assert(0 <= index && index < in_List.count(self));
    return self[index];
  };

  in_List.count = function(self) {
    return self.length;
  };

  var in_HTMLEvent = {};

  in_HTMLEvent.preventDefault = function(self) {
    HTML.preventDefault(self);
  };

  var in_HTMLTouchEvent = {};

  in_HTMLTouchEvent.touches = function(self) {
    return HTML.asList(self.touches);
  };

  var in_HTMLElement = {};

  in_HTMLElement.addEventListener4 = function(self, type, listener) {
    HTML.on(self, type, listener);
  };

  in_HTMLElement.addEventListener5 = function(self, type, listener) {
    HTML.on(self, type, listener);
  };

  in_HTMLElement.addEventListener6 = function(self, type, listener) {
    HTML.on(self, type, listener);
  };

  var in_HTMLWindow = {};

  in_HTMLWindow.addEventListener1 = function(self, type, listener) {
    HTML.on(self, type, listener);
  };

  var RELEASE = false;
  Controller.gridSize = 128;
  Zoom.minSize = 15;
  Zoom.maxSize = 2500;

  main();
})();
