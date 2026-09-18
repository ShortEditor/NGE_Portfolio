const vertex = `attribute vec2 aPosition; varying vec2 vUv;
void main(){vUv=vec2(aPosition.x*.5+.5,.5-aPosition.y*.5);gl_Position=vec4(aPosition,0.,1.);}`;

const fragment = `precision highp float;
varying vec2 vUv;
uniform sampler2D uBackground,uHill,uSubject;
uniform vec2 uSize,uCenter;
uniform vec4 uBgRect,uHillRect,uSubjectRect;
uniform float uBurst,uProgress,uQuality;

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float hash2(vec2 p){return fract(sin(dot(p,vec2(269.5,183.3)))*43758.5453);}

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

// Apply mosaic cell warping — pixelated fragments that travel outward
vec2 mosaicWarp(vec2 uv, vec2 direction, float radius, float effect, float progress){
 float cellSize=mix(2.,8.,effect);
 vec2 grid=floor(uv*uSize/cellSize);
 float seed=hash(grid);
 float envelope=1.-smoothstep(.08,1.0,radius);
 float fragmentTravel=pow(seed,4.)*effect*.085*envelope;
 float waveRadius=mix(.02,1.15,clamp((progress-.35)/.36,0.,1.));
 float wave=exp(-pow((radius-waveRadius)/.105,2.))*effect*.033;
 vec2 warped=uv-direction*(fragmentTravel+wave);
 vec2 pixelated=(floor(warped*uSize/cellSize)+.5)*cellSize/uSize;
 warped=mix(warped,pixelated,effect*.62*envelope);
 return warped;
}

// Particles — bright sparkles that drift outward from the focal center
float particles(vec2 uv, vec2 center, float effect, float progress){
 float sparkle=0.;
 for(float i=0.;i<80.;i++){
   vec2 seed=vec2(i*13.72,i*7.31);
   vec2 pos=vec2(hash(seed),hash2(seed));
   vec2 drift=(pos-center)*effect*(.3+hash(seed+1.)*.5)*progress;
   pos+=drift;
   pos=fract(pos);
   float d=length((uv-pos)*vec2(uSize.x/uSize.y,1.));
   float size=(.0008+hash(seed+3.)*.0018)*effect;
   float brightness=smoothstep(size,size*.2,d);
   float flicker=.5+.5*sin(i*4.37+progress*6.28);
   brightness*=flicker*effect;
   float dist=length((pos-center)*vec2(uSize.x/uSize.y,1.));
   brightness*=smoothstep(1.2,.05,dist);
   sparkle+=brightness*(.6+hash(seed+5.)*.4);
 }
 return sparkle;
}

void main(){
 vec2 uv=vUv;
 vec2 aspect=vec2(uSize.x/uSize.y,1.);
 vec2 radial=(uv-uCenter)*aspect;
 float radius=length(radial);
 vec2 direction=normalize(radial+vec2(.00001))/aspect;
 float effect=uBurst;

 vec3 color=vec3(0.);
 if(effect>.001){
   // Step 1: Mosaic warp — pixelated cells that fragment outward
   vec2 warped=mosaicWarp(uv,direction,radius,effect,uProgress);

   // Step 2: Radial motion blur on top of the mosaic — multi-tap along radial direction
   float blurStrength=effect*.028;
   float envelope=1.-smoothstep(.05,.95,radius);
   float strength=blurStrength*envelope;

   if(uQuality>.5){
     // 8-tap radial blur over the mosaic-warped coordinates
     const int SAMPLES=8;
     float totalWeight=0.;
     for(int i=0;i<SAMPLES;i++){
       float t=float(i)/float(SAMPLES-1)-.5;
       float weight=1.-abs(t)*1.4;
       weight=max(weight,.1);
       vec2 offset=direction*t*strength*2.;
       // Each tap gets its own mosaic warp for streaked mosaic fragments
       vec2 tapUv=mosaicWarp(uv+offset,direction,radius,effect,uProgress);
       color+=compose(tapUv)*weight;
       totalWeight+=weight;
     }
     color/=totalWeight;
   } else {
     // Low quality: simple 3-tap radial streak over mosaic
     vec2 streak=direction*strength;
     color=compose(warped)*.54+compose(mosaicWarp(uv+streak,direction,radius,effect,uProgress))*.23
           +compose(mosaicWarp(uv-streak,direction,radius,effect,uProgress))*.23;
   }

   // Chromatic aberration — radial channel split
   float caStrength=effect*.0025;
   color.r=mix(color.r,compose(mosaicWarp(uv+direction*caStrength,direction,radius,effect,uProgress)).r,effect*.45);
   color.b=mix(color.b,compose(mosaicWarp(uv-direction*caStrength,direction,radius,effect,uProgress)).b,effect*.45);
 } else {
   color=compose(uv);
 }

 // Particle overlay
 if(effect>.01){
   float p=particles(uv,uCenter,effect,uProgress);
   vec3 particleColor=vec3(1.,.92,.78);
   color+=particleColor*p*.7;
 }

 // Film grain
 float grain=(hash(floor(vUv*uSize))-.5)*.012*effect;
 gl_FragColor=vec4(color+grain,1.);
}`;

export class SceneRenderer {
  constructor(canvas, images, onLost) {
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'low-power', preserveDrawingBuffer: false });
    if (!this.gl) throw new Error('WebGL unavailable');
    const gl = this.gl;
    this.onContextLost = e => { e.preventDefault(); onLost(); };
    canvas.addEventListener('webglcontextlost', this.onContextLost);
    const shader = (type, source) => {
      const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);
      if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){const msg=gl.getShaderInfoLog(s);gl.deleteShader(s);throw new Error(msg);}
      return s;
    };
    const vs=shader(gl.VERTEX_SHADER,vertex),fs=shader(gl.FRAGMENT_SHADER,fragment);
    this.program=gl.createProgram();gl.attachShader(this.program,vs);gl.attachShader(this.program,fs);gl.linkProgram(this.program);gl.deleteShader(vs);gl.deleteShader(fs);
    if(!gl.getProgramParameter(this.program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(this.program));
    gl.useProgram(this.program);
    this.buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
    const a=gl.getAttribLocation(this.program,'aPosition');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
    this.uniforms=Object.fromEntries(['uSize','uCenter','uBgRect','uHillRect','uSubjectRect','uBurst','uProgress','uQuality'].map(n=>[n,gl.getUniformLocation(this.program,n)]));
    this.textures=images.map((image,i)=>{
      const tex=gl.createTexture();gl.activeTexture(gl.TEXTURE0+i);gl.bindTexture(gl.TEXTURE_2D,tex);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);
      gl.uniform1i(gl.getUniformLocation(this.program,['uBackground','uHill','uSubject'][i]),i);return tex;
    });
    this.quality=1;this.pixelRatio=1;
  }
  resize(w,h,dpr){this.width=w;this.height=h;this.pixelRatio=dpr;this.canvas.width=Math.round(w*dpr);this.canvas.height=Math.round(h*dpr);this.gl.viewport(0,0,this.canvas.width,this.canvas.height);}
  render(state){
    const g=this.gl,u=this.uniforms;g.useProgram(this.program);g.uniform2f(u.uSize,this.width,this.height);g.uniform2fv(u.uCenter,state.center);
    for(const [key,rect] of [['uBgRect',state.background],['uHillRect',state.hill],['uSubjectRect',state.subject]])g.uniform4f(u[key],rect.x,rect.y,rect.w,rect.h);
    g.uniform1f(u.uBurst,state.burst);g.uniform1f(u.uProgress,state.p);g.uniform1f(u.uQuality,this.quality);g.drawArrays(g.TRIANGLES,0,6);
  }
  dispose(){const g=this.gl;this.canvas.removeEventListener('webglcontextlost',this.onContextLost);this.textures?.forEach(t=>g.deleteTexture(t));if(this.buffer)g.deleteBuffer(this.buffer);if(this.program)g.deleteProgram(this.program);}
}
