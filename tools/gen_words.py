#!/usr/bin/env python3
"""Builds shared/qbank-words.js: kid-friendly word lists (Easy/Standard/Challenge) for Word Scramble and Spelling Bee.
Words = real dictionary lemmas (WordNet) ranked by everyday frequency (wordfreq); adult/violent/offensive words, names and homophones are filtered out."""
import json, os, re, collections
from wordfreq import top_n_list, zipf_frequency
from wn import WordNet
from better_profanity import profanity
profanity.load_censor_words()
wn = WordNet()
OUT = os.path.join(os.path.dirname(__file__), '..', 'shared', 'qbank-words.js')

BLOCK = set('''sex sexy sexual sexuality porn porno nude naked nudity breast breasts penis vagina anus rectum rape rapist molest abuse abused
kill killer killing murder murderer suicide suicidal death dead die dying corpse corpses cadaver grave gore gory blood bloody bleed wound wounded torture torment
gun guns rifle pistol revolver bullet bombs bomb bomber explosive grenade missile weapon weapons assassin assassinate massacre genocide terror terrorist terrorism hostage kidnap
drug drugs cocaine heroin opium marijuana cannabis narcotic narcotics hashish meth morphine overdose addict addiction alcohol alcoholic beer wine whisky whiskey vodka liquor rum gin brandy booze drunk drunken tipsy intoxicated cigarette cigar tobacco smoker nicotine gambling gamble casino brothel prostitute
hell damn devil satan demon demons curse cursed slave slavery racist racism slur bastard bitch whore slut slutty pimp stripper erotic orgasm fetish lust lustful adultery adulterer mistress affair concubine
fat fatty obese obesity ugly stupid idiot moron dumb retard cripple crippled lunatic insane madman psycho psychotic
genital genitals testicle testicles scrotum vulva clitoris semen sperm ovary womb uterus menstruation menstrual pregnant pregnancy abortion contraception condom
cancer tumor tumour disease diseases infection virus epidemic plague leprosy syphilis aids herpes hiv
war wars warfare battle battles combat soldier soldiers army armies troops invade invasion invader enemy enemies attack attacker assault slaughter butcher execute execution hang hanged hanging noose gallows
jail prison prisoner convict criminal crime thief steal stole robbery robber burglar bribe fraud scam smuggle smuggler gang gangster mafia
religion religious god gods allah jesus christ church mosque temple priest pope bible quran hindu muslim jew jewish christian catholic atheist
republican democrat politics political election vote voter president senator communist communism fascist fascism nazi
nipple nipples bra bikini underwear panties lingerie brassiere diaper toilet urine urinate faeces feces excrement vomit vomiting puke fart farting poop pooh pee piss turd
bum butt arse ass anal anus dick cock prick pussy cunt twat tit tits boob boobs wank crap shit fuck fucking hump humping screw screwing bonk bonking nookie knocker knockers rod pecker
cult sect heretic infidel pagan witch witchcraft sorcerer sorcery occult satanic voodoo
dope joint stoned hooker harlot tramp trollop floozy strumpet courtesan hustler gigolo
retarded spastic mongol negro nigger coon gook chink spic wop kike dyke fag faggot queer homo lesbian gay transgender tranny
suicide hangman beheaded beheading decapitate mutilate mutilation dismember amputate amputation
lynch lynching riot rioter protest protester revolt rebel rebellion coup treason traitor spy spies espionage
alcoholism hangover brew brewery pub bar tavern saloon cocktail martini champagne sherry port lager ale stout cider
mate mating copulate copulation intercourse coitus orgy breed breeding
horny kinky naughty seduce seduction seductive sensual sensuality sexually virgin virginity
wasted wasting waste junkie crack pot weed grass speed ice
stripe strip stripping striptease'''.split())
# words that are fine in kids' lists even if the blocklist is greedy
ALLOW = set('grass pot ice speed port waste bar bar strip stripe war fat mate ice gin rum brew die dead'.split()) - set('die dead fat war'.split())
BLOCK -= ALLOW
BLOCK |= set('die dying dead fat war wars'.split())
HOMO = set('''to too two there their theyre here hear for four fore no know new knew night knight write right rite wright by buy bye be bee see sea sun son one won ate eight blue blew bear bare flower flour hole whole
meet meat made maid pair pear pare plain plane read reed red road rode rowed role roll sail sale tail tale wait weight way weigh weak week which witch wear where ware would wood your youre you
air heir aloud allowed ant aunt berry bury boy buoy bread bred brake break cell sell cent scent sent cereal serial chews choose close clothes coarse course dear deer die dye doe dough fair fare feat feet
fir fur flee flea flew flu flue foul fowl gait gate genes jeans grate great groan grown hair hare heal heel heard herd hi high him hymn hour our idle idol in inn knot not lead led lessen lesson main mane
mail male mist missed moose mousse morning mourning none nun oar ore or pail pale pain pane peace piece peak peek pole poll pray prey principal principle rain reign rein raise rays raze ring wring root route
sauce source seam seem sew so sow soar sore some sum stair stare stake steak stationary stationery steal steel storey story suite sweet tea tee team teem tide tied toe tow vain vane vein waist waste war wore
whale wail wale weather whether wheel weal yoke yolk lain lane lie lye might mite mind mined naval navel patience patients peal peel rap wrap rest wrest ring sight site cite slay sleigh soul sole threw through throne thrown
tire tyre vale veil wade weighed whine wine wholly holy wholey caught court cord chord council counsel currant current dual duel faint feint flair flare gorilla guerrilla hall haul hangar hanger
lo low manner manor medal meddle metal mettle mussel muscle pause paws pores pours poor pour pore profit prophet quarts quartz rap sealing ceiling serf surf sew sword soared'''.split())
ABBR = set('tv pc dvd cd ok vs etc'.split())
PHRASAL_BAD = re.compile(r"\b(sex|sexual|penis|vagina|kill|murder|rape|drug|alcohol|liquor|wine|beer|drunk|nude|naked|breast|genital|testic|semen|intercourse|vulgar|obscene|slang|offensive|derogatory|whore|prostitut|erotic|excrement|urine|feces|faeces|vomit|corpse|cadaver|dead body|death|dying|die|suicide|tortur|massacre|slaughter|weapon|gun|bomb|explos|gambl|cigar|tobacco|narcotic|opium|heroin|cocaine|disease|cancer|tumor|bastard|devil|satan|curse|damn|hell|abortion|pregnan|condom|menstru|lust|adulter|rape)", re.I)

ROOTS = {'sexual_activity.n.01','sex.n.01','drug.n.01','drug_of_abuse.n.01','weapon.n.01','weaponry.n.01','killing.n.02','killing.n.01','death.n.01','alcohol.n.01','alcoholic_beverage.n.01','disease.n.01','illness.n.01','religion.n.01','religious_person.n.01','criminal.n.01','crime.n.01','violence.n.01','violent_death.n.01','sexual_organ.n.01','excretion.n.01','body_waste.n.01','prostitute.n.01','ethnic_group.n.01','slur.n.01','swearing.n.01','profanity.n.01','explosive.n.01','war.n.01','warfare.n.01','fighting.n.01','sin.n.01','punishment.n.01','injury.n.01','tobacco.n.01','poison.n.01','cadaver.n.01','mental_illness.n.01','physical_ailment.n.01','abuse.n.01','mistreatment.n.01','sex_act.n.01','sexual_desire.n.01','nudity.n.01','pornography.n.01','sexual_love.n.01','kiss.n.01','intoxication.n.01'}
PRIM_BAD = re.compile(r"\b(sex|sexual|sexually|vulgar|genital|intercourse|obscene|offensive|derogatory|erotic|penis|vagina|breast|naked|nude|kill|murder|rape|drunk|intoxicat|drug|opium|narcotic|prostitut|whore|slut|bastard|excrement|urinat|feces|faeces|dung|menstru|pregnan|abortion|torture|suicide|corpse|stupid|fool|idiot|ugly|devil|curse|damn|hell|romance|romantic|passion|lover|lovemaking|seduc)", re.I)
BLOCK |= set('buttocks crappy homophobia homophobic cummings stupidity tortured crippling drugstore ungodly mainline idiotic undressed supremacist segregated segregation segregate narcissist disfigured inflamed mod climax aroused arousing arouse intimacy intimate promiscuous celibacy solicit solicitation procure potency unfaithful provocative sexist hellish violate sedation tucker spade'.split())
top = top_n_list('en', 90000)
rank = {w: i for i, w in enumerate(top)}
cand = {}
for w in top:
    if not (3 <= len(w) <= 13) or not w.isascii() or not w.isalpha() or w != w.lower(): continue
    if w in BLOCK or w in HOMO or w in ABBR: continue
    if profanity.contains_profanity(w): continue
    if not re.search('[aeiouy]', w): continue
    if len(set(w)) < 3 and len(w) > 3: pass
    if len(set(w)) < 2: continue
    ss = wn.synsets(w)
    ss = [s for s in ss if w in [l.lower() for l in s.lemma_names()] and w in s.lemma_names()]  # exact lowercase lemma (excludes proper nouns)
    if not ss: continue
    if rank[w] >= 2500 and any(w.capitalize() in x.lemma_names() for x in wn.synsets(w)): continue   # also a proper name
    s0 = ss[0]
    d = s0.definition()
    if PHRASAL_BAD.search(d) or PRIM_BAD.search(d): continue
    if profanity.contains_profanity(d): continue
    # reject if any sense is flagged vulgar/offensive/slang-usage topic
    bad = False
    for s in ss:
        try:
            if any('vulgar' in x.name().lower() or 'offensive' in x.name().lower() for x in s.usage_domains()): bad = True
        except Exception: pass
    if bad: continue
    names = set()
    for sx in ss:
        try:
            for pth in sx.hypernym_paths(): names |= {x.name() for x in pth}
        except Exception: pass
    if names & ROOTS: continue
    lex = [x.lexname() for x in ss]
    onepos = len({x.pos() for x in ss}) == 1
    uniq = onepos and len(set(lex)) == 1
    major = onepos and lex.count(lex[0]) / len(lex) >= 0.6
    cand[w] = (s0, d, (uniq, major))
print('candidates', len(cand))

LEX = {'noun.animal': 'an animal', 'noun.plant': 'a plant', 'noun.food': 'something to eat or drink', 'noun.body': 'a part of the body', 'noun.person': 'a kind of person',
       'noun.location': 'a place', 'noun.artifact': 'a made object', 'noun.substance': 'a material or substance', 'noun.time': 'a word about time', 'noun.act': 'an activity',
       'noun.event': 'something that happens', 'noun.feeling': 'a feeling', 'noun.quantity': 'a measure or amount', 'noun.shape': 'a shape', 'noun.communication': 'something people say, write or show',
       'noun.cognition': 'something to do with thinking', 'noun.group': 'a group of things or people', 'noun.attribute': 'a quality', 'noun.phenomenon': 'something in nature',
       'noun.object': 'something in nature', 'noun.possession': 'something to do with owning or money', 'noun.relation': 'a relationship word', 'noun.state': 'a state or condition', 'noun.process': 'a natural process',
       'verb.motion': 'an action word about moving', 'verb.communication': 'an action word about talking', 'verb.cognition': 'an action word about thinking', 'verb.consumption': 'an action word about eating or drinking',
       'verb.creation': 'an action word about making things', 'verb.body': 'an action word about the body', 'verb.change': 'an action word about changing', 'verb.contact': 'an action word about touching',
       'verb.perception': 'an action word about seeing, hearing or feeling', 'verb.social': 'an action word about people together', 'verb.stative': 'an action or state word', 'verb.emotion': 'an action word about feelings',
       'verb.competition': 'an action word about games or contests', 'verb.possession': 'an action word about having or giving', 'verb.weather': 'an action word about weather',
       'adj.all': 'a describing word', 'adj.pert': 'a describing word', 'adj.ppl': 'a describing word', 'adv.all': 'a word that tells how, when or where'}
CONCRETE = {'noun.animal', 'noun.plant', 'noun.food', 'noun.body', 'noun.artifact', 'noun.object', 'noun.substance', 'noun.person', 'noun.location'}
CATS = sorted(set(LEX.values()) | {'a word'})
STOP = set('a an the of and or to in on at by for with from that which who whom whose is are was be being been it its this these those as'.split())
def gloss_hint(w, d):
    g = re.split(r'[;:]', d)[0].strip()
    if '(' in g or len(g) > 60 or len(g) < 8: return None
    words = re.findall(r"[a-zA-Z']+", g.lower())
    if any(zipf_frequency(x, 'en') < 3.2 for x in words if x not in STOP): return None
    stem = w[:max(4, len(w) - 2)]
    if any(stem in x for x in words): return None
    return g[0].upper() + g[1:]

items = []
for w, (s0, d, uniq) in cand.items():
    r = rank[w]; L = len(w)
    z = zipf_frequency(w, 'en')
    if L <= 6 and r < 9000: lvl = 'easy'
    elif L <= 9 and z >= 3.3 and not (L <= 5 and r < 3000): lvl = 'standard'
    elif L >= 7 and z >= 2.9: lvl = 'challenge'
    elif L <= 6 and z >= 3.3: lvl = 'standard'
    else: continue
    items.append((w, lvl, s0, d, r, uniq))
# anagram collisions -> drop the rarer word (scramble must have a single answer)
by = collections.defaultdict(list)
for it in items: by[''.join(sorted(it[0]))].append(it)
drop = set()
for k, v in by.items():
    if len(v) > 1:
        v.sort(key=lambda x: x[4])
        for x in v[1:]: drop.add(x[0])
items = [i for i in items if i[0] not in drop]
out = {'easy': [], 'standard': [], 'challenge': []}
for w, lvl, s0, d, r, uniq in items:
    h = gloss_hint(w, d) if (uniq[0] and s0.lexname() in CONCRETE and s0.pos() == 'n') else None
    cat = LEX.get(s0.lexname(), 'a word')
    ci = CATS.index(cat) if (uniq[1] and cat in CATS) else -1
    out[lvl].append([w.upper(), h if h else ci])
for k in out: out[k].sort(key=lambda x: (len(x[0]), x[0]))
with open(OUT, 'w') as f:
    f.write('/* Generated by tools/gen_words.py — do not edit by hand. Item = [WORD, hint]. */\nwindow._qbWordCats=%s;window._qbWords=%s;\n' % (json.dumps(CATS), json.dumps(out, ensure_ascii=False, separators=(',', ':'))))
print({k: len(v) for k, v in out.items()}, sum(len(v) for v in out.values()), os.path.getsize(OUT) // 1024, 'KB')
