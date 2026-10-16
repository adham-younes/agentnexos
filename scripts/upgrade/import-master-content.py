"""Extract section 16 verbatim; never publish execution/publication instructions."""
from pathlib import Path
import re,json
root=Path(__file__).resolve().parents[2]
s=(root/'docs/upgrade/AGYNEXA-CODEX-MASTER-UPGRADE-PLAN-AR-EN.md').read_text()
def fields(text):
 result=[]
 for p in re.split(r'\n\s*\n',text.strip()):
  p=p.strip()
  if not p:continue
  matches=list(re.finditer(r'^([^\n:]{1,70}):(?:[ \n]|$)',p,re.M))
  if matches:
   for i,m in enumerate(matches):result.append({'heading':m[1].strip(),'body':p[m.end():matches[i+1].start() if i+1<len(matches) else len(p)].strip()})
  elif p.endswith(('؟','?')):result.append({'heading':p,'body':''})
  elif result:result[-1]['body']+='\n\n'+p
 return result
a={'ar':{},'en':{}}
for m in re.finditer(r'^### 16\.(\d+) ([^\n]+)\n(.*?)(?=^### |^## |\Z)',s,re.M|re.S):
 n=int(m[1])
 if n<2:continue
 path=re.search(r'/(\S+)',m[2]);key=path[1] if path else 'home';key='home' if 'locale' in key else key
 text=m[3]
 if key=='home':
  groups={'ar':[],'en':[]};tags=list(re.finditer(r'^\*\*(AR|EN): ([^\n]+)\*\*',text,re.M))
  for i,t in enumerate(tags):
   body=text[t.end():tags[i+1].start() if i+1<len(tags) else text.index('**FAQ')]
   groups[t[1].lower()].append({'name':t[2],'fields':fields(body)})
  for loc in a:
   faqtext=text.split('AR:' if loc=='ar' else 'EN:')[-1]
   if loc=='ar':faqtext=faqtext.split('\nEN:')[0]
   qa=list(re.finditer(r'^(?:س|Q): (.*?)\s*\n(?:ج|A): (.*?)(?=\n\s*\n|\Z)',faqtext,re.M|re.S))
   a[loc][key]={'groups':groups[loc],'faq':[{'question':x[1].strip(),'answer':x[2].strip()} for x in qa]}
  continue
 for loc in a:
  mark='**'+loc.upper()+'**'
  body=text.split(mark,1)[1] if mark in text else ''
  body=re.split(r'^\*\*|^(?:شرط|إجراء التنفيذ|لا تضف|لا شارة)',body,1,flags=re.M)[0]
  fs=fields(body);title=next((x['body'] for x in fs if x['heading'] in ['العنوان','Title']),'');intro=next((x['body'] for x in fs if x['heading'] in ['المقدمة','Introduction','الوصف','Description']),'')
  a[loc][key]={'title':title,'intro':intro,'sections':[x for x in fs if x['heading'] not in ['العنوان','Title','المقدمة','Introduction','الوصف','Description']]}
# Exact metadata tables from section 19.1.
meta=s.split('### 19.1 ',1)[1].split('### 19.2 ',1)[0]
mode='seoTitle'
for row in meta.splitlines():
 if 'AR description' in row or 'AR Description' in row:mode='seoDescription'
 cols=[x.strip() for x in row.strip('|').split('|')]
 if len(cols)!=3 or not cols[0].startswith('/'):continue
 route=cols[0].strip('`').lstrip('/');route='home' if not route or 'locale' in route else route
 for i,loc in enumerate(['ar','en']):
  a[loc].setdefault(route,{})[mode]=cols[i+1]
(root/'lib/content/master-upgrade.json').write_text(json.dumps(a,ensure_ascii=False,indent=2)+'\n')
print('Imported',len(a['en']),'bilingual page definitions')
