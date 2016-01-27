(function(){var Ba=Math.imul||function(a,b){return (a*(b>>>16)<<16)+a*(b&65535)|0};var q;function Da(){window.onload=function(){var a=document.getElementById('game-of-life-canvas'),b=new Ca(a);G(b),aa(b),isTouchDevice()&&(document.getElementById('instructions').innerHTML='Pinch and drag to move around.')}}function H(a,b,c){var e=M(a,b);return ja(c,e)}function E(b){var a=document.getElementById('canvas-container');b.a.width=a.offsetWidth,b.a.height=a.offsetHeight,qa(b.j.b,new Ka(b.a.width,b.a.height),1)}function F(a){return new Ka(a.a.width,a.a.height)}function G(a){a.c.defaultFramebuffer.bind(),a.b.f.bind(0),a.c.gl.viewport(0,0,a.a.width,a.a.height),a.e.use().attrib('quad',a.f,2).uniformi('cellGridTexture',0).uniform('viewportOffset',O(a.j.a)).uniform('viewportSize',O(a.j.b)).uniform('canvasSize',new Float32Array([a.a.width,a.a.height])).uniform('gridSize',new Float32Array([a.b.b,a.b.b])).uniform('showDebugUI',!1,!0).draw(5,4)}function aa(a){setInterval(function(){ma(a.b),G(a)},60)}function ba(k){i(k.a,'mousedown',
function(a){for(var t=0,Q=k.g,ra=Q.length;t<ra;t=t+1|0){var b=Q[t];b.B(a.offsetX,a.offsetY)}h(a)}),i(k.a,'mousemove',function(c){for(var u=0,R=k.g,sa=R.length;u<sa;u=u+1|0){var e=R[u];e.C(c.offsetX,c.offsetY)}h(c)}),i(k.a,'mouseup',function(f){for(var v=0,S=k.g,ta=S.length;v<ta;v=v+1|0){var g=S[v];g.p(f.offsetX,f.offsetY)}h(f)}),i(k.a,'mouseleave',function(l){for(var w=0,T=k.g,ua=T.length;w<ua;w=w+1|0){var j=T[w];j.p(l.offsetX,l.offsetY)}}),i(k.a,'wheel',function(m){for(var x=0,U=k.g,va=U.length;x<va;x=x+1|0){var D=U[x];D.Y(m.offsetX,m.offsetY,m.deltaX,m.deltaY)}h(m)}),i(k.a,'touchstart',function(ca){for(var y=0,V=k.l,wa=V.length;y<wa;y=y+1|0){var da=V[y];da.Z(ca)}h(ca)}),i(k.a,'touchmove',function(ea){for(var z=0,W=k.l,xa=W.length;z<xa;z=z+1|0){var fa=W[z];fa._(ea)}h(ea)}),i(k.a,'touchend',function(ga){for(var A=0,X=k.l,ya=X.length;A<ya;A=A+1|0){var ha=X[A];ha.$(ga)}h(ga)})}function r(c,a,b){if(!c.c)throw new Error("Shouldn't call _gridSpaceFromCanvasSpace unless _onDownViewport is set");return H(new Ka(a,b),
new Ka(c.a.a.width,c.a.a.height),c.c.a)}function I(c,a){if(!c.b)throw new Error("Shouldn't call _delta unless _onDownGridSpace is set");var b=s(c.b.a,a);return b.b*=-1,b}function ia(a){return new Ga(a.a.a,a.a.b,a.b.a,a.b.b)}function ja(b,a){return n(b.a,L(a,b.b))}function ka(a,b){return new Ga(a.a,a.b,b.a,b.b)}function la(f,a){for(var b=new Uint8Array(f.b*f.b<<2),c=0,g=a.length;c<g;c=c+1|0){var e=c<<2;b[e]=a[c]^1?0:255,b[e+1|0]=a[c]^1?0:255,b[e+2|0]=a[c]^1?0:255,b[e+3|0]=255}f.f.subset(b,0,0,f.b,f.b)}function ma(b){b.l.attach(b.g),b.f.bind(0),b.a.gl.viewport(0,0,b.b,b.b),b.c.use().attrib('quad',b.e,2).uniformi('cellGridTexture',0).uniform('cellGridSize',new Float32Array([b.b,b.b])).draw(5,4);var a=b.f;b.f=b.g,b.g=a}function J(g,a){var b=d(a.touches)[0],c=d(a.touches)[1],e=new Ka(b.clientX,b.clientY),f=new Ka(c.clientX,c.clientY);return N(s(e,f))}function na(g,a){var b=d(a.touches)[0],c=d(a.touches)[1],e=new Ka(b.clientX,b.clientY),f=new Ka(c.clientX,c.clientY);return oa(n(e,f),2)}function K(b,a){b.a.j=P(b.e,b.c.a-J(b,
a),na(b,a),F(b.a))}function n(b,a){return new Ka(b.a+a.a,b.b+a.b)}function s(b,a){return new Ka(b.a-a.a,b.b-a.b)}function L(b,a){return new Ka(b.a*a.a,b.b*a.b)}function M(b,a){return new Ka(b.a/a.a,b.b/a.b)}function oa(b,a){return new Ka(b.a/a,b.b/a)}function N(a){return Math.sqrt(a.a*a.a+a.b*a.b)}function pa(a){return new Ka(a.a,a.b)}function O(a){return new Float32Array([a.a,a.b])}function qa(c,a,b){b?c.b=c.a*a.b/a.a:c.a=c.b*a.a/a.b}function o(){return new Ka(0,0)}function P(a,b,c,e){var f=pa(c);f.b=(e.b|0)-f.b;var g=H(f,e,a),l=a.b.b/a.b.a,j=new Ka(b,b*l),m=n(a.b,j);(m.a<30||m.b<30)&&b<0?m=new Ka(30,l*30):(m.a>2500||m.b>2500)&&b>0&&(m=new Ka(2500,l*2500));var D=s(g,L(M(f,e),m));return ka(D,m)}function d(a){for(var b=[],c=0,e=a.length;c<e;c=c+1|0)b.push(a[c]);return b}function i(a,b,c){a.addEventListener(b,c)}function h(a){a.preventDefault()}function Aa(a){this.a=a}function Ca(a){var b=this;if(b.b=b.c=null,b.e=b.f=null,b.g=b.l=null,b.j=null,b.a=a,b.j=new Ga(0,0,700,700),b.c=new Igloo(a),!b.c.gl){document.getElementById('app-container').style.display='none',
document.getElementById('webgl-error').style.display=null;throw new Error('Failed to initialize Igloo')}b.b=new Ha(b.c,za),b.c.gl.disable(2929),b.e=b.c.program('glsl/quad.vert','glsl/draw_grid.frag'),b.f=b.c.array(Igloo.QUAD2),b.g=[new Ea(b),new Fa(b)],b.l=[new Ia(b),new Ja(b)],ba(b),E(b),i(window,'resize',function(){E(b)})}function Ea(a){this.a=a,this.b=this.c=null}q=Ea.prototype;q.B=function(a,b){this.c=new Aa(ia(this.a.j)),this.b=new Aa(r(this,a,b)),this.a.a.style.cursor='move'};q.C=function(a,b){if(this.b){var c=r(this,a,b),e=I(this,c);this.a.j.a=n(this.c.a.a,e),this.a.a.style.cursor='move'}};q.p=function(a,b){if(this.b){var c=r(this,a,b),e=I(this,c);N(e)>10&&(this.a.j.a=n(this.c.a.a,e))}this.b=this.c=null,this.a.a.style.cursor='default'};q.Y=function(a,b,c,e){};function Fa(a){this.a=a}q=Fa.prototype;q.B=function(a,b){};q.C=function(a,b){};q.p=function(a,b){};q.Y=function(a,b,c,e){this.a.j=P(this.a.j,e,new Ka(a,b),F(this.a))};function Ga(a,b,c,e){this.a=o(),this.b=o(),this.a=new Ka(a,b),this.b=new Ka(c,e)}
function Ha(a,b){this.c=this.e=null,this.f=this.g=null,this.l=null,this.a=a,this.b=b;var c=this.a.gl;c.disable(2929),this.c=this.a.program('glsl/quad.vert','glsl/game_of_life.frag'),this.e=a.array(Igloo.QUAD2),this.f=this.a.texture(null,6408,10497,9728).blank(this.b,this.b),this.g=this.a.texture(null,6408,10497,9728).blank(this.b,this.b),this.l=this.a.framebuffer();for(var e=new Uint8Array(Ba(this.b,this.b)),f=0,g=e.length;f<g;f=f+1|0)e[f]=Math.random()<.5?1:0;la(this,e)}function Ia(a){this.a=a,this.b=!1,this.c=null}q=Ia.prototype;q.Z=function(a){this.b=d(a.touches).length==1,this.b&&(this.c=new Ea(this.a),this.c.B(d(a.touches)[0].clientX,d(a.touches)[0].clientY)),h(a)};q._=function(a){this.b=this.b&&d(a.touches).length==1,this.b&&this.c.C(d(a.touches)[0].clientX,d(a.touches)[0].clientY),h(a)};q.$=function(a){this.b=this.b&&d(a.touches).length==1,this.b&&this.c.p(d(a.touches)[0].clientX,d(a.touches)[0].clientY),this.b=!1,h(a)};function Ja(a){this.a=a,this.b=!1,this.c=this.e=null}q=Ja.prototype;q.Z=function(a){
d(a.touches).length^2||(this.b=!0,this.e=this.a.j,this.c=new Aa(J(this,a)))};q._=function(a){this.e&&d(a.touches).length==2&&K(this,a)};q.$=function(a){this.e&&d(a.touches).length==2&&(K(this,a),this.e=null)};function Ka(a,b){this.a=a,this.b=b}var za=1024;Da()})();