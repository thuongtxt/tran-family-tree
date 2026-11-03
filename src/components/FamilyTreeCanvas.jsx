import React,{useMemo,useEffect} from 'react';
import {ReactFlow,Background,Controls,MiniMap,useReactFlow} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import MemberCard from './MemberCard';
const nodeTypes={member:MemberCard};
function Focus({focusId,nodes}) {
 const {setCenter,fitView}=useReactFlow();
 useEffect(()=>{if(focusId){const n=nodes.find(x=>x.id===focusId);if(n)setCenter(n.position.x+105,n.position.y+70,{zoom:1.1,duration:500});}else fitView({padding:.15,duration:350});},[focusId,nodes,setCenter,fitView]);
 return null;
}
export default function FamilyTreeCanvas({members,onSelect,focusId,collapsed=[]}) {
 const {nodes,edges}=useMemo(()=>{
  const hidden=new Set();
  const visit=(id,seen=new Set())=>{if(seen.has(id))return;seen.add(id);members.filter(m=>m.parentId===id).forEach(c=>{hidden.add(c.id);visit(c.id,seen);if(c.spouseId)hidden.add(c.spouseId);});};
  collapsed.forEach(id=>visit(id));
  const visible=members.filter(m=>!hidden.has(m.id));
  const groups={};visible.forEach(m=>(groups[m.generation]??=[]).push(m));
  const nodes=[];
  Object.keys(groups).sort((a,b)=>+a-+b).forEach(g=>{groups[g].sort((a,b)=>(a.orderInFamily||0)-(b.orderInFamily||0));groups[g].forEach((m,i)=>nodes.push({id:m.id,type:'member',position:{x:i*255-(groups[g].length-1)*127.5,y:(+g-1)*225},data:{member:m}}));});
  const ids=new Set(visible.map(m=>m.id));
  const edges=[];
  visible.forEach(m=>{if(m.parentId&&ids.has(m.parentId))edges.push({id:'p'+m.id,source:m.parentId,target:m.id,type:'smoothstep',style:{stroke:'#a68a60',strokeWidth:2}});if(m.spouseId&&m.id<m.spouseId&&ids.has(m.spouseId))edges.push({id:'s'+m.id,source:m.id,target:m.spouseId,type:'straight',style:{stroke:'#cf8d9d',strokeDasharray:'5 5',strokeWidth:2}});});
  return {nodes,edges};
 },[members,collapsed]);
 return <div className="h-[65vh] min-h-[450px] overflow-hidden rounded-2xl border border-stone-200 bg-[#fbfaf7]"><ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} onNodeClick={(_,n)=>onSelect(n.id)} fitView minZoom={.12} maxZoom={2}><Background color="#e5e0d6" gap={22}/><Controls/><MiniMap pannable zoomable/><Focus focusId={focusId} nodes={nodes}/></ReactFlow></div>;
}
