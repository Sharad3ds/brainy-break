#!/usr/bin/env python3
"""Generates Fun Fact pages (dolphin sleep, shark teeth) from data below. Run from repo root: python3 tools/gen_funfact.py"""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HEAD = open(os.path.join(ROOT, 'games/index.html')).read().split('\n')[14].replace('<a href="/games/" class="active">', '<a href="/games/">')
BASE = 'https://www.thebrainybreak.com'

BG = 'shallow'

def sc(title, who, say, side, dur, sfx, body, bg=None):
    bg = bg or BG
    return (f'<g class="ff-scene" data-title="{title}" data-who="{who}" data-side="{side}" data-dur="{dur}" data-sfx="{sfx}" data-say="{say}">'
            f'<g data-bg="{bg}"></g>{body}</g>')

def ch(k, x, y, s, extra=''):
    return f'<g data-char="{k}" data-x="{x}" data-y="{y}" data-s="{s}" {extra}></g>'

def cap(t, x=400, y=430, cls='ff-cap sm'):
    return f'<text class="{cls}" x="{x}" y="{y}" text-anchor="middle">{t}</text>'

def build(f):
    scenes = ''.join(f['scenes'])
    cards = ''.join(f'<div class="ff-card"><div class="em">{e}</div><h3>{t}</h3><p>{d}</p></div>' for e, t, d in f['why'])
    stats = ''.join(f'<div class="ff-stat"><b>{b}</b><span>{l}</span></div>' for b, l in f['stats'])
    more = ''.join(f'<li>{m}</li>' for m in f['more'])
    gloss = ''.join(f'<dt>{a}</dt><dd>{b}</dd>' for a, b in f['gloss'])
    rows = ''.join(f'<tr><td>{a}</td><td>{b}</td><td>{c}</td></tr>' for a, b, c in f['table']['rows']) if f.get('table') else ''
    tablehtml = (f"<section class=\"ff-sec\"><h2>{f['table']['title']}</h2><table class=\"ff-table\"><thead><tr><th>{f['table']['h'][0]}</th><th>{f['table']['h'][1]}</th><th>{f['table']['h'][2]}</th></tr></thead><tbody>{rows}</tbody></table></section>" if f.get('table') else '')
    srcs = ''.join(f'<li><a href="{u}" rel="noopener" target="_blank">{t}</a></li>' for t, u in f['sources'])
    sibs = ''.join(f'<a class="topic-card" href="{u}"><div class="em">{e}</div><h2>{t}</h2></a>' for e, t, u in f['siblings'])
    T = f.get('topic', ('sea-animals', 'Sea Animals', '🌊')); url = f'/fun-facts/{T[0]}/{f["slug"]}/'
    ld = json.dumps({"@context": "https://schema.org", "@type": "Article", "headline": f['title'], "description": f['desc'], "author": {"@type": "Organization", "name": "Brainy Break"}, "mainEntityOfPage": BASE + url})
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{f['title']} Fun Fact for Kids | Brainy Break</title>
<meta name="description" content="{f['desc']}">
<link rel="canonical" href="{BASE}{url}">
<meta property="og:title" content="{f['title']} | Brainy Break"><meta property="og:description" content="{f['desc']}">
<meta name="twitter:card" content="summary">
<link rel="stylesheet" href="/shared/styles.css"><link rel="stylesheet" href="/shared/funfact.css">
<script type="application/ld+json">{ld}</script>
</head>
<body class="activity-page">
{HEAD}
<main class="activity-main"><div class="ff-page">
<div class="breadcrumb"><a href="/">Home</a><span>›</span><a href="/fun-facts/">Fun Facts</a><span>›</span><a href="/fun-facts/{T[0]}/">{T[1]}</a><span>›</span><span>{f['crumb']}</span></div>
<div class="ff-hero"><span class="ff-chip">{T[2]} {T[1]}</span><span class="ff-chip">⏱ {f.get('mins','2')} min watch</span></div>
<h1>{f['icon']} {f['title']}</h1>
<p class="ff-hook">{f['hook']}</p>
<div class="ff-player" tabindex="0" aria-label="Cartoon explainer: {f['crumb']}">
<div class="ff-stage"><svg viewBox="0 0 800 450" role="img" aria-label="{f['alt']}">{scenes}</svg>
<div class="ff-bubble" hidden><span class="ff-bubble-who"></span><span class="ff-bubble-text"></span></div>
<button class="ff-cover" type="button" data-act="cover" aria-label="Play cartoon"><svg viewBox="0 0 800 450"><g data-bg="{f.get('bg', 'shallow')}"></g>{f['cover']}</svg><span class="big">▶</span><span class="t">{f['cover_text']}</span></button>
<div class="ff-end" hidden><h2 style="margin:0">🎉 Great job!</h2><p style="margin:0">{f['end']}</p><button class="ff-btn" data-act="replay" type="button">↻ Watch again</button><a class="ff-btn" style="display:inline-flex;align-items:center;text-decoration:none" href="#quiz">Take the quiz ↓</a></div></div>
<div class="ff-progress"><div class="ff-progress-bar"></div></div>
<div class="ff-controls"><button data-act="prev" type="button" aria-label="Previous scene">⏮</button><button data-act="play" type="button" aria-label="Play">▶</button><button data-act="next" type="button" aria-label="Next scene">⏭</button><span class="ff-scene-name" aria-live="polite"></span><button data-act="speed" type="button" aria-label="Speed">1×</button><button data-act="voice" type="button" class="on" aria-pressed="true" aria-label="Voice on/off">🗣</button><button data-act="full" type="button" aria-label="Full screen">⛶</button><button data-act="sound" type="button" class="on" aria-pressed="true" aria-label="Sound effects">🔊</button></div>
<div class="ff-dots"></div></div>
<p class="ff-note">Tip: 🗣 turns the voices on or off (you can choose better voices below), 🔊 turns sound effects on or off. Space pauses, arrow keys change scene, F toggles full screen.</p>

<section class="ff-sec"><h2>The big idea</h2><div class="ff-big">{f['big']}</div></section>
{tablehtml}
<section class="ff-sec"><h2>{f['why_title']}</h2><div class="ff-grid">{cards}</div></section>
<section class="ff-sec"><h2>Quick stats</h2><div class="ff-stats">{stats}</div></section>
<section class="ff-sec"><h2>More about {f['more_about']}</h2><ul>{more}</ul></section>
<section class="ff-sec"><h2>Words to know</h2><dl class="ff-gloss">{gloss}</dl></section>
<section class="ff-sec"><div class="ff-try"><h2>🧪 Try it yourself</h2>{f['try']}</div></section>
<section class="ff-sec" id="quiz"><h2>Quiz time!</h2><div class="ff-quiz" data-hero="{f['hero']}" data-expert="{f['expert']}"><div class="ff-qprog"></div><div class="ff-q"></div><div class="ff-a"></div><div class="ff-fb" aria-live="polite"></div><button class="ff-btn ff-qnext" type="button" hidden>Next</button><script type="application/json">{json.dumps(f['quiz'])}</script></div></section>
<section class="ff-sec"><h2>Sources</h2><ul class="ff-src">{srcs}</ul></section>
<section class="ff-sec"><h2>More {T[1]}</h2><div class="topic-grid">{sibs}</div></section>
</div></main>
<footer class="activity-footer"><span>💡 Spot it. Solve it. Grow!</span><span><strong>Brainy Break</strong><br>Play. Learn. Think. Grow.</span></footer>
<script src="/shared/funfact.js"></script>{f.get('scripts', '<script src="/shared/fun-characters.js"></script>')}<script>FF.init('.ff-player');FF.quiz();</script>
<script src="/shared/analytics.js"></script>
</body></html>'''

# ------------------------------------------------------------------ DOLPHIN
Z = '<text class="zz z1" x="470" y="150" font-size="34" font-weight="800" fill="#fff">z</text><text class="zz z2" x="500" y="130" font-size="42" font-weight="800" fill="#fff">Z</text><text class="zz z3" x="530" y="110" font-size="30" font-weight="800" fill="#fff">z</text>'
dolphin = dict(
 slug='dolphin-sleep', icon='🐬', crumb='Dolphin sleep', title='How Do Dolphins Sleep Without Drowning?',
 desc='Dolphins sleep with half their brain at a time and one eye open! Watch Dilly the dolphin and Finn the clownfish explain, then take the quiz.',
 hook='Press play and meet Dilly the dolphin. She will show you how to sleep with half a brain!', alt='Cartoon of Dilly the dolphin and Finn the fish',
 cover=ch('dilly', 520, 250, .9) + ch('finn', 170, 320, .8), cover_text='Watch: half-brain sleep?!', hero='dilly', expert='Perfect! You are a dolphin sleep expert.',
 end='You learned how dolphins sleep without drowning.',
 scenes=[
  sc('Hello!', 'finn', "Hi, I'm Finn! Here is a puzzle: how do dolphins sleep without drowning? Let's ask my friend Dilly the dolphin!", 'top-left', 9000, 'pop',
     ch('finn', 180, 310, .85) + ch('dilly', 560, 260, .8) + cap('🐬 Sleep puzzle', 400, 430, 'ff-cap fx-in')),
  sc('Breathing', 'dilly', "Hi! Unlike a fish, I breathe air, and I have to think about every breath. I swim up to the surface to breathe, so I can never fall into a deep, still sleep like people do.", 'top-right', 11000, 'whoosh',
     '<path d="M0,95 Q50,80 100,95 T200,95 T300,95 T400,95 T500,95 T600,95 T700,95 T800,95 L800,0 L0,0Z" fill="#bfe9ff" opacity=".55"/><g transform="translate(400 300)"><g class="fx-rise">' + ch('dilly', 0, 0, .75) + '</g></g>' + cap('💨 Breathing air at the surface', 400, 430)),
  sc('Half a brain', 'dilly', "So I sleep with half of my brain at a time! Look: one half of my brain snoozes while the other half stays wide awake.", 'top-left', 10000, 'pop',
     ch('dilly', 440, 315, 1, 'data-xray') + '' +
     '<text class="ff-lab" x="40" y="215">Sleeping half 💤</text><text class="ff-lab" x="590" y="215">Awake half 👀</text>'),
  sc('One eye open', 'dilly', "The eye on the opposite side from the sleeping half stays closed. The awake half keeps watch for danger, and it tells me when to breathe.", 'top-left', 11000, 'pop',
     ch('dilly', 450, 315, 1, 'data-xray data-cls="closed"') + '<text class="ff-lab" x="120" y="360">One eye closed 😴</text><text class="ff-lab" x="520" y="400">Awake half is on guard 🛡</text>'),
  sc('Resting', 'dilly', "When I rest, I may float near the surface or swim very slowly. Each half of my brain gets about four hours of deep sleep every day.", 'top-right', 10000, 'pop',
     '<circle cx="680" cy="80" r="42" fill="#fff6c9"/><circle cx="662" cy="68" r="38" fill="#0b2a63"/><g transform="translate(180 290)"><g class="fx-drift">' + ch('dilly', 0, 0, .8, 'data-cls="closed"') + '</g></g>' + Z + cap('⏱ About 4 hours of deep sleep per brain half', 400, 430)),
  sc('Why?', 'finn', "Why sleep like this? It helps dolphins avoid drowning, stay alert for danger, and keep warm in cold water!", 'top-left', 10000, 'pop',
     '<g class="fx-in"><text x="150" y="250" font-size="90" text-anchor="middle">🫧</text><text x="400" y="250" font-size="90" text-anchor="middle">👀</text><text x="650" y="250" font-size="90" text-anchor="middle">🔥</text></g>' + cap('No drowning', 150, 310) + cap('Stay alert', 400, 310) + cap('Stay warm', 650, 310) + ch('finn', 110, 400, .5)),
  sc('Wrap-up', 'dilly', "So remember: half a brain asleep, one eye open, and a trip to the surface for air. Dolphins are amazing! Now try the quiz below!", 'top-right', 10000, 'win',
     ch('dilly', 450, 270, .95) + ch('finn', 140, 330, .7) + cap('🐬 💤 👁', 400, 62, 'ff-cap fx-in')),
 ],
 big='A dolphin sleeps with <b>half of its brain at a time</b>. One half rests while the other half stays awake to <b>watch for danger</b> and <b>control breathing</b>, so the dolphin never forgets to come up for air.',
 table=dict(title='Half asleep, half awake', h=['Brain half', 'State', 'Job'], rows=[
  ('🧠 One half', 'Asleep (deep sleep)', 'Rests and recovers. The eye on the opposite side stays closed.'),
  ('🧠 Other half', 'Awake', 'Watches for danger and keeps controlling breathing.')]),
 why_title='Why sleep with half a brain?',
 why=[('🫧', 'Avoid drowning', 'Dolphins breathe air on purpose, not automatically. The awake half makes sure they surface for breaths.'),
      ('👀', 'Stay alert', 'The awake half keeps watch for sharks and other dangers, even during sleep.'),
      ('🔥', 'Stay warm', 'Staying active in cold water helps a dolphin keep its body heat.')],
 stats=[('½', 'of the brain sleeps at a time'), ('4 h', 'deep sleep for each brain half, per day'), ('1', 'eye closed at a time'), ('0', 'breaths forgotten!')],
 more_about='dolphins', more=['Dolphins are mammals, not fish. They breathe air through a blowhole on top of the head.', 'They live in family groups called pods.', 'They find food with echolocation: they make clicks and listen for the echoes.'],
 gloss=[('Hemisphere', 'One half of the brain. A brain has two.'), ('Blowhole', 'The nose on top of a dolphin’s head that it uses to breathe.'), ('Pod', 'A family group of dolphins.')],
 **{'try': '<p>Try holding your breath for 10 seconds, then breathe out. You can do that on purpose, just like a dolphin! Now think: you breathe even when you are asleep without trying. A dolphin has to be awake enough to breathe every time.</p>'},
 quiz=[{"q": "How much of its brain does a dolphin sleep with at a time?", "o": ["Half", "All of it", "A tiny bit", "None"], "why": "Only one half of the brain sleeps at a time."},
       {"q": "What does the awake half of the brain do?", "o": ["Watches for danger and controls breathing", "Makes ink", "Counts the waves", "Sings songs"], "why": "It keeps watch and makes sure the dolphin breathes."},
       {"q": "What happens to the eye on the opposite side from the sleeping half?", "o": ["It closes", "It glows", "It turns blue", "It falls out"], "why": "That eye closes while the other stays open."},
       {"q": "Why can dolphins not fall into a deep, still sleep?", "o": ["They must surface to breathe air", "They do not need sleep", "They are afraid of the dark", "They are too hot"], "why": "Dolphins breathe air on purpose, so they cannot sleep deeply."}],
 sources=[('Live Science: How Do Dolphins Sleep?', 'https://www.livescience.com/44822-how-do-dolphins-sleep.html'), ('Indiana Public Media: Sleeping in the Deep', 'https://indianapublicmedia.org/amomentofscience/sleeping-in-the-deep/')],
 siblings=[('🐙', 'Why does an octopus have 3 hearts?', '/fun-facts/sea-animals/octopus-three-hearts/'), ('🦈', 'Shark teeth', '/fun-facts/sea-animals/shark-teeth/')])

# ------------------------------------------------------------------ SHARK
def teeth_rows(y, size, op, shift):
    t = ''
    for i in range(-1, 12):
        x = 40 + i * 70 + shift
        t += f'<path d="M{x},{y} l{size*.4:.0f},-{size} l{size*.4:.0f},{size}z" fill="#fff" stroke="#9fb3c4" stroke-width="2"/>'
    return f'<g class="belt" opacity="{op}">{t}</g>'
def jaw(n):
    return ('<defs><clipPath id="jawclip'+n+'"><rect x="90" y="150" width="620" height="230" rx="30"/></clipPath></defs><rect x="90" y="150" width="620" height="230" rx="30" fill="#FF9FB3" stroke="#d96a86" stroke-width="5"/>'
       '<g clip-path="url(#jawclip'+n+')"><g transform="translate(-70 0)">' + teeth_rows(235, 62, 1, 0) + teeth_rows(300, 44, .8, 35) + teeth_rows(352, 28, .55, 0) + '</g></g>')
shark = dict(
 slug='shark-teeth', icon='🦈', crumb='Shark teeth', title='Why Do Sharks Never Run Out of Teeth?',
 desc='Sharks have a conveyor belt of teeth that never stops! Watch Sunny the shark and Finn the clownfish explain, then take the quiz.',
 hook='Press play and meet Sunny the shark. Her smile has a surprising secret!', alt='Cartoon of Sunny the shark and Finn the fish',
 cover=ch('sunny', 540, 250, .9) + ch('finn', 170, 320, .8), cover_text='Watch: endless teeth?!', hero='sunny', expert='Perfect! You are a shark teeth expert.',
 end='You learned why sharks never run out of teeth.',
 scenes=[
  sc('Hello!', 'finn', "Hi, I'm Finn! Sharks are famous for their teeth. But did you know they almost never run out? Let's meet my friend Sunny the shark!", 'top-left', 9500, 'pop',
     ch('finn', 170, 320, .8) + ch('sunny', 560, 250, .85) + cap('🦈 Endless teeth!', 400, 430, 'ff-cap fx-in')),
  sc('Many rows', 'sunny', "Don't worry, I'm a friendly shark! Open wide: I don't have just one row of teeth. I have several rows lined up behind each other.", 'top-left', 10500, 'pop',
     jaw('a') + ch('sunny', 70, 398, .4) + '<text class="ff-lab" x="400" y="425" text-anchor="middle">Inside a shark’s jaw</text>' + '<text class="ff-lab" x="740" y="240" text-anchor="end">Front row</text><text class="ff-lab" x="740" y="304" text-anchor="end">Next row</text><text class="ff-lab" x="740" y="358" text-anchor="end">New teeth</text>'),
  sc('Conveyor belt', 'sunny', "My teeth work like a conveyor belt. When a tooth at the front falls out, a new one moves forward to take its place.", 'top-left', 10500, 'whoosh',
     jaw('b') + ch('sunny', 70, 398, .4) + '<path class="tfall" d="M650,235 l25,-62 l25,62z" fill="#fff" stroke="#9fb3c4" stroke-width="2"/>' + '<text class="ff-lab" x="230" y="425" text-anchor="middle">Teeth move forward ➜</text><text class="ff-lab" x="620" y="425" text-anchor="middle">Old tooth falls out ⬇</text>'),
  sc('How many?', 'sunny', "A great white shark has about 300 teeth in its mouth, but only around 50 are in use at a time. A grown-up person has 32.", 'top-right', 11000, 'pop',
     '<g class="fx-in"><text x="160" y="220" font-size="120" font-weight="800" fill="#fff" text-anchor="middle" stroke="#06183d" stroke-width="6" paint-order="stroke">300</text><text x="400" y="220" font-size="120" font-weight="800" fill="#FFD166" text-anchor="middle" stroke="#06183d" stroke-width="6" paint-order="stroke">50</text><text x="640" y="220" font-size="120" font-weight="800" fill="#9fe3a8" text-anchor="middle" stroke="#06183d" stroke-width="6" paint-order="stroke">32</text></g>' + cap('teeth in total', 160, 270) + cap('in use at a time', 400, 270) + cap('a person has', 640, 270) + ch('sunny', 130, 390, .45)),
  sc('Lifetime', 'finn', "Shark teeth break and wear down easily, so sharks replace them instead. An average great white may go through about 20,000 teeth in its life!", 'top-left', 11000, 'win',
     '<g class="fx-in"><text x="400" y="260" font-size="150" font-weight="800" fill="#FFD166" text-anchor="middle" stroke="#06183d" stroke-width="8" paint-order="stroke">20,000</text></g>' + cap('teeth in a great white’s lifetime', 400, 320) + ch('finn', 110, 380, .55)),
  sc('Other sharks', 'sunny', "Different sharks have different teeth. The whale shark has about 3,000 tiny teeth, but it only eats shrimp and plankton!", 'top-right', 10500, 'pop',
     ch('sunny', 480, 250, .85) + '<g class="fx-in"><text x="130" y="170" font-size="70">🦐</text><text x="190" y="230" font-size="46">🦐</text></g>' + cap('Whale shark: ~3,000 tiny teeth', 400, 430)),
  sc('Wrap-up', 'sunny', "So remember: rows of teeth, a conveyor belt that never stops, and thousands of teeth in a lifetime. Sharks are amazing! Try the quiz below!", 'top-right', 10000, 'win',
     ch('sunny', 480, 260, .9) + ch('finn', 140, 330, .7) + cap('🦈 😁 🦷', 400, 62, 'ff-cap fx-in')),
 ],
 big='Sharks have <b>several rows of teeth</b> that move forward like a <b>conveyor belt</b>. When a front tooth is lost, a new one takes its place, so sharks keep a sharp smile for life.',
 table=dict(title='A great white’s teeth', h=['What', 'Number', 'Fun comparison'], rows=[
  ('Teeth in the mouth', 'About 300', 'In rows, ready to move forward'),
  ('Teeth in use at once', 'About 50', 'A grown-up person has 32'),
  ('Teeth used in a lifetime', 'About 20,000', 'Because they keep being replaced')]),
 why_title='Why replace teeth?',
 why=[('🦷', 'Teeth wear out', 'Shark teeth break and wear down easily, so they are replaced instead of made extra strong.'),
      ('🏭', 'A conveyor belt', 'New teeth are always waiting in the back rows and move forward when needed.'),
      ('🍤', 'Different diets', 'Some sharks use many tiny teeth. The whale shark eats shrimp and plankton.')],
 stats=[('300', 'teeth in a great white'), ('50', 'in use at a time'), ('20,000', 'in a great white’s lifetime'), ('3,000', 'tiny teeth in a whale shark')],
 more_about='sharks', more=['Sharks are fish. Their skeletons are made of bendy cartilage, not hard bone.', 'Shark teeth are a common fossil, so you can find ancient ones on some beaches.', 'There are over 500 kinds of sharks, and many are small and harmless to people.'],
 gloss=[('Conveyor belt', 'A moving strip that carries things forward, like at a supermarket checkout.'), ('Plankton', 'Tiny living things that drift in the sea.'), ('Fossil', 'The old remains of a plant or animal turned to stone.')],
 **{'try': '<p>Draw a shark mouth with three rows of teeth. Colour the front row white and the back rows lighter. Then count: if a shark loses one front tooth each week, how many would it use in a year?</p>'},
 quiz=[{"q": "What happens when a front shark tooth falls out?", "o": ["A new tooth moves forward", "The shark stops eating", "Nothing, it stays empty", "A bone grows"], "why": "Teeth move forward like a conveyor belt."},
       {"q": "About how many teeth are in use at one time in a great white?", "o": ["About 50", "About 5", "About 2,000", "Just 1"], "why": "A great white has about 300 teeth, but only about 50 are in use."},
       {"q": "Why do sharks keep replacing their teeth?", "o": ["Teeth break and wear down easily", "They like new teeth", "They sell old ones", "They are too big"], "why": "Shark teeth wear out, so they are replaced."},
       {"q": "Which shark has about 3,000 tiny teeth but eats shrimp and plankton?", "o": ["Whale shark", "Great white", "Hammerhead", "Tiger shark"], "why": "The whale shark has about 3,000 tiny teeth."}],
 sources=[('Mental Floss: How Many Teeth Do Sharks Have?', 'https://www.mentalfloss.com/posts/how-many-teeth-do-sharks-have'), ('Natural History Museum: What can shark teeth tell us?', 'https://www.nhm.ac.uk/discover/what-can-shark-teeth-tell-us.html')],
 siblings=[('🐙', 'Why does an octopus have 3 hearts?', '/fun-facts/sea-animals/octopus-three-hearts/'), ('🐬', 'How do dolphins sleep?', '/fun-facts/sea-animals/dolphin-sleep/')])

if __name__ == '__main__':
  for f in (dolphin, shark):
    d = os.path.join(ROOT, 'fun-facts/sea-animals', f['slug']); os.makedirs(d, exist_ok=True)
    open(os.path.join(d, 'index.html'), 'w').write(build(f))
    print('wrote', d)
