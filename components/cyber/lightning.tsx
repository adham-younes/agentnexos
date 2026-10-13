"use client";
import { useEffect, useRef } from "react";

const vertex = `attribute vec2 position; void main(){gl_Position=vec4(position,0.,1.);}`;
// Procedural emerald discharge, adapted to the selected Cyber Serif reference.
const fragment = `precision mediump float;
uniform vec2 resolution; uniform float time;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<6;i++){v+=a*noise(p);p=mat2(.9,-.435,.435,.9)*p*2.;a*=.5;}return v;}
void main(){vec2 uv=gl_FragCoord.xy/resolution;uv=uv*2.-1.;uv.x*=resolution.x/resolution.y;uv.x+=.05;uv+=2.*fbm(uv*1.5+time*.14)-1.;float d=abs(uv.x);float glow=.018/max(d,.005);vec3 color=vec3(.045,.54,.32)*glow;float fade=smoothstep(0.,.2,gl_FragCoord.y/resolution.y);gl_FragColor=vec4(pow(color,vec3(1.1))*fade,1.);}`;

export function Lightning() {
 const canvas = useRef<HTMLCanvasElement>(null);
 useEffect(() => {
  const element=canvas.current;if(!element)return;
  const reduced=matchMedia("(prefers-reduced-motion: reduce)"),small=matchMedia("(max-width: 600px)");
  let dispose=()=>{};
  function configure(){
   dispose();element!.style.opacity="0";
   if(reduced.matches||small.matches)return;
   const gl=element!.getContext("webgl",{alpha:false,antialias:false,powerPreference:"low-power"});if(!gl)return;
   const shaders:WebGLShader[]=[];
   function compile(source:string,type:number){const shader=gl!.createShader(type);if(!shader)return null;shaders.push(shader);gl!.shaderSource(shader,source);gl!.compileShader(shader);return gl!.getShaderParameter(shader,gl!.COMPILE_STATUS)?shader:null;}
   const vs=compile(vertex,gl.VERTEX_SHADER),fs=compile(fragment,gl.FRAGMENT_SHADER),program=gl.createProgram();
   if(!vs||!fs||!program){shaders.forEach(s=>gl.deleteShader(s));return;}
   gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
   if(!gl.getProgramParameter(program,gl.LINK_STATUS)){gl.deleteProgram(program);shaders.forEach(s=>gl.deleteShader(s));return;}
   gl.useProgram(program);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const pos=gl.getAttribLocation(program,"position");gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
   const resolution=gl.getUniformLocation(program,"resolution"),time=gl.getUniformLocation(program,"time");let frame=0,last=-100,inView=true;const start=performance.now();
   function resize(){const r=element!.getBoundingClientRect();element!.width=Math.max(1,Math.round(r.width));element!.height=Math.max(1,Math.round(r.height));gl!.viewport(0,0,element!.width,element!.height);}
   const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(element!);resize();
   function draw(now:number){if(!inView||document.hidden||gl!.isContextLost())return;if(now-last>=33){gl!.uniform2f(resolution,element!.width,element!.height);gl!.uniform1f(time,(now-start)/1000);gl!.drawArrays(gl!.TRIANGLES,0,6);element!.style.opacity="1";last=now;}frame=requestAnimationFrame(draw);}
   function schedule(){cancelAnimationFrame(frame);if(inView&&!document.hidden)frame=requestAnimationFrame(draw);}
   const observer=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;schedule();});observer.observe(element!);document.addEventListener("visibilitychange",schedule);schedule();
   dispose=()=>{cancelAnimationFrame(frame);observer.disconnect();resizeObserver.disconnect();document.removeEventListener("visibilitychange",schedule);gl.deleteBuffer(buffer);gl.deleteProgram(program);shaders.forEach(s=>gl.deleteShader(s));};
  }
  configure();reduced.addEventListener("change",configure);small.addEventListener("change",configure);
  return()=>{dispose();reduced.removeEventListener("change",configure);small.removeEventListener("change",configure);};
 },[]);
 return <div className="nexus-lightning" aria-hidden="true"><svg viewBox="0 0 500 1000" preserveAspectRatio="none"><path className="nexus-discharge-glow" d="M310 0 270 95 292 140 234 230 249 280 197 368 220 413 176 510 194 555 155 645 174 720 140 795 153 850 125 930 140 1000"/><path d="M310 0 270 95 292 140 234 230 249 280 197 368 220 413 176 510 194 555 155 645 174 720 140 795 153 850 125 930 140 1000"/></svg><canvas ref={canvas}/></div>;
}
