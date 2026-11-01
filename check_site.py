from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit,unquote
import collections

root=Path(__file__).parent/'public'
class Page(HTMLParser):
 def __init__(self,text):
  super().__init__();self.ids=[];self.links=[];self.feed(text)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.append(a['id'])
  for attr in ('href','src','poster','data-src-mp4','data-src-webm','data-src-mobile-mp4','data-src-mobile-webm'):
   if a.get(attr):self.links.append(a[attr])

pages={p.name:Page(p.read_text(encoding='utf-8')) for p in root.glob('*.html')}
errors=[];count=0
for name,page in pages.items():
 for ident,n in collections.Counter(page.ids).items():
  if n>1:errors.append(f'{name}: duplicate id {ident}')
 for url in page.links:
  u=urlsplit(url)
  if u.scheme or u.netloc:continue
  path=unquote(u.path) or name;count+=1
  if not (root/path).exists():errors.append(f'{name}: missing file {path}')
  elif u.fragment and path in pages and unquote(u.fragment) not in pages[path].ids:errors.append(f'{name}: missing anchor {url}')
print(f'Checked {len(pages)} pages and {count} local links/assets.')
for error in errors:print(error)
raise SystemExit(bool(errors))
