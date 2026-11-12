const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const ts=require(process.cwd()+'/node_modules/typescript');
const source=ts.transpileModule(fs.readFileSync('app/ExitModal.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText;
function setup({stored=false,touch=false,blocked=false,path='/'}={}){
 const effects=[],events={},state=[],timers=[],storage={};let clock=0;
 const win={scrollY:0,matchMedia:()=>({matches:touch}),addEventListener:(k,f)=>events[k]=f,removeEventListener:k=>delete events[k],setTimeout:f=>(timers.push(f),1),clearTimeout:()=>{}};
 const doc={visibilityState:'visible',activeElement:{closest:()=>blocked},addEventListener:(k,f)=>events[k]=f,removeEventListener:k=>delete events[k]};
 const module={exports:{}};
 vm.runInNewContext(source,{exports:module.exports,module,require:n=>n==='react'?{useEffect:f=>effects.push(f),useRef:()=>({current:null}),useState:()=>[false,v=>state.push(v)]}:n==='next/navigation'?{usePathname:()=>path}:{jsx:()=>null,jsxs:()=>null},window:win,document:doc,performance:{now:()=>clock},sessionStorage:{getItem:()=>stored,setItem:(k,v)=>storage[k]=v}});
 module.exports.default();const clean=effects.map(f=>f());
 return {events,state,timers,storage,win,tick:v=>clock=v,clean};
}
let s=setup();s.events.mouseout({relatedTarget:{},clientY:0});assert.equal(s.state.length,0);s.events.mouseout({relatedTarget:null,clientY:0});s.events.mouseout({relatedTarget:null,clientY:0});assert.deepEqual(s.state,[true]);assert.equal(s.storage.exitModalShown,'1');
s=setup();s.timers[0]();s.events.mouseout({relatedTarget:null,clientY:0});assert.equal(s.state.length,0);
assert.equal(setup({stored:true}).events.mouseout,undefined);assert.equal(setup({path:'/adatkezeles'}).events.mouseout,undefined);
s=setup({blocked:true});s.events.mouseout({relatedTarget:null,clientY:0});assert.equal(s.state.length,0);
s=setup({touch:true});s.win.scrollY=500;s.tick(100);s.events.scroll();s.win.scrollY=80;s.tick(200);s.events.scroll();assert.deepEqual(s.state,[true]);
s=setup();s.clean.forEach(f=>f?.());assert.equal(Object.keys(s.events).length,0);
console.log('Exit modal: egyszeriség, 15 mp korlát, útvonal, aktív bevitel, mobil visszagörgetés és cleanup OK.');
