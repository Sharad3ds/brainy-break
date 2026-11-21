#!/usr/bin/env python3
"""Builds every Everyday Science fun-fact page from tools/facts_science/*.py plus the Everyday Science topic page and the Fun Facts hub card.
Run from the repo root:  python3 tools/gen_science.py   (generated files say 'do not edit by hand')"""
import os, sys, glob, importlib.util, html, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gen_funfact as G
import gen_sea as S
from gen_funfact import sc, ch, cap, build, ROOT, HEAD

G.BG = 'workshop'
GUIDE, GN = 'sparky', 'Sparky'
TOPIC = ('everyday-science', 'Everyday Science', '🔬')
NAMES = dict(sparky='Sparky', magnet='Maggie', bulb='Lumi', battery='Volt', flame='Blaze', ice='Frosty', balloon='Poppy', bubble='Bubbles', magnifier='Looky', prism='Prizzy', gear='Cogsworth', thermometer='Thermo', flask='Fizz', soccer='Kicker', speaker='Boomer', microscope='Micro', scale='Balance', rocket='Zoom', spring='Boing')
S.SCALE.update(dict(sparky=.8, magnet=1.0, bulb=1.05, battery=1.0, flame=1.05, ice=1.1, balloon=1.05, bubble=1.0, magnifier=1.0, prism=1.05, gear=1.0, thermometer=1.0, flask=1.05, soccer=1.0, speaker=1.0, microscope=1.0, scale=1.0, rocket=1.0, spring=1.0))
S.NAMES.update(NAMES)
GROUPS = [('forces', '🧲 Forces & Motion'), ('energy', '⚡ Energy & Electricity'), ('matter', '🧪 Matter & Materials'), ('light', '🌈 Light & Sound'), ('tools', '🔬 Tools & Thinking')]
EXISTING = []

def make(f):
    G.BG = f.get('bg', 'workshop')
    SC = S.SCALE; h = f['hero']; n = NAMES[h]; a = f['animal']; sc_list = []; hx = f.get('hx', ''); s = f.get('s', SC[h])
    sc_list.append(sc('Hello!', GUIDE, f"Hi, I'm {GN} the scientist! {f['intro']} Let's meet my friend {n} the {a}!", 'top-left', 9500, 'pop', ch(GUIDE, 150, 318, 1.05) + ch(h, 570, 262, s, hx) + cap(f"{f['icon']} {f['tease']}", 400, 430, 'ff-cap fx-in')))
    for who, text, vis in f['sc']:
        k, rest = vis.split(':', 1); w = h if who == 'h' else GUIDE
        body = S.fx(f, k, rest)
        if who == 'f': body += ch(GUIDE, 748, 372, .72)
        sc_list.append(sc(rest.split('|')[-1][:24] if k != 'trio' else 'Why?', w, text, 'top-right' if who == 'h' else 'top-left', max(9000, 600 * len(text.split())), 'pop', body))
    sc_list.append(sc('Wrap-up', h, f['recap'] + " Now try the quiz below!", 'top-right', 9500, 'win', ch(h, 560, 262, s, hx) + ch(GUIDE, 150, 330, .95) + cap(f"{f['icon']} Amazing!", 400, 62, 'ff-cap fx-in')))
    quiz = [dict(q=q[0], o=[q[1], q[2], q[3], q[4]], why=q[5]) for q in f['quiz']]
    return dict(slug=f['slug'], icon=f['icon'], crumb=f.get('crumb', f['title'][:30]), title=f['title'], desc=f.get('desc') or f"{f['hook']} A short cartoon with {n} the {a} and {GN} the scientist, plus the science and a quiz.",
        hook=f['hook'], alt=f"Cartoon of {n} the {a} and {GN} the scientist", cover=ch(h, 560, 262, s, hx) + ch(GUIDE, 170, 330, .95), cover_text=f.get('cover', 'Press play!'), hero=h, expert=f.get('expert', f"Perfect! You are a {a} expert."),
        end=f.get('end', 'You learned a new science fact.'), scenes=sc_list, big=f['big'], table=None, why_title=f.get('why_title', 'How it works'), why=f['why'], stats=f['stats'], more_about=f.get('more_about', 'nature'), more=f['more'], gloss=f['gloss'], quiz=quiz,
        sources=f['src'], siblings=f.get('_sib', []), mins='1', bg=f.get('bg', 'workshop'), topic=TOPIC, scripts='<script src="/shared/fun-science.js"></script>', **{'try': f"<p>{f['tryit']}</p>"})

def load():
    facts = []
    for fn in sorted(glob.glob(os.path.join(ROOT, 'tools/facts_science/*.py'))):
        spec = importlib.util.spec_from_file_location('m', fn); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); facts += m.FACTS
    return facts

def main():
    facts = load(); allf = facts; slugs = [x['slug'] for x in allf]
    assert len(slugs) == len(set(slugs)), 'duplicate slug'
    for f in facts:
        pos = slugs.index(f['slug']); sib = [x for x in (allf[pos + 1:] + allf[:pos]) if x['group'] == f['group']][:3]
        f['_sib'] = [(x['icon'], x['title'], f"/fun-facts/everyday-science/{x['slug']}/") for x in sib]
        d = os.path.join(ROOT, 'fun-facts/everyday-science', f['slug']); os.makedirs(d, exist_ok=True)
        open(os.path.join(d, 'index.html'), 'w').write(build(make(f)))
    secs = ''
    for key, label in GROUPS:
        cards = ''.join(f'<a class="topic-card" data-t="{html.escape(x["title"].lower())}" href="/fun-facts/everyday-science/{x["slug"]}/"><div class="em">{x["icon"]}</div><h2>{html.escape(x["title"])}</h2></a>' for x in allf if x['group'] == key)
        if cards: secs += f'<section class="ff-sec"><h2>{label}</h2><div class="topic-grid">{cards}</div></section>'
    topic = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Everyday Science Fun Facts for Kids | Brainy Break</title>
<meta name="description" content="{len(allf)} cartoon fun facts about forces, energy, materials, light and sound, each with a story, science and a quiz.">
<link rel="canonical" href="https://www.thebrainybreak.com/fun-facts/everyday-science/">
<link rel="stylesheet" href="/shared/styles.css"><link rel="stylesheet" href="/shared/funfact.css">
</head>
<body class="activity-page">
{HEAD}
<main class="activity-main"><div class="ff-page">
<div class="breadcrumb"><a href="/">Home</a><span>›</span><a href="/fun-facts/">Fun Facts</a><span>›</span><span>Everyday Science</span></div>
<h1>🔬 Everyday Science</h1><p class="ff-hook">{len(allf)} cartoon facts. Experiment with Sparky the scientist and her science friends!</p>
<p><input id="q" type="search" placeholder="Search facts… (try “magnet”)" aria-label="Search facts" style="width:100%;max-width:420px;padding:12px 14px;border-radius:12px;border:2px solid #D8DDF0;font-size:1rem"></p>
{secs}
</div></main>
<footer class="activity-footer"><span>💡 Spot it. Solve it. Grow!</span><span><strong>Brainy Break</strong><br>Play. Learn. Think. Grow.</span></footer>
<script>var q=document.getElementById('q');q.addEventListener('input',function(){{var v=q.value.trim().toLowerCase();document.querySelectorAll('.topic-card').forEach(function(c){{c.style.display=!v||c.getAttribute('data-t').indexOf(v)>-1?'':'none'}});document.querySelectorAll('.ff-sec').forEach(function(s){{s.style.display=[].some.call(s.querySelectorAll('.topic-card'),function(c){{return c.style.display!=='none'}})?'':'none'}})}});</script>
<script src="/shared/analytics.js"></script>
</body></html>'''
    os.makedirs(os.path.join(ROOT, 'fun-facts/everyday-science'), exist_ok=True)
    open(os.path.join(ROOT, 'fun-facts/everyday-science/index.html'), 'w').write(topic)
    hp = os.path.join(ROOT, 'fun-facts/index.html'); t = open(hp).read()
    live = f'<a class="topic-card" href="/fun-facts/everyday-science/"><div class="em">🔬</div><h2>Everyday Science</h2><p>Why things work.</p><span class="ff-chip">{len(allf)} facts</span></a>'
    t = re.sub(r'<div class="topic-card soon"><div class="em">🔬</div>.*?</div>(?=<div class="topic-card|</div>)', live, t, count=1, flags=re.S) if 'topic-card soon"><div class="em">🔬' in t else re.sub(r'<a class="topic-card" href="/fun-facts/everyday-science/">.*?</a>', live, t, count=1, flags=re.S)
    open(hp, 'w').write(t)
    print('science facts', len(facts))

if __name__ == '__main__':
    main()
