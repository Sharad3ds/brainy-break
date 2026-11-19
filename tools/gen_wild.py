#!/usr/bin/env python3
"""Builds every Wild Animals fun-fact page from tools/facts_wild/*.py plus the Wild Animals topic page and the Fun Facts hub card.
Run from the repo root:  python3 tools/gen_wild.py   (generated files say 'do not edit by hand')"""
import os, sys, glob, importlib.util, html, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gen_funfact as G
import gen_sea as S
from gen_funfact import sc, ch, cap, build, ROOT, HEAD

G.BG = 'land'
GUIDE, GN = 'kiki', 'Kiki'
TOPIC = ('wild-animals', 'Wild Animals', '🦁')
NAMES = dict(owl='Olive', hummer='Hana', eagle='Edgar', ostrich='Otis', flamingo='Flora', crow='Cato', woodpecker='Woody', albatross='Alba', toucan='Tico', peacock='Pavo', chimp='Charlie', gorilla='Gus', orang='Ora', sloth='Sloane', bat='Bree', meerkat='Milo', platypus='Pat', armadillo='Arlo', hedgehog='Hattie', pangolin='Pia', elephant='Ellie', giraffe='Gigi', hippo='Hugo', rhino='Rocky', zebra='Zuri', kangaroo='Kip', koala='Kara', camel='Cami', moose='Moe', kiki='Kiki', lion='Leo', tiger='Tara', cheetah='Chip', leopard='Lola', snowleopard='Sasha', wolf='Wyatt', hyena='Hazel', polar='Polly', brown='Barney', panda='Pandy')
S.SCALE.update(dict(kiki=.8, lion=.85, tiger=.85, cheetah=.85, leopard=.85, snowleopard=.85, wolf=.85, hyena=.85, polar=.8, brown=.8, panda=.8, elephant=.9, giraffe=.72, hippo=.85, rhino=.85, zebra=.85, kangaroo=.75, koala=.9, camel=.8, moose=.85, owl=.85, hummer=.95, eagle=.8, ostrich=.72, flamingo=.7, crow=.85, woodpecker=.7, albatross=.7, toucan=.8, peacock=.7, chimp=.85, gorilla=.85, orang=.85, sloth=.85, bat=.6, meerkat=.8, platypus=.85, armadillo=.85, hedgehog=.9, pangolin=.85))
S.NAMES.update(NAMES)
GROUPS = [('carn', '🦁 Big Cats & Hunters'), ('herb', '🐘 Giants of the Savanna & Forest'), ('small', '🐒 Clever Climbers & Small Mammals'), ('birds', '🦅 Amazing Birds')]
EXISTING = []

def make(f):
    G.BG = f.get('bg', 'land')
    SC = S.SCALE; h = f['hero']; n = NAMES[h]; a = f['animal']; sc_list = []; hx = f.get('hx', ''); s = f.get('s', SC[h])
    sc_list.append(sc('Hello!', GUIDE, f"Hi, I'm {GN} the parrot! {f['intro']} Let's ask my friend {n} the {a}!", 'top-left', 9500, 'pop', ch(GUIDE, 150, 300, .75) + ch(h, 570, 262, s, hx) + cap(f"{f['icon']} {f['tease']}", 400, 430, 'ff-cap fx-in')))
    for who, text, vis in f['sc']:
        k, rest = vis.split(':', 1); w = h if who == 'h' else GUIDE
        body = S.fx(f, k, rest)
        if who == 'f': body += ch(GUIDE, 70, 380, .42)
        sc_list.append(sc(rest.split('|')[-1][:24] if k != 'trio' else 'Why?', w, text, 'top-right' if who == 'h' else 'top-left', max(9000, 600 * len(text.split())), 'pop', body))
    sc_list.append(sc('Wrap-up', h, f['recap'] + " Now try the quiz below!", 'top-right', 9500, 'win', ch(h, 560, 262, s, hx) + ch(GUIDE, 150, 320, .62) + cap(f"{f['icon']} Amazing!", 400, 62, 'ff-cap fx-in')))
    quiz = [dict(q=q[0], o=[q[1], q[2], q[3], q[4]], why=q[5]) for q in f['quiz']]
    return dict(slug=f['slug'], icon=f['icon'], crumb=f.get('crumb', f['title'][:30]), title=f['title'], desc=f.get('desc') or f"{f['hook']} A short cartoon with {n} the {a} and {GN} the parrot, plus the science and a quiz.",
        hook=f['hook'], alt=f"Cartoon of {n} the {a} and {GN} the parrot", cover=ch(h, 560, 262, s, hx) + ch(GUIDE, 170, 320, .7), cover_text=f.get('cover', 'Press play!'), hero=h, expert=f.get('expert', f"Perfect! You are a {a} expert."),
        end=f.get('end', 'You learned a new wild animal fact.'), scenes=sc_list, big=f['big'], table=None, why_title=f.get('why_title', 'How it works'), why=f['why'], stats=f['stats'], more_about=f.get('more_about', f['animal'] + 's'), more=f['more'], gloss=f['gloss'], quiz=quiz,
        sources=f['src'], siblings=f.get('_sib', []), mins='1', bg=f.get('bg', 'land'), topic=TOPIC, scripts='<script src="/shared/fun-wild.js"></script>', **{'try': f"<p>{f['tryit']}</p>"})

def load():
    facts = []
    for fn in sorted(glob.glob(os.path.join(ROOT, 'tools/facts_wild/*.py'))):
        spec = importlib.util.spec_from_file_location('m', fn); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); facts += m.FACTS
    return facts

def main():
    facts = load(); allf = facts; slugs = [x['slug'] for x in allf]
    assert len(slugs) == len(set(slugs)), 'duplicate slug'
    for f in facts:
        pos = slugs.index(f['slug']); sib = [x for x in (allf[pos + 1:] + allf[:pos]) if x['group'] == f['group']][:3]
        f['_sib'] = [(x['icon'], x['title'], f"/fun-facts/wild-animals/{x['slug']}/") for x in sib]
        d = os.path.join(ROOT, 'fun-facts/wild-animals', f['slug']); os.makedirs(d, exist_ok=True)
        open(os.path.join(d, 'index.html'), 'w').write(build(make(f)))
    secs = ''
    for key, label in GROUPS:
        cards = ''.join(f'<a class="topic-card" data-t="{html.escape(x["title"].lower())}" href="/fun-facts/wild-animals/{x["slug"]}/"><div class="em">{x["icon"]}</div><h2>{html.escape(x["title"])}</h2></a>' for x in allf if x['group'] == key)
        if cards: secs += f'<section class="ff-sec"><h2>{label}</h2><div class="topic-grid">{cards}</div></section>'
    topic = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Wild Animals Fun Facts for Kids | Brainy Break</title>
<meta name="description" content="{len(allf)} cartoon fun facts about lions, tigers, wolves, bears, elephants and more wild animals, each with a story, science and a quiz.">
<link rel="canonical" href="https://www.thebrainybreak.com/fun-facts/wild-animals/">
<link rel="stylesheet" href="/shared/styles.css"><link rel="stylesheet" href="/shared/funfact.css">
</head>
<body class="activity-page">
{HEAD}
<main class="activity-main"><div class="ff-page">
<div class="breadcrumb"><a href="/">Home</a><span>›</span><a href="/fun-facts/">Fun Facts</a><span>›</span><span>Wild Animals</span></div>
<h1>🦁 Wild Animals</h1><p class="ff-hook">{len(allf)} cartoon facts. Go on a safari with Kiki the parrot and her wild friends!</p>
<p><input id="q" type="search" placeholder="Search facts… (try “lion”)" aria-label="Search facts" style="width:100%;max-width:420px;padding:12px 14px;border-radius:12px;border:2px solid #D8DDF0;font-size:1rem"></p>
{secs}
</div></main>
<footer class="activity-footer"><span>💡 Spot it. Solve it. Grow!</span><span><strong>Brainy Break</strong><br>Play. Learn. Think. Grow.</span></footer>
<script>var q=document.getElementById('q');q.addEventListener('input',function(){{var v=q.value.trim().toLowerCase();document.querySelectorAll('.topic-card').forEach(function(c){{c.style.display=!v||c.getAttribute('data-t').indexOf(v)>-1?'':'none'}});document.querySelectorAll('.ff-sec').forEach(function(s){{s.style.display=[].some.call(s.querySelectorAll('.topic-card'),function(c){{return c.style.display!=='none'}})?'':'none'}})}});</script>
<script src="/shared/analytics.js"></script>
</body></html>'''
    os.makedirs(os.path.join(ROOT, 'fun-facts/wild-animals'), exist_ok=True)
    open(os.path.join(ROOT, 'fun-facts/wild-animals/index.html'), 'w').write(topic)
    hp = os.path.join(ROOT, 'fun-facts/index.html'); t = open(hp).read()
    live = f'<a class="topic-card" href="/fun-facts/wild-animals/"><div class="em">🦁</div><h2>Wild Animals</h2><p>Lions, elephants, giraffes.</p><span class="ff-chip">{len(allf)} facts</span></a>'
    t = re.sub(r'<div class="topic-card soon"><div class="em">🦁</div>.*?</div>(?=<div class="topic-card|</div>)', live, t, count=1, flags=re.S) if 'topic-card soon"><div class="em">🦁' in t else re.sub(r'<a class="topic-card" href="/fun-facts/wild-animals/">.*?</a>', live, t, count=1, flags=re.S)
    open(hp, 'w').write(t)
    print('wild facts', len(facts))

if __name__ == '__main__':
    main()
