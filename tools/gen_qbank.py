#!/usr/bin/env python3
"""Generates shared/qbank-science.js and shared/qbank-olympiad.js (Easy/Standard/Challenge).
Every answer is computed or taken from a fact table; wrong options are generated and checked distinct."""
import random, json, math, itertools, os, sys
R = random.Random(2026)
OUT = os.path.join(os.path.dirname(__file__), '..', 'shared')
B = {'science': {'easy': {}, 'standard': {}, 'challenge': {}}, 'olympiad': {'easy': {}, 'standard': {}, 'challenge': {}}}
CAP = {}

def add(subj, lvl, q, ans, wrongs, tag='x', cap=10**9):
    import re
    q = re.sub(r'\b([Aa]) (?=[aeiouAEIOU])', lambda m: m.group(1) + 'n ', q)
    ans = str(ans); wrongs = [str(w) for w in wrongs]
    CAP.setdefault((subj, lvl, tag), 0)
    if CAP[(subj, lvl, tag)] >= cap: return False
    ws = []
    for w in wrongs:
        if w != ans and w not in ws: ws.append(w)
    if len(ws) < 3: raise ValueError(('few wrongs', q, ans, wrongs))
    ws = ws[:3]
    if q in B[subj][lvl]: return False
    B[subj][lvl][q] = [q, ans] + ws
    CAP[(subj, lvl, tag)] += 1
    return True

def numw(a, spread=None, integer=True, minv=0):
    """3 distinct plausible wrong numbers near a."""
    cands = []
    base = abs(a) if a else 1
    steps = [1, 2, 3, 5, 10]
    if spread: steps = spread
    for s in steps:
        cands += [a + s, a - s]
    if integer and a not in (0,):
        cands += [a * 2, a // 2 if isinstance(a, int) else a / 2, a + 10, a - 10, int(a * 1.5) if isinstance(a, int) else a * 1.5]
    out = []
    R.shuffle(cands)
    for c in cands:
        if c != a and c >= minv and c not in out:
            out.append(c)
    return out[:6]

def pick_other(pool, ans, n=3):
    o = [p for p in pool if p != ans]
    return R.sample(o, n)

def g(x):  # tidy number formatting
    if isinstance(x, float):
        s = ('%.4f' % x).rstrip('0').rstrip('.')
        return s
    return str(x)

# ===================================================================== SCIENCE
S = 'science'
# ---- animal tables
baby = dict(dog='puppy', cat='kitten', cow='calf', horse='foal', sheep='lamb', goat='kid', pig='piglet', hen='chick', duck='duckling',
            frog='tadpole', kangaroo='joey', lion='cub', tiger='cub', bear='cub', deer='fawn', swan='cygnet', goose='gosling',
            elephant='calf', owl='owlet', eagle='eaglet', giraffe='calf', zebra='foal', donkey='foal', wolf='pup', seal='pup', bat='pup', fish='fry')
sound = dict(dog='barks', cat='meows', cow='moos', sheep='bleats', horse='neighs', pig='oinks', duck='quacks', lion='roars', hen='clucks',
             frog='croaks', owl='hoots', snake='hisses', bee='buzzes', elephant='trumpets', donkey='brays', crow='caws', rooster='crows',
             wolf='howls', mouse='squeaks', pigeon='coos', cricket='chirps', bird='sings')
home = dict(bird='nest', bee='hive', spider='web', dog='kennel', horse='stable', pig='sty', hen='coop', rabbit='burrow',
            ant='anthill', fox='den', lion='den', wolf='den', beaver='lodge', fish='water', monkey='tree')
home = {k: v for k, v in home.items()}
cls = {
 'mammal': 'dog cat cow horse whale dolphin bat elephant lion tiger monkey rabbit kangaroo bear deer giraffe zebra sheep pig goat mouse squirrel seal camel panda wolf fox leopard cheetah hippo rhino otter bison',
 'bird': 'parrot eagle owl penguin ostrich crow sparrow duck hen peacock swan pigeon kiwi flamingo hawk vulture woodpecker pelican',
 'reptile': 'snake lizard crocodile turtle tortoise gecko chameleon alligator cobra iguana',
 'fish': 'shark goldfish salmon tuna seahorse clownfish eel trout catfish',
 'amphibian': 'frog toad salamander newt',
 'insect': 'ant bee butterfly fly mosquito beetle grasshopper ladybird dragonfly cricket wasp moth cockroach',
}
cls = {k: v.split() for k, v in cls.items()}
legs = dict(dog=4, cat=4, cow=4, horse=4, hen=2, duck=2, spider=8, ant=6, bee=6, butterfly=6, snake=0, fish=0, bird=2, elephant=4, human=2, crab=10, beetle=6, frog=4, lion=4, ostrich=2)
diet = {'herbivore': 'cow horse sheep goat deer elephant giraffe zebra rabbit camel hippo rhino panda koala',
        'carnivore': 'lion tiger wolf shark crocodile eagle owl cheetah leopard hawk frog snake',
        'omnivore': 'bear human pig crow hen monkey fox raccoon duck rat'}
diet = {k: v.split() for k, v in diet.items()}
cover = {'fur or hair': 'dog cat cow horse bear lion tiger sheep rabbit monkey', 'feathers': 'parrot eagle owl penguin ostrich duck hen sparrow peacock', 'scales': 'snake lizard crocodile fish shark'}
cover = {k: v.split() for k, v in cover.items()}

def lvl_easy(q, a, w, tag, cap=10**9): return add(S, 'easy', q, a, w, tag, cap)

for a, b in baby.items():
    pool = sorted(set(baby.values()))
    for t in ['What is a baby %s called?', 'A young %s is called a …', 'The baby of a %s is called a …']:
        lvl_easy(t % a, b, pick_other(pool, b), 'baby')
for a, b in sound.items():
    pool = sorted(set(sound.values()))
    for t in ['What sound does a %s make?', 'Which word describes how a %s sounds?']:
        if a == 'bird': continue
        lvl_easy(t % a, b[:-1] + 's' if False else b, pick_other(pool, b), 'sound')
    # reverse (skip ambiguous bleats)
    if b not in ('bleats', 'growls', 'roars', 'howls'):
        pool2 = [x for x in sound if x != 'bird']
        lvl_easy('Which animal %s?' % b, a, pick_other([x for x in pool2 if sound[x] != b], a), 'sound')
for a, b in home.items():
    pool = sorted(set(home.values()))
    for t in ['Where does a %s live? (its home is called a …)', 'A %s lives in a …']:
        if a in ('fox', 'lion', 'wolf'):
            ans = 'den'; wr = [p for p in pool if p != 'den']
            lvl_easy(t % a, ans, R.sample(wr, 3), 'home')
        else:
            lvl_easy(t % a, b, pick_other(pool, b), 'home')
cn = list(cls)
for c, lst in cls.items():
    for an in lst:
        for t in ['Which group does a %s belong to?', 'A %s is a …', 'What kind of animal is a %s?']:
            lvl_easy(t % an, c, [x for x in cn if x != c][:3] if c != 'amphibian' else R.sample([x for x in cn if x != c], 3), 'class')
        # odd one out style
        for _ in range(4):
            others = [x for k, v in cls.items() if k != c for x in v]
            opts = [an] + R.sample(others, 3)
            q = 'Which of these is a %s: %s?' % (c, ', '.join(sorted(opts)))
            lvl_easy(q, an, [o for o in opts if o != an], 'class2')
for an, n in legs.items():
    pool = [0, 2, 4, 6, 8, 10]
    for t in ['How many legs does a %s have?', 'Count the legs: a %s has …']:
        lvl_easy(t % an, n, [x for x in pool if x != n][:3] if n not in (4, 2) else R.sample([x for x in pool if x != n], 3), 'legs')
for d, lst in diet.items():
    for an in lst:
        for t in ['What does a %s eat? (herbivore, carnivore or omnivore)', 'A %s is a …']:
            lvl_easy(t % an, d, [x for x in diet if x != d] + ['decomposer'], 'diet')
for cv, lst in cover.items():
    for an in lst:
        lvl_easy('What covers the body of a %s?' % an, cv, [x for x in cover if x != cv] + ['shell'] if cv != 'scales' else ['feathers', 'fur or hair', 'shell'], 'cover')
# senses / body
senses = {'see': 'eyes', 'hear': 'ears', 'smell': 'nose', 'taste': 'tongue', 'touch': 'skin'}
for s, o in senses.items():
    lvl_easy('Which part of the body do we use to %s?' % s, o, [x for x in ['eyes', 'ears', 'nose', 'tongue', 'skin', 'knees'] if x != o][:3], 'senses')
organs = [('pumps blood around the body', 'heart'), ('helps us breathe', 'lungs'), ('helps us think', 'brain'), ('digests our food', 'stomach'), ('holds up our body and protects organs', 'skeleton'),
          ('helps us hear', 'ear'), ('helps us see', 'eye'), ('helps us chew food', 'teeth'), ('protects our body and helps us feel', 'skin'), ('carries messages to the brain', 'nerves')]
for d, o in organs:
    lvl_easy('Which body part %s?' % d, o, pick_other([x[1] for x in organs], o), 'organ')
# planets
planets = 'Mercury Venus Earth Mars Jupiter Saturn Uranus Neptune'.split()
ordn = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth']
for i, p in enumerate(planets):
    lvl_easy('Which planet is %s from the Sun?' % ordn[i], p, pick_other(planets, p), 'planet')
    if i < 7: lvl_easy('Which planet comes just after %s, counting away from the Sun?' % p, planets[i + 1], pick_other(planets, planets[i + 1]), 'planet')
    if i > 0: lvl_easy('Which planet comes just before %s, counting away from the Sun?' % p, planets[i - 1], pick_other(planets, planets[i - 1]), 'planet')
# materials & properties
mats = {'magnetic': 'iron nickel steel cobalt', 'not magnetic': 'wood plastic glass paper rubber copper aluminium cloth',
        'floats': 'cork wood plastic-bottle leaf ice ball', 'sinks': 'stone coin key brick iron-nail marble',
        'transparent': 'glass clear-plastic water air', 'conductor of electricity': 'copper iron aluminium silver gold',
        'insulator': 'rubber plastic wood glass cloth paper'}
matsq = [('Is a {} attracted by a magnet?', 'magnetic', 'Yes', 'No'),]
for m in mats['magnetic'].split():
    lvl_easy('Will a magnet attract %s?' % m, 'Yes', ['No', 'Only when wet', 'Only in the dark'], 'mat')
for m in 'wood plastic glass paper rubber aluminium cloth'.split():
    lvl_easy('Will a magnet attract %s?' % m, 'No', ['Yes', 'Only when wet', 'Only in the dark'], 'mat')
for m in mats['conductor of electricity'].split():
    lvl_easy('Is %s a conductor or an insulator of electricity?' % m, 'Conductor', ['Insulator', 'Neither', 'Both'], 'mat')
for m in mats['insulator'].split():
    lvl_easy('Is %s a conductor or an insulator of electricity?' % m, 'Insulator', ['Conductor', 'Neither', 'Both'], 'mat')
for m in 'cork wood leaf ice'.split():
    lvl_easy('Will %s float or sink in water?' % m, 'Float', ['Sink', 'Melt', 'Disappear'], 'mat')
for m in 'stone coin key brick marble'.split():
    lvl_easy('Will a %s float or sink in water?' % m, 'Sink', ['Float', 'Melt', 'Disappear'], 'mat')
# states of matter
for item, st in [('ice', 'solid'), ('water', 'liquid'), ('steam', 'gas'), ('milk', 'liquid'), ('stone', 'solid'), ('air', 'gas'), ('juice', 'liquid'), ('wood', 'solid'), ('oxygen', 'gas'), ('oil', 'liquid'), ('iron', 'solid'), ('smoke', 'gas'), ('honey', 'liquid'), ('rain', 'liquid'), ('snow', 'solid')]:
    lvl_easy('Is %s a solid, a liquid or a gas?' % item, st, [x for x in ['solid', 'liquid', 'gas', 'plasma'] if x != st][:3], 'state')
# plants
parts = [('takes in water from the soil', 'roots'), ('holds the plant up', 'stem'), ('makes food using sunlight', 'leaves'), ('becomes a fruit', 'flower'), ('grows into a new plant', 'seed'), ('holds a plant in the soil', 'roots')]
for d, p in parts:
    lvl_easy('Which part of a plant %s?' % d, p, [x for x in ['roots', 'stem', 'leaves', 'flower', 'seed'] if x != p][:3], 'plant')
for item, kind in [('carrot', 'root'), ('potato', 'stem (tuber)'), ('spinach', 'leaf'), ('apple', 'fruit'), ('rose', 'flower'), ('radish', 'root'), ('cabbage', 'leaf'), ('tomato', 'fruit'), ('onion', 'bulb'), ('rice', 'seed'), ('sunflower', 'flower'), ('lettuce', 'leaf')]:
    lvl_easy('Which part of a plant do we eat when we eat %s?' % item, kind, [x for x in ['root', 'stem (tuber)', 'leaf', 'fruit', 'flower', 'seed', 'bulb'] if x != kind][:3], 'plant')
# seasons/weather/day
for q, a, w in [('Which season is the coldest?', 'Winter', ['Summer', 'Spring', 'Monsoon']), ('Which season is the hottest in most places?', 'Summer', ['Winter', 'Spring', 'Autumn']),
                ('In which season do leaves fall from many trees?', 'Autumn', ['Spring', 'Summer', 'Winter']), ('What do we call frozen rain?', 'Hail', ['Fog', 'Dew', 'Mist']),
                ('What do we call the water drops on grass in the morning?', 'Dew', ['Hail', 'Snow', 'Smoke']), ('What do we use to measure temperature?', 'Thermometer', ['Ruler', 'Clock', 'Scale']),
                ('What do we use to measure length?', 'Ruler', ['Thermometer', 'Clock', 'Compass']), ('What do we use to find directions?', 'Compass', ['Ruler', 'Clock', 'Scale']),
                ('What do we use to weigh things?', 'Weighing scale', ['Ruler', 'Thermometer', 'Compass']), ('Which gas do we breathe in to stay alive?', 'Oxygen', ['Carbon dioxide', 'Helium', 'Smoke']),
                ('Which star gives us light and heat?', 'The Sun', ['The Moon', 'Mars', 'A comet']), ('Which natural satellite goes around the Earth?', 'The Moon', ['The Sun', 'Mars', 'Venus']),
                ('What do plants need to grow?', 'Water, air and sunlight', ['Only sand', 'Only plastic', 'Only darkness']), ('Which sense organ helps us smell?', 'Nose', ['Ear', 'Eye', 'Tongue'])]:
    lvl_easy(q, a, w, 'misc')
# easy numeric: counting body/time
for q, a in [('How many days are there in a week?', 7), ('How many hours are there in a day?', 24), ('How many months are there in a year?', 12), ('How many fingers are there on one hand?', 5), ('How many eyes does a person have?', 2), ('How many planets are in our solar system?', 8), ('How many wings does a bird have?', 2), ('How many seasons are there?', 4), ('How many legs does a spider have?', 8), ('How many legs does an insect have?', 6)]:
    lvl_easy(q, a, numw(a)[:3], 'count')
# easy numeric: unit conversion simple + temperature reading
for m in range(1, 41):
    lvl_easy('How many centimetres are in %d metres?' % m, m * 100, [m * 10, m * 1000, m + 100], 'conv')
    lvl_easy('How many grams are in %d kg?' % m, m * 1000, [m * 100, m * 10, m + 1000], 'conv')
    lvl_easy('How many minutes are in %d hours?' % m, m * 60, [m * 100, m * 30, m + 60], 'conv')
    lvl_easy('How many days are in %d weeks?' % m, m * 7, [m * 5, m * 6, m * 8], 'conv')
    lvl_easy('How many millilitres are in %d litres?' % m, m * 1000, [m * 100, m * 10, m * 500], 'conv')
for t in range(1, 60):
    hot = t % 2 == 1
    lvl_easy('Water freezes at 0°C. A puddle is at %d°C. Will it be ice or liquid water?' % (t if hot else -t), 'Liquid water' if hot else 'Ice', ['Ice', 'Steam', 'Snow'] if hot else ['Liquid water', 'Steam', 'Rain'], 'temp')

# ---- STANDARD science
elem = [(1, 'H', 'Hydrogen', 1), (2, 'He', 'Helium', 4), (3, 'Li', 'Lithium', 7), (4, 'Be', 'Beryllium', 9), (5, 'B', 'Boron', 11), (6, 'C', 'Carbon', 12), (7, 'N', 'Nitrogen', 14), (8, 'O', 'Oxygen', 16),
        (9, 'F', 'Fluorine', 19), (10, 'Ne', 'Neon', 20), (11, 'Na', 'Sodium', 23), (12, 'Mg', 'Magnesium', 24), (13, 'Al', 'Aluminium', 27), (14, 'Si', 'Silicon', 28), (15, 'P', 'Phosphorus', 31),
        (16, 'S', 'Sulfur', 32), (17, 'Cl', 'Chlorine', 35), (18, 'Ar', 'Argon', 40), (19, 'K', 'Potassium', 39), (20, 'Ca', 'Calcium', 40), (26, 'Fe', 'Iron', 56), (29, 'Cu', 'Copper', 64),
        (30, 'Zn', 'Zinc', 65), (47, 'Ag', 'Silver', 108), (50, 'Sn', 'Tin', 119), (53, 'I', 'Iodine', 127), (79, 'Au', 'Gold', 197), (80, 'Hg', 'Mercury', 201), (82, 'Pb', 'Lead', 207)]
sy = [e[1] for e in elem]; nm = [e[2] for e in elem]
for z, s, n, m in elem:
    for lv in ('standard', 'challenge'):
        add(S, lv, 'What is the chemical symbol for %s?' % n.lower(), s, pick_other(sy, s), 'elem')
        add(S, lv, 'Which element has the symbol %s?' % s, n, pick_other(nm, n), 'elem')
    add(S, 'standard', 'What is the atomic number of %s?' % n.lower(), z, [e[0] for e in R.sample([e for e in elem if e[0] != z], 3)], 'elem')
    add(S, 'standard', 'Which element has the atomic number %d?' % z, n, pick_other(nm, n), 'elem')
    add(S, 'challenge', 'An atom of %s has atomic number %d and mass number %d. How many neutrons does it have?' % (n.lower(), z, m), m - z, [x for x in numw(m - z, [1, 2, 3, 4], minv=0)], 'neut')
compounds = [('water', 'H2O'), ('carbon dioxide', 'CO2'), ('table salt', 'NaCl'), ('methane', 'CH4'), ('ammonia', 'NH3'), ('glucose', 'C6H12O6'), ('hydrogen peroxide', 'H2O2'), ('sulfuric acid', 'H2SO4'),
             ('calcium carbonate', 'CaCO3'), ('hydrochloric acid', 'HCl'), ('sodium hydroxide', 'NaOH'), ('carbon monoxide', 'CO'), ('oxygen gas', 'O2'), ('nitrogen gas', 'N2'), ('ozone', 'O3'), ('nitric acid', 'HNO3'), ('baking soda', 'NaHCO3')]
for nme, f in compounds:
    for lv in ('standard', 'challenge'):
        add(S, lv, 'What is the chemical formula of %s?' % nme, f, pick_other([c[1] for c in compounds], f), 'form')
        add(S, lv, 'Which substance has the formula %s?' % f, nme, pick_other([c[0] for c in compounds], nme), 'form')
# physics numerics -- standard
for _ in range(900):
    v = R.randint(2, 30); t = R.randint(2, 20); d = v * t
    add(S, 'standard', 'A car travels %d m in %d s at a steady speed. What is its speed?' % (d, t), '%d m/s' % v, ['%d m/s' % x for x in numw(v, [1, 2, 3, 5], minv=1)], 'speed', 400)
for _ in range(900):
    v = R.randint(2, 30); t = R.randint(2, 20); d = v * t
    add(S, 'standard', 'A runner moves at %d m/s for %d s. How far does the runner go?' % (v, t), '%d m' % d, ['%d m' % x for x in numw(d, [v, t, 2, 5, 10], minv=1)], 'dist', 400)
for _ in range(900):
    m = R.randint(2, 50); a = R.randint(2, 12); F = m * a
    add(S, 'standard', 'A force of %d N moves a %d kg object. What is its acceleration? (a = F ÷ m)' % (F, m), '%d m/s²' % a, ['%d m/s²' % x for x in numw(a, [1, 2, 3, 4], minv=1)], 'acc', 400)
for _ in range(900):
    m = R.randint(1, 60); d = R.randint(2, 40); den = m * d  # density = mass/volume
    add(S, 'standard', 'An object has a mass of %d g and a volume of %d cm³. What is its density?' % (m * d, m), '%d g/cm³' % d, ['%d g/cm³' % x for x in numw(d, [1, 2, 3, 4], minv=1)], 'density', 400)
for km in range(1, 301):
    add(S, 'standard', 'How many metres are there in %d km?' % km, km * 1000, [km * 100, km * 10, km + 1000], 'conv2', 300)
for kg in range(2, 400, 3):
    add(S, 'standard', 'How many grams are in %d kg %d g?' % (kg % 20 + 1, kg % 9 * 100), (kg % 20 + 1) * 1000 + kg % 9 * 100, [(kg % 20 + 1) * 100 + kg % 9 * 100, (kg % 20 + 1) * 1000 + kg % 9 * 10, (kg % 20 + 1) * 10000 + kg % 9 * 100], 'conv2', 300)
for _ in range(500):
    c = R.randrange(0, 101, 5); f = c * 9 // 5 + 32 if (c * 9) % 5 == 0 else None
    if f is None: continue
    add(S, 'standard', 'Convert %d°C to °F using F = C × 9/5 + 32.' % c, '%d°F' % f, ['%d°F' % x for x in numw(f, [2, 9, 18, 32, 10], minv=-50)], 'temp2', 200)
for _ in range(900):
    p = R.randint(2, 20); r = R.randint(2, 15)
    add(S, 'standard', 'A bulb works at %d V and draws %d A of current. How much power does it use? (P = V × I)' % (p, r), '%d W' % (p * r), ['%d W' % x for x in numw(p * r, [p, r, 5, 10], minv=1)], 'power', 300)
for _ in range(700):
    n = R.randint(2, 12); h = R.randint(2, 12)
    add(S, 'standard', 'Work done = force × distance. A force of %d N moves an object %d m. How much work is done?' % (n, h), '%d J' % (n * h), ['%d J' % x for x in numw(n * h, [n, h, 5, 10], minv=1)], 'work', 300)
# standard bio/earth facts
facts_s = [
 ('Which gas do plants take in for photosynthesis?', 'Carbon dioxide', ['Oxygen', 'Nitrogen', 'Hydrogen']), ('Which gas do plants release during photosynthesis?', 'Oxygen', ['Carbon dioxide', 'Methane', 'Helium']),
 ('What is the green pigment in leaves called?', 'Chlorophyll', ['Haemoglobin', 'Keratin', 'Melanin']), ('Which part of a flower makes pollen?', 'Stamen', ['Pistil', 'Petal', 'Sepal']),
 ('What is the process by which water changes from liquid to gas?', 'Evaporation', ['Condensation', 'Freezing', 'Melting']), ('What is the force that pulls objects toward the Earth?', 'Gravity', ['Friction', 'Magnetism', 'Buoyancy']),
 ('Which organ pumps blood around the body?', 'Heart', ['Liver', 'Kidney', 'Lungs']), ('Which blood cells carry oxygen?', 'Red blood cells', ['White blood cells', 'Platelets', 'Plasma']),
 ('Which blood cells fight germs?', 'White blood cells', ['Red blood cells', 'Platelets', 'Plasma']), ('Which organ filters waste from the blood to make urine?', 'Kidney', ['Heart', 'Liver', 'Stomach']),
 ('Which vitamin helps our eyes see in dim light?', 'Vitamin A', ['Vitamin C', 'Vitamin D', 'Vitamin K']), ('Which vitamin is made in our skin with sunlight?', 'Vitamin D', ['Vitamin A', 'Vitamin B12', 'Vitamin C']),
 ('Which nutrient helps build and repair the body?', 'Protein', ['Fat', 'Water', 'Fibre']), ('Which nutrient is the main source of energy?', 'Carbohydrates', ['Vitamins', 'Minerals', 'Water']),
 ('What type of energy does a moving car have?', 'Kinetic energy', ['Potential energy', 'Chemical energy only', 'Sound energy']), ('What type of energy is stored in a stretched rubber band?', 'Potential energy', ['Kinetic energy', 'Light energy', 'Sound energy']),
 ('What do we call the bending of light as it passes from air into water?', 'Refraction', ['Reflection', 'Absorption', 'Dispersion']), ('What do we call light bouncing off a mirror?', 'Reflection', ['Refraction', 'Absorption', 'Diffraction']),
 ('What splits white light into seven colours?', 'A prism', ['A mirror', 'A lens only', 'A magnet']), ('What is the closest planet to the Sun?', 'Mercury', ['Venus', 'Earth', 'Mars']),
 ('Which planet is called the Red Planet?', 'Mars', ['Venus', 'Jupiter', 'Mercury']), ('Which planet has prominent rings?', 'Saturn', ['Mars', 'Mercury', 'Venus']),
 ('Which is the largest planet?', 'Jupiter', ['Saturn', 'Earth', 'Neptune']), ('Which layer of the Earth do we live on?', 'Crust', ['Mantle', 'Outer core', 'Inner core']),
 ('What are rocks formed from cooled lava called?', 'Igneous rocks', ['Sedimentary rocks', 'Metamorphic rocks', 'Fossils']), ('What kind of rock forms from layers of sediment?', 'Sedimentary rock', ['Igneous rock', 'Metamorphic rock', 'Volcanic glass']),
 ('Which of these is a renewable source of energy?', 'Wind', ['Coal', 'Petrol', 'Diesel']), ('Which of these is a fossil fuel?', 'Coal', ['Wind', 'Solar', 'Hydro']),
 ('What do we call animals that hunt other animals?', 'Predators', ['Prey', 'Producers', 'Decomposers']), ('What do we call organisms that break down dead matter?', 'Decomposers', ['Producers', 'Predators', 'Herbivores']),
 ('In a food chain, what do plants make?', 'Food (they are producers)', ['Nothing', 'Only oxygen', 'Meat']), ('What is the main gas in air?', 'Nitrogen', ['Oxygen', 'Carbon dioxide', 'Hydrogen']),
 ('What is the boiling point of water at sea level?', '100°C', ['90°C', '0°C', '50°C']), ('What is the freezing point of water?', '0°C', ['10°C', '-10°C', '100°C']),
 ('Which part of the cell contains DNA?', 'Nucleus', ['Cytoplasm', 'Cell wall', 'Vacuole']), ('Which organelle makes energy for the cell?', 'Mitochondria', ['Nucleus', 'Ribosome', 'Vacuole']),
 ('How many bones does an adult human have?', '206', ['106', '300', '150']), ('How many chambers does the human heart have?', '4', ['2', '3', '6']),
 ('What is the hardest natural substance?', 'Diamond', ['Gold', 'Iron', 'Quartz']), ('What is the lightest gas?', 'Hydrogen', ['Oxygen', 'Helium is heavier? no', 'Nitrogen']),
]
facts_s[-1] = ('What is the lightest gas?', 'Hydrogen', ['Oxygen', 'Nitrogen', 'Carbon dioxide'])
for q, a, w in facts_s: add(S, 'standard', q, a, w, 'fact')
# ---- CHALLENGE science (numeric/derived)
for _ in range(1500):
    V = R.randint(2, 24); I = R.randint(1, 12)
    add(S, 'challenge', 'A resistor carries %d A when %d V is applied across it. What is its resistance? (R = V ÷ I)' % (I, V * I), '%d Ω' % V, ['%d Ω' % x for x in numw(V, [1, 2, 3, 4], minv=1)], 'ohm', 350)
for _ in range(1500):
    a = R.randint(1, 20); b = R.randint(1, 20)
    add(S, 'challenge', 'Two resistors of %d Ω and %d Ω are connected in series. What is the total resistance?' % (a, b), '%d Ω' % (a + b), ['%d Ω' % x for x in numw(a + b, [1, 2, a, b], minv=1)], 'series', 300)
for _ in range(2500):
    r = R.randint(2, 20); k = R.choice([2, 3, 4]); 
    add(S, 'challenge', 'Calculate the total resistance of %d identical %d Ω resistors connected in parallel.' % (k, r * k), '%d Ω' % r, ['%d Ω' % x for x in numw(r, [1, 2, 3, r], minv=1)], 'parallel', 250)
for _ in range(2500):
    m = R.randint(1, 20); v = R.randint(2, 20)
    ke = m * v * v
    if ke % 2: continue
    add(S, 'challenge', 'What is the kinetic energy of a %d kg object moving at %d m/s? (KE = ½mv²)' % (m, v), '%d J' % (ke // 2), ['%d J' % x for x in numw(ke // 2, [m * v, ke, 10, 25], minv=1)], 'ke', 350)
for _ in range(2500):
    m = R.randint(1, 30); h = R.randint(2, 40)
    add(S, 'challenge', 'Find the gravitational potential energy of %d kg raised %d m. (Use g = 10 m/s², PE = mgh)' % (m, h), '%d J' % (m * h * 10), ['%d J' % x for x in numw(m * h * 10, [m * h, 10, 100, m * 10], minv=1)], 'pe', 350)
for _ in range(2500):
    f = R.randint(2, 50); lam = R.randint(2, 20)
    add(S, 'challenge', 'A wave has frequency %d Hz and wavelength %d m. What is its speed? (v = f × λ)' % (f, lam), '%d m/s' % (f * lam), ['%d m/s' % x for x in numw(f * lam, [f, lam, 10, 20], minv=1)], 'wave', 350)
for _ in range(2500):
    A = R.randint(2, 20); P = R.randint(2, 50)
    add(S, 'challenge', 'A force of %d N acts on an area of %d m². What is the pressure? (P = F ÷ A)' % (A * P, A), '%d Pa' % P, ['%d Pa' % x for x in numw(P, [1, 2, 5, 10], minv=1)], 'pressure', 300)
for _ in range(2500):
    n = R.randint(1, 6); m0 = R.choice([16, 32, 48, 64, 80, 96, 128, 160, 200, 320, 640])
    if m0 % (2 ** n): continue
    add(S, 'challenge', 'A radioactive sample of %d g has a half-life of 1 day. How much remains after %d day%s?' % (m0, n, 's' if n > 1 else ''), '%s g' % g(m0 / 2 ** n), ['%s g' % g(x) for x in numw(m0 / 2 ** n, [1, 2, 4, 8], integer=False, minv=0.25)], 'halflife', 250)
for _ in range(2500):
    c = R.randint(-40, 150)
    add(S, 'challenge', 'Convert %d°C to kelvin (K = °C + 273).' % c, '%d K' % (c + 273), ['%d K' % x for x in [c + 273 + 10, c + 273 - 10, c + 373, c + 173, c - 273]], 'kelvin', 150)
elm = {'H': 1, 'C': 12, 'N': 14, 'O': 16, 'Na': 23, 'Mg': 24, 'S': 32, 'Cl': 35, 'Ca': 40}
mol = [('H2O', {'H': 2, 'O': 1}), ('CO2', {'C': 1, 'O': 2}), ('NaCl', {'Na': 1, 'Cl': 1}), ('CH4', {'C': 1, 'H': 4}), ('NH3', {'N': 1, 'H': 3}), ('CaO', {'Ca': 1, 'O': 1}), ('MgO', {'Mg': 1, 'O': 1}),
       ('H2SO4', {'H': 2, 'S': 1, 'O': 4}), ('HCl', {'H': 1, 'Cl': 1}), ('NaOH', {'Na': 1, 'O': 1, 'H': 1}), ('CaCO3', {'Ca': 1, 'C': 1, 'O': 3}), ('SO2', {'S': 1, 'O': 2}), ('MgCl2', {'Mg': 1, 'Cl': 2}), ('CaCl2', {'Ca': 1, 'Cl': 2}), ('Na2O', {'Na': 2, 'O': 1}), ('N2O', {'N': 2, 'O': 1}), ('C2H6', {'C': 2, 'H': 6}), ('CO', {'C': 1, 'O': 1})]
for f, comp in mol:
    M = sum(elm[e] * n for e, n in comp.items())
    add(S, 'challenge', 'Using H = 1, C = 12, N = 14, O = 16, Na = 23, Mg = 24, S = 32, Cl = 35, Ca = 40, what is the molar mass of %s in g/mol?' % f, M, numw(M, [1, 2, 4, 8, 16], minv=1), 'molar')
    for k in (2, 3, 4, 5, 10):
        add(S, 'challenge', 'Using H = 1, C = 12, N = 14, O = 16, Na = 23, Mg = 24, S = 32, Cl = 35, Ca = 40, how many moles are in %d g of %s? (moles = mass ÷ molar mass)' % (M * k, f), k, numw(k, [1, 2, 3], minv=1), 'molar')
for _ in range(3000):
    n = R.randint(4, 12)
    strand = ''.join(R.choice('ATGC') for _ in range(n)); comp = ''.join({'A': 'T', 'T': 'A', 'G': 'C', 'C': 'G'}[c] for c in strand)
    wr = []
    while len(wr) < 3:
        s = list(comp); i = R.randrange(n); s[i] = R.choice([x for x in 'ATGC' if x != s[i]]); s = ''.join(s)
        if s != comp and s not in wr: wr.append(s)
    add(S, 'challenge', 'A DNA strand reads %s. What is the complementary strand? (A pairs with T, G pairs with C)' % strand, comp, wr, 'dna', 400)
for z in range(3, 60):
    for m in range(z + 1, z + 4 + z // 2, 2):
        add(S, 'challenge', 'An atom has %d protons and a mass number of %d. How many neutrons does it have?' % (z, m), m - z, numw(m - z, [1, 2, 3], minv=0), 'neut2', 400)
        add(S, 'challenge', 'A neutral atom has atomic number %d and mass number %d. How many electrons does it have?' % (z, m), z, numw(z, [1, 2, 3, m - z], minv=0), 'neut2', 400)
for ph in range(0, 15):
    r = 'Acidic' if ph < 7 else ('Neutral' if ph == 7 else 'Basic (alkaline)')
    add(S, 'challenge', 'A solution has a pH of %d. Is it acidic, neutral or basic?' % ph, r, [x for x in ['Acidic', 'Neutral', 'Basic (alkaline)', 'Cannot be tested'] if x != r][:3], 'ph')
facts_c = [
 ('Which part of the cell is the site of protein synthesis?', 'Ribosome', ['Lysosome', 'Vacuole', 'Nucleolus']), ('What is the powerhouse of the cell?', 'Mitochondrion', ['Nucleus', 'Golgi body', 'Ribosome']),
 ('What is the process by which cells divide to make two identical cells?', 'Mitosis', ['Meiosis', 'Osmosis', 'Diffusion']), ('What is the movement of water across a semi-permeable membrane called?', 'Osmosis', ['Diffusion', 'Mitosis', 'Respiration']),
 ('Which gas is produced when zinc reacts with dilute hydrochloric acid?', 'Hydrogen', ['Oxygen', 'Carbon dioxide', 'Chlorine']), ('Which gas turns limewater milky?', 'Carbon dioxide', ['Oxygen', 'Hydrogen', 'Nitrogen']),
 ('What type of bond forms when atoms share electrons?', 'Covalent bond', ['Ionic bond', 'Metallic bond', 'Hydrogen bond']), ('What type of bond forms when electrons are transferred between atoms?', 'Ionic bond', ['Covalent bond', 'Metallic bond', 'Hydrogen bond']),
 ('Which law states V = I × R?', "Ohm's law", ["Boyle's law", "Newton's first law", "Hooke's law"]), ("Which law states that every action has an equal and opposite reaction?", "Newton's third law", ["Newton's first law", "Newton's second law", "Ohm's law"]),
 ('What is the SI unit of force?', 'Newton', ['Joule', 'Watt', 'Pascal']), ('What is the SI unit of energy?', 'Joule', ['Newton', 'Watt', 'Pascal']), ('What is the SI unit of power?', 'Watt', ['Joule', 'Newton', 'Volt']),
 ('What is the SI unit of pressure?', 'Pascal', ['Newton', 'Joule', 'Watt']), ('What is the SI unit of electric current?', 'Ampere', ['Volt', 'Ohm', 'Watt']), ('What is the SI unit of resistance?', 'Ohm', ['Ampere', 'Volt', 'Watt']),
 ('Which type of electromagnetic wave has the shortest wavelength?', 'Gamma rays', ['Radio waves', 'Microwaves', 'Visible light']), ('Which type of electromagnetic wave is used in remote controls?', 'Infrared', ['Ultraviolet', 'X-rays', 'Gamma rays']),
 ('What is the pH of pure water at room temperature?', '7', ['0', '14', '1']), ('Which element is a liquid metal at room temperature?', 'Mercury', ['Iron', 'Copper', 'Lead']),
 ('What is the most abundant gas in the Earth\'s atmosphere?', 'Nitrogen', ['Oxygen', 'Argon', 'Carbon dioxide']), ('Which scientist proposed the theory of evolution by natural selection?', 'Charles Darwin', ['Isaac Newton', 'Albert Einstein', 'Louis Pasteur']),
 ('Which organelle is found in plant cells but not animal cells?', 'Chloroplast', ['Mitochondrion', 'Nucleus', 'Ribosome']), ('What is the name of the process plants use to make glucose from carbon dioxide and water?', 'Photosynthesis', ['Respiration', 'Transpiration', 'Digestion']),
 ('Which part of the brain controls balance and coordination?', 'Cerebellum', ['Cerebrum', 'Medulla', 'Thalamus']), ('What is the function of the pancreas?', 'Makes insulin and digestive enzymes', ['Filters blood', 'Pumps blood', 'Stores bile only']),
 ('Which type of lens is used to correct short-sightedness (myopia)?', 'Concave lens', ['Convex lens', 'Plane lens', 'Cylindrical lens']), ('Which type of lens is used in a magnifying glass?', 'Convex lens', ['Concave lens', 'Plane lens', 'Prism']),
]
for q, a, w in facts_c: add(S, 'challenge', q, a, w, 'fact')

# ===================================================================== OLYMPIAD
O = 'olympiad'
def oadd(lvl, q, a, w, tag='x', cap=10**9): return add(O, lvl, q, a, w, tag, cap)
# ---- EASY
for start in range(1, 40):
    for step in (1, 2, 3, 5, 10):
        seq = [start + step * i for i in range(4)]; nxt = start + step * 4
        oadd('easy', 'What comes next: %s, ?' % ', '.join(map(str, seq)), nxt, numw(nxt, [1, 2, step], minv=0), 'seq1', 250)
for a in range(1, 100):
    b = R.randint(1, 99)
    if a == b: continue
    oadd('easy', 'Which is bigger: %d or %d?' % (a, b), max(a, b), [min(a, b), 'Same', 'Cannot say'], 'cmp', 150)
    oadd('easy', 'Which is smaller: %d or %d?' % (a, b), min(a, b), [max(a, b), 'Same', 'Cannot say'], 'cmp', 150)
for _ in range(2000):
    a = R.randint(1, 20); b = R.randint(1, 20)
    oadd('easy', 'What is %d + %d?' % (a, b), a + b, numw(a + b, [1, 2, 10], minv=0), 'add', 250)
    if a >= b: oadd('easy', 'What is %d − %d?' % (a, b), a - b, numw(a - b, [1, 2, 10], minv=0), 'sub', 250)
    if a <= 10 and b <= 10: oadd('easy', 'What is %d × %d?' % (a, b), a * b, numw(a * b, [a, b, 1, 2, 10], minv=0), 'mul', 80)
for n in range(1, 60):
    oadd('easy', 'What is double %d?' % n, 2 * n, numw(2 * n, [1, 2, n], minv=0), 'dbl')
    oadd('easy', 'What is half of %d?' % (2 * n), n, numw(n, [1, 2, 10], minv=0), 'dbl')
    oadd('easy', 'What number comes just after %d?' % (n * 3), n * 3 + 1, [n * 3 - 1, n * 3 + 2, n * 3 + 10], 'dbl')
    oadd('easy', 'What number comes just before %d?' % (n * 3 + 1), n * 3, [n * 3 + 1, n * 3 - 1, n * 3 + 2], 'dbl')
shapes = {'triangle': 3, 'square': 4, 'rectangle': 4, 'pentagon': 5, 'hexagon': 6, 'octagon': 8, 'circle': 0}
for s, n in shapes.items():
    oadd('easy', 'How many sides does a %s have?' % s, n, [x for x in [0, 3, 4, 5, 6, 8] if x != n][:3], 'shape')
    oadd('easy', 'How many corners does a %s have?' % s, n, [x for x in [0, 3, 4, 5, 6, 8] if x != n][:3], 'shape')
cats = {'fruits': 'apple banana mango orange grape papaya guava pear plum cherry lemon melon', 'vegetables': 'carrot potato onion spinach cabbage peas beans radish',
        'mammals': 'dog cat cow horse lion tiger rabbit sheep goat monkey', 'vehicles': 'car bus train bike truck ship plane scooter', 'colours': 'red blue green yellow pink purple black brown',
        'birds': 'parrot crow eagle sparrow owl peacock', 'furniture': 'chair table bed sofa desk shelf', 'body parts': 'hand foot nose ear eye knee arm leg', 'clothes': 'shirt skirt socks cap jacket scarf shorts',
        'tools': 'hammer saw spanner drill pliers', 'planets': 'Mars Venus Earth Jupiter Saturn Mercury', 'instruments': 'guitar piano drum flute violin', 'stationery': 'pencil eraser ruler sharpener pen', 'drinks': 'milk juice tea water coffee', 'flowers': 'rose lily tulip lotus daisy jasmine'}
cats = {k: v.split() for k, v in cats.items()}
ck = list(cats)
for lv, N in (('easy', 700), ('standard', 700)):
    cnt = 0
    while cnt < N:
        a, b = R.sample(ck, 2)
        grp = R.sample(cats[a], 3); odd = R.choice(cats[b])
        if odd in cats[a]: continue
        o = grp + [odd]; R.shuffle(o)
        if oadd(lv, 'Which is the odd one out: %s?' % ', '.join(o), odd, grp, 'odd'): cnt += 1
for k, items in cats.items():
    for it in items:
        other = [x for kk in ck if kk != k for x in cats[kk]]
        oadd('easy', 'Which of these is one of the %s: %s?' % (k, ', '.join(sorted([it] + R.sample(other, 3)))), it, [], 'dummy') if False else None
# analogies
ana = [('hand', 'glove', 'foot', 'sock'), ('bird', 'nest', 'bee', 'hive'), ('day', 'night', 'light', 'dark'), ('hot', 'cold', 'up', 'down'), ('eye', 'see', 'ear', 'hear'), ('fish', 'swim', 'bird', 'fly'),
       ('pen', 'write', 'knife', 'cut'), ('big', 'small', 'tall', 'short'), ('puppy', 'dog', 'kitten', 'cat'), ('teacher', 'school', 'doctor', 'hospital'), ('sun', 'day', 'moon', 'night'), ('milk', 'cow', 'egg', 'hen'),
       ('book', 'read', 'song', 'sing'), ('hot', 'summer', 'cold', 'winter'), ('sad', 'happy', 'old', 'young'), ('car', 'road', 'train', 'track'), ('foot', 'shoe', 'head', 'cap'), ('lion', 'roar', 'dog', 'bark')]
alln = [x for r in ana for x in r]
for a, b, c, d in ana:
    for lv in ('easy', 'standard'):
        oadd(lv, '%s is to %s as %s is to …' % (a.capitalize(), b, c), d, pick_other([r[3] for r in ana], d), 'ana')
        oadd(lv, '%s : %s :: %s : ?' % (a.capitalize(), b, c), d, pick_other([r[3] for r in ana], d), 'ana')
# calendar basics
days = 'Monday Tuesday Wednesday Thursday Friday Saturday Sunday'.split()
for i, d in enumerate(days):
    for n in range(1, 15):
        oadd('easy', 'What day comes %d day%s after %s?' % (n, 's' if n > 1 else '', d), days[(i + n) % 7], pick_other(days, days[(i + n) % 7]), 'day', 120)
# money / time word problems easy
for _ in range(2500):
    a = R.randint(2, 12); b = R.randint(2, 9)
    oadd('easy', 'Riya has %d sweets. She gets %d more. How many sweets does she have now?' % (a, b), a + b, numw(a + b, [1, 2], minv=0), 'wp', 250)
    if a > b: oadd('easy', 'Sam had %d balloons and %d burst. How many are left?' % (a, b), a - b, numw(a - b, [1, 2], minv=0), 'wp2', 250)
    oadd('easy', 'There are %d rows of chairs with %d chairs in each row. How many chairs are there?' % (b, a), a * b, numw(a * b, [a, b, 2, 10], minv=1), 'wp3', 200)
    oadd('easy', '%d apples are shared equally among %d children. How many does each get?' % (a * b, b), a, numw(a, [1, 2], minv=1), 'wp4', 200)
# ---- STANDARD
for _ in range(2000):
    a = R.randint(2, 30); step = R.randint(2, 15); n = R.randint(4, 6)
    seq = [a + step * i for i in range(n)]
    oadd('standard', 'What is the next number in: %s, ?' % ', '.join(map(str, seq)), a + step * n, numw(a + step * n, [1, 2, step], minv=0), 'seq2', 300)
for _ in range(2000):
    a = R.randint(1, 5); r = R.randint(2, 4); n = 4
    seq = [a * r ** i for i in range(n)]
    oadd('standard', 'Find the next number: %s, ?' % ', '.join(map(str, seq)), a * r ** n, numw(a * r ** n, [r, a * r ** (n - 1), 2], minv=1), 'seq3', 300)
for k in range(1, 16):
    seq = [(k + i) ** 2 for i in range(4)]
    oadd('standard', 'What comes next in: %s, ?' % ', '.join(map(str, seq)), (k + 4) ** 2, numw((k + 4) ** 2, [1, 2, 2 * (k + 4)], minv=0), 'sq')
for _ in range(2500):
    a = R.randint(20, 400); p = R.choice([5, 10, 20, 25, 50, 75, 40, 30, 60])
    if (a * p) % 100: continue
    oadd('standard', 'What is %d%% of %d?' % (p, a), a * p // 100, numw(a * p // 100, [1, 2, 5, 10], minv=0), 'pct', 350)
for _ in range(2500):
    a = R.randint(2, 12); b = R.randint(2, 12); c = R.randint(1, 20)
    oadd('standard', 'What is the value of %d × %d + %d?' % (a, b, c), a * b + c, numw(a * b + c, [1, 2, 10], minv=0), 'expr', 300)
    oadd('standard', 'What is the value of %d + %d × %d?' % (c, a, b), c + a * b, numw(c + a * b, [1, 2, a + c], minv=0), 'expr', 300)
    oadd('standard', 'What is the value of (%d + %d) × %d?' % (c, a, b), (c + a) * b, numw((c + a) * b, [b, a, 10], minv=0), 'expr', 300)
for _ in range(2500):
    v = R.randint(20, 90); t = R.randint(2, 9)
    oadd('standard', 'A bus moves at %d km/h for %d hours. How far does it travel?' % (v, t), '%d km' % (v * t), ['%d km' % x for x in numw(v * t, [v, t * 10, 10, 20], minv=1)], 'sdt', 300)
    oadd('standard', 'A train covers %d km in %d hours at a constant speed. What is its speed?' % (v * t, t), '%d km/h' % v, ['%d km/h' % x for x in numw(v, [5, 10, t, 2], minv=1)], 'sdt2', 300)
for _ in range(2500):
    l = R.randint(3, 40); w = R.randint(2, 30)
    if l == w: continue
    oadd('standard', 'What is the perimeter of a rectangle %d cm long and %d cm wide?' % (l, w), '%d cm' % (2 * (l + w)), ['%d cm' % x for x in numw(2 * (l + w), [l, w, l + w, 2], minv=1)], 'peri', 300)
    oadd('standard', 'What is the area of a rectangle %d cm long and %d cm wide?' % (l, w), '%d sq cm' % (l * w), ['%d sq cm' % x for x in numw(l * w, [l, w, l + w, 2 * (l + w)], minv=1)], 'area', 300)
    oadd('standard', 'A square has a side of %d cm. What is its area?' % l, '%d sq cm' % (l * l), ['%d sq cm' % x for x in numw(l * l, [l, 2 * l, 4 * l, 10], minv=1)], 'area', 300)
for _ in range(2500):
    a = R.randint(2, 60); b = R.randint(2, 60)
    if a == b: continue
    h = math.gcd(a, b); l = a * b // h
    oadd('standard', 'What is the HCF of %d and %d?' % (a, b), h, numw(h, [1, 2, 3, 4, 6], minv=1), 'hcf', 250)
    oadd('standard', 'What is the LCM of %d and %d?' % (a, b), l, numw(l, [a, b, h, l // 2 if l % 2 == 0 else 1, 10], minv=1), 'lcm', 250)
for _ in range(2500):
    a = R.randint(5, 90); b = R.randint(2, 9)
    oadd('standard', 'What is the remainder when %d is divided by %d?' % (a * 3 + R.randint(0, b - 1) if False else a, b), a % b, [x for x in range(0, max(b, 5)) if x != a % b][:3], 'rem', 250)
for _ in range(2500):
    x = R.randint(2, 30); a = R.randint(2, 9); b = R.randint(1, 30)
    oadd('standard', 'Solve: %dx + %d = %d. What is x?' % (a, b, a * x + b), x, numw(x, [1, 2, 3, a], minv=0), 'eq', 300)
    oadd('standard', 'If x ÷ %d = %d, what is x?' % (a, x), a * x, numw(a * x, [a, x, 10], minv=1), 'eq2', 300)
for n in range(3, 40):
    oadd('standard', 'In a group of %d people, each person shakes hands once with everyone else. How many handshakes are there?' % n, n * (n - 1) // 2, numw(n * (n - 1) // 2, [n, 1, 2, n - 1], minv=1), 'hs')
    oadd('standard', 'How many diagonals does a polygon with %d sides have?' % n, n * (n - 3) // 2, numw(n * (n - 3) // 2, [1, 2, n, n - 3], minv=0), 'diag')
    oadd('standard', 'What is the sum of the interior angles of a polygon with %d sides?' % n, '%d°' % ((n - 2) * 180), ['%d°' % x for x in [(n - 1) * 180, (n - 3) * 180, n * 180, (n - 2) * 90]], 'angle')
for _ in range(1500):
    p = R.randint(1, 9) * 10; cp = R.randint(2, 20) * 10
    sp = cp + p
    oadd('standard', 'An article bought for ₹%d is sold for ₹%d. What is the profit?' % (cp, sp), '₹%d' % p, ['₹%d' % x for x in numw(p, [10, 20, 5, cp], minv=1)], 'profit', 250)
# letters / coding
import string
for _ in range(2500):
    n = R.randint(3, 5); k = R.randint(1, 5)
    word = ''.join(R.choice('ABCDEFGHIKLMNOPRSTU') for _ in range(n))
    enc = ''.join(chr((ord(c) - 65 + k) % 26 + 65) for c in word)
    wr = []
    while len(wr) < 3:
        kk = R.randint(1, 6)
        w = ''.join(chr((ord(c) - 65 + kk) % 26 + 65) for c in word)
        if w != enc and w not in wr: wr.append(w)
    oadd('standard', 'In a code, each letter moves %d place%s forward in the alphabet. What is the code for %s?' % (k, 's' if k > 1 else '', word), enc, wr, 'code', 350)
for _ in range(1500):
    tot = R.randint(15, 45); L = R.randint(3, tot - 3)
    oadd('standard', 'In a row of %d children, Anu is %d-th from the left. What is her position from the right?' % (tot, L), tot - L + 1, numw(tot - L + 1, [1, 2, 3], minv=1), 'rank', 300)
for _ in range(1500):
    h = R.randint(1, 12)
    ang = abs(30 * h) if h != 12 else 0
    ang = min(ang, 360 - ang)
    oadd('standard', 'What is the smaller angle between the clock hands at %d o\'clock?' % h, '%d°' % ang, ['%d°' % x for x in numw(ang, [30, 60, 90, 15], minv=0)], 'clock')
# ---- CHALLENGE
for _ in range(2500):
    a = R.randint(1, 6); d = R.randint(1, 6); n = 6
    seq = [a + (i * (i + 1) // 2) * d for i in range(n)]
    nxt = a + (n * (n + 1) // 2) * d
    oadd('challenge', 'Find the next term: %s, ?' % ', '.join(map(str, seq)), nxt, numw(nxt, [d, n * d, 2, 1], minv=1), 'tri', 300)
for _ in range(2500):
    a = R.randint(1, 9); b = R.randint(1, 9); n = 6
    seq = [a, b]
    for _i in range(n - 2): seq.append(seq[-1] + seq[-2])
    nxt = seq[-1] + seq[-2]
    oadd('challenge', 'In the sequence %s, ? each term is the sum of the two before it. What is the next term?' % ', '.join(map(str, seq)), nxt, numw(nxt, [1, 2, seq[-2], 5], minv=1), 'fib', 300)
for _ in range(2500):
    a = R.randint(2, 10); b = R.randint(2, 10); n = 3
    seq = []
    x, y = a, b
    for i in range(3): seq += [x, y]; x += 2; y += 3
    nxt = x
    oadd('challenge', 'Two patterns alternate: %s, ? What is the next number?' % ', '.join(map(str, seq)), nxt, numw(nxt, [1, 2, 3, 5], minv=0), 'alt', 300)
for _ in range(2500):
    c = R.randint(10, 80); a = R.randint(2, 6)
    # age problems: father is k times son; sum S
    s = R.randint(2, 15); k = R.randint(2, 5)
    S_ = s * (k + 1)
    oadd('challenge', 'A father is %d times as old as his son. Together their ages add up to %d years. How old is the son?' % (k, S_), s, numw(s, [1, 2, 3, 5], minv=1), 'age', 400)
    oadd('challenge', 'The sum of two numbers is %d and their difference is %d. What is the larger number?' % (2 * s + 2 * a, 2 * a), s + 2 * a if False else (2 * s + 2 * a + 2 * a) // 2, numw((2 * s + 2 * a + 2 * a) // 2, [1, 2, a], minv=1), 'sumdiff', 400)
for _ in range(2500):
    r = R.randint(2, 40); 
    p = R.choice([10, 20, 25, 40, 50]); base = R.randint(1, 20) * 100 // 1
    nv = base * (100 - p) // 100 if (base * (100 - p)) % 100 == 0 else None
    if nv is None: continue
    oadd('challenge', 'After a %d%% discount, a toy costs ₹%d. What was its original price?' % (p, nv), '₹%d' % base, ['₹%d' % x for x in [base + 100, base + 200, base + 300, base - 100, nv + p]], 'disc', 300)
for _ in range(2500):
    a = R.randint(2, 9); b = R.randint(2, 9)
    t = R.randint(2, 8)
    sp1 = a * 5; sp2 = b * 5
    oadd('challenge', 'Two cyclists start from the same point and ride in opposite directions at %d km/h and %d km/h. How far apart are they after %d hours?' % (sp1, sp2, t), '%d km' % ((sp1 + sp2) * t), ['%d km' % x for x in [abs(sp1 - sp2) * t, (sp1 + sp2) * t + t, (sp1 + sp2) * t // 2 + 1, (sp1 + sp2) * (t + 1)]], 'rel', 300)
for _ in range(2500):
    n = R.randint(2, 14)
    oadd('challenge', 'How many squares of all sizes are there in a %d × %d grid of unit squares?' % (n, n), sum(i * i for i in range(1, n + 1)), numw(sum(i * i for i in range(1, n + 1)), [n, n * n, 1, 2], minv=1), 'grid', 100)
for n in range(3, 40):
    oadd('challenge', 'How many different 2-person teams can be chosen from %d players?' % n, n * (n - 1) // 2, numw(n * (n - 1) // 2, [n, 1, 2], minv=1), 'comb')
    oadd('challenge', 'From %d different books, in how many ways can 3 be chosen and placed in order on a shelf?' % n, n * (n - 1) * (n - 2), numw(n * (n - 1) * (n - 2), [n, 6, 10], minv=1), 'perm')
for _ in range(2500):
    r = R.randint(1, 9) * 7; n = R.randint(2, 9)
    oadd('challenge', 'What is the area of a circle of radius %d cm? (Use π = 22/7)' % r, '%d sq cm' % (22 * r * r // 7), ['%d sq cm' % x for x in numw(22 * r * r // 7, [r, 2 * r * 22 // 7, 44, 22], minv=1)], 'circle', 100)
    oadd('challenge', 'What is the circumference of a circle of radius %d cm? (Use π = 22/7)' % r, '%d cm' % (44 * r // 7), ['%d cm' % x for x in numw(44 * r // 7, [r, 22, 44], minv=1)], 'circle', 100)
for _ in range(2500):
    n = R.randint(2, 12)
    # digit sum / last digit
    a = R.randint(2, 9); p = R.randint(5, 40)
    ld = pow(a, p, 10)
    oadd('challenge', 'What is the last digit of %d^%d?' % (a, p), ld, [x for x in range(10) if x != ld][:3] if ld > 2 else [x for x in range(1, 10) if x != ld][:3], 'lastdigit', 300)
for _ in range(2500):
    a = R.randint(2, 15); b = R.randint(2, 15); c = R.randint(2, 15)
    ans = a * b - c * a
    oadd('challenge', 'What is the value of %d × %d − %d × %d?' % (a, b, c, a), ans, [x for x in numw(ans, [1, a, b, c], minv=-1000)], 'expr2', 300)
    k = R.randint(2, 12)
    oadd('challenge', 'If %d is added to %d times a number the result is %d. What is the number?' % (a, k, a + k * b), b, numw(b, [1, 2, a, k], minv=0), 'unk', 300)
for _ in range(2500):
    n = R.randint(5, 60); r1 = R.randint(1, 5); r2 = R.randint(1, 5)
    if r1 == r2: continue
    tot = (r1 + r2) * n
    oadd('challenge', 'Two numbers are in the ratio %d : %d and their sum is %d. What is the larger number?' % (r1, r2, tot), max(r1, r2) * n, numw(max(r1, r2) * n, [n, 2, 5, 10], minv=1), 'ratio', 300)
d3 = [(a, b) for a in range(1, 8) for b in range(a + 1, 9)]
for a, b in d3:
    for c, d in d3:
        if len(B[O]['challenge']) > 40000: break
        if (c / d) == (a / b): continue
        pass
dirs = ['North', 'East', 'South', 'West']
for i, d in enumerate(dirs):
    for turn, k in [('right', 1), ('left', -1)]:
        for t in range(1, 8):
            oadd('standard', 'A child facing %s turns %s %d time%s (a quarter turn each time). Which way is the child facing now?' % (d, turn, t, 's' if t > 1 else ''), dirs[(i + k * t) % 4], pick_other(dirs, dirs[(i + k * t) % 4]), 'dir')
for _ in range(300):
    d = R.choice(dirs); a = R.randint(2, 9); b = R.randint(2, 9)
    oadd('challenge', 'Ravi walks %d km %s, then %d km %s. How far is he from the start?' % (a, 'North', a, 'South'), '0 km', ['%d km' % a, '%d km' % (2 * a), '%d km' % (a + 1)], 'walk') if False else None
# ---------------------------------------------------------------- write
def dump(subj):
    out = {}
    for lvl in ('easy', 'standard', 'challenge'):
        items = list(B[subj][lvl].values())
        R.shuffle(items)
        out[lvl] = items
    return out
for subj, var in (('science', '_qbSci'), ('olympiad', '_qbOly')):
    d = dump(subj)
    p = os.path.join(OUT, 'qbank-%s.js' % subj)
    with open(p, 'w') as f:
        f.write('/* Generated by tools/gen_qbank.py — do not edit by hand. Item = [question, answer, wrong1, wrong2, wrong3]. */\n')
        f.write('window.%s=%s;\n' % (var, json.dumps(d, ensure_ascii=False, separators=(',', ':'))))
    print(subj, {k: len(v) for k, v in d.items()}, 'total', sum(len(v) for v in d.values()), os.path.getsize(p) // 1024, 'KB')
