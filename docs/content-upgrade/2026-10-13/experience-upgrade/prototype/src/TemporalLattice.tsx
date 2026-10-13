import { useEffect, useRef, useState } from 'react';
const vertices = Array.from({length:16},(_,n)=>[0,1,2,3].map(i=> n&(1<<i) ? 1 : -1));
const edges = vertices.flatMap((_,i)=>[0,1,2,3].map(k=>[i,i^(1<<k)]).filter(([a,b])=>a<b));
export function projectLattice(t:number){
 return vertices.map(([x,y,z,w])=>{
  const a=t*.12,b=t*.08;
  const xx=x*Math.cos(a)-w*Math.sin(a),ww=x*Math.sin(a)+w*Math.cos(a);
  const yy=y*Math.cos(b)-z*Math.sin(b),zz=y*Math.sin(b)+z*Math.cos(b);
  const k=2.8/(3.8-ww),xx3=xx*k,yy3=yy*k,zz3=zz*k;
  const v=4/(5-zz3);return [220+xx3*v*94,170+yy3*v*94];
 });
}
/** Decorative true 4D projection. No metrics, reasoning or operational status. */
export function TemporalLattice(){
 const root=useRef<SVGSVGElement>(null);const [points,setPoints]=useState(()=>projectLattice(3));
 useEffect(()=>{
  const el=root.current;if(!el)return;let frame=0,visible=false,last=0;
  const motion=matchMedia('(prefers-reduced-motion: reduce)');const narrow=matchMedia('(max-width: 767px)');
  const step=(now:number)=>{if(visible&&!motion.matches&&!narrow.matches&&!document.hidden&&now-last>40){setPoints(projectLattice(now/1000));last=now;}frame=requestAnimationFrame(step);};
  const sync=()=>{cancelAnimationFrame(frame);if(visible&&!motion.matches&&!narrow.matches&&!document.hidden)frame=requestAnimationFrame(step);};
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();});observer.observe(el);
  motion.addEventListener('change',sync);narrow.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);
  return()=>{observer.disconnect();cancelAnimationFrame(frame);motion.removeEventListener('change',sync);narrow.removeEventListener('change',sync);document.removeEventListener('visibilitychange',sync);};
 },[]);
 return <svg ref={root} viewBox="0 0 440 340" aria-hidden="true" className="temporal-lattice"><defs><radialGradient id="lattice-halo"><stop stopColor="#10b981" stopOpacity=".12"/><stop offset="1" stopColor="#050505" stopOpacity="0"/></radialGradient></defs><circle cx="220" cy="170" r="160" fill="url(#lattice-halo)"/>{edges.map(([a,b])=><line key={`${a}-${b}`} x1={points[a][0]} y1={points[a][1]} x2={points[b][0]} y2={points[b][1]} stroke="#10b981" strokeOpacity=".6" strokeWidth="1"/>)}{points.map(([x,y],i)=><circle key={i} cx={x} cy={y} r={i%3===0?4:2} fill={i%3===0?'#b8f4dc':'#10b981'}/>)}</svg>;
}
