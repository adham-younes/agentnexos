from pathlib import Path
from html.parser import HTMLParser
import json,re,hashlib,subprocess,base64,html
from PIL import Image
r=Path(__file__).resolve().parents[1];d=json.load(open(r/'prototype/src/content.json'))
class Parse(HTMLParser):
 def __init__(self):super().__init__();self.text=[];self.links=[];self.sections=[]
 def handle_data(self,data):self.text.append(data)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='a' and 'href' in a:self.links.append(a['href'])
  if 'data-section-id' in a:self.sections.append(a['data-section-id'])
def norm(x):return re.sub(r'\s+',' ',x).strip()
known={p['slug'] for p in d['pages']};results=[];failures=[];count=0
for l in d['locales']:
 for p in d['pages']:
  f=r/'verification/rendered-html'/f"{l}-{p['id'].replace('/','-')}.html";parser=Parse();parser.feed(f.read_text());text=norm(' '.join(parser.text));missing=[]
  strings=[('title',p['title'][l]),('hero',p['hero'][l])]
  for s in p['sections']:
   strings.append((s['id']+'.heading',s['heading'][l]))
   for k in ['paragraphs','items']:
    for i,v in enumerate(s[k]):strings.append((s['id']+'.'+k+'.'+str(i),v[l]))
   for i,v in enumerate(s['links']):strings.append((s['id']+'.links.'+str(i),v['label'][l]))
  for i,v in enumerate(p.get('faq',[])):strings.extend([(f'faq.{i}.question',v['question'][l]),(f'faq.{i}.answer',v['answer'][l])])
  if 'sample_output' in p:
   o=p['sample_output'];strings.extend([('sample.heading',o['heading'][l]),('sample.note',o['note'][l])])
   for i,v in enumerate(o['rows']):strings.extend([(f'sample.{i}.label',v['label'][l]),(f'sample.{i}.value',v['value'][l])])
  for i,v in enumerate(p.get('form',[])):strings.extend([(f'form.{i}.label',v['label'][l]),(f'form.{i}.help',v['help'][l])])
  for i,v in enumerate(p.get('prompts',[])):strings.append((f'prompts.{i}.label',v['label'][l]))
  for key,v in strings:
   count+=1
   if norm(v) not in text:missing.append(key)
  broken=[]
  for a in parser.links:
   if a.startswith('#/') and '/'.join(a[2:].split('/')[1:]) not in known:broken.append(a)
  sections=p['sections'] if p['id']!='start' else []
  order=[s['id'] for s in sections]
  if order!=parser.sections:missing.append('section_order')
  if missing or broken:failures.append({'route':p['slug'],'locale':l,'missing':missing,'broken':broken})
  results.append({'route':p['slug'],'locale':l,'checked_texts':len(strings),'missing':missing,'broken_links':broken,'status':'PASS' if not missing and not broken else 'FAIL'})
# Current palette measurements, opaque foreground/background only.
def lum(h):
 rgb=[int(h[i:i+2],16)/255 for i in (1,3,5)];v=[x/12.92 if x<=.04045 else((x+.055)/1.055)**2.4 for x in rgb];return .2126*v[0]+.7152*v[1]+.0722*v[2]
def contrast(a,b):x,y=sorted([lum(a),lum(b)]);return round((y+.05)/(x+.05),2)
pairs=[('body','#ebebeb','#050505',4.5),('muted','#a5b2ac','#0b100e',4.5),('cta','#050505','#10b981',4.5),('cta_hover','#050505','#34d399',4.5),('error','#fca5a5','#1e1111',4.5),('control_border','#66796d','#0b100e',3),('focus','#10b981','#050505',3)]
colors=[{'role':name,'foreground':a,'background':b,'ratio':contrast(a,b),'required':minimum,'status':'PASS' if contrast(a,b)>=minimum else 'FAIL'} for name,a,b,minimum in pairs]
for c in colors:
 if c['status']=='FAIL':failures.append(c)
media=[]
for f in sorted((r/'assets').glob('*.webp')):
 im=Image.open(f);im.verify();media.append({'file':f.name,'bytes':f.stat().st_size,'format':'WEBP'})
video=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration,size','-show_entries','stream=width,height,codec_type','-of','json',str(r/'assets/neural-film.mp4')]))
assert all(s['codec_type']!='audio' for s in video['streams'])
assert int(video['format']['size'])<=1200000
prototype=(r/'prototype/src/content.json').read_bytes(); source=r.parent/'content/site_content.json'; original=source.read_bytes() if source.exists() else prototype; assert original==prototype
report={'status':'PASS' if not failures else 'FAIL','render_type':'React server render, not browser rendering','route_locale_combinations':len(results),'text_comparisons':count,'content_source_sha256':hashlib.sha256(original).hexdigest(),'all_content_identical':original==prototype,'routes':results,'contrast_pairs':colors,'images':media,'video':video,'failures':failures,'browser_visual_qa':'NOT_RUN: cloud browser local file protocol is blocked','model_evaluations':'NOT_RUN','production_deployment':'NOT_CHANGED'}
(r/'verification/content-and-assets-check.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps({k:report[k] for k in ['status','route_locale_combinations','text_comparisons','failures','contrast_pairs']},ensure_ascii=False))
# Self-contained local document for convenient review. Media plays from adjacent assets folder.
dist=r/'prototype/dist';js=(dist/'app.js').read_text();css=(dist/'styles.css').read_text()
for name in ['neural-hero.webp','neural-film-poster.webp']:
 uri='data:image/webp;base64,'+base64.b64encode((r/'assets'/name).read_bytes()).decode();js=js.replace('assets/'+name,uri)
review='<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Agentnexos | Experience reference</title><style>'+css+'</style></head><body><div id="root"></div><script>'+js.replace('</script','<\\/script')+'</script></body></html>'
(r/'Agentnexos_Experience_Review.html').write_text(review)
assert not failures,failures
