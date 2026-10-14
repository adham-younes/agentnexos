import { useId } from "react";
import "./computational-graph.css";
const points=[[160,110],[360,110],[460,200],[260,200],[160,310],[360,310],[460,400],[260,400],[230,165],[335,165],[387,212],[283,212],[230,270],[335,270],[387,317],[283,317]];
const edges=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7],[8,9],[9,10],[10,11],[11,8],[12,13],[13,14],[14,15],[15,12],[8,12],[9,13],[10,14],[11,15],[0,8],[1,9],[2,10],[3,11],[4,12],[5,13],[6,14],[7,15]];
export function ComputationalGraph({label,animated=false}:{label:string;animated?:boolean}) {
 const id=useId().replace(/:/g,"");
 return <svg className={`ax-computational ${animated?"ax-computational-motion":""}`} viewBox="0 0 620 510" role="img" aria-labelledby={id}>
 <title id={id}>{label}</title>
 <g fill="none" stroke="#10b981" strokeWidth="1.2" opacity=".45">{edges.map(([a,b],i)=><path key={i} d={`M${points[a][0]} ${points[a][1]}L${points[b][0]} ${points[b][1]}`}/>)}</g>
 <g fill="#050505" stroke="#10b981">{points.map(([x,y],i)=><rect key={i} x={x-4} y={y-4} width="8" height="8" rx="1"/>)}</g>
 <g className="ax-computational-pulse" fill="none" stroke="#10b981" strokeWidth="2.2" strokeDasharray="5 34">{[0,4,12,16,24,28].map(i=>{const [a,b]=edges[i];return <path key={i} d={`M${points[a][0]} ${points[a][1]}L${points[b][0]} ${points[b][1]}`}/>;})}</g>
 <path fill="#10b981" fillOpacity=".035" stroke="#10b981" strokeOpacity=".25" d="M180 240L420 140L420 350L180 450Z"/>
 </svg>;
}
