import json, os, sys
D=sys.argv[1]; os.chdir(D)
TL=json.load(open('timeline.json')); L={l['id']:l for l in TL['lines']}; total=TL['total']
B=json.loads(sys.argv[2])  # [[name, first_line_id_or_0, style]]
G=["upbeat modern electronic","118 BPM","bright plucky synths","punchy clean drums","playful confident gaming vibe","premium commercial explainer music","instrumental","leaves space for a voiceover"]
NEG=["vocals","singing","lyrics","rap","sad","dark","horror","lo-fi","ambient drone"]
starts=[0.0 if b[1]==0 else max(0.0,L[b[1]]['start']-0.9) for b in B]+[total]
sec=[]
for i,b in enumerate(B):
    d=int(round((starts[i+1]-starts[i])*1000))
    sec.append({"section_name":b[0],"positive_local_styles":b[2],"negative_local_styles":["slow","sad"],"duration_ms":max(3000,d),"lines":[]})
diff=int(round(total*1000))-sum(s['duration_ms'] for s in sec); sec[-1]['duration_ms']+=diff
json.dump({"composition_plan":{"positive_global_styles":G,"negative_global_styles":NEG,"sections":sec},"respect_sections_durations":True},open('music.json','w'),ensure_ascii=False,indent=1)
print(D, total, [(s['section_name'],s['duration_ms']) for s in sec])
