import{c as o}from"./index-Dg4opzhY.js";import{F as u}from"./mock-N-4NoNjK.js";/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=o("CircleCheckBig",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=o("CircleX",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]]);function i(e=300){return new Promise(t=>setTimeout(t,e))}let s=[...u];async function w(e){return await i(),s.filter(t=>t.studentId===e).sort((t,n)=>new Date(n.submittedAt).getTime()-new Date(t.submittedAt).getTime())}async function f(e){return await i(),s.filter(t=>e.includes(t.classId)).sort((t,n)=>new Date(n.submittedAt).getTime()-new Date(t.submittedAt).getTime())}async function y(){return await i(),s.filter(e=>e.status==="pending_principal").sort((e,t)=>new Date(t.submittedAt).getTime()-new Date(e.submittedAt).getTime())}async function g(e){await i();const t=new Date(e.startDate),n=new Date(e.endDate),r=Math.max(1,Math.round((n.getTime()-t.getTime())/(1e3*60*60*24))+1),a={...e,daysCount:r,status:"pending_teacher",submittedAt:new Date().toISOString(),id:`lv-${Date.now()}`};return s.unshift(a),a}async function v(e,t,n,r){await i();const a=s.find(c=>c.id===e);if(!a)throw new Error("Leave not found");a.teacherApproval={approved:n,by:t,at:new Date().toISOString(),remark:r},n?a.daysCount>7?a.status="pending_principal":a.status="approved":a.status="rejected"}async function h(e,t,n,r){await i();const a=s.find(c=>c.id===e);if(!a)throw new Error("Leave not found");a.principalApproval={approved:n,by:t,at:new Date().toISOString(),remark:r},a.status=n?"approved":"rejected"}export{m as C,p as a,f as b,v as c,y as d,h as e,w as g,g as s};
