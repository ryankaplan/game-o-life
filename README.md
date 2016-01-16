## Game of Life implementation on the GPU

This is pretty much a port of [Skeeto](https://github.com/skeeto)'s [Game of Life implementation in JS](http://nullprogram.com/blog/2014/06/10/).

I wrote in [Skew](http://skew-lang.org/) to play around with the language. You can see a demo [here](http://rykap.com/game-o-life).

Or, if you want to run it locally:

```
npm install
jake release
python -m SimpleHTTPServer 8000
```

Then visit `http://localhost:8000/www/index.html` in a web browser.

