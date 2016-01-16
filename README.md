## Game of Life implementation on the GPU

This is pretty much a port of [this implementation of Game of Life on the GPU](http://nullprogram.com/blog/2014/06/10/) to [Skew](http://skew-lang.org/).

I wrote it as a way to play around with Skew and with WebGL. You can run it with...

```
npm install
jake release
python -m SimpleHTTPServer 8000
```

Then visit `http://localhost:8000/www/index.html` in a web browser.

