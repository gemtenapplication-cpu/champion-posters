const fs=require('fs'),vm=require('vm');const src=fs.readFileSync(process.argv[2]+'/data.js','utf8');
const ctx={};vm.createContext(ctx);vm.runInContext(src+';this.__D={kf:DATA.kf,hl:DATA.hl,cur:DATA.cur,badges:DATA.badges,sections:DATA.sections,sfx:DATA.sfx||[],endA:DATA.endA||null}',ctx);
fs.writeFileSync(process.argv[2]+'/data_dump.json',JSON.stringify(ctx.__D));
