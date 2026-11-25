const fs=require('fs'),vm=require('vm');const src=fs.readFileSync(process.argv[2]+'/data.js','utf8');
const ctx={window:{}};vm.createContext(ctx);
vm.runInContext(src+`;this.__D={kf:[],hl:DATA.HL.map(h=>({a:h.a})),cur:[].concat(...DATA.HL.map(h=>(h.press||[]).map(t=>({t})))),badges:[],sections:DATA.sections,
 sfx:(DATA.sfx||[]).concat(DATA.shots.filter(s=>typeof s.t==='string'&&s.t!=='k2-0.3').map(s=>[s.t,'whoosh',-15])),endA:DATA.endA}`,ctx);
fs.writeFileSync(process.argv[2]+'/data_dump.json',JSON.stringify(ctx.__D));console.log('hl',ctx.__D.hl.length,'cur',ctx.__D.cur.length,'sfx',ctx.__D.sfx.length);
