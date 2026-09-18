var e=class{constructor(e,t,n){if(this.canvas=e,this.gl=e.getContext(`webgl`,{alpha:!1,antialias:!1,depth:!1,stencil:!1,powerPreference:`low-power`,preserveDrawingBuffer:!1}),!this.gl)throw Error(`WebGL unavailable`);let r=this.gl;this.onContextLost=e=>{e.preventDefault(),n()},e.addEventListener(`webglcontextlost`,this.onContextLost);let i=(e,t)=>{let n=r.createShader(e);if(r.shaderSource(n,t),r.compileShader(n),!r.getShaderParameter(n,r.COMPILE_STATUS)){let e=r.getShaderInfoLog(n);throw r.deleteShader(n),Error(e)}return n},a=i(r.VERTEX_SHADER,`attribute vec2 aPosition; varying vec2 vUv;
void main(){vUv=vec2(aPosition.x*.5+.5,.5-aPosition.y*.5);gl_Position=vec4(aPosition,0.,1.);}`),o=i(r.FRAGMENT_SHADER,`precision highp float;
varying vec2 vUv;
uniform sampler2D uBackground,uHill,uSubject;
uniform vec2 uSize,uCenter;
uniform vec4 uBgRect,uHillRect,uSubjectRect;
uniform float uBurst,uProgress,uQuality;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
vec4 layer(sampler2D tex,vec2 uv,vec4 rect){
 vec2 p=(uv*uSize-rect.xy)/rect.zw;
 if(p.x<0.||p.y<0.||p.x>1.||p.y>1.)return vec4(0.);
 return texture2D(tex,p);
}
vec3 compose(vec2 uv){
 vec4 bg=layer(uBackground,uv,uBgRect);
 vec4 hill=layer(uHill,uv,uHillRect);
 vec4 subject=layer(uSubject,uv,uSubjectRect);
 vec3 color=mix(vec3(.075,.10,.14),bg.rgb,bg.a);
 color=mix(color,hill.rgb,hill.a);
 return mix(color,subject.rgb,subject.a);
}
void main(){
 vec2 uv=vUv;
 vec2 aspect=vec2(uSize.x/uSize.y,1.);
 vec2 radial=(uv-uCenter)*aspect;
 float radius=length(radial);
 vec2 direction=normalize(radial+vec2(.00001))/aspect;
 float effect=uBurst;
 vec2 warped=uv;
 if(effect>.001){
   // Fixed image-space cells stretch along the view's depth vector. No random playback.
   float cellSize=mix(2.,8.,effect);
   vec2 grid=floor(uv*uSize/cellSize);
   float seed=hash(grid);
   float envelope=1.-smoothstep(.08,1.0,radius);
   float fragmentTravel=pow(seed,4.)*effect*.085*envelope;
   float waveRadius=mix(.02,1.15,clamp((uProgress-.35)/.36,0.,1.));
   float wave=exp(-pow((radius-waveRadius)/.105,2.))*effect*.033;
   warped-=direction*(fragmentTravel+wave);
   vec2 pixelated=(floor(warped*uSize/cellSize)+.5)*cellSize/uSize;
   warped=mix(warped,pixelated,effect*.62*envelope);
 }
 vec3 color=compose(warped);
 if(effect>.001&&uQuality>.5){
   vec2 streak=direction*effect*.009;
   color=color*.54+compose(warped+streak)*.23+compose(warped-streak)*.23;
   // A restrained channel separation, removed entirely at both bookends.
   color.r=mix(color.r,compose(warped+direction*effect*.0025).r,effect*.45);
   color.b=mix(color.b,compose(warped-direction*effect*.0025).b,effect*.45);
 }
 float grain=(hash(floor(vUv*uSize))-.5)*.012*effect;
 gl_FragColor=vec4(color+grain,1.);
}`);if(this.program=r.createProgram(),r.attachShader(this.program,a),r.attachShader(this.program,o),r.linkProgram(this.program),r.deleteShader(a),r.deleteShader(o),!r.getProgramParameter(this.program,r.LINK_STATUS))throw Error(r.getProgramInfoLog(this.program));r.useProgram(this.program),this.buffer=r.createBuffer(),r.bindBuffer(r.ARRAY_BUFFER,this.buffer),r.bufferData(r.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),r.STATIC_DRAW);let s=r.getAttribLocation(this.program,`aPosition`);r.enableVertexAttribArray(s),r.vertexAttribPointer(s,2,r.FLOAT,!1,0,0),this.uniforms=Object.fromEntries([`uSize`,`uCenter`,`uBgRect`,`uHillRect`,`uSubjectRect`,`uBurst`,`uProgress`,`uQuality`].map(e=>[e,r.getUniformLocation(this.program,e)])),this.textures=t.map((e,t)=>{let n=r.createTexture();return r.activeTexture(r.TEXTURE0+t),r.bindTexture(r.TEXTURE_2D,n),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE),r.texImage2D(r.TEXTURE_2D,0,r.RGBA,r.RGBA,r.UNSIGNED_BYTE,e),r.uniform1i(r.getUniformLocation(this.program,[`uBackground`,`uHill`,`uSubject`][t]),t),n}),this.quality=1,this.pixelRatio=1}resize(e,t,n){this.width=e,this.height=t,this.pixelRatio=n,this.canvas.width=Math.round(e*n),this.canvas.height=Math.round(t*n),this.gl.viewport(0,0,this.canvas.width,this.canvas.height)}render(e){let t=this.gl,n=this.uniforms;t.useProgram(this.program),t.uniform2f(n.uSize,this.width,this.height),t.uniform2fv(n.uCenter,e.center);for(let[r,i]of[[`uBgRect`,e.background],[`uHillRect`,e.hill],[`uSubjectRect`,e.subject]])t.uniform4f(n[r],i.x,i.y,i.w,i.h);t.uniform1f(n.uBurst,e.burst),t.uniform1f(n.uProgress,e.p),t.uniform1f(n.uQuality,this.quality),t.drawArrays(t.TRIANGLES,0,6)}dispose(){let e=this.gl;this.canvas.removeEventListener(`webglcontextlost`,this.onContextLost),this.textures?.forEach(t=>e.deleteTexture(t)),this.buffer&&e.deleteBuffer(this.buffer),this.program&&e.deleteProgram(this.program)}};export{e as SceneRenderer};