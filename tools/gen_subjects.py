#!/usr/bin/env python3
"""Generates shared/qbank-english.js and shared/qbank-gk.js (Olympiad English and General Knowledge), Easy/Standard/Challenge.
Run after gen_qbank.py logic (imported) because odd-one-out and analogy questions are moved from the maths pool into GK / English."""
import random, json, os, re, sys, itertools
sys.path.insert(0, os.path.dirname(__file__))
import gen_qbank
from wordfreq import zipf_frequency
R = random.Random(77)
OUT = os.path.join(os.path.dirname(__file__), '..', 'shared')
LV = ('easy', 'standard', 'challenge')
EN = {l: {} for l in LV}; GK = {l: {} for l in LV}
for l in LV:
    for it in gen_qbank.MOVED['english'][l]: EN[l][it[0]] = it
    for it in gen_qbank.MOVED['gk'][l]: GK[l][it[0]] = it
CAP = {}
from wn import WordNet
_wn = WordNet()
_posc = {}
def posof(w):
    if w not in _posc:
        ss = _wn.synsets(w); c = {}
        for i, x in enumerate(ss[:4]):
            k = x.pos().replace('s', 'a'); c[k] = c.get(k, 0) + (4 - i)
        _posc[w] = max(c, key=c.get) if c else '?'
    return _posc[w]
def samepos(pool, ans):
    ps = [x for x in dict.fromkeys(pool) if x != ans and posof(x) == posof(ans)]
    return ps if len(ps) >= 6 else list(dict.fromkeys(pool))
def art(q): return re.sub(r'\b([Aa]) (?=[aeiouAEIOU])', lambda m: m.group(1) + 'n ', q)
def put(D, lvl, q, ans, wrongs, tag='x', cap=10**9):
    q = q.strip(); ans = str(ans); ws = []
    for w in wrongs:
        w = str(w)
        if w != ans and w not in ws: ws.append(w)
    if len(ws) < 3: raise ValueError(('few wrongs', q, ans, wrongs))
    k = (id(D), lvl, tag); CAP.setdefault(k, 0)
    if CAP[k] >= cap or q in D[lvl]: return False
    D[lvl][q] = [q, ans] + ws[:3]; CAP[k] += 1; return True
def en(l, q, a, w, tag='x', cap=10**9): return put(EN, l, q, a, w, tag, cap)
def gk(l, q, a, w, tag='x', cap=10**9): return put(GK, l, q, a, w, tag, cap)
def others(pool, ans, n=3, avoid=()):
    c = list(dict.fromkeys(p for p in pool if p != ans and p not in avoid)); return R.sample(c, n)

# ============================================================== ENGLISH
# ---- a / an
SILENT_H = ('hon', 'hou', 'heir', 'herb'); SOFT_U = ('uni', 'use', 'usu', 'uti', 'ubi', 'eu', 'ewe', 'one', 'once')
t = open(os.path.join(OUT, 'qbank-words.js')).read()
i = t.index('window._qbWords='); words = json.loads(t[i + 16:].rstrip().rstrip(';'))
cats = json.loads(t[t.index('window._qbWordCats=') + 19:i - 1])
UNC = set('furniture equipment luggage baggage jewelry jewellery machinery clothing clothes information advice traffic scenery cutlery crockery hardware software homework money stairs jeans trousers scissors glasses pants shorts tights goggles pliers binoculars'.split())
nouns = [w.lower() for l in words for w, h in words[l] if (isinstance(h, int) and h >= 0 and cats[h] in ('an animal', 'a plant', 'a part of the body', 'a made object', 'a kind of person'))]
for w in nouns:
    if w.startswith(SILENT_H) or w.startswith(SOFT_U) or len(w) < 3 or w in UNC: continue
    if w.endswith('s') and not w.endswith(('ss', 'us', 'is')): continue
    if zipf_frequency(w, 'en') < 3.8: continue
    a = 'an' if w[0] in 'aeiou' else 'a'
    lvl = 'easy' if len(w) <= 6 else 'standard'
    en(lvl, 'Choose the correct article: ___ %s' % w, a, ['a' if a == 'an' else 'an', 'the', 'no article'], 'art', 450)
# ---- plurals
P = {'easy': {'s': 'book pen cat dog table chair apple flower car bird tree school house pencil bag window door ball cup bed hat shoe egg star road farm river mountain'.split(),
              'es': 'box bus dish watch church glass brush fox class bench sandwich wish kiss peach dress match'.split(),
              'ies': 'baby city story lady fly party country family puppy berry candy hobby'.split(),
              'ys': 'boy toy day key monkey donkey tray holiday valley'.split()},
     'standard': {'ves': 'leaf wolf knife life wife shelf half calf thief loaf elf'.split(), 'fs': 'roof cliff chief belief proof safe'.split(),
                  'oes': 'potato tomato hero echo volcano'.split(), 'os': 'photo piano zoo radio video kilo studio'.split()}}
IRR = {'easy': {'man': 'men', 'woman': 'women', 'child': 'children', 'foot': 'feet', 'tooth': 'teeth', 'mouse': 'mice', 'goose': 'geese', 'person': 'people'},
       'standard': {'ox': 'oxen', 'louse': 'lice'}, 'challenge': {'cactus': 'cacti', 'fungus': 'fungi', 'nucleus': 'nuclei', 'radius': 'radii', 'analysis': 'analyses', 'crisis': 'crises', 'phenomenon': 'phenomena', 'criterion': 'criteria', 'bacterium': 'bacteria', 'curriculum': 'curricula', 'thesis': 'theses', 'stimulus': 'stimuli', 'alumnus': 'alumni', 'appendix': 'appendices'}}
SAME = {'standard': 'sheep deer fish series species aircraft salmon moose'.split()}
def wrong_plurals(w, ans):
    c = [w + 's', w + 'es']
    if w.endswith('y'): c.append(w[:-1] + 'ies')
    if w.endswith('f'): c += [w[:-1] + 'ves', w + 's']
    if w.endswith('fe'): c += [w[:-2] + 'ves', w + 's']
    if w.endswith('o'): c += [w + 'es', w + 's']
    if w.endswith('us'): c += [w[:-2] + 'i', w + 'es']
    if w.endswith('um'): c += [w[:-2] + 'a', w + 's']
    if w.endswith('is'): c += [w[:-2] + 'es', w + 'es']
    c += [w + 'ren', w + 'en', w[:-1] + 'i', w + 'ies', w + 'ves']
    return [x for x in dict.fromkeys(c) if x != ans and x != w]
def plural_of(w, kind):
    return {'s': w + 's', 'es': w + 'es', 'ies': w[:-1] + 'ies', 'ys': w + 's', 'ves': (w[:-2] if w.endswith('fe') else w[:-1]) + 'ves', 'fs': w + 's', 'oes': w + 'es', 'os': w + 's'}[kind]
for lvl, d in P.items():
    for kind, lst in d.items():
        for w in lst:
            a = plural_of(w, kind); ws = wrong_plurals(w, a)
            for tpl in ('What is the plural of "%s"?', 'Choose the correct plural: one %s, two ___'):
                en(lvl, tpl % w, a, ws[:3], 'plural')
for lvl, d in IRR.items():
    for w, a in d.items():
        ws = [x for x in (w + 's', w + 'es', w[:-1] + 'ies', w + 'en', w + 'ren') if x != a]
        for tpl in ('What is the plural of "%s"?', 'Choose the correct plural: one %s, two ___'):
            en(lvl, tpl % w, a, ws[:3], 'plural')
for w in SAME['standard']:
    en('standard', 'What is the plural of "%s"?' % w, w, [w + 's', w + 'es', w[:-1] + 'ies'], 'plural')
# ---- verbs
IV = [x.split() for x in '''begin began begun|break broke broken|bring brought brought|build built built|buy bought bought|catch caught caught|choose chose chosen|come came come|do did done|draw drew drawn|drink drank drunk|drive drove driven|eat ate eaten|fall fell fallen|feel felt felt|fight fought fought|find found found|fly flew flown|forget forgot forgotten|freeze froze frozen|get got got|give gave given|go went gone|grow grew grown|have had had|hear heard heard|hide hid hidden|hold held held|keep kept kept|know knew known|lead led led|leave left left|lend lent lent|lose lost lost|make made made|mean meant meant|meet met met|pay paid paid|ride rode ridden|ring rang rung|rise rose risen|run ran run|say said said|see saw seen|sell sold sold|send sent sent|shake shook shaken|shine shone shone|shoot shot shot|show showed shown|sing sang sung|sink sank sunk|sit sat sat|sleep slept slept|speak spoke spoken|spend spent spent|stand stood stood|steal stole stolen|swim swam swum|take took taken|teach taught taught|tear tore torn|tell told told|think thought thought|throw threw thrown|wake woke woken|wear wore worn|win won won|write wrote written|bite bit bitten|blow blew blown|dig dug dug|feed fed fed|sweep swept swept|swing swung swung|slide slid slid|spin spun spun|stick stuck stuck|sting stung stung|strike struck struck|swear swore sworn'''.split('|')]
base = [v[0] for v in IV]; pasts = [v[1] for v in IV]; pps = [v[2] for v in IV]
def wrong_past(b, p):
    c = [b + 'ed' if not b.endswith('e') else b + 'd', b + 'en', b + 'ing', b[:-1] + 'ed' if b.endswith('y') else b + 'ed']
    c += R.sample(pasts, 3) + R.sample(pps, 2)
    return [x for x in dict.fromkeys(c) if x != p and x != b]
for b, p, pp in IV:
    cand = [x for x in dict.fromkeys([(b + 'd') if b.endswith('e') else (b + 'ed')] + wrong_past(b, p)) if x != p]
    candpp = [x for x in dict.fromkeys([(b + 'd') if b.endswith('e') else (b + 'ed'), p, b + 'en', b + 'ing', b] + wrong_past(b, pp)) if x != pp]
    for tpl in ('What is the past tense of "%s"?', 'Fill in the blank: Yesterday I ___ (%s).'):
        en('standard', tpl % b, p, cand[:3], 'past', 200)
    for tpl in ('What is the past participle of "%s"? (I have ___)', 'Complete the sentence: She has already ___ (%s).'):
        en('challenge', tpl % b, pp, candpp[:3], 'pp', 200)
    if b in 'go eat run see come give take sit sing swim make'.split():
        en('easy', 'What is the past tense of "%s"?' % b, p, [x for x in (b + 'ed', b + 'ing', b + 's') if x != p][:3], 'past0')
REG = {'ed': 'walk jump play talk cook clean help kick open paint pull push want wash watch work visit start rain listen laugh climb count call ask answer enjoy learn look stay obey'.split(),
       'd': 'move like love dance smile bake use live arrive hope'.split(), 'ied': 'carry cry study try hurry worry copy marry dry'.split(),
       'dbl': 'stop plan hop drop clap hug jog skip shop rub beg grab nod tap'.split()}
for k, lst in REG.items():
    for w in lst:
        a = {'ed': w + 'ed', 'd': w + 'd', 'ied': w[:-1] + 'ied', 'dbl': w + w[-1] + 'ed'}[k]
        ws = {'ed': [w + 'd', w + 'ed' + 'ed', w[:-1] + 'ed'], 'd': [w + 'ed', w[:-1] + 'ed', w + 'id'], 'ied': [w + 'ed', w[:-1] + 'ed', w + 'd'], 'dbl': [w + 'ed', w + w[-1] + 'd', w[:-1] + 'ed']}[k]
        ws = [x for x in ws if x != a]
        lvl = 'easy' if k in ('ed',) else 'standard'
        for tpl in ('What is the past tense of "%s"?', 'Fill in the blank: Yesterday we ___ (%s).'):
            en(lvl, tpl % w, a, (ws + [w + 'ing'])[:3], 'regpast')
ING = {'make': 'making', 'take': 'taking', 'run': 'running', 'sit': 'sitting', 'swim': 'swimming', 'lie': 'lying', 'die': 'dying', 'tie': 'tying', 'dance': 'dancing', 'write': 'writing', 'hop': 'hopping', 'stop': 'stopping', 'begin': 'beginning', 'play': 'playing', 'carry': 'carrying', 'ride': 'riding', 'give': 'giving', 'hide': 'hiding', 'see': 'seeing', 'come': 'coming', 'have': 'having', 'cut': 'cutting', 'get': 'getting', 'put': 'putting', 'shop': 'shopping', 'plan': 'planning', 'win': 'winning', 'smile': 'smiling', 'bake': 'baking', 'skip': 'skipping'}
for w, a in ING.items():
    ws = [w + 'ing', w[:-1] + 'ing' if w.endswith('e') else w + w[-1] + 'ing', w + w[-1] + 'ing', w[:-1] + 'ying' if w.endswith('ie') else w + 'ning']
    ws = [x for x in dict.fromkeys(ws) if x != a]
    if len(ws) < 3: ws += ['%sig' % w, '%sen' % w]
    en('standard', 'Add -ing to "%s". Which spelling is correct?' % w, a, ws[:3], 'ing')
# ---- subject–verb agreement
SUBJ1 = ['He', 'She', 'It', 'My brother', 'The dog', 'Our teacher', 'Mina', 'The baby', 'Rahul', 'My mother', 'The bird', 'A boy', 'The cat', 'The farmer', 'My friend', 'The girl']
SUBJ2 = ['I', 'You', 'We', 'They', 'The children', 'My friends', 'The dogs', 'Rahul and Mina', 'The boys', 'Birds', 'Cats', 'The teachers']
VERB = {'play': 'plays', 'run': 'runs', 'eat': 'eats', 'like': 'likes', 'watch': 'watches', 'go': 'goes', 'walk': 'walks', 'read': 'reads', 'jump': 'jumps', 'sing': 'sings', 'drink': 'drinks', 'study': 'studies', 'carry': 'carries', 'fly': 'flies', 'wash': 'washes', 'teach': 'teaches', 'write': 'writes', 'help': 'helps', 'sleep': 'sleeps', 'draw': 'draws', 'catch': 'catches', 'try': 'tries', 'cook': 'cooks', 'paint': 'paints'}
OBJ = {'play': 'cricket every evening', 'run': 'in the park', 'eat': 'lunch at noon', 'like': 'ice cream', 'watch': 'TV after school', 'go': 'to school by bus', 'walk': 'to the market', 'read': 'a book every night', 'jump': 'over the fence', 'sing': 'a song', 'drink': 'milk every morning', 'study': 'hard for the exam', 'carry': 'a heavy bag', 'fly': 'high in the sky', 'wash': 'the dishes', 'teach': 'English', 'write': 'a letter', 'help': 'at home', 'sleep': 'early', 'draw': 'a picture', 'catch': 'the ball', 'try': 'her best', 'cook': 'dinner', 'paint': 'the wall'}
for sj, plural in ((SUBJ1, False), (SUBJ2, True)):
    for s in sj:
        for b, v3 in VERB.items():
            right = b if (plural or s in ('I', 'You')) else v3
            wrong = v3 if right == b else b
            q = 'Choose the correct verb: %s ___ %s.' % (s, OBJ[b])
            en('easy' if b in 'play run eat like go walk read jump sing drink sleep draw cook'.split() else 'standard', q, right, [wrong, b + 'ing', 'are ' + b][:3] if False else [wrong, b + 'ing', 'to ' + b], 'sva', 520)
# ---- parts of speech
ADJ = 'big small happy sad red tall short quick slow bright dark cold hot soft hard sweet sour clever kind brave lazy noisy quiet shiny old new young heavy light'.split()
NOUN = 'boy girl dog cat tree car book table bird teacher doctor farmer river house ball garden mountain apple city street flower'.split()
VRB = {'runs': 'run', 'jumps': 'jump', 'sleeps': 'sleep', 'eats': 'eat', 'sings': 'sing', 'plays': 'play', 'walks': 'walk', 'reads': 'read', 'draws': 'draw', 'swims': 'swim'}
ADV = 'quickly slowly loudly softly happily carefully quietly bravely badly neatly'.split()
for a_ in ADJ:
    for n_ in NOUN:
        v_ = R.choice(list(VRB)); ad = R.choice(ADV)
        sent = 'The %s %s %s %s.' % (a_, n_, v_, ad)
        opts = [a_, n_, v_, ad]
        en('easy', 'In the sentence "%s", which word is the adjective?' % sent, a_, [n_, v_, ad], 'pos', 300)
        sent2 = 'The %s %s %s %s.' % (R.choice(ADJ), n_, v_, ad)
        en('standard', 'In the sentence "%s", which word is the adverb?' % sent2, ad, [n_, v_, sent2.split()[1]], 'pos2', 300)
        sent3 = 'The %s %s %s %s.' % (a_, n_, v_, R.choice(ADV))
        en('standard', 'In the sentence "%s", which word is the verb?' % sent3, v_, [n_, a_, sent3.split()[-1].rstrip('.')], 'pos3', 300)
        sent4 = 'The %s %s %s %s.' % (a_, n_, v_, R.choice(ADV))
        en('easy', 'In the sentence "%s", which word is the noun?' % sent4, n_, [a_, v_, sent4.split()[-1].rstrip('.')], 'pos4', 300)
# ---- synonym / antonym groups
SYN = [x.split(',') for x in '''big,large,huge,enormous|small,little,tiny|happy,glad,cheerful,joyful|sad,unhappy,sorrowful|fast,quick,speedy,rapid|slow,sluggish|begin,start,commence|end,finish,complete,conclude|smart,clever,intelligent,bright|brave,bold,fearless,courageous|angry,furious,cross,mad|beautiful,pretty,lovely,attractive|ugly,hideous|cold,chilly,freezing|hot,boiling,scorching|tired,weary,exhausted,sleepy|scared,afraid,frightened,fearful|strong,powerful,mighty|weak,feeble,frail|rich,wealthy,affluent|poor,needy|clean,spotless,neat|dirty,filthy,grimy|quiet,silent,hushed,still|loud,noisy,deafening|shout,yell,scream|talk,speak,chat|look,see,glance,gaze|walk,stroll,stride|run,sprint,dash|jump,leap,hop|throw,toss,hurl|pull,drag,tug|help,assist,aid|ask,enquire,question|answer,reply,respond|choose,select,pick|buy,purchase|build,construct,make|break,smash,shatter|fix,repair,mend|shut,close|keep,hold,retain|find,discover,locate|hard,difficult,tough|easy,simple,effortless|funny,amusing,comical,humorous|boring,dull,tedious|friend,pal,companion,buddy|enemy,foe,rival|house,home,dwelling|road,street,lane|kid,child,youngster|stop,halt,cease|tell,inform,notify|wait,pause,linger|trip,journey,voyage|reply,response,answer|error,mistake,fault|rubbish,garbage,trash,waste|pretend,fake,imitate|brief,short,concise|huge,gigantic,colossal,massive|ancient,old,aged|brilliant,dazzling,radiant|careful,cautious,watchful|generous,kind,giving|honest,truthful,sincere|important,vital,essential,crucial|rude,impolite,discourteous|calm,peaceful,tranquil,serene|clever,wise,sensible|gloomy,dismal,dreary|odd,strange,peculiar,unusual|wonderful,marvellous,fantastic,splendid|danger,peril,hazard,risk|hungry,starving,famished|thirsty,parched|enough,adequate,sufficient|eager,keen,enthusiastic|empty,vacant,hollow|full,packed,crammed|sudden,abrupt,unexpected|simple,plain|nervous,anxious,worried,uneasy|pleased,delighted,thrilled|glance,peek,peep|fierce,savage,ferocious|tidy,orderly,neat'''.split('|')]
SYN = [[w.strip() for w in g] for g in SYN]
_m = []
for g in SYN:                       # merge groups that share a word, so a distractor can never be a synonym too
    g = set(g); hit = [x for x in _m if x & g]
    for x in hit: g |= x; _m.remove(x)
    _m.append(g)
SYN = [sorted(x) for x in _m]
lvl_of = lambda w: 'easy' if zipf_frequency(w, 'en') >= 4.9 else ('standard' if zipf_frequency(w, 'en') >= 4.1 else 'challenge')
allsyn = [w for g in SYN for w in g]
for gi, g in enumerate(SYN):
    others_ = [w for gj, h in enumerate(SYN) if gj != gi for w in h]
    for a_ in g:
        for b_ in g:
            if a_ == b_: continue
            lv = lvl_of(b_) if lvl_of(a_) == 'easy' else lvl_of(a_)
            lv = 'easy' if max(zipf_frequency(a_, 'en'), 0) >= 4.6 and zipf_frequency(b_, 'en') >= 4.4 else ('standard' if min(zipf_frequency(a_, 'en'), zipf_frequency(b_, 'en')) >= 3.6 else 'challenge')
            en(lv, 'Which word means the same as "%s"?' % a_, b_, others(samepos(others_, b_), b_, avoid=g), 'syn')
            en(lv, 'Choose the synonym of "%s".' % a_, b_, others(samepos(others_, b_), b_, avoid=g), 'syn')
ANT = [x.split('|') for x in '''hot|cold;big|small;happy|sad;fast|slow;up|down;in|out;day|night;old|young;new|old;good|bad;right|wrong;hard|soft;tall|short;long|short;heavy|light;empty|full;open|close;early|late;rich|poor;strong|weak;clean|dirty;wet|dry;thick|thin;wide|narrow;deep|shallow;near|far;high|low;brave|cowardly;begin|end;love|hate;win|lose;buy|sell;push|pull;laugh|cry;remember|forget;come|go;arrive|depart;give|take;find|lose;true|false;always|never;before|after;inside|outside;above|below;front|back;first|last;noisy|quiet;sweet|sour;bright|dark;smooth|rough;sharp|blunt;borrow|lend;dangerous|safe;lazy|active;polite|rude;generous|selfish;ancient|modern;victory|defeat;accept|refuse;increase|decrease;expand|shrink;optimist|pessimist;permanent|temporary;guilty|innocent;majority|minority;visible|invisible;possible|impossible;fiction|fact;transparent|opaque;generous|stingy;vacant|occupied;forward|backward;ascend|descend;expensive|cheap;freedom|slavery;enemy|friend;success|failure;birth|death;guest|host;sunrise|sunset;north|south;east|west;summer|winter;male|female;maximum|minimum;simple|complex;humble|proud;巨大|'''.split(';') if '|' in x and all(ord(c) < 128 for c in x)]
for a_, b_ in ANT:
    pool = [y for x in ANT for y in x if y not in (a_, b_)]
    for x, y in ((a_, b_), (b_, a_)):
        z = min(zipf_frequency(x, 'en'), zipf_frequency(y, 'en'))
        lv = 'easy' if z >= 4.6 else ('standard' if z >= 3.9 else 'challenge')
        en(lv, 'What is the opposite of "%s"?' % x, y, others(samepos(pool, y), y), 'ant')
        en(lv, 'Which word is an antonym of "%s"?' % x, y, others(samepos(pool, y), y), 'ant')
# analogies from ant/syn: A:B :: C:?
for _ in range(900):
    (a1, b1), (a2, b2) = R.sample(ANT, 2)
    z = min(zipf_frequency(w, 'en') for w in (a1, b1, a2, b2))
    lv = 'easy' if z >= 4.6 else ('standard' if z >= 3.9 else 'challenge')
    pool = [y for x in ANT for y in x if y not in (a2, b2, a1, b1)]
    en(lv, '%s is to %s as %s is to …' % (a1.capitalize(), b1, a2), b2, others(samepos(pool, b2), b2), 'ana2', 250)
# ---- collective nouns, gender
COLL = {'lions': 'pride', 'sheep': 'flock', 'birds': 'flock', 'cattle': 'herd', 'elephants': 'herd', 'bees': 'swarm', 'wolves': 'pack', 'fish': 'school', 'grapes': 'bunch', 'puppies': 'litter', 'geese': 'gaggle', 'ants': 'colony', 'ships': 'fleet', 'sailors': 'crew', 'whales': 'pod', 'crows': 'murder', 'owls': 'parliament', 'monkeys': 'troop', 'stars': 'galaxy', 'players': 'team', 'musicians': 'band', 'singers': 'choir', 'eggs': 'clutch', 'giraffes': 'tower', 'stairs': 'flight', 'flowers': 'bouquet', 'bananas': 'bunch', 'keys': 'bunch', 'soldiers': 'army', 'dolphins': 'pod', 'locusts': 'swarm'}
heavy = ['pride', 'flock', 'herd', 'swarm', 'pack', 'school', 'bunch', 'litter', 'colony', 'fleet', 'crew', 'pod', 'troop', 'team', 'band', 'choir', 'deck', 'stack', 'set', 'army', 'bouquet', 'class']
easyc = {'sheep', 'birds', 'cattle', 'elephants', 'bees', 'fish', 'grapes', 'bananas', 'flowers', 'players', 'students'}
for w, c in COLL.items():
    lv = 'easy' if w in easyc else ('standard' if c in ('pride', 'pack', 'litter', 'colony', 'fleet', 'crew', 'pod', 'troop', 'band', 'choir', 'deck', 'stack', 'set', 'army', 'bunch') else 'challenge')
    en(lv, 'What do we call a group of %s? A ___ of %s' % (w, w), c, others(heavy, c, avoid=[x for x, y in COLL.items() if y == c] + {'ants': ['army'], 'players': ['class'], 'singers': ['band'], 'musicians': ['choir'], 'bees': ['colony'], 'birds': ['herd', 'pack'], 'fish': ['pod'], 'whales': ['school']}.get(w, [])), 'coll')
GEN = {'boy': 'girl', 'king': 'queen', 'prince': 'princess', 'father': 'mother', 'uncle': 'aunt', 'brother': 'sister', 'son': 'daughter', 'husband': 'wife', 'nephew': 'niece', 'lion': 'lioness', 'tiger': 'tigress', 'actor': 'actress', 'waiter': 'waitress', 'host': 'hostess', 'hero': 'heroine', 'bull': 'cow', 'rooster': 'hen', 'stallion': 'mare', 'ram': 'ewe', 'drake': 'duck', 'gander': 'goose', 'buck': 'doe', 'monk': 'nun', 'bridegroom': 'bride', 'emperor': 'empress', 'duke': 'duchess', 'wizard': 'witch', 'widower': 'widow', 'gentleman': 'lady', 'grandfather': 'grandmother', 'man': 'woman', 'sir': 'madam', 'poet': 'poetess', 'peacock': 'peahen', 'fox': 'vixen', 'horse': 'mare'}
GEN.pop('horse'); GEN.pop('bull'); GEN['bull'] = 'cow'
fem = list(GEN.values()); mas = list(GEN)
for m, f in GEN.items():
    lv = 'easy' if m in 'boy king prince father uncle brother son husband man lion actor'.split() else ('standard' if m in 'tiger nephew waiter host hero bull rooster emperor duke grandfather gentleman sir'.split() else 'challenge')
    en(lv, 'What is the feminine (female) form of "%s"?' % m, f, others(fem, f), 'gen')
    en(lv, 'What is the masculine (male) form of "%s"?' % f, m, others(mas, m), 'gen')
# ---- homophones
HP = {'hear': ('I can ___ the birds singing.', 'here'), 'here': ('Please come ___ and sit down.', 'hear'), 'their': ('The students packed ___ bags.', 'there'), 'there': ('Put the books over ___.', 'their'),
      'to': ('We are going ___ the market.', 'too'), 'too': ('The soup is ___ hot to drink.', 'to'), 'write': ('Please ___ your name on the page.', 'right'), 'right': ('Turn ___ at the corner.', 'write'),
      'see': ('I can ___ a bird in the tree.', 'sea'), 'sea': ('The ___ was calm and blue.', 'see'), 'knew': ('She ___ the answer at once.', 'new'), 'new': ('I got a ___ bag for school.', 'knew'),
      'no': ('There is ___ milk left in the jug.', 'know'), 'know': ('Do you ___ the way to the station?', 'no'), 'sun': ('The ___ rises in the east.', 'son'), 'son': ('Their ___ plays football.', 'sun'),
      'buy': ('I want to ___ a new pencil.', 'by'), 'by': ('The shop is ___ the river.', 'buy'), 'flour': ('Mother used ___ to bake a cake.', 'flower'), 'flower': ('She picked a red ___ from the garden.', 'flour'),
      'meat': ('Tigers eat ___.', 'meet'), 'meet': ('Let us ___ at the gate at nine.', 'meat'), 'night': ('The stars shine at ___.', 'knight'), 'knight': ('The brave ___ rode a white horse.', 'night'),
      'one': ('I have only ___ pencil.', 'won'), 'won': ('Our team ___ the match.', 'one'), 'peace': ('The dove is a symbol of ___.', 'piece'), 'piece': ('Would you like a ___ of cake?', 'peace'),
      'plane': ('The ___ flew above the clouds.', 'plain'), 'plain': ('She wore a ___ white shirt.', 'plane'), 'tail': ('The dog wagged its ___.', 'tale'), 'tale': ('Grandmother told us a fairy ___.', 'tail'),
      'wait': ('Please ___ for me at the door.', 'weight'), 'weight': ('The ___ of the bag is two kilograms.', 'wait'), 'week': ('There are seven days in a ___.', 'weak'), 'weak': ('The patient felt ___ after the fever.', 'week'),
      'wear': ('You must ___ a helmet.', 'where'), 'where': ('___ is my bag?', 'wear'), 'whole': ('He ate the ___ apple.', 'hole'), 'hole': ('The mouse ran into a small ___.', 'whole'),
      'sale': ('The shop has a ___ on shoes.', 'sail'), 'sail': ('The boat will ___ across the lake.', 'sale'), 'steel': ('The bridge is made of ___.', 'steal'), 'steal': ('It is wrong to ___ things.', 'steel'),
      'bear': ('A brown ___ lives in the forest.', 'bare'), 'bare': ('The child walked with ___ feet.', 'bear'), 'break': ('Do not ___ the glass.', 'brake'), 'brake': ('Press the ___ to stop the bike.', 'break'),
      'dear': ('Hello, my ___ friend!', 'deer'), 'deer': ('A ___ ran across the field.', 'dear'), 'eight': ('She is ___ years old.', 'ate'), 'ate': ('He ___ his lunch quickly.', 'eight'),
      'hair': ('She combs her ___ every morning.', 'hare'), 'hare': ('The ___ lost the race to the tortoise.', 'hair'), 'mail': ('The postman delivers the ___.', 'male'), 'male': ('A lion is a ___ animal.', 'mail'),
      'pair': ('I bought a ___ of socks.', 'pear'), 'pear': ('He ate a juicy ___.', 'pair'), 'rain': ('Take an umbrella; it may ___.', 'reign'), 'road': ('The bus drove along the ___.', 'rode'), 'rode': ('She ___ her bicycle to school.', 'road'),
      'blue': ('The sky is ___.', 'blew'), 'blew': ('The wind ___ my hat away.', 'blue'), 'hour': ('The class lasts one ___.', 'our'), 'our': ('This is ___ school.', 'hour'), 'ant': ('An ___ is a tiny insect.', 'aunt'), 'aunt': ('My ___ lives in Delhi.', 'ant'),
      'bored': ('I felt ___ with nothing to do.', 'board'), 'board': ('The teacher wrote on the ___.', 'bored'), 'heel': ('She hurt her ___ while running.', 'heal'), 'heal': ('The wound will ___ soon.', 'heel'),
      'sight': ('The rainbow was a beautiful ___.', 'site'), 'site': ('They visited the building ___.', 'sight'), 'route': ('We took a shorter ___ home.', 'root'), 'root': ('The ___ of the plant drinks water.', 'route'),
      'throne': ('The king sat on his ___.', 'thrown'), 'thrown': ('The ball was ___ over the wall.', 'throne'), 'vain': ('The proud peacock was very ___.', 'vein'), 'vein': ('Blood flows through a ___.', 'vain')}
allhp = list(HP)
for w, (s, other) in HP.items():
    ws = [other] + [x for x in R.sample(allhp, 6) if x not in (w, other)]
    lv = 'easy' if w in 'hear here see sea no know sun son one won to too buy by their there'.split() else ('standard' if zipf_frequency(w, 'en') >= 4.2 else 'challenge')
    en(lv, 'Choose the correct word: %s' % s.replace('___', '_____'), w, ws[:3], 'hp')
# ---- prepositions
PREP = [('The cat is sitting ___ the table.', 'on', ['in', 'at', 'by']), ('She was born ___ 2015.', 'in', ['on', 'at', 'by']), ('The meeting is ___ Monday.', 'on', ['in', 'at', 'to']), ('We eat lunch ___ noon.', 'at', ['on', 'in', 'by']),
        ('The bird flew ___ the window.', 'through', ['in', 'at', 'on']), ('He jumped ___ the wall.', 'over', ['in', 'at', 'to']), ('The dog is hiding ___ the bed.', 'under', ['on', 'at', 'to']), ('She walked ___ the bridge.', 'across', ['at', 'in', 'on']),
        ('I am afraid ___ spiders.', 'of', ['from', 'at', 'on']), ('He is good ___ maths.', 'at', ['in', 'of', 'to']), ('She is interested ___ music.', 'in', ['on', 'at', 'of']), ('The train arrives ___ 6 o\'clock.', 'at', ['in', 'on', 'by']),
        ('We went to school ___ bus.', 'by', ['with', 'in', 'on']), ('The book is ___ the shelf and the lamp.', 'between', ['among', 'under', 'on']), ('Divide the sweets ___ the four children.', 'among', ['between', 'on', 'at']),
        ('The cat ran ___ the tree.', 'up', ['in', 'at', 'of']), ('He has lived here ___ 2010.', 'since', ['for', 'from', 'by']), ('She has been sick ___ three days.', 'for', ['since', 'from', 'at']), ('Stand ___ the line, please.', 'in', ['at', 'on', 'to']),
        ('The picture hangs ___ the wall.', 'on', ['in', 'at', 'over']), ('He was angry ___ me.', 'with', ['on', 'at', 'of']), ('They are looking ___ a lost puppy.', 'for', ['at', 'to', 'of']), ('Please listen ___ the teacher.', 'to', ['at', 'on', 'for']), ('She is married ___ a doctor.', 'to', ['with', 'by', 'at'])]
for q, a, w in PREP:
    en('easy' if a in ('on', 'in', 'at', 'under', 'over', 'by') else 'standard', 'Fill in the blank: ' + q.replace('___', '_____'), a, w, 'prep')
# ---- one-word substitution, vocabulary, idioms
OWS = [('a person who writes books', 'author'), ('a place where books are kept', 'library'), ('a person who flies an aeroplane', 'pilot'), ('a doctor for animals', 'vet'), ('a person who cooks food professionally', 'chef'), ('the study of stars and planets', 'astronomy'), ('a person who looks after teeth', 'dentist'),
       ('a person who cuts hair', 'barber'), ('a person who makes bread', 'baker'), ('a place where aeroplanes land', 'airport'), ('a person who paints pictures', 'artist'), ('a book of words and their meanings', 'dictionary'), ('a person who lives next door', 'neighbour'), ('a story of a person\'s life written by that person', 'autobiography'),
       ('one who does not eat meat', 'vegetarian'), ('a person who repairs cars', 'mechanic'), ('a collection of photographs', 'album'), ('a group of islands', 'archipelago'), ('a person who studies the past', 'historian'), ('the place where a bee lives', 'hive'), ('a person who sails a ship', 'sailor'),
       ('a person who writes poems', 'poet'), ('a person who is fond of reading', 'bookworm'), ('a fear of heights', 'acrophobia'), ('a person who speaks two languages', 'bilingual'), ('a speech by one person in a play', 'monologue'), ('a place where animals are kept for show', 'zoo'), ('a shop where medicines are sold', 'pharmacy'),
       ('a list of food in a restaurant', 'menu'), ('someone who cannot be seen', 'invisible'), ('a person who treats sick people', 'doctor'), ('a person who teaches', 'teacher'), ('a scientist who studies living things', 'biologist'), ('the study of rocks and the earth', 'geology'), ('a person who draws maps', 'cartographer'), ('a person who looks after a garden', 'gardener')]
pool_o = [b for _, b in OWS]
for d, w in OWS:
    lv = 'easy' if zipf_frequency(w, 'en') >= 4.2 else ('standard' if zipf_frequency(w, 'en') >= 3.2 else 'challenge')
    en(lv, 'Choose one word for: %s' % d, w, others(pool_o, w), 'ows')
VOC = [('benevolent', 'kind and generous'), ('meticulous', 'very careful about details'), ('reluctant', 'unwilling'), ('abundant', 'more than enough'), ('fragile', 'easily broken'), ('humble', 'not proud'), ('vivid', 'bright and clear'), ('swift', 'very fast'), ('feeble', 'weak'), ('ancient', 'very old'),
       ('hesitate', 'to pause before doing something'), ('conceal', 'to hide'), ('reveal', 'to show or make known'), ('enormous', 'very large'), ('tranquil', 'calm and peaceful'), ('rapid', 'quick'), ('eager', 'very keen'), ('gloomy', 'dark and sad'), ('fatigue', 'extreme tiredness'), ('frequent', 'happening often'),
       ('scarce', 'hard to find; not enough'), ('rebuke', 'to scold'), ('commence', 'to begin'), ('diligent', 'hard-working'), ('obstinate', 'stubborn'), ('candid', 'honest and open'), ('prudent', 'wise and careful'), ('vanish', 'to disappear'), ('ferocious', 'fierce and violent'), ('serene', 'calm and quiet'),
       ('zeal', 'great enthusiasm'), ('elegant', 'graceful and stylish'), ('radiant', 'shining brightly'), ('timid', 'shy and afraid'), ('hilarious', 'extremely funny'), ('persevere', 'to keep trying'), ('lethargic', 'lacking energy'), ('ambiguous', 'having more than one meaning'), ('jubilant', 'extremely happy'),
       ('inevitable', 'certain to happen'), ('arrogant', 'too proud of oneself'), ('compassion', 'sympathy for others'), ('endeavour', 'a serious effort'), ('hostile', 'unfriendly'), ('immense', 'extremely large'), ('mediocre', 'only average'), ('nimble', 'quick and light in movement'), ('obsolete', 'no longer used'),
       ('pensive', 'deep in thought'), ('quaint', 'attractively old-fashioned'), ('resilient', 'able to recover quickly'), ('solitary', 'alone'), ('tedious', 'long and boring'), ('unanimous', 'agreed by everyone'), ('vigilant', 'watchful'), ('wary', 'careful about possible danger'), ('lucid', 'clear and easy to understand'),
       ('grateful', 'thankful'), ('modest', 'not boastful'), ('novice', 'a beginner'), ('rural', 'of the countryside'), ('urban', 'of the city'), ('sphere', 'a round solid shape like a ball'), ('maximum', 'the greatest amount'), ('transparent', 'able to be seen through'), ('barren', 'unable to grow crops')]
pool_m = [m for _, m in VOC]
for w, m in VOC:
    z = zipf_frequency(w, 'en'); lv = 'easy' if z >= 4.5 else ('standard' if z >= 3.5 else 'challenge')
    en(lv, 'What does "%s" mean?' % w, m, others(pool_m, m), 'voc')
    en(lv if lv != 'easy' else 'standard', 'Which word means "%s"?' % m, w, others([x for x, _ in VOC], w), 'voc')
IDI = [('It is raining cats and dogs.', 'It is raining very heavily'), ('Break the ice', 'start a conversation in a friendly way'), ('A piece of cake', 'something very easy'), ('Once in a blue moon', 'very rarely'), ('Let the cat out of the bag', 'reveal a secret'),
       ('Under the weather', 'feeling a little ill'), ('Hit the books', 'study hard'), ('Spill the beans', 'tell a secret'), ('Burn the midnight oil', 'work late into the night'), ('Cost an arm and a leg', 'be very expensive'), ('Bite the bullet', 'face something unpleasant bravely'),
       ('Beat around the bush', 'avoid the main topic'), ('Kill two birds with one stone', 'solve two problems with one action'), ('The ball is in your court', 'it is your turn to decide'), ('Out of the blue', 'suddenly and unexpectedly'), ('Add fuel to the fire', 'make a bad situation worse'),
       ('Call it a day', 'stop working'), ('On cloud nine', 'extremely happy'), ('Pull someone\'s leg', 'tease or joke with someone'), ('A blessing in disguise', 'something good that seemed bad at first'), ('Barking up the wrong tree', 'making the wrong choice'), ('Cry over spilt milk', 'be upset about something that cannot be changed'),
       ('Don\'t count your chickens before they hatch', 'do not rely on something that has not happened yet'), ('Every cloud has a silver lining', 'there is something good in every bad situation'), ('Actions speak louder than words', 'what you do matters more than what you say')]
pool_i = [m for _, m in IDI]
for idm, m in IDI:
    en('standard' if len(idm) < 24 else 'challenge', 'What does the idiom "%s" mean?' % idm.rstrip('.'), m, others(pool_i, m), 'idi')
# ---- spelling choices from the word bank
def misspell(w):
    w = w.lower(); out = set()
    for i in range(1, len(w) - 1):
        if w[i] != w[i + 1]: out.add(w[:i] + w[i + 1] + w[i] + w[i + 2:])
    for i in range(1, len(w)):
        if w[i] == w[i - 1]: out.add(w[:i] + w[i + 1:])
    for i in range(1, len(w) - 1):
        if w[i] in 'bcdfglmnprst' and w[i] != w[i - 1] and w[i] != w[i + 1] and w[i - 1] in 'aeiou' and w[i + 1] in 'aeiou': out.add(w[:i] + w[i] + w[i] + w[i + 1:])
    out |= {w.replace('ie', 'ei') , w.replace('ei', 'ie'), w.replace('ph', 'f'), w.replace('tion', 'sion'), w.replace('sion', 'tion'), w.replace('ous', 'us'), w.replace('ance', 'ence'), w.replace('ence', 'ance'), w.replace('able', 'ible'), w.replace('ible', 'able'), w.replace('ck', 'k'), w.replace('ee', 'ea'), w.replace('ea', 'ee')}
    for i in range(1, len(w)):
        if w[i] in 'aeiou': out.add(w[:i] + w[i + 1:]); break
    out.discard(w); return [m for m in out if m != w and zipf_frequency(m, 'en') < 1.0 and m.isalpha()]
for lvl in LV:
    ws = [w.lower() for w, h in words[lvl] if len(w) >= 5]; R.shuffle(ws); n = 0
    for w in ws:
        mm = misspell(w)
        if len(mm) < 3: continue
        o = [w] + R.sample(mm, 3); R.shuffle(o)
        if en(lvl, 'Which spelling is correct: %s?' % ', '.join(o), w, [x for x in o if x != w], 'spell', 650): n += 1
    print('spell', lvl, n)

# ============================================================== GENERAL KNOWLEDGE
T = lambda n: ('the ' + n) if n in THE else n
THE = {'United States', 'United Kingdom', 'Netherlands', 'Bahamas', 'Gambia', 'Philippines', 'Democratic Republic of the Congo', 'Republic of the Congo', 'Central African Republic', 'Czech Republic', 'United Arab Emirates', 'Maldives', 'Comoros', 'Seychelles', 'Marshall Islands', 'Solomon Islands'}
C = {'Africa': '''Algeria|Algiers;Angola|Luanda;Benin|Porto-Novo;Botswana|Gaborone;Burkina Faso|Ouagadougou;Burundi|Gitega;Cabo Verde|Praia;Cameroon|Yaoundé;Central African Republic|Bangui;Chad|N'Djamena;Comoros|Moroni;Democratic Republic of the Congo|Kinshasa;Republic of the Congo|Brazzaville;Djibouti|Djibouti;Equatorial Guinea|Malabo;Eritrea|Asmara;Eswatini|Mbabane;Ethiopia|Addis Ababa;Gabon|Libreville;Gambia|Banjul;Ghana|Accra;Guinea|Conakry;Guinea-Bissau|Bissau;Ivory Coast|Yamoussoukro;Kenya|Nairobi;Lesotho|Maseru;Liberia|Monrovia;Libya|Tripoli;Madagascar|Antananarivo;Malawi|Lilongwe;Mali|Bamako;Mauritania|Nouakchott;Mauritius|Port Louis;Morocco|Rabat;Mozambique|Maputo;Namibia|Windhoek;Niger|Niamey;Nigeria|Abuja;Rwanda|Kigali;Senegal|Dakar;Seychelles|Victoria;Sierra Leone|Freetown;Somalia|Mogadishu;South Africa|Pretoria;South Sudan|Juba;Sudan|Khartoum;Tanzania|Dodoma;Togo|Lomé;Tunisia|Tunis;Uganda|Kampala;Zambia|Lusaka;Zimbabwe|Harare;Egypt|Cairo''',
 'Asia': '''Afghanistan|Kabul;Bahrain|Manama;Bangladesh|Dhaka;Bhutan|Thimphu;Brunei|Bandar Seri Begawan;Cambodia|Phnom Penh;China|Beijing;India|New Delhi;Indonesia|Jakarta;Iran|Tehran;Iraq|Baghdad;Japan|Tokyo;Jordan|Amman;Kazakhstan|Astana;Kuwait|Kuwait City;Kyrgyzstan|Bishkek;Laos|Vientiane;Lebanon|Beirut;Malaysia|Kuala Lumpur;Maldives|Malé;Mongolia|Ulaanbaatar;Myanmar|Naypyidaw;Nepal|Kathmandu;North Korea|Pyongyang;Oman|Muscat;Pakistan|Islamabad;Philippines|Manila;Qatar|Doha;Saudi Arabia|Riyadh;Singapore|Singapore;South Korea|Seoul;Syria|Damascus;Tajikistan|Dushanbe;Thailand|Bangkok;Timor-Leste|Dili;Turkmenistan|Ashgabat;United Arab Emirates|Abu Dhabi;Uzbekistan|Tashkent;Vietnam|Hanoi;Yemen|Sana'a;Turkey|Ankara;Cyprus|Nicosia;Armenia|Yerevan;Azerbaijan|Baku;Georgia|Tbilisi''',
 'Europe': '''Albania|Tirana;Andorra|Andorra la Vella;Austria|Vienna;Belarus|Minsk;Belgium|Brussels;Bosnia and Herzegovina|Sarajevo;Bulgaria|Sofia;Croatia|Zagreb;Czech Republic|Prague;Denmark|Copenhagen;Estonia|Tallinn;Finland|Helsinki;France|Paris;Germany|Berlin;Greece|Athens;Hungary|Budapest;Iceland|Reykjavik;Ireland|Dublin;Italy|Rome;Latvia|Riga;Liechtenstein|Vaduz;Lithuania|Vilnius;Luxembourg|Luxembourg City;Malta|Valletta;Moldova|Chisinau;Monaco|Monaco;Montenegro|Podgorica;Netherlands|Amsterdam;North Macedonia|Skopje;Norway|Oslo;Poland|Warsaw;Portugal|Lisbon;Romania|Bucharest;Russia|Moscow;San Marino|San Marino;Serbia|Belgrade;Slovakia|Bratislava;Slovenia|Ljubljana;Spain|Madrid;Sweden|Stockholm;Switzerland|Bern;Ukraine|Kyiv;United Kingdom|London''',
 'North America': '''Antigua and Barbuda|Saint John's;Bahamas|Nassau;Barbados|Bridgetown;Belize|Belmopan;Canada|Ottawa;Costa Rica|San José;Cuba|Havana;Dominica|Roseau;Dominican Republic|Santo Domingo;El Salvador|San Salvador;Grenada|St. George's;Guatemala|Guatemala City;Haiti|Port-au-Prince;Honduras|Tegucigalpa;Jamaica|Kingston;Mexico|Mexico City;Nicaragua|Managua;Panama|Panama City;Saint Lucia|Castries;Trinidad and Tobago|Port of Spain;United States|Washington, D.C.''',
 'South America': '''Argentina|Buenos Aires;Brazil|Brasília;Chile|Santiago;Colombia|Bogotá;Ecuador|Quito;Guyana|Georgetown;Paraguay|Asunción;Peru|Lima;Suriname|Paramaribo;Uruguay|Montevideo;Venezuela|Caracas''',
 'Oceania': '''Australia|Canberra;Fiji|Suva;Kiribati|Tarawa;Marshall Islands|Majuro;Palau|Ngerulmud;New Zealand|Wellington;Papua New Guinea|Port Moresby;Samoa|Apia;Solomon Islands|Honiara;Tonga|Nuku'alofa;Tuvalu|Funafuti;Vanuatu|Port Vila'''}
TRANS = {'Turkey', 'Russia', 'Kazakhstan', 'Egypt', 'Azerbaijan', 'Georgia', 'Cyprus', 'Armenia'}
EASYC = set('India|China|Japan|United States|United Kingdom|France|Germany|Italy|Spain|Russia|Australia|Canada|Brazil|Egypt|South Africa|Nepal|Pakistan|Bangladesh|Thailand|Indonesia|Mexico|Argentina|Greece|Turkey|Saudi Arabia|Kenya|Nigeria|New Zealand|Netherlands|Switzerland|Sweden|Norway|Portugal|Ireland|Cuba|Peru|Iran|Iraq|South Korea|Afghanistan|Singapore|Malaysia|Vietnam|Philippines|United Arab Emirates|Austria|Belgium|Denmark|Finland|Poland|Ukraine'.split('|'))
STDAFR = set('Ethiopia|Ghana|Morocco|Algeria|Libya|Tanzania|Uganda|Sudan|Tunisia|Zimbabwe|Zambia|Senegal|Angola|Madagascar|Mozambique|Namibia|Botswana|Somalia|Ivory Coast|Cameroon'.split('|'))
CAPS = []; ALLCAP = {}; CONT = {}
for cont, s in C.items():
    for e in s.split(';'):
        n, k = e.split('|'); CAPS.append((n, k, cont)); ALLCAP[n] = k; CONT[n] = cont
def clevel(n, cont):
    if n in EASYC: return 'easy'
    if cont in ('Africa', 'Oceania') and n not in STDAFR: return 'challenge'
    if n in ('Liechtenstein', 'Andorra', 'San Marino', 'Monaco', 'Montenegro', 'Kyrgyzstan', 'Tajikistan', 'Turkmenistan', 'Brunei', 'Bhutan', 'Timor-Leste', 'Moldova', 'North Macedonia', 'Bosnia and Herzegovina', 'Antigua and Barbuda', 'Dominica', 'Belize', 'Grenada', 'Saint Lucia', 'Barbados', 'Suriname', 'Guyana', 'Paraguay', 'Eswatini'): return 'challenge'
    return 'standard'
capnames = [k for _, k, _ in CAPS]
for n, k, cont in CAPS:
    lv = clevel(n, cont)
    same = [x for m, x, c in CAPS if c == cont and x != k]; rest = capnames
    w = (R.sample(same, 2) if len(same) >= 2 else []) + R.sample([x for x in rest if x != k and x not in same][:200], 3)
    ws = list(dict.fromkeys(w))
    gk(lv, 'What is the capital of %s?' % T(n), k, ws, 'cap')
    ctr = [m for m, x, c in CAPS if m != n]
    samec = [m for m, x, c in CAPS if c == cont and m != n]
    gk(lv, '%s is the capital of which country?' % k, n, (R.sample(samec, 2) if len(samec) > 2 else []) + R.sample(ctr, 4), 'cap2') if k != n else None
    if n not in TRANS:
        conts = ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania']
        gk(lv, 'In which continent is %s?' % T(n), cont, [c for c in conts if c != cont][:3] if lv != 'challenge' else R.sample([c for c in conts if c != cont], 3), 'cont')
for cont in C:
    for lv in ('easy', 'standard'):
        for _ in range(60):
            inside = [n for n, k, c in CAPS if c == cont and n not in TRANS]; outside = [n for n, k, c in CAPS if c != cont and n not in TRANS]
            a = R.choice([n for n in inside if (clevel(n, cont) == lv)] or inside); wr = R.sample(outside, 3)
            o = sorted([a] + wr)
            gk(lv, 'Which of these countries is in %s: %s?' % (cont, ', '.join(T(x).replace('the ', 'the ') for x in o)), a, wr, 'incont', 60)
# India
ST = '''Andhra Pradesh|Amaravati;Arunachal Pradesh|Itanagar;Assam|Dispur;Bihar|Patna;Chhattisgarh|Raipur;Goa|Panaji;Gujarat|Gandhinagar;Haryana|Chandigarh;Himachal Pradesh|Shimla;Jharkhand|Ranchi;Karnataka|Bengaluru;Kerala|Thiruvananthapuram;Madhya Pradesh|Bhopal;Maharashtra|Mumbai;Manipur|Imphal;Meghalaya|Shillong;Mizoram|Aizawl;Nagaland|Kohima;Odisha|Bhubaneswar;Punjab|Chandigarh;Rajasthan|Jaipur;Sikkim|Gangtok;Tamil Nadu|Chennai;Telangana|Hyderabad;Tripura|Agartala;Uttar Pradesh|Lucknow;Uttarakhand|Dehradun;West Bengal|Kolkata'''
STL = [e.split('|') for e in ST.split(';')]
scaps = list(dict.fromkeys(k for _, k in STL)); sstates = [s for s, _ in STL]
easy_st = set('Maharashtra|Tamil Nadu|Kerala|Karnataka|Rajasthan|Gujarat|West Bengal|Punjab|Uttar Pradesh|Goa|Bihar|Madhya Pradesh|Telangana|Assam|Haryana'.split('|'))
for s, k in STL:
    lv = 'easy' if s in easy_st else 'standard'
    gk(lv, 'What is the capital of the Indian state of %s?' % s, k, others(scaps, k, avoid=[k] + ([ 'Chandigarh'] if k == 'Chandigarh' else [])), 'instate')
    if s not in ('Haryana', 'Punjab'): gk(lv, '%s is the capital of which Indian state?' % k, s, others(sstates, s), 'instate2')
LIST = lambda d: list(d.items())
INDIA = [('What is the national animal of India?', 'Tiger', ['Lion', 'Elephant', 'Leopard']), ('What is the national bird of India?', 'Peacock', ['Parrot', 'Sparrow', 'Crow']), ('What is the national flower of India?', 'Lotus', ['Rose', 'Marigold', 'Sunflower']), ('What is the national fruit of India?', 'Mango', ['Banana', 'Apple', 'Guava']),
         ('What is the national tree of India?', 'Banyan', ['Neem', 'Peepal', 'Mango']), ('What is the currency of India?', 'Rupee', ['Dollar', 'Taka', 'Yen']), ('Which colour is at the top of the Indian flag?', 'Saffron', ['Green', 'White', 'Blue']), ('How many spokes does the Ashoka Chakra on the Indian flag have?', '24', ['12', '16', '32']),
         ('On which date is Independence Day celebrated in India?', '15 August', ['26 January', '2 October', '14 November']), ('On which date is Republic Day celebrated in India?', '26 January', ['15 August', '2 October', '5 September']), ('On which date is Gandhi Jayanti celebrated?', '2 October', ['15 August', '26 January', '14 November']),
         ('Children\'s Day in India is celebrated on…', '14 November', ['5 September', '2 October', '26 January']), ('Teachers\' Day in India is celebrated on…', '5 September', ['14 November', '2 October', '15 August']), ('Who is called the Father of the Nation in India?', 'Mahatma Gandhi', ['Jawaharlal Nehru', 'Sardar Patel', 'Subhas Chandra Bose']),
         ('Who was the first Prime Minister of India?', 'Jawaharlal Nehru', ['Mahatma Gandhi', 'Lal Bahadur Shastri', 'Indira Gandhi']), ('Who was the first President of India?', 'Dr Rajendra Prasad', ['Dr S. Radhakrishnan', 'Jawaharlal Nehru', 'Dr Zakir Husain']), ('Who is known as the Missile Man of India?', 'Dr A.P.J. Abdul Kalam', ['Dr Homi Bhabha', 'Dr Vikram Sarabhai', 'Dr C.V. Raman']),
         ('Who was the first woman Prime Minister of India?', 'Indira Gandhi', ['Sarojini Naidu', 'Pratibha Patil', 'Sonia Gandhi']), ('Who is known as the architect of the Indian Constitution?', 'Dr B.R. Ambedkar', ['Mahatma Gandhi', 'Jawaharlal Nehru', 'Sardar Patel']), ('Who wrote the Indian national anthem "Jana Gana Mana"?', 'Rabindranath Tagore', ['Bankim Chandra Chatterjee', 'Mahatma Gandhi', 'Sarojini Naidu']),
         ('Who was the first Indian to travel into space?', 'Rakesh Sharma', ['Kalpana Chawla', 'Vikram Sarabhai', 'Sunita Williams']), ('Who is known as the Iron Man of India?', 'Sardar Vallabhbhai Patel', ['Jawaharlal Nehru', 'Subhas Chandra Bose', 'Bhagat Singh']), ('Who gave the slogan "Jai Jawan Jai Kisan"?', 'Lal Bahadur Shastri', ['Jawaharlal Nehru', 'Indira Gandhi', 'Mahatma Gandhi']),
         ('Which Indian won the Nobel Prize in Literature in 1913?', 'Rabindranath Tagore', ['C.V. Raman', 'Amartya Sen', 'R.K. Narayan']), ('Which Indian scientist won the Nobel Prize in Physics in 1930?', 'C.V. Raman', ['Homi Bhabha', 'Jagadish Bose', 'S. Chandrasekhar']), ('Which Indian athlete won gold in javelin throw at the Tokyo Olympics?', 'Neeraj Chopra', ['Abhinav Bindra', 'Sushil Kumar', 'Milkha Singh']),
         ('What is the name of India\'s space agency?', 'ISRO', ['NASA', 'DRDO', 'BARC']), ('What was the name of India\'s first satellite?', 'Aryabhata', ['Bhaskara', 'INSAT', 'Rohini']), ('Which Indian mission landed near the Moon\'s south pole in 2023?', 'Chandrayaan-3', ['Mangalyaan', 'Chandrayaan-1', 'Aditya-L1']), ('Which Indian mission went to Mars?', 'Mangalyaan', ['Chandrayaan', 'Aditya-L1', 'Gaganyaan']),
         ('Which is the longest river in India?', 'Ganga', ['Yamuna', 'Godavari', 'Narmada']), ('Which river is known as the Ganga of the South?', 'Godavari', ['Kaveri', 'Krishna', 'Narmada']), ('The Taj Mahal is located in which city?', 'Agra', ['Delhi', 'Jaipur', 'Lucknow']), ('The Gateway of India is in which city?', 'Mumbai', ['Delhi', 'Kolkata', 'Chennai']),
         ('The Charminar is in which city?', 'Hyderabad', ['Lucknow', 'Bengaluru', 'Jaipur']), ('The Golden Temple is in which city?', 'Amritsar', ['Ludhiana', 'Chandigarh', 'Jaipur']), ('The Hawa Mahal is in which city?', 'Jaipur', ['Udaipur', 'Jodhpur', 'Agra']), ('The Victoria Memorial is in which city?', 'Kolkata', ['Mumbai', 'Chennai', 'Delhi']),
         ('The Qutub Minar is in which city?', 'Delhi', ['Agra', 'Jaipur', 'Lucknow']), ('The Mysore Palace is in which state?', 'Karnataka', ['Kerala', 'Tamil Nadu', 'Andhra Pradesh']), ('The Konark Sun Temple is in which state?', 'Odisha', ['Gujarat', 'Rajasthan', 'Bihar']), ('Which state is famous for the Kaziranga National Park and the one-horned rhinoceros?', 'Assam', ['Kerala', 'Gujarat', 'Odisha']),
         ('Which national park in Gujarat is famous for Asiatic lions?', 'Gir', ['Kanha', 'Ranthambore', 'Corbett']), ('Which Indian state is famous for backwaters and coconut trees?', 'Kerala', ['Punjab', 'Bihar', 'Rajasthan']), ('Which festival is called the festival of lights?', 'Diwali', ['Holi', 'Eid', 'Pongal']), ('Which festival is celebrated with colours?', 'Holi', ['Diwali', 'Onam', 'Baisakhi']),
         ('Onam is the harvest festival of which state?', 'Kerala', ['Punjab', 'Assam', 'Gujarat']), ('Pongal is celebrated mainly in which state?', 'Tamil Nadu', ['Kerala', 'Punjab', 'Bihar']), ('Baisakhi is a major festival of which state?', 'Punjab', ['Kerala', 'Assam', 'Goa']), ('Bihu is a festival of which state?', 'Assam', ['Punjab', 'Kerala', 'Gujarat']),
         ('Durga Puja is most famous in which state?', 'West Bengal', ['Gujarat', 'Kerala', 'Punjab']), ('Which language is mostly spoken in Kerala?', 'Malayalam', ['Tamil', 'Telugu', 'Kannada']), ('Which language is mostly spoken in Tamil Nadu?', 'Tamil', ['Telugu', 'Malayalam', 'Kannada']), ('Which language is mostly spoken in West Bengal?', 'Bengali', ['Odia', 'Hindi', 'Assamese']),
         ('Which language is mostly spoken in Gujarat?', 'Gujarati', ['Marathi', 'Hindi', 'Punjabi']), ('Which language is mostly spoken in Maharashtra?', 'Marathi', ['Gujarati', 'Hindi', 'Konkani']), ('Which language is mostly spoken in Karnataka?', 'Kannada', ['Telugu', 'Tamil', 'Malayalam']), ('How many states does India have?', '28', ['25', '29', '30']),
         ('What is the capital of India?', 'New Delhi', ['Mumbai', 'Kolkata', 'Chennai']), ('Which is the largest state of India by area?', 'Rajasthan', ['Maharashtra', 'Madhya Pradesh', 'Uttar Pradesh']), ('Which is the smallest state of India by area?', 'Goa', ['Sikkim', 'Tripura', 'Kerala']), ('The highest mountain peak in India is…', 'Kanchenjunga', ['Mount Everest', 'Nanda Devi', 'K2']),
         ('Which Indian city is known as the Pink City?', 'Jaipur', ['Jodhpur', 'Udaipur', 'Agra']), ('Which Indian city is known as the City of Lakes?', 'Udaipur', ['Jaipur', 'Jodhpur', 'Agra']), ('Which Indian city is called the Silicon Valley of India?', 'Bengaluru', ['Hyderabad', 'Chennai', 'Pune']), ('Which Indian city is called the City of Joy?', 'Kolkata', ['Mumbai', 'Delhi', 'Chennai']),
         ('The Hindi film industry based in Mumbai is called…', 'Bollywood', ['Tollywood', 'Kollywood', 'Hollywood']), ('Which Indian city is nicknamed the Blue City?', 'Jodhpur', ['Jaipur', 'Udaipur', 'Agra'])]
for q, a, w in INDIA:
    lv = 'easy' if any(x in q for x in ('national', 'currency', 'capital of India', 'Taj', 'Gateway', 'Independence', 'Republic', 'Father of the Nation', 'festival', 'first Prime', 'colour', 'Diwali', 'Holi', 'How many states')) else ('standard' if len(a) < 14 else 'challenge')
    gk(lv, q, a, w, 'india')
# world facts
WORLD = [('Which is the largest ocean on Earth?', 'Pacific Ocean', ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean'], 'easy'), ('Which is the largest continent?', 'Asia', ['Africa', 'Europe', 'North America'], 'easy'), ('Which is the smallest continent?', 'Australia (Oceania)', ['Europe', 'Antarctica', 'South America'], 'easy'),
         ('How many continents are there?', '7', ['5', '6', '8'], 'easy'), ('How many oceans are there?', '5', ['3', '4', '7'], 'easy'), ('Which is the largest country in the world by area?', 'Russia', ['Canada', 'China', 'USA'], 'easy'), ('Which is the smallest country in the world?', 'Vatican City', ['Monaco', 'Malta', 'San Marino'], 'standard'),
         ('Which is the highest mountain in the world?', 'Mount Everest', ['K2', 'Kanchenjunga', 'Mont Blanc'], 'easy'), ('Which is the largest hot desert in the world?', 'Sahara', ['Gobi', 'Kalahari', 'Thar'], 'easy'), ('Which is the tallest animal?', 'Giraffe', ['Elephant', 'Camel', 'Horse'], 'easy'),
         ('Which is the largest animal on Earth?', 'Blue whale', ['Elephant', 'Shark', 'Giraffe'], 'easy'), ('Which is the fastest land animal?', 'Cheetah', ['Lion', 'Horse', 'Leopard'], 'easy'), ('Which is the largest planet in our solar system?', 'Jupiter', ['Saturn', 'Earth', 'Neptune'], 'easy'), ('Which planet is known as the Red Planet?', 'Mars', ['Venus', 'Jupiter', 'Mercury'], 'easy'),
         ('Which is the capital of the world\'s most populated... no', '', [], ''), ('Which is the longest river in Europe? (flows through Russia)', 'Volga', ['Danube', 'Rhine', 'Thames'], 'challenge'), ('The river Thames flows through which city?', 'London', ['Paris', 'Rome', 'Berlin'], 'standard'), ('The river Seine flows through which city?', 'Paris', ['London', 'Rome', 'Madrid'], 'standard'),
         ('The river Nile is in which continent?', 'Africa', ['Asia', 'Europe', 'South America'], 'easy'), ('The Amazon rainforest is mostly in which country?', 'Brazil', ['Peru', 'Colombia', 'Argentina'], 'standard'), ('Which mountain range separates Europe from Asia?', 'Ural Mountains', ['Alps', 'Andes', 'Himalayas'], 'challenge'), ('The Alps are in which continent?', 'Europe', ['Asia', 'Africa', 'South America'], 'standard'),
         ('The Andes mountains are in which continent?', 'South America', ['Africa', 'Asia', 'Europe'], 'standard'), ('Which is the saltiest natural lake, so salty you can float easily?', 'Dead Sea', ['Lake Victoria', 'Lake Superior', 'Caspian Sea'], 'challenge'), ('Which country is known as the Land of the Rising Sun?', 'Japan', ['China', 'Thailand', 'India'], 'easy'),
         ('Which country is known as the Land of Thousand Lakes?', 'Finland', ['Norway', 'Sweden', 'Canada'], 'challenge'), ('Which country is called the Land of the Midnight Sun?', 'Norway', ['Egypt', 'Italy', 'Spain'], 'challenge'), ('Which country has a maple leaf on its flag?', 'Canada', ['USA', 'Australia', 'Norway'], 'easy'), ('Which country is famous for pyramids?', 'Egypt', ['Mexico only', 'India', 'Greece'], 'easy'),
         ('Which is the national animal of Australia?', 'Kangaroo', ['Koala', 'Emu', 'Crocodile'], 'easy'), ('Which animal is the national symbol of China?', 'Giant panda', ['Dragon', 'Tiger', 'Elephant'], 'easy'), ('Which bird is the national symbol of the United States?', 'Bald eagle', ['Hawk', 'Owl', 'Pigeon'], 'standard'), ('Which bird is the national symbol of New Zealand?', 'Kiwi', ['Emu', 'Penguin', 'Parrot'], 'standard'),
         ('Which animal is a national symbol of Canada?', 'Beaver', ['Moose only', 'Bear', 'Wolf'], 'challenge'), ('What are the primary colours?', 'Red, blue and yellow', ['Red, green and orange', 'Blue, green and purple', 'Black, white and grey'], 'easy'), ('Mixing blue and yellow makes which colour?', 'Green', ['Purple', 'Orange', 'Brown'], 'easy'), ('Mixing red and yellow makes which colour?', 'Orange', ['Green', 'Purple', 'Pink'], 'easy'),
         ('Mixing red and blue makes which colour?', 'Purple', ['Green', 'Orange', 'Brown'], 'easy'), ('How many colours are there in a rainbow?', '7', ['5', '6', '8'], 'easy'), ('What does the acronym VIBGYOR stand for?', 'The colours of the rainbow', ['Planets', 'Days of the week', 'Oceans'], 'standard'), ('How many days are there in a leap year?', '366', ['365', '364', '367'], 'easy'),
         ('How many days does February have in a leap year?', '29', ['28', '30', '31'], 'easy'), ('A leap year comes every…', '4 years', ['2 years', '3 years', '5 years'], 'easy'), ('How many months have 31 days?', '7', ['5', '6', '8'], 'standard'), ('How many seconds are there in a minute?', '60', ['30', '100', '90'], 'easy'), ('How many hours are there in a day?', '24', ['12', '48', '60'], 'easy'),
         ('How many players are there in a football team on the field?', '11', ['9', '10', '12'], 'easy'), ('How many players are there in a cricket team?', '11', ['9', '10', '12'], 'easy'), ('How many players are there in a basketball team on court?', '5', ['6', '7', '11'], 'standard'), ('How many players are there in a volleyball team on court?', '6', ['5', '7', '11'], 'standard'),
         ('How many players are there in a hockey team on the field?', '11', ['9', '10', '12'], 'standard'), ('How many stumps are there in cricket?', '3', ['2', '4', '5'], 'easy'), ('How many rings are there in the Olympic symbol?', '5', ['4', '6', '7'], 'easy'), ('How often are the Summer Olympic Games held?', 'Every 4 years', ['Every year', 'Every 2 years', 'Every 5 years'], 'easy'),
         ('Which sport is played at Wimbledon?', 'Tennis', ['Cricket', 'Golf', 'Football'], 'easy'), ('Which sport is the FIFA World Cup played in?', 'Football', ['Cricket', 'Hockey', 'Tennis'], 'easy'), ('In which sport is the term "love" used for zero?', 'Tennis', ['Cricket', 'Football', 'Golf'], 'challenge'), ('How many pieces does each player start with in chess?', '16', ['12', '14', '18'], 'standard'),
         ('How many squares are there on a chessboard?', '64', ['32', '48', '81'], 'standard'), ('Which medal is given for first place?', 'Gold', ['Silver', 'Bronze', 'Platinum'], 'easy'), ('Who is known as the Father of the Nation in the USA? (first President)', 'George Washington', ['Abraham Lincoln', 'Thomas Jefferson', 'Barack Obama'], 'standard'), ('Which US President is shown on the one-dollar bill?', 'George Washington', ['Abraham Lincoln', 'Barack Obama', 'John F. Kennedy'], 'challenge'),
         ('Who was the first man to walk on the Moon?', 'Neil Armstrong', ['Buzz Aldrin', 'Yuri Gagarin', 'Rakesh Sharma'], 'easy'), ('Who was the first man in space?', 'Yuri Gagarin', ['Neil Armstrong', 'Alan Shepard', 'Buzz Aldrin'], 'standard'), ('Who discovered gravity after seeing an apple fall (as the story goes)?', 'Isaac Newton', ['Albert Einstein', 'Galileo', 'Thomas Edison'], 'easy'),
         ('Who invented the telephone?', 'Alexander Graham Bell', ['Thomas Edison', 'Marconi', 'Nikola Tesla'], 'easy'), ('Who is famous for inventing the practical electric light bulb?', 'Thomas Edison', ['Alexander Graham Bell', 'Isaac Newton', 'James Watt'], 'easy'), ('Who invented the aeroplane?', 'The Wright brothers', ['Thomas Edison', 'Marconi', 'Newton'], 'easy'),
         ('Who discovered penicillin?', 'Alexander Fleming', ['Louis Pasteur', 'Edward Jenner', 'Marie Curie'], 'standard'), ('Who developed the theory of relativity?', 'Albert Einstein', ['Isaac Newton', 'Galileo', 'Stephen Hawking'], 'easy'), ('Who invented the World Wide Web?', 'Tim Berners-Lee', ['Bill Gates', 'Steve Jobs', 'Mark Zuckerberg'], 'standard'),
         ('Who developed the first smallpox vaccine?', 'Edward Jenner', ['Louis Pasteur', 'Alexander Fleming', 'Jonas Salk'], 'challenge'), ('Who invented the printing press in Europe?', 'Johannes Gutenberg', ['William Caxton', 'Leonardo da Vinci', 'Isaac Newton'], 'challenge'), ('Who painted the Mona Lisa?', 'Leonardo da Vinci', ['Michelangelo', 'Pablo Picasso', 'Vincent van Gogh'], 'easy'),
         ('Who painted "The Starry Night"?', 'Vincent van Gogh', ['Leonardo da Vinci', 'Pablo Picasso', 'Claude Monet'], 'standard'), ('Who wrote "Romeo and Juliet"?', 'William Shakespeare', ['Charles Dickens', 'Mark Twain', 'Roald Dahl'], 'easy'), ('Who wrote the Harry Potter books?', 'J.K. Rowling', ['Roald Dahl', 'Enid Blyton', 'C.S. Lewis'], 'easy'),
         ('Who wrote "Alice\'s Adventures in Wonderland"?', 'Lewis Carroll', ['Roald Dahl', 'J.M. Barrie', 'A.A. Milne'], 'standard'), ('Who wrote "The Jungle Book"?', 'Rudyard Kipling', ['R.K. Narayan', 'Ruskin Bond', 'Mark Twain'], 'standard'), ('Who wrote "Charlie and the Chocolate Factory"?', 'Roald Dahl', ['Enid Blyton', 'J.K. Rowling', 'Dr Seuss'], 'easy'),
         ('Who wrote "Malgudi Days"?', 'R.K. Narayan', ['Ruskin Bond', 'Premchand', 'Rabindranath Tagore'], 'standard'), ('Who wrote "Wings of Fire"?', 'A.P.J. Abdul Kalam', ['Jawaharlal Nehru', 'R.K. Narayan', 'Chetan Bhagat'], 'standard'), ('Who wrote the Ramayana?', 'Valmiki', ['Vyasa', 'Tulsidas', 'Kalidasa'], 'easy'), ('Who wrote the Mahabharata?', 'Ved Vyasa', ['Valmiki', 'Kalidasa', 'Tulsidas'], 'easy'),
         ('Who wrote "Peter Pan"?', 'J.M. Barrie', ['Lewis Carroll', 'A.A. Milne', 'Roald Dahl'], 'challenge'), ('Who wrote "Winnie-the-Pooh"?', 'A.A. Milne', ['J.M. Barrie', 'Roald Dahl', 'Enid Blyton'], 'challenge'), ('Who wrote "The Hobbit"?', 'J.R.R. Tolkien', ['C.S. Lewis', 'J.K. Rowling', 'Roald Dahl'], 'challenge'), ('Who wrote "Oliver Twist"?', 'Charles Dickens', ['Mark Twain', 'Jane Austen', 'Roald Dahl'], 'challenge'),
         ('Where is the Eiffel Tower?', 'Paris', ['London', 'Rome', 'Berlin'], 'easy'), ('Where is the Statue of Liberty?', 'New York', ['Washington, D.C.', 'Los Angeles', 'Chicago'], 'easy'), ('Where is the Great Wall located?', 'China', ['India', 'Japan', 'Mongolia'], 'easy'), ('Where are the Pyramids of Giza?', 'Egypt', ['Mexico', 'Peru', 'Sudan'], 'easy'),
         ('Where is the Colosseum?', 'Rome', ['Athens', 'Paris', 'Madrid'], 'standard'), ('Where is Big Ben?', 'London', ['Paris', 'Dublin', 'Edinburgh'], 'easy'), ('Where is the Leaning Tower of Pisa?', 'Italy', ['France', 'Spain', 'Greece'], 'easy'), ('Where is the Sydney Opera House?', 'Australia', ['New Zealand', 'USA', 'England'], 'easy'),
         ('Where is the statue Christ the Redeemer?', 'Rio de Janeiro, Brazil', ['Lima, Peru', 'Rome, Italy', 'Madrid, Spain'], 'standard'), ('Where is Machu Picchu?', 'Peru', ['Chile', 'Mexico', 'Brazil'], 'standard'), ('Where is the ancient city of Petra?', 'Jordan', ['Egypt', 'Iraq', 'Syria'], 'challenge'), ('Where is Mount Fuji?', 'Japan', ['China', 'Korea', 'Nepal'], 'easy'),
         ('Where is the Burj Khalifa?', 'Dubai, UAE', ['Doha, Qatar', 'Riyadh, Saudi Arabia', 'Cairo, Egypt'], 'easy'), ('Where is the Acropolis?', 'Athens, Greece', ['Rome, Italy', 'Cairo, Egypt', 'Istanbul, Turkey'], 'standard'), ('Where is Angkor Wat?', 'Cambodia', ['Thailand', 'Vietnam', 'Laos'], 'standard'), ('Where is Stonehenge?', 'England', ['Scotland', 'Ireland', 'France'], 'challenge'),
         ('Where is the Brandenburg Gate?', 'Berlin', ['Vienna', 'Munich', 'Prague'], 'challenge'), ('Where is the Golden Gate Bridge?', 'San Francisco', ['New York', 'Chicago', 'Seattle'], 'standard'), ('Where is the CN Tower?', 'Toronto', ['Montreal', 'Vancouver', 'Ottawa'], 'challenge'), ('Where is Mount Kilimanjaro?', 'Tanzania', ['Kenya', 'Uganda', 'Ethiopia'], 'challenge'),
         ('Where is the Great Barrier Reef?', 'Australia', ['Fiji', 'Indonesia', 'Philippines'], 'standard'), ('Which is the currency of Japan?', 'Yen', ['Won', 'Yuan', 'Baht'], 'easy'), ('Which is the currency of the United States?', 'Dollar', ['Pound', 'Euro', 'Rupee'], 'easy'), ('Which is the currency of the United Kingdom?', 'Pound sterling', ['Euro', 'Dollar', 'Franc'], 'easy'),
         ('Which is the currency of China?', 'Yuan', ['Yen', 'Won', 'Baht'], 'standard'), ('Which is the currency of Russia?', 'Ruble', ['Euro', 'Yuan', 'Zloty'], 'standard'), ('Which is the currency of Germany?', 'Euro', ['Mark', 'Franc', 'Pound'], 'easy'), ('Which is the currency of Switzerland?', 'Franc', ['Euro', 'Krona', 'Pound'], 'standard'),
         ('Which is the currency of Saudi Arabia?', 'Riyal', ['Dirham', 'Dinar', 'Rupee'], 'standard'), ('Which is the currency of the UAE?', 'Dirham', ['Riyal', 'Dinar', 'Rupee'], 'standard'), ('Which is the currency of Bangladesh?', 'Taka', ['Rupee', 'Rupiah', 'Ringgit'], 'standard'), ('Which is the currency of South Africa?', 'Rand', ['Dollar', 'Pound', 'Naira'], 'standard'),
         ('Which is the currency of Malaysia?', 'Ringgit', ['Rupiah', 'Baht', 'Peso'], 'challenge'), ('Which is the currency of Thailand?', 'Baht', ['Ringgit', 'Dong', 'Yen'], 'standard'), ('Which is the currency of Indonesia?', 'Rupiah', ['Ringgit', 'Baht', 'Peso'], 'challenge'), ('Which is the currency of Nigeria?', 'Naira', ['Rand', 'Cedi', 'Shilling'], 'challenge'),
         ('Which is the currency of South Korea?', 'Won', ['Yen', 'Yuan', 'Baht'], 'challenge'), ('Which is the currency of Brazil?', 'Real', ['Peso', 'Dollar', 'Euro'], 'challenge'), ('Which language is spoken in Brazil?', 'Portuguese', ['Spanish', 'English', 'French'], 'standard'), ('Which language is spoken in Egypt?', 'Arabic', ['Persian', 'Turkish', 'Hebrew'], 'standard'),
         ('Which language is spoken in Japan?', 'Japanese', ['Chinese', 'Korean', 'Thai'], 'easy'), ('Which language is spoken in Iran?', 'Persian (Farsi)', ['Arabic', 'Turkish', 'Urdu'], 'challenge'), ('Which language is spoken in Pakistan as the national language?', 'Urdu', ['Hindi', 'Arabic', 'Persian'], 'standard'), ('Which language is spoken in Bangladesh?', 'Bengali', ['Hindi', 'Urdu', 'Nepali'], 'standard'),
         ('Which language is spoken in Nepal as the official language?', 'Nepali', ['Hindi', 'Tibetan', 'Bengali'], 'standard'), ('Which language is spoken in Greece?', 'Greek', ['Latin', 'Italian', 'Turkish'], 'easy'), ('Which language is spoken in Argentina?', 'Spanish', ['Portuguese', 'English', 'French'], 'easy'), ('Which language is spoken in the Netherlands?', 'Dutch', ['German', 'French', 'Flemish only'], 'standard'),
         ('What do we call a person who studies plants?', 'Botanist', ['Zoologist', 'Geologist', 'Astronomer'], 'standard'), ('What do we call a person who studies animals?', 'Zoologist', ['Botanist', 'Geologist', 'Chemist'], 'standard'), ('What do we call a person who studies rocks?', 'Geologist', ['Botanist', 'Zoologist', 'Chemist'], 'standard'), ('What do we call a person who studies the stars?', 'Astronomer', ['Geologist', 'Botanist', 'Chemist'], 'standard'),
         ('Which festival is celebrated on 25 December?', 'Christmas', ['Easter', 'Diwali', 'Eid'], 'easy'), ('Which festival marks the end of Ramadan?', 'Eid al-Fitr', ['Diwali', 'Christmas', 'Easter'], 'standard'), ('Halloween is celebrated on which date?', '31 October', ['25 December', '1 January', '14 February'], 'standard'), ('Which day is celebrated as New Year\'s Day?', '1 January', ['25 December', '31 December', '14 February'], 'easy'),
         ('What is the name of the first month of the year?', 'January', ['February', 'December', 'March'], 'easy'), ('Which month comes after September?', 'October', ['August', 'November', 'December'], 'easy'), ('Which is the shortest month of the year?', 'February', ['April', 'June', 'September'], 'easy'), ('Which day comes after Wednesday?', 'Thursday', ['Tuesday', 'Friday', 'Saturday'], 'easy')]
for q, a, w, lv in WORLD:
    if not a: continue
    gk(lv, q, a, w, 'world')
# currencies / languages / shortcuts done above; flags: skip.
# capital-based Q from "which city" skip.

def dump(D, var, fn):
    out = {}
    for lv in LV:
        items = list(D[lv].values()); R.shuffle(items); out[lv] = items
    p = os.path.join(OUT, fn)
    with open(p, 'w') as f:
        f.write('/* Generated by tools/gen_subjects.py — do not edit by hand. Item = [question, answer, wrong1, wrong2, wrong3]. */\nwindow.%s=%s;\n' % (var, json.dumps(out, ensure_ascii=False, separators=(',', ':'))))
    print(fn, {k: len(v) for k, v in out.items()}, sum(len(v) for v in out.values()), os.path.getsize(p) // 1024, 'KB')
dump(EN, '_qbEng', 'qbank-english.js'); dump(GK, '_qbGk', 'qbank-gk.js')
