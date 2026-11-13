// Simulated UI flow; no browser or remote submission.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const slots=[];let index=0,requests=0,pendingResolve;
const jsx=(type,props)=>({type,props});
const source=ts.transpileModule(fs.readFileSync('app/LeadMagnetSection.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText;
const mod={exports:{}};
let fetchMode='pending';
const fakeFetch=async()=>{
 requests++;
 if(fetchMode==='pending')return new Promise(resolve=>pendingResolve=resolve);
 if(fetchMode==='failed')return {ok:false,json:async()=>({error:'Próbáld újra később.'})};
 return {ok:true,json:async()=>({ok:true})};
};
vm.runInNewContext(source,{exports:mod.exports,module:mod,require:n=>n==='react'?{
 useState:initial=>{const i=index++;if(!(i in slots))slots[i]=initial;return [slots[i],v=>slots[i]=typeof v==='function'?v(slots[i]):v];},
 useRef:initial=>{const i=index++;if(!(i in slots))slots[i]={current:initial};return slots[i];},
}:{jsx,jsxs:jsx},fetch:fakeFetch,FormData:class {get(){return ''}},AbortSignal,Error,window:{requestAnimationFrame:f=>f()}});
function nodes(root){const out=[];function walk(n){if(!n||typeof n!=='object')return;if(Array.isArray(n))return n.forEach(walk);out.push(n);walk(n.props?.children);}walk(root);return out;}
function render(){index=0;return nodes(mod.exports.default());}
const event={preventDefault(){},currentTarget:{}};
(async()=>{
 let all=render();assert(!all.some(n=>n.type==='a'&&n.props.download));
 all.find(n=>n.type==='input'&&n.props.type==='email').props.onChange({target:{value:'teszt@example.com'}});
 all.find(n=>n.type==='input'&&n.props.type==='checkbox').props.onChange({target:{checked:true}});
 all=render();const submit=all.find(n=>n.type==='form').props.onSubmit;
 const first=submit(event);await submit(event);assert.equal(requests,1);
 assert(render().find(n=>n.type==='button').props.disabled);
 pendingResolve({ok:false,json:async()=>({error:'Próbáld újra később.'})});await first;
 all=render();assert(all.some(n=>n.props?.role==='alert'));assert(!all.some(n=>n.type==='a'&&n.props.download));
 assert.equal(all.find(n=>n.type==='input'&&n.props.type==='email').props.value,'teszt@example.com');
 fetchMode='success';await all.find(n=>n.type==='form').props.onSubmit(event);
 all=render();assert(all.some(n=>n.type==='a'&&n.props.download&&n.props.href==='/otthonod-piaca-5-hiba.pdf'));
 assert(!all.some(n=>n.type==='form'));
 assert(all.some(n=>n.type==='a'&&n.props.href==='#kapcsolat')); 
 console.log('PDF UI checks passed: pending lock, failure preserves input, download only after acknowledged success.');
})().catch(error=>{console.error(error);process.exitCode=1;});
