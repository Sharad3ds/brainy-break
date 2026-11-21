#!/usr/bin/env python3
"""Builds every Sea Animals fun-fact page from tools/facts_sea/*.py plus the Sea Animals topic page and Fun Facts hub.
Run from the repo root:  python3 tools/gen_sea.py        (generated files say 'do not edit by hand')"""
import os, sys, glob, importlib.util, html, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gen_funfact as G
from gen_funfact import sc, ch, cap, build, ROOT, HEAD

NAMES = dict(finn='Finn', blue='Bella', hump='Hugo', orca='Orla', beluga='Bibi', narwhal='Nico', sperm='Sam', seal='Pip', sealion='Leo', walrus='Wally', eseal='Ellie', manatee='Maggie', otter='Otto', penguin='Percy', seahorse='Harry', puffer='Puff', angler='Angie', manta='Mandy', wshark='Wanda', sword='Sid', flyfish='Skye', moray='Morgan', remora='Remy', jelly='Jojo', warship='Manny', star='Stella', cucumber='Cuke', urchin='Spike', sponge='Penny', coral='Coco', crab='Carl', hermit='Herman', lobster='Larry', mantis='Mia', pistol='Snap', squid='Gigi', nautilus='Nellie', turtle='Tilly', iguana='Iggy', dilly='Dilly', sunny='Sunny', ollie='Ollie')
SCALE = dict(finn=1.0, sunny=.8, ollie=.9, dilly=.8, blue=.62, hump=.66, orca=.7, beluga=.72, narwhal=.62, sperm=.66, seal=.95, sealion=.95, walrus=.95, eseal=.95, manatee=.9, otter=.95, penguin=.95, seahorse=1, puffer=.9, angler=.95, manta=.68, wshark=.8, sword=.8, flyfish=1, moray=.9, remora=1.2, jelly=1, warship=.9, star=1, cucumber=.95, urchin=1.1, sponge=1.05, coral=1, crab=1.05, hermit=1.05, lobster=.9, mantis=1.1, pistol=1.1, squid=.8, nautilus=.95, turtle=1, iguana=.85)
GROUPS = [('mammals', '🐋 Whales, Seals & Seabirds'), ('fish', '🐟 Fish & Sharks'), ('reef', '🪸 Reef, Jellies & Crabs'), ('reptiles', '🐢 Turtles & Reptiles')]
EXISTING = [dict(slug='octopus-three-hearts', icon='🐙', title='Why does an octopus have 3 hearts?', group='reef'), dict(slug='dolphin-sleep', icon='🐬', title='How do dolphins sleep without drowning?', group='mammals'), dict(slug='shark-teeth', icon='🦈', title='Why do sharks never run out of teeth?', group='fish')]

def fx(f, kind, rest):
    """one content-scene picture"""
    h, s = f['hero'], f.get('s', SCALE.get(f['hero'], .9)); X = f.get('hx', ''); hx = ch(h, 590, 262, s, X)
    if kind == 'hero':
        e, _, c = rest.rpartition('|') if '|' in rest else ('', '', rest)
        return ch(h, 400, 258, s * 1.15 if s < 1 else s, X) + cap(c, 400, 432) + (f'<text class="fx-in" x="690" y="150" font-size="70" text-anchor="middle">{e}</text>' if e else '')
    if kind == 'big':
        e, c = rest.split('|', 1)
        return f'<text class="fx-in" x="190" y="260" font-size="130" text-anchor="middle">{e}</text>' + hx + cap(c, 400, 432)
    if kind == 'num':
        n, c = rest.split('|', 1); fs = 130 if len(n) <= 4 else (100 if len(n) <= 6 else (78 if len(n) <= 9 else 58))
        return f'<g class="fx-in"><text x="230" y="270" font-size="{fs}" font-weight="800" fill="#FFD166" text-anchor="middle" stroke="#06183d" stroke-width="8" paint-order="stroke">{n}</text></g>' + cap(c, 230, 330) + ch(h, 620, 290, s * .8, X)
    if kind == 'trio':
        parts = [p.split('|') for p in rest.split(';')]; xs = [150, 400, 650]; o = ''
        for x, (e, l) in zip(xs, parts): o += f'<text class="fx-in" x="{x}" y="250" font-size="90" text-anchor="middle">{e}</text>' + cap(l, x, 312)
        return f'<g>{o}</g>' + ch(h, 120, 400, s * .45, X)
    if kind == 'pair':
        (e1, l1), (e2, l2) = [p.split('|') for p in rest.split(';')]
        return f'<g class="fx-in"><text x="200" y="250" font-size="110" text-anchor="middle">{e1}</text><text x="600" y="250" font-size="110" text-anchor="middle">{e2}</text></g><text class="ff-cap" x="400" y="240" text-anchor="middle">vs</text>' + cap(l1, 200, 312) + cap(l2, 600, 312) + ch(h, 400, 400, s * .45, X)
    raise ValueError(kind)

def make(f):
    h = f['hero']; n = NAMES[h]; a = f['animal']; sc_list = []
    if h == 'finn':
        sc_list.append(sc('Hello!', 'finn', f"Hi, I'm Finn the clownfish! {f['intro']}", 'top-left', 9500, 'pop', ch('finn', 400, 262, 1.5) + cap(f"{f['icon']} {f['tease']}", 400, 430, 'ff-cap fx-in')))
    else:
        sc_list.append(sc('Hello!', 'finn', f"Hi, I'm Finn! {f['intro']} Let's ask my friend {n} the {a}!", 'top-left', 9500, 'pop', ch('finn', 150, 330, .82) + ch(h, 570, 262, f.get('s', SCALE[h]), f.get('hx', '')) + cap(f"{f['icon']} {f['tease']}", 400, 430, 'ff-cap fx-in')))
    for who, text, vis in f['sc']:
        k, rest = vis.split(':', 1); w = h if who == 'h' else 'finn'
        side = 'top-right' if who == 'h' else 'top-left'
        body = fx(f, k, rest)
        if who == 'f' and h != 'finn': body += ch('finn', 70, 395, .5)
        sc_list.append(sc(rest.split('|')[-1][:24] if k != 'trio' else 'Why?', w, text, side, max(9000, 600 * len(text.split())), 'pop', body))
    sc_list.append(sc('Wrap-up', h, f['recap'] + " Now try the quiz below!", 'top-right', 9500, 'win', ch(h, 560, 262, f.get('s', SCALE[h]), f.get('hx', '')) + (ch('finn', 150, 340, .7) if h != 'finn' else '') + cap(f"{f['icon']} Amazing!", 400, 62, 'ff-cap fx-in')))
    quiz = [dict(q=q[0], o=[q[1], q[2], q[3], q[4]], why=q[5]) for q in f['quiz']]
    sib = f.get('_sib', [])
    return dict(slug=f['slug'], icon=f['icon'], crumb=f['crumb'] if 'crumb' in f else f['title'][:30], title=f['title'], desc=f.get('desc') or f"{f['hook']} A short cartoon with {n} the {a} and Finn the clownfish, plus the science and a quiz.",
        hook=f['hook'], alt=(f"Cartoon of {n} the {a} and Finn the fish" if h != 'finn' else 'Cartoon of Finn the clownfish'), cover=(ch(h, 560, 262, f.get('s', SCALE[h]), f.get('hx', '')) + ch('finn', 170, 330, .8)) if h != 'finn' else ch('finn', 400, 262, 1.5), cover_text=f.get('cover', 'Press play!'), hero=h, expert=f.get('expert', f"Perfect! You are a {a} expert."),
        end=f.get('end', 'You learned a new sea animal fact.'), scenes=sc_list, big=f['big'], table=None, why_title=f.get('why_title', 'How it works'), why=f['why'], stats=f['stats'], more_about=f.get('more_about', f['animal'] + 's'), more=f['more'], gloss=f['gloss'], quiz=quiz,
        sources=f['src'], siblings=sib, mins='1', **{'try': f"<p>{f['tryit']}</p>"})

def load():
    facts = []
    for fn in sorted(glob.glob(os.path.join(ROOT, 'tools/facts_sea/*.py'))):
        spec = importlib.util.spec_from_file_location('m', fn); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); facts += m.FACTS
    return facts

def main():
    facts = load(); allf = EXISTING + facts; slugs = [x['slug'] for x in allf]
    assert len(slugs) == len(set(slugs)), 'duplicate slug'
    for f in facts:
        grp = [x for x in allf if x['group'] == f['group'] and x['slug'] != f['slug']]; i = [x['slug'] for x in grp].index(grp[0]['slug']) if grp else 0
        pos = [k for k, x in enumerate(allf) if x['slug'] == f['slug']][0]
        sib = [x for x in (allf[pos + 1:] + allf[:pos]) if x['group'] == f['group']][:3]
        f['_sib'] = [(x['icon'], x['title'], f"/fun-facts/sea-animals/{x['slug']}/") for x in sib]
        d = os.path.join(ROOT, 'fun-facts/sea-animals', f['slug']); os.makedirs(d, exist_ok=True)
        open(os.path.join(d, 'index.html'), 'w').write(build(make(f)))
    # topic page
    secs = ''
    for key, label in GROUPS:
        cards = ''.join(f'<a class="topic-card" data-t="{html.escape(x["title"].lower())}" href="/fun-facts/sea-animals/{x["slug"]}/"><div class="em">{x["icon"]}</div><h2>{html.escape(x["title"])}</h2></a>' for x in allf if x['group'] == key)
        secs += f'<section class="ff-sec"><h2>{label}</h2><div class="topic-grid">{cards}</div></section>'
    topic = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Sea Animals Fun Facts for Kids | Brainy Break</title>
<meta name="description" content="{len(allf)} cartoon fun facts about whales, sharks, octopuses, turtles, jellyfish and more sea animals, each with a story, science and a quiz.">
<link rel="canonical" href="https://www.thebrainybreak.com/fun-facts/sea-animals/">
<link rel="stylesheet" href="/shared/styles.css"><link rel="stylesheet" href="/shared/funfact.css">
</head>
<body class="activity-page">
{HEAD}
<main class="activity-main"><div class="ff-page">
<div class="breadcrumb"><a href="/">Home</a><span>›</span><a href="/fun-facts/">Fun Facts</a><span>›</span><span>Sea Animals</span></div>
<h1>🌊 Sea Animals</h1><p class="ff-hook">{len(allf)} cartoon facts. Dive in with Finn the clownfish and his sea-animal friends!</p>
<p><input id="q" type="search" placeholder="Search facts… (try “shark”)" aria-label="Search facts" style="width:100%;max-width:420px;padding:12px 14px;border-radius:12px;border:2px solid #D8DDF0;font-size:1rem"></p>
{secs}
</div></main>
<footer class="activity-footer"><span>💡 Spot it. Solve it. Grow!</span><span><strong>Brainy Break</strong><br>Play. Learn. Think. Grow.</span></footer>
<script>var q=document.getElementById('q');q.addEventListener('input',function(){{var v=q.value.trim().toLowerCase();document.querySelectorAll('.topic-card').forEach(function(c){{c.style.display=!v||c.getAttribute('data-t').indexOf(v)>-1?'':'none'}});document.querySelectorAll('.ff-sec').forEach(function(s){{s.style.display=s.querySelector('.topic-card:not([style*="none"])')?'':'none'}})}});</script>
<script src="/shared/analytics.js"></script>
</body></html>'''
    open(os.path.join(ROOT, 'fun-facts/sea-animals/index.html'), 'w').write(topic)
    hp = os.path.join(ROOT, 'fun-facts/index.html'); t = open(hp).read()
    import re; t = re.sub(r'<span class="ff-chip">\d+ facts?</span>', f'<span class="ff-chip">{len(allf)} facts</span>', t, count=1); open(hp, 'w').write(t)
    print('facts', len(facts), 'total', len(allf))

if __name__ == '__main__':
    main()
