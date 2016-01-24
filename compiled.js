(function(){var Ca=Math.imul||function(a,b){return (a*(b>>>16)<<16)+a*(b&65535)|0};var p;function Ea(){window.onload=function(){var a=document.getElementById('game-of-life-canvas'),b=new Da(a);G(b),aa(b),isTouchDevice()&&(document.getElementById('instructions').innerHTML='Pinch and drag to move around.')}}function H(a,b,c){var e=N(a,b);return ha(c,e)}function E(b){var a=document.getElementById('canvas-container');b.a.width=a.offsetWidth,b.a.height=a.offsetHeight,oa(b.i.b,new La(b.a.width,b.a.height),1)}function F(a){return new La(a.a.width,a.a.height)}function G(a){a.c.defaultFramebuffer.bind(),a.b.f.bind(0),a.c.gl.viewport(0,0,a.a.width,a.a.height),a.e.use().attrib('quad',a.f,2).uniformi('cellGridTexture',0).uniform('viewportOffset',P(a.i.a)).uniform('viewportSize',P(a.i.b)).uniform('canvasSize',new Float32Array([a.a.width,a.a.height])).uniform('gridSize',new Float32Array([a.b.b,a.b.b])).uniform('showDebugUI',!1,!0).draw(5,4)}function aa(a){setInterval(function(){ka(a.b),G(a)},60)}function ba(j){h(j.a,'mousedown',
function(a){for(var t=0,Q=j.g,pa=Q.length;t<pa;t=t+1|0){var b=Q[t];b.B(a.offsetX,a.offsetY)}}),h(j.a,'mousemove',function(c){for(var u=0,R=j.g,qa=R.length;u<qa;u=u+1|0){var e=R[u];e.C(c.offsetX,c.offsetY)}}),h(j.a,'mouseup',function(f){for(var v=0,S=j.g,ra=S.length;v<ra;v=v+1|0){var g=S[v];g.o(f.offsetX,f.offsetY)}}),h(j.a,'mouseleave',function(k){for(var w=0,T=j.g,sa=T.length;w<sa;w=w+1|0){var i=T[w];i.o(k.offsetX,k.offsetY)}}),h(j.a,'wheel',function(l){for(var x=0,U=j.g,ta=U.length;x<ta;x=x+1|0){var D=U[x];D.Y(l.offsetX,l.offsetY,l.deltaY)}}),h(j.a,'touchstart',function(ya){for(var y=0,V=j.k,ua=V.length;y<ua;y=y+1|0){var ca=V[y];ca.Z(ya)}}),h(j.a,'touchmove',function(za){for(var z=0,W=j.k,va=W.length;z<va;z=z+1|0){var da=W[z];da._(za)}}),h(j.a,'touchend',function(Aa){for(var A=0,X=j.k,wa=X.length;A<wa;A=A+1|0){var ea=X[A];ea.$(Aa)}})}function fa(a){a.b=a.c=null}function r(c,a,b){if(!c.c)throw new Error("Shouldn't call _gridSpaceFromCanvasSpace unless _onDownViewport is set");return H(new La(a,b),new La(c.a.a.width,
c.a.a.height),c.c.a)}function I(c,a){if(!c.b)throw new Error("Shouldn't call _delta unless _onDownGridSpace is set");var b=s(c.b.a,a);return b.b*=-1,b}function J(a,b,c,e){var f=na(c);f.b=(e.b|0)-f.b;var g=H(f,e,a),k=a.b.b/a.b.a,i=new La(b,b*k),l=m(a.b,i),D=s(g,M(N(f,e),l));return l.a>15&&l.b>15&&l.a<2500&&l.b<2500?ia(D,l):a}function ga(a){return new Ha(a.a.a,a.a.b,a.b.a,a.b.b)}function ha(b,a){return m(b.a,M(a,b.b))}function ia(a,b){return new Ha(a.a,a.b,b.a,b.b)}function ja(f,a){for(var b=new Uint8Array(f.b*f.b<<2),c=0,g=a.length;c<g;c=c+1|0){var e=c<<2;b[e]=a[c]^1?0:255,b[e+1|0]=a[c]^1?0:255,b[e+2|0]=a[c]^1?0:255,b[e+3|0]=255}f.f.subset(b,0,0,f.b,f.b)}function ka(b){b.k.attach(b.g),b.f.bind(0),b.a.gl.viewport(0,0,b.b,b.b),b.c.use().attrib('quad',b.e,2).uniformi('cellGridTexture',0).uniform('cellGridSize',new Float32Array([b.b,b.b])).draw(5,4);var a=b.f;b.f=b.g,b.g=a}function K(g,a){var b=d(a.touches)[0],c=d(a.touches)[1],e=new La(b.clientX,b.clientY),f=new La(c.clientX,c.clientY);return O(s(e,f))}function la(g,a){
var b=d(a.touches)[0],c=d(a.touches)[1],e=new La(b.clientX,b.clientY),f=new La(c.clientX,c.clientY);return ma(m(e,f),2)}function L(b,a){b.a.i=J(b.e,b.c.a-K(b,a),la(b,a),F(b.a))}function m(b,a){return new La(b.a+a.a,b.b+a.b)}function s(b,a){return new La(b.a-a.a,b.b-a.b)}function M(b,a){return new La(b.a*a.a,b.b*a.b)}function N(b,a){return new La(b.a/a.a,b.b/a.b)}function ma(b,a){return new La(b.a/a,b.b/a)}function O(a){return Math.sqrt(a.a*a.a+a.b*a.b)}function na(a){return new La(a.a,a.b)}function P(a){return new Float32Array([a.a,a.b])}function oa(c,a,b){b?c.b=c.a*a.b/a.a:c.a=c.b*a.a/a.b}function n(){return new La(0,0)}function d(a){for(var b=[],c=0,e=a.length;c<e;c=c+1|0)b.push(a[c]);return b}function h(a,b,c){a.addEventListener(b,c)}function q(a){a.preventDefault()}function Ba(a){this.a=a}function Da(a){var b=this;if(b.b=b.c=null,b.e=b.f=null,b.g=b.k=null,b.i=null,b.a=a,b.i=new Ha(0,0,700,700),b.c=new Igloo(a),!b.c.gl){document.getElementById('app-container').style.display='none',document.getElementById('webgl-error').style.display=null;
throw new Error('Failed to initialize Igloo')}b.b=new Ia(b.c,xa),b.c.gl.disable(2929),b.e=b.c.program('glsl/quad.vert','glsl/draw_grid.frag'),b.f=b.c.array(Igloo.QUAD2),b.g=[new Fa(b),new Ga(b)],b.k=[new Ja(b),new Ka(b)],ba(b),E(b),h(window,'resize',function(){E(b)})}function Fa(a){this.a=a,this.b=this.c=null}p=Fa.prototype;p.B=function(a,b){this.c=new Ba(ga(this.a.i)),this.b=new Ba(r(this,a,b))};p.C=function(a,b){if(this.b){var c=r(this,a,b),e=I(this,c);this.a.i.a=m(this.c.a.a,e)}};p.o=function(a,b){if(this.b){var c=r(this,a,b),e=I(this,c);O(e)>10&&(this.a.i.a=m(this.c.a.a,e))}fa(this)};p.Y=function(a,b,c){};function Ga(a){this.a=a}p=Ga.prototype;p.B=function(a,b){};p.C=function(a,b){};p.o=function(a,b){};p.Y=function(a,b,c){this.a.i=J(this.a.i,c,new La(a,b),F(this.a))};function Ha(a,b,c,e){this.a=n(),this.b=n(),this.a=new La(a,b),this.b=new La(c,e)}function Ia(a,b){this.c=this.e=null,this.f=this.g=null,this.k=null,this.a=a,this.b=b;var c=this.a.gl;c.disable(2929),this.c=this.a.program('glsl/quad.vert','glsl/game_of_life.frag'),
this.e=a.array(Igloo.QUAD2),this.f=this.a.texture(null,6408,10497,9728).blank(this.b,this.b),this.g=this.a.texture(null,6408,10497,9728).blank(this.b,this.b),this.k=this.a.framebuffer();for(var e=new Uint8Array(Ca(this.b,this.b)),f=0,g=e.length;f<g;f=f+1|0)e[f]=Math.random()<.5?1:0;ja(this,e)}function Ja(a){this.a=a,this.b=!1,this.c=null}p=Ja.prototype;p.Z=function(a){this.b=d(a.touches).length==1,this.b&&(this.c=new Fa(this.a),this.c.B(d(a.touches)[0].clientX,d(a.touches)[0].clientY)),q(a)};p._=function(a){this.b=this.b&&d(a.touches).length==1,this.b&&this.c.C(d(a.touches)[0].clientX,d(a.touches)[0].clientY),q(a)};p.$=function(a){this.b=this.b&&d(a.touches).length==1,this.b&&this.c.o(d(a.touches)[0].clientX,d(a.touches)[0].clientY),this.b=!1,q(a)};function Ka(a){this.a=a,this.b=!1,this.c=this.e=null}p=Ka.prototype;p.Z=function(a){d(a.touches).length^2||(this.b=!0,this.e=this.a.i,this.c=new Ba(K(this,a)))};p._=function(a){this.e&&d(a.touches).length==2&&L(this,a)};p.$=function(a){this.e&&d(a.touches).length==2&&(L(this,
a),this.e=null)};function La(a,b){this.a=a,this.b=b}var xa=1024;Ea()})();
