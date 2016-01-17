## Game o' life

See the demo of this [here](http://rykap.com/game-o-life).


This is a Game of Life simulation that runs on the GPU. I borrowed a lot of
this from [Skeeto](https://github.com/skeeto)'s [Game of Life implementation](http://nullprogram.com/blog/2014/06/10/).
This implementation is written in [Skew](http://skew-lang.org/) - I built it
to play around with the language and to get a little more familiar with WebGL.

To develop locally:

```
npm install
python -m SimpleHTTPServer 8000
jake debug
```

Then visit `http://localhost:8000/www/index.html` in a web browser. You can
also run `jake watch` to re-compile as you make changes to the source.

