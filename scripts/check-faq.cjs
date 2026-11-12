const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const ts=require(process.cwd()+'/node_modules/typescript');let open=0;
const src=ts.transpileModule(fs.readFileSync('app/FaqSection.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText;
const m={exports:{}};const jsx=(type,props)=>({type,props});
vm.runInNewContext(src,{exports:m.exports,module:m,require:n=>n==='react'?{useId:()=> 'faq-test',useState:()=>[open,f=>open=typeof f==='function'?f(open):f]}:{jsx,jsxs:jsx}});
function nodes(root){const result=[];function visit(n){if(!n||typeof n!=='object')return;if(Array.isArray(n)){n.forEach(visit);return;}result.push(n);visit(n.props?.children);}visit(root);return result;}
let all=nodes(m.exports.default());let buttons=all.filter(n=>n.type==='button');assert.equal(buttons.length,6);assert.equal(buttons.filter(n=>n.props['aria-expanded']).length,1);
buttons[1].props.onClick();all=nodes(m.exports.default());buttons=all.filter(n=>n.type==='button');assert.equal(buttons[0].props['aria-expanded'],false);assert.equal(buttons[1].props['aria-expanded'],true);
buttons[1].props.onClick();all=nodes(m.exports.default());assert.equal(all.filter(n=>n.type==='button'&&n.props['aria-expanded']).length,0);
const json=JSON.parse(all.find(n=>n.type==='script').props.dangerouslySetInnerHTML.__html);assert.equal(json.mainEntity.length,6);
for(const q of json.mainEntity){assert(all.some(n=>n.type==='span'&&n.props.children===q.name));assert(all.some(n=>n.type==='p'&&n.props.children===q.acceptedAnswer.text));}
for(const b of all.filter(n=>n.type==='button')){assert(all.some(n=>n.props?.id===b.props['aria-controls']));assert.equal(b.props.type,'button');}
console.log('GYIK: váltás/bezárás, ARIA-kapcsolatok, 6 látható tartalommal egyező JSON-LD kérdés rendben.');
