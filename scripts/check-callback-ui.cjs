// Simulated callbacks, no live provider requests.
const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm'),ts=require('typescript');
const source=ts.transpileModule(fs.readFileSync('app/LeadForm.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText;
const slots=[];let index=0,calls=0,reset=0,resolve;
const jsx=(type,props)=>({type,props});const mod={exports:{}};
let mode='pending';
vm.runInNewContext(source,{exports:mod.exports,module:mod,require:n=>n==='react'?{
 useState:v=>{const i=index++;if(!(i in slots))slots[i]=v;return[slots[i],v=>slots[i]=v]},
 useRef:v=>{const i=index++;if(!(i in slots))slots[i]={current:v};return slots[i]}
}:{jsx,jsxs:jsx},FormData:class { *[Symbol.iterator](){yield ['name','Kiss Péter'];yield ['phone','06301234567'];yield ['location','Debrecen'];yield ['consent','yes'];}},
fetch:async(url,options)=>{calls++;assert.equal(url,'/api/interest');assert.equal(JSON.parse(options.body).consent,'yes');if(mode==='pending')return new Promise(r=>resolve=r);return {ok:true,json:async()=>({ok:true})};},AbortSignal,Error,window:{requestAnimationFrame:f=>f()}});
function render(){index=0;const out=[];function walk(n){if(!n||typeof n!=='object')return;if(Array.isArray(n))return n.forEach(walk);out.push(n);walk(n.props?.children);}walk(mod.exports.default());return out;}
(async()=>{
 let all=render();const phone=all.find(n=>n.type==='input'&&n.props.name==='phone');assert.equal(phone.props.inputMode,'tel');assert.equal(phone.props.type,'tel');assert.equal(all.find(n=>n.type==='form').props.className,'lead-form');
 const event={preventDefault(){},currentTarget:{reset(){reset++}}};const submit=all.find(n=>n.type==='form').props.onSubmit;
 const pending=submit(event);await submit(event);assert.equal(calls,1);assert(render().find(n=>n.type==='button').props.disabled);
 resolve({ok:false,json:async()=>({error:'Hibás adat'})});await pending;all=render();assert(all.some(n=>n.props?.role==='alert'));assert.equal(reset,0);assert(!all.some(n=>n.props?.role==='status'));
 mode='success';await all.find(n=>n.type==='form').props.onSubmit(event);all=render();assert(all.some(n=>n.props?.role==='status'&&n.props.tabIndex===-1));assert(all.some(n=>n.type==='a'&&n.props.href==='#letoltes'));assert.equal(reset,1);assert(!all.some(n=>n.type==='input'||n.type==='button'));
 console.log('Callback UI: double-submit lock, error preservation, success focus target and guide link OK.');
})().catch(e=>{console.error(e);process.exitCode=1;});
