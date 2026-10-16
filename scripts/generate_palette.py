import json
from coloraide import Color

STEPS = [50,100,200,300,400,500,600,700,800,900,950]
L = {50:0.975,100:0.945,200:0.89,300:0.82,400:0.72,500:0.63,600:0.545,700:0.475,800:0.39,900:0.30,950:0.215}
# chroma shape: peaks mid
def cshape(s, peak):
    f = {50:0.18,100:0.32,200:0.55,300:0.78,400:0.95,500:1.0,600:1.0,700:0.92,800:0.8,900:0.62,950:0.5}[s]
    return peak*f

FAM = {
  # name: (hue, peak chroma)
  'iris':   (279, 0.235),
  'ember':  (40, 0.19),
  'lagoon': (190, 0.13),
  'lime':   (125, 0.20),
  'green':  (155, 0.16),
  'amber':  (75, 0.17),
  'red':    (24, 0.21),
  'blue':   (250, 0.17),
  'rose':   (0, 0.19),
}
# neutral: cool ink with tiny violet tint
INK_L = {0:1.0,25:0.988,50:0.975,100:0.955,200:0.92,300:0.87,400:0.72,500:0.58,600:0.48,700:0.38,800:0.28,850:0.235,900:0.2,925:0.175,950:0.15,1000:0.12}

out = {}
for name,(h,c) in FAM.items():
    out[name] = {}
    for s in STEPS:
        col = Color('oklch', [L[s], cshape(s,c), h]).fit('srgb')
        out[name][str(s)] = col.convert('srgb').to_string(hex=True)
out['ink'] = {}
for s,l in INK_L.items():
    ch = 0.0 if s==0 else (0.006 if l>0.5 else 0.012)
    out['ink'][str(s)] = Color('oklch',[l,ch,285]).fit('srgb').convert('srgb').to_string(hex=True)

def cr(a,b): return Color(a).contrast(Color(b))
checks = {
 'iris600/white': cr(out['iris']['600'],'#fff'),
 'ember600/white': cr(out['ember']['600'],'#fff'),
 'lagoon600/white': cr(out['lagoon']['600'],'#fff'),
 'lagoon700/white': cr(out['lagoon']['700'],'#fff'),
 'iris400/ink950': cr(out['iris']['400'],out['ink']['950']),
 'ink500/white(text-tertiary)': cr(out['ink']['500'],'#fff'),
 'ink600/white': cr(out['ink']['600'],'#fff'),
 'ink400/ink950(dark tertiary)': cr(out['ink']['400'],out['ink']['950']),
 'ink300/ink950': cr(out['ink']['300'],out['ink']['950']),
 'red600/white': cr(out['red']['600'],'#fff'),
 'green700/white': cr(out['green']['700'],'#fff'),
 'amber700/white': cr(out['amber']['700'],'#fff'),
 'ember400/ink950': cr(out['ember']['400'],out['ink']['950']),
 'lagoon400/ink950': cr(out['lagoon']['400'],out['ink']['950']),
 'red400/ink950': cr(out['red']['400'],out['ink']['950']),
}
json.dump(out, open('palette.json','w'), indent=1)
print(json.dumps(out, indent=0)[:3000])
for k,v in checks.items(): print(k, round(v,2))
