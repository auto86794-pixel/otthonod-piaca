from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public/otthonod-piaca-5-hiba.pdf'
pdfmetrics.registerFont(TTFont('Body','/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('BodyBold','/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))
pdfmetrics.registerFont(TTFont('Display','/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf'))
W,H=595.28,841.89
G=HexColor('#405d34');INK=HexColor('#243323');MUTED=HexColor('#59604f');PAPER=HexColor('#fcfaf6');LINE=HexColor('#d9ddcc');LIGHT=HexColor('#eef1e4')
c=canvas.Canvas(str(OUT),pagesize=(W,H));c.setTitle('5 elkerülhető hiba lakáseladás előtt | Otthonod Piaca');c.setAuthor('Otthonod Piaca');c.setSubject('Gyakorlati útmutató lakáseladóknak Debrecenben és környékén')
def text(txt,x,y,width=483,size=11.2,font='Body',color=INK,leading=None):
 st=ParagraphStyle('p',fontName=font,fontSize=size,leading=leading or size*1.5,textColor=color,spaceAfter=0,alignment=TA_LEFT)
 p=Paragraph(txt,st);_,h=p.wrap(width,900);p.drawOn(c,x,y-h);return y-h

def page(n,kicker):
 c.setFillColor(PAPER);c.rect(0,0,W,H,fill=1,stroke=0)
 c.setFillColor(G);c.rect(0,H-10,W,10,fill=1,stroke=0)
 text('OTTHONOD PIACA',48,H-39,size=11,font='BodyBold',color=G)
 text(kicker,48,H-64,size=9,color=MUTED)
 c.setStrokeColor(LINE);c.line(48,49,W-48,49)
 text('otthonodpiaca.hu  |  Ingyenes eladói útmutató',48,37,size=8.5,color=MUTED)
 text(f'{n} / 4',W-82,37,width=40,size=8.5,color=MUTED)

def heading(num,title,y):
 c.setFillColor(G);c.roundRect(48,y-40,40,40,12,fill=1,stroke=0)
 text(num,57,y-8,width=28,size=18,font='Display',color=HexColor('#ffffff'))
 text(title,104,y-4,width=443,size=20,font='Display',leading=25)
 return y-61

def block(label,body,y):
 y=text(label.upper(),48,y,size=9,font='BodyBold',color=G);y-=5
 return text(body,48,y,size=11.2)-15

def tip(body,y):
 st=ParagraphStyle('tip',fontName='Body',fontSize=10.3,leading=15.6,textColor=INK)
 p=Paragraph(body,st);_,h=p.wrap(451,500)
 c.setFillColor(LIGHT);c.roundRect(48,y-h-24,499,h+24,10,fill=1,stroke=0);p.drawOn(c,64,y-h-12)
 return y-h-40

page(1,'DEBRECEN ÉS KÖRNYÉKE  /  ELADÁS ELŐTT')
y=text('5 elkerülhető hiba',48,727,size=32,font='Display',leading=40)
y=text('lakáseladás előtt',48,y-4,size=32,font='Display',leading=40)
text('Apró döntések, amelyek az árazást, az érdeklődést és az alkuhelyzetedet is befolyásolhatják.',48,y-21,width=470,size=13,color=MUTED)
# Meglévő arculati fotó, pontos vágással.
c.saveState();path=c.beginPath();path.roundRect(48,305,499,215,14);c.clipPath(path,stroke=0)
c.drawImage(ImageReader(str(ROOT/'public/otthon-nappali.webp')),48,260,width=499,height=333,mask='auto');c.restoreState()
y=text('Mielőtt feladod a hirdetést',48,279,size=19,font='Display')
y=text('Öt gyakori döntési helyzetet nézünk végig: hogyan válassz induló árat, mit mutass meg a fotókon, mire költs a felkészítésnél, hogyan írj pontos hirdetést, és miként kezeld az érdeklődőket.',48,y-10,size=11.2)
y=tip('<b>Mit jelenthet 1-2 millió forint?</b><br/>Szemléltető számolás: 60 millió Ft 2%-a 1,2 millió Ft. Ez nem kutatási adat és nem ígéret arra, hogy egy adott változtatás ennyivel növeli az árat. A tényleges hatás minden ingatlannál más.',y-18)
assert y>65
c.showPage()

page(2,'01-02  /  ÁRAZÁS ÉS BEMUTATÁS')
y=heading('01','Induló ár piaci összehasonlítás nélkül',730)
y=block('Mi a kockázat?','Ha kizárólag a saját költségeidből, egyetlen szomszéd hirdetéséből vagy a kívánt bevételből indulsz ki, könnyen elkerülheted a reális ársávot. A túl magas ár visszafoghatja az érdeklődést, a túl alacsony ár pedig indokolatlan engedményt jelenthet.',y)
y=block('Mit tegyél helyette?','Nézz több, hasonló fekvésű, méretű, épülettípusú és állapotú ingatlant. Debrecenben ne keverd össze a városrészeket vagy a panel- és téglalakásokat. A hirdetési ár nem azonos a végül kialkudott vételárral.',y)
y=tip('<b>Első teendő:</b> írj össze 5 összehasonlítható ajánlatot, és mindegyiknél jegyezd fel a fontos eltéréseket. Az induló árhoz kérj személyes, helyi összehasonlítást.',y)
y-=11
y=heading('02','Sötét, zsúfolt vagy félrevezető fotók',y)
y=block('Mi a kockázat?','A fotók alapján dönti el az érdeklődő, tovább olvas-e. A rossz fények és a zsúfoltság elvonhatják a figyelmet a térről. A túlzott szerkesztés pedig csalódást okozhat a megtekintéskor.',y)
y=block('Mit tegyél helyette?','Fotózz nappali fényben, rendezett helyiségekkel. Legyen átlátható a képsorrend, és szerepeljen a nappali, a hálók, a konyha, a fürdő és az erkély is, ha van. Olyan előnyöket mutass meg, amelyek a valóságban is jelen vannak.',y)
y=tip('<b>Első teendő:</b> ürítsd le a konyhapultot, igazítsd meg a textileket, és a hirdetéshez válaszd a legjobban áttekinthető nyitóképet. Az ingatlan hibáit ne tüntesd el képszerkesztéssel.',y)
assert y>65,y
c.showPage()

page(3,'03-04  /  FELKÉSZÍTÉS ÉS HIRDETÉS')
y=heading('03','Nagy kiadás, átgondolatlan felújítás',730)
y=block('Mi a kockázat?','Nem biztos, hogy az eladás előtt elköltött teljes összeg visszajön a vételárban. Egy költséges, egyéni ízlésre szabott átalakítás ráadásul nem feltétlenül találkozik a következő tulajdonos igényeivel.',y)
y=block('Mit tegyél helyette?','Kezdj a tisztasággal, rendrakással és a könnyen javítható problémákkal. Különítsd el a szükséges műszaki javítást a pusztán esztétikai változtatástól. Nagyobb munkára előbb kérj költségbecslést, és mérlegeld az eladási célodat.',y)
y=tip('<b>Első teendő:</b> készíts két listát: „szükséges javítás” és „szépítés”. Minden tétel mellé írj keretet és határidőt. A hibát takarás helyett kezeld vagy jelezd.',y)
y-=11
y=heading('04','Hiányos adatok, túlzó ígéretek',y)
y=block('Mi a kockázat?','A homályos méretadat, a hiányzó alaprajz vagy a fontos jellemzők elhallgatása felesleges köröket okozhat. A szöveg és a valóság közti eltérés a személyes megtekintésnél gyengítheti a bizalmat.',y)
y=block('Mit tegyél helyette?','Írd le pontosan az alapterületet és annak értelmezését, a szobaszámot, az emeletet, a liftet, a fűtést, a kültéri területet és az ismert állapotot. Csak ellenőrzött költségadatot adj meg, egyértelmű időszakkal. Az alaprajz legyen olvasható.',y)
y=tip('<b>Első teendő:</b> olvasd végig a hirdetést vevői szemmel: mire nem kapnál választ? Az adatokat ellenőrizd a rendelkezésre álló dokumentumokkal, a bizonytalanságokat pedig tisztázd.',y)
assert y>65,y
c.showPage()

page(4,'05  /  ÉRDEKLŐDŐK ÉS A KÖVETKEZŐ LÉPÉS')
y=heading('05','Rögtönzött megtekintés és kapkodó alku',730)
y=block('Mi a kockázat?','Ha a kérdésekre nincs felkészült válaszod, az időpontok nehezen szervezhetők, vagy az ajánlatot csak az összeg alapján mérlegeled, fontos feltételek maradhatnak tisztázatlanul.',y)
y=block('Mit tegyél helyette?','Készíts rövid adatlapot az ingatlanról, és egyeztesd előre a megtekintést. Az ajánlatnál az áron túl a finanszírozásról, a tervezett határidőkről és az átadásról is beszéljetek. A szerződéses kérdéseket ügyvéddel tisztázd.',y)
y=text('Hirdetés előtti gyors ellenőrzőlista',48,y-5,size=19,font='Display');y-=14
for line in [
 'Összehasonlítottam több, valóban hasonló ingatlant.',
 'Rendezett, világos és valósághű fotóim vannak.',
 'A felkészítésnek költségkeretet és határidőt adtam.',
 'Az alapadatok pontosak; az alaprajz áttekinthető.',
 'Átgondoltam az eladás és az átadás időzítését.',
]:
 c.setStrokeColor(G);c.roundRect(49,y-15,11,11,2,stroke=1,fill=0)
 y=text(line,72,y,width=470,size=10.8)-11

y=tip('<b>Nem kell mindent egyedül megoldanod.</b><br/>Kérj ingyenes, személyes értékbecslési egyeztetést Debrecenben és környékén. Átnézzük az ingatlanod adottságait, és megbeszéljük a következő lépést.',y-3)
c.setFillColor(G);c.roundRect(48,y-35,499,38,9,fill=1,stroke=0)
text('Személyes egyeztetést kérek  >',64,y-6,width=460,size=12,font='BodyBold',color=HexColor('#ffffff'))
c.linkURL('https://otthonodpiaca.hu/#kapcsolat',(48,y-35,547,y+3),relative=0)
y-=53
y=text('Az útmutató általános felkészülési szempontokat ad. Nem helyettesít egyedi értékbecslést, műszaki vizsgálatot vagy jogi tanácsadást. Nem garantál vételárat, megtérülést vagy eladási határidőt.',48,y,size=8.7,color=MUTED,leading=13)
assert y>65,y
c.showPage();c.save()
print(OUT)
