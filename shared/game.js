// ─── No-repeat picker ───────────────────────────────────────────────
const noRepeatState = {};
function pickNoRepeat(key, pool){
  let state = noRepeatState[key];
  if(!state || state.pool.length !== pool.length || state.index >= state.pool.length){
    state = { pool: [...pool].sort(() => Math.random()-0.5), index: 0 };
    noRepeatState[key] = state;
  }
  return state.pool[state.index++];
}

// ─── Band helper ─────────────────────────────────────────────────────
function bandFor(grade){
  if(!grade || grade === 'all'){
    const bands = ['1-2','3-4','5-6','7-8','9-10'];
    return bands[Math.floor(Math.random()*bands.length)];
  }
  const g = parseInt(grade);
  if(g <= 2) return '1-2';
  if(g <= 4) return '3-4';
  if(g <= 6) return '5-6';
  if(g <= 8) return '7-8';
  return '9-10';
}
function bandLabel(band){ return 'Grade ' + band; }

// get grade from URL: /practice/grade-5/math.html → 5
function gradeFromURL(){
  const m = window.location.pathname.match(/grade-(\d+)/);
  return m ? m[1] : 'all';
}

// ─── Voice / TTS System ─────────────────────────────────────────────
let selectedVoice = null;

function loadVoices(){
  const voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  const usable = voices.filter(v =>
    v.lang && v.lang.startsWith('en') &&
    !v.name.toLowerCase().includes('espeak') &&
    !v.name.toLowerCase().includes('mbrola')
  );
  selectedVoice =
    usable.find(v => v.lang === 'en-US' && v.name.toLowerCase().includes('google')) ||
    usable.find(v => v.lang === 'en-US') ||
    usable.find(v => v.name.toLowerCase().includes('google')) ||
    usable[0] || null;
}
if(window.speechSynthesis){ loadVoices(); window.speechSynthesis.onvoiceschanged = loadVoices; }

function speakText(text, statusElId){
  const statusEl = statusElId ? document.getElementById(statusElId) : null;
  if(!('speechSynthesis' in window)){
    if(statusEl) statusEl.textContent = '⚠️ Speech not supported on this browser.';
    return;
  }
  try{
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    if(selectedVoice) utter.voice = selectedVoice;
    utter.rate = 0.82;
    utter.pitch = 1.0;
    utter.volume = 1.0;
    if(statusEl){
      utter.onstart = () => statusEl.textContent = '🔊 Playing…';
      utter.onerror = () => statusEl.textContent = '⚠️ Could not play audio.';
      utter.onend = () => statusEl.textContent = '✅ Now type your spelling!';
    }
    window.speechSynthesis.speak(utter);
  } catch(err){
    if(statusEl) statusEl.textContent = '⚠️ Error: ' + err.message;
  }
}

function speakBeeWord(){
  speakText(currentBeeWord, 'bee-status');
}

// ─── Math Blitz ──────────────────────────────────────────────────────
let mathScore=0, mathStreak=0, mathAnswer=0;
function genMathQuestion(band){
  let a,b,op,text,answer;
  if(band==='1-2'){
    op=Math.random()<0.5?'+':'-'; a=Math.floor(Math.random()*10)+1; b=Math.floor(Math.random()*10)+1;
    if(op==='-'&&b>a)[a,b]=[b,a]; answer=op==='+'?a+b:a-b; text=`${a} ${op} ${b} = ?`;
  } else if(band==='3-4'){
    const ops=['+','-','×']; op=ops[Math.floor(Math.random()*3)];
    a=Math.floor(Math.random()*12)+1; b=Math.floor(Math.random()*12)+1;
    if(op==='-'&&b>a)[a,b]=[b,a]; answer=op==='+'?a+b:op==='-'?a-b:a*b; text=`${a} ${op} ${b} = ?`;
  } else if(band==='5-6'){
    const type=Math.floor(Math.random()*3);
    if(type===0){ b=Math.floor(Math.random()*9)+2; answer=Math.floor(Math.random()*12)+1; a=b*answer; text=`${a} ÷ ${b} = ?`; }
    else if(type===1){ a=(Math.floor(Math.random()*90)+10)/10; b=(Math.floor(Math.random()*90)+10)/10; answer=Math.round((a+b)*10)/10; text=`${a} + ${b} = ?`; }
    else { a=Math.floor(Math.random()*10)*10; b=[10,20,25,50][Math.floor(Math.random()*4)]; answer=Math.round(a*b/100); text=`${b}% of ${a} = ?`; }
  } else if(band==='7-8'){
    const type=Math.floor(Math.random()*3);
    if(type===0){ a=Math.floor(Math.random()*20)-10; b=Math.floor(Math.random()*20)-10; answer=a+b; text=`${a} + (${b}) = ?`; }
    else if(type===1){ a=Math.floor(Math.random()*15)+1; answer=Math.floor(Math.random()*15)+1; b=a+answer; text=`x + ${a} = ${b}, x = ?`; }
    else { a=Math.floor(Math.random()*12)+2; answer=a*a; text=`${a}² = ?`; }
  } else {
    const type=Math.floor(Math.random()*3);
    if(type===0){ a=Math.floor(Math.random()*5)+2; const x=Math.floor(Math.random()*10)+1; b=Math.floor(Math.random()*10)+1; const c=a*x+b; answer=x; text=`${a}x + ${b} = ${c}, x = ?`; }
    else if(type===1){ a=Math.floor(Math.random()*5)+2; b=Math.floor(Math.random()*3)+2; answer=Math.pow(a,b); text=`${a}^${b} = ?`; }
    else { a=(Math.floor(Math.random()*20)+5)*10; b=[10,15,20][Math.floor(Math.random()*3)]; answer=Math.round(a*(1+b/100)); text=`${a} increased by ${b}% = ?`; }
  }
  return {text, answer};
}
function initMath(grade){
  mathScore=0; mathStreak=0;
  const band=bandFor(grade);
  document.getElementById('math-grade-tag').textContent=bandLabel(band);
  nextMathQuestion(grade);
}
function nextMathQuestion(grade){
  const band=bandFor(grade);
  document.getElementById('math-grade-tag').textContent=bandLabel(band);
  const q=genMathQuestion(band); mathAnswer=q.answer;
  document.getElementById('question').textContent=q.text;
  const options=new Set([mathAnswer]);
  while(options.size<4){ const d=Math.floor(Math.random()*10)-5||1; options.add(mathAnswer+d); }
  const container=document.getElementById('math-answers'); container.innerHTML='';
  [...options].sort(()=>Math.random()-0.5).forEach(val=>{
    const btn=document.createElement('button'); btn.textContent=val;
    btn.onclick=()=>{
      if(val===mathAnswer){ btn.classList.add('correct'); mathScore+=10; mathStreak+=1; document.getElementById('math-feedback').textContent='✅ Correct!'; }
      else { btn.classList.add('wrong'); mathStreak=0; document.getElementById('math-feedback').textContent=`❌ Answer was ${mathAnswer}`; }
      document.getElementById('math-score').textContent=mathScore; document.getElementById('math-streak').textContent=mathStreak;
      setTimeout(()=>nextMathQuestion(grade), 900);
    };
    container.appendChild(btn);
  });
  document.getElementById('math-feedback').textContent='';
}

// ─── Word Scramble ───────────────────────────────────────────────────
const wordBanks={
  '1-2':[{word:'CAT',hint:'A pet that says meow'},{word:'DOG',hint:'A pet that barks'},{word:'SUN',hint:'It shines in the sky'},{word:'HAT',hint:'You wear it on your head'},{word:'RUN',hint:'To move fast on your feet'},{word:'BED',hint:'You sleep on it'},{word:'CUP',hint:'You drink from it'},{word:'PEN',hint:'You write with it'},{word:'BALL',hint:'Round toy you throw or kick'},{word:'FISH',hint:'Swims in water'},{word:'BOOK',hint:'You read it'},{word:'RAIN',hint:'Water falling from clouds'},{word:'STAR',hint:'You see it twinkle at night'},{word:'MOON',hint:'Shines at night'},{word:'TREE',hint:'Has roots, trunk and leaves'},{word:'FROG',hint:'Jumps and croaks'},{word:'MILK',hint:'White drink from cows'},{word:'CAKE',hint:'Sweet baked treat'},{word:'BIRD',hint:'Has wings and feathers'},{word:'FIRE',hint:'Hot and gives light'}],
  '3-4':[{word:'ELEPHANT',hint:'Large animal with a trunk'},{word:'RAINBOW',hint:'Colorful arc in the sky after rain'},{word:'PLANET',hint:'Earth is one of these'},{word:'LIBRARY',hint:'A place full of books'},{word:'BICYCLE',hint:'Two wheels, you pedal it'},{word:'VOLCANO',hint:'Mountain that can erupt'},{word:'GARDEN',hint:'Place where flowers and plants grow'},{word:'FOREST',hint:'A large area covered with trees'},{word:'KITCHEN',hint:'Room where food is cooked'},{word:'WINDOW',hint:'You look outside through it'},{word:'PENCIL',hint:'You write with it'},{word:'MOUNTAIN',hint:'A very tall rocky landform'},{word:'CALENDAR',hint:'Shows the days and months'},{word:'FESTIVAL',hint:'A celebration or special event'},{word:'BASKET',hint:'Woven container'},{word:'BLANKET',hint:'Keeps you warm at night'},{word:'CANDLE',hint:'Gives light when lit'},{word:'COMPASS',hint:'Used for finding direction'},{word:'DIAMOND',hint:'A precious gemstone'},{word:'DRAGON',hint:'A mythical fire-breathing creature'}],
  '5-6':[{word:'DINOSAUR',hint:'Ancient giant reptile'},{word:'TELESCOPE',hint:'Used to look at stars'},{word:'ADVENTURE',hint:'An exciting journey'},{word:'CONTINENT',hint:'Asia or Africa for example'},{word:'MICROSCOPE',hint:'Used to see tiny things'},{word:'ATMOSPHERE',hint:'Layer of air around Earth'},{word:'KNOWLEDGE',hint:'Facts and information you know'},{word:'JOURNEY',hint:'A trip from one place to another'},{word:'TREASURE',hint:'Valuable hidden riches'},{word:'GLACIER',hint:'A huge slow-moving mass of ice'},{word:'CURIOUS',hint:'Eager to learn or know'},{word:'FRAGILE',hint:'Easily broken'},{word:'ABSENCE',hint:'Not being present'},{word:'AMBITION',hint:'A strong desire to achieve'},{word:'ANCIENT',hint:'Very old, from long ago'},{word:'AQUARIUM',hint:'Tank where fish are kept'},{word:'BALANCE',hint:'A state of equal weight'},{word:'CAPACITY',hint:'Maximum amount that can be held'},{word:'CENTURY',hint:'A period of 100 years'},{word:'CHAMPION',hint:'A winner or first-place person'}],
  '7-8':[{word:'PHOTOSYNTHESIS',hint:'How plants make food from sunlight'},{word:'DEMOCRACY',hint:'Government elected by the people'},{word:'ECOSYSTEM',hint:'Living things and environment together'},{word:'HYPOTHESIS',hint:'An educated guess in science'},{word:'REVOLUTION',hint:'A major sweeping change'},{word:'METAPHOR',hint:'A figure of speech comparing two things'},{word:'CONSCIENCE',hint:'Inner sense of right and wrong'},{word:'RHYTHM',hint:'A regular repeated pattern of beat'},{word:'INDEPENDENCE',hint:'Freedom from outside control'},{word:'ARCHITECTURE',hint:'The design of buildings'},{word:'TEMPERATURE',hint:'How hot or cold something is'},{word:'GEOGRAPHY',hint:'Study of Earths land and features'},{word:'NECESSARY',hint:'Cannot be done without'},{word:'VACUUM',hint:'A space with no matter in it'},{word:'ABUNDANT',hint:'Available in large quantities'},{word:'ACCELERATE',hint:'To increase in speed'},{word:'ACCOMPANY',hint:'To go along with someone'},{word:'ADEQUATE',hint:'Enough for the purpose'},{word:'ADVOCATE',hint:'To support a cause or person'},{word:'AMBIGUOUS',hint:'Open to more than one interpretation'}],
  '9-10':[{word:'ENTREPRENEUR',hint:'A person who starts a business'},{word:'PHILOSOPHY',hint:'Study of knowledge and existence'},{word:'ALGORITHM',hint:'Step-by-step procedure for a task'},{word:'RENAISSANCE',hint:'Period of art and learning revival'},{word:'EQUILIBRIUM',hint:'A state of balance'},{word:'ARTICULATE',hint:'To express clearly'},{word:'BUREAUCRACY',hint:'A system of officials running government'},{word:'SILHOUETTE',hint:'A dark outline against a light background'},{word:'PHENOMENON',hint:'A remarkable or unusual occurrence'},{word:'INFRASTRUCTURE',hint:'Basic physical systems of a country'},{word:'PERSEVERANCE',hint:'Continued effort despite difficulty'},{word:'SUSTAINABLE',hint:'Able to continue without harming resources'},{word:'CONSCIENTIOUS',hint:'Wishing to do right'},{word:'ONOMATOPOEIA',hint:'Word that sounds like what it describes'},{word:'ABERRATION',hint:'A departure from what is normal'},{word:'AMBIVALENT',hint:'Having mixed feelings'},{word:'ANACHRONISM',hint:'Something out of its time period'},{word:'ANTAGONIST',hint:'A person who opposes the main character'},{word:'AUSPICIOUS',hint:'Giving a sign of future success'},{word:'BELLIGERENT',hint:'Hostile and aggressive'}]
};
let spellScore=0, spellStreak=0, currentWord='', currentHint='';
function scramble(str){ let arr=str.split(''); for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; } return arr.join(''); }
function initSpelling(grade){
  spellScore=0; spellStreak=0;
  nextSpellingWord(grade);
}
function nextSpellingWord(grade){
  const band=bandFor(grade);
  document.getElementById('spell-grade-tag').textContent=bandLabel(band);
  const pick=pickNoRepeat('spell-'+band, wordBanks[band]);
  currentWord=pick.word; currentHint=pick.hint;
  let sc=scramble(pick.word); while(sc===pick.word) sc=scramble(pick.word);
  document.getElementById('scramble-word').textContent=sc;
  document.getElementById('hint').textContent='💡 '+pick.hint;
  document.getElementById('spell-input').value='';
  document.getElementById('spell-feedback').textContent='';
  const btn=document.getElementById('speak-btn');
  if(btn) btn.style.display=(band==='1-2'?'inline-block':'none');
}
function checkSpelling(){
  const val=document.getElementById('spell-input').value.trim().toUpperCase();
  if(val===currentWord){ spellScore+=10; spellStreak+=1; document.getElementById('spell-feedback').textContent='✅ Correct!'; }
  else { spellStreak=0; document.getElementById('spell-feedback').textContent=`❌ It was ${currentWord}`; }
  document.getElementById('spell-score').textContent=spellScore; document.getElementById('spell-streak').textContent=spellStreak;
  setTimeout(()=>nextSpellingWord(gradeFromURL()), 1200);
}

// ─── Science Quiz ────────────────────────────────────────────────────
const sciBanks={
  '1-2':[
    {q:'What color is the sky on a clear day?',options:['Blue','Green','Red','Purple'],answer:'Blue'},
    {q:'How many legs does a dog have?',options:['2','4','6','8'],answer:'4'},
    {q:'What do bees make?',options:['Milk','Honey','Bread','Juice'],answer:'Honey'},
    {q:'What do we use to see in the dark?',options:['Sunglasses','Flashlight','Umbrella','Spoon'],answer:'Flashlight'},
    {q:'What animal says "moo"?',options:['Cat','Cow','Dog','Duck'],answer:'Cow'},
    {q:'What do plants need to grow?',options:['Water','Sand','Rocks','Plastic'],answer:'Water'},
    {q:'How many eyes does a person have?',options:['1','2','3','4'],answer:'2'},
    {q:'What season comes after winter?',options:['Summer','Spring','Fall','Rainy'],answer:'Spring'},
    {q:'Which animal can fly?',options:['Bird','Fish','Cat','Cow'],answer:'Bird'},
    {q:'What do we breathe in to live?',options:['Water','Oxygen','Sand','Milk'],answer:'Oxygen'},
    {q:'What shape is the sun?',options:['Square','Round','Triangle','Flat'],answer:'Round'},
    {q:'Which animal lives in water?',options:['Fish','Cat','Dog','Bird'],answer:'Fish'},
    {q:'What do we call frozen rain?',options:['Hail','Fog','Steam','Dew'],answer:'Hail'},
    {q:'Which of these is a fruit?',options:['Carrot','Potato','Apple','Onion'],answer:'Apple'},
    {q:'What do caterpillars turn into?',options:['Bees','Butterflies','Ants','Spiders'],answer:'Butterflies'},
    {q:'Which is the fastest land animal?',options:['Elephant','Cheetah','Turtle','Snail'],answer:'Cheetah'},
    {q:'What do we call a baby dog?',options:['Kitten','Puppy','Cub','Calf'],answer:'Puppy'},
    {q:'Which of these can we hear with?',options:['Nose','Ears','Eyes','Hands'],answer:'Ears'},
    {q:'What color are leaves usually?',options:['Green','Blue','Purple','Black'],answer:'Green'},
    {q:'Which animal has a long neck?',options:['Giraffe','Pig','Cat','Rabbit'],answer:'Giraffe'}
  ],
  '3-4':[
    {q:'How many legs does a spider have?',options:['6','8','10','4'],answer:'8'},
    {q:'What planet is known as the Red Planet?',options:['Venus','Mars','Jupiter','Saturn'],answer:'Mars'},
    {q:'What do we call baby frogs?',options:['Cubs','Tadpoles','Kittens','Larvae'],answer:'Tadpoles'},
    {q:'What is the largest ocean on Earth?',options:['Atlantic','Indian','Pacific','Arctic'],answer:'Pacific'},
    {q:'What gas do humans breathe out?',options:['Oxygen','Carbon Dioxide','Nitrogen','Helium'],answer:'Carbon Dioxide'},
    {q:'What is the closest planet to the sun?',options:['Earth','Venus','Mercury','Mars'],answer:'Mercury'},
    {q:'What do you call water that has frozen?',options:['Steam','Ice','Fog','Rain'],answer:'Ice'},
    {q:'Which part of the plant absorbs water?',options:['Leaf','Flower','Root','Stem'],answer:'Root'},
    {q:'What is the study of animals called?',options:['Botany','Zoology','Geology','Astronomy'],answer:'Zoology'},
    {q:'How many continents are there?',options:['5','6','7','8'],answer:'7'},
    {q:'What do we call the natural satellite of Earth?',options:['Sun','Moon','Star','Mars'],answer:'Moon'},
    {q:'Which planet is closest to the sun after Mercury?',options:['Earth','Venus','Mars','Jupiter'],answer:'Venus'},
    {q:'What is the largest bone in the human body?',options:['Skull','Femur','Spine','Rib'],answer:'Femur'},
    {q:'Which of these animals is a reptile?',options:['Frog','Snake','Bird','Fish'],answer:'Snake'},
    {q:'What do we call water in its gas form?',options:['Ice','Steam','Snow','Liquid'],answer:'Steam'},
    {q:'What is the process of plants making their own food called?',options:['Digestion','Photosynthesis','Respiration','Circulation'],answer:'Photosynthesis'},
    {q:'What is the outer part of the Earth called?',options:['Core','Mantle','Crust','Atmosphere'],answer:'Crust'},
    {q:'Which of these helps plants stand upright?',options:['Leaf','Stem','Flower','Fruit'],answer:'Stem'},
    {q:'Which of these animals hatches from an egg?',options:['Dog','Chicken','Cat','Cow'],answer:'Chicken'},
    {q:'What is the freezing point of water in Celsius?',options:['0°C','32°C','100°C','10°C'],answer:'0°C'}
  ],
  '5-6':[
    {q:'What gas do plants breathe in?',options:['Oxygen','Carbon Dioxide','Nitrogen','Helium'],answer:'Carbon Dioxide'},
    {q:'How many bones are in the human body?',options:['206','150','300','120'],answer:'206'},
    {q:'What is the powerhouse of the cell?',options:['Nucleus','Mitochondria','Ribosome','Cytoplasm'],answer:'Mitochondria'},
    {q:'What force pulls objects toward Earth?',options:['Magnetism','Friction','Gravity','Tension'],answer:'Gravity'},
    {q:'What is the boiling point of water in Celsius?',options:['90°C','100°C','80°C','120°C'],answer:'100°C'},
    {q:'What is the process of water turning to vapor called?',options:['Condensation','Evaporation','Precipitation','Freezing'],answer:'Evaporation'},
    {q:'What do we call animals that eat only plants?',options:['Carnivores','Herbivores','Omnivores','Predators'],answer:'Herbivores'},
    {q:'What is the hardest natural substance on Earth?',options:['Gold','Iron','Diamond','Silver'],answer:'Diamond'},
    {q:'Which blood cells fight infection?',options:['Red blood cells','White blood cells','Platelets','Plasma'],answer:'White blood cells'},
    {q:'What is the main gas in Earth\'s atmosphere?',options:['Oxygen','Nitrogen','Carbon Dioxide','Hydrogen'],answer:'Nitrogen'},
    {q:'What instrument measures temperature?',options:['Barometer','Thermometer','Speedometer','Altimeter'],answer:'Thermometer'},
    {q:'What is the largest organ in the human body?',options:['Heart','Liver','Skin','Brain'],answer:'Skin'},
    {q:'Which planet has rings around it?',options:['Earth','Saturn','Mercury','Mars'],answer:'Saturn'},
    {q:'What is the smallest unit of matter called?',options:['Cell','Atom','Molecule','Tissue'],answer:'Atom'},
    {q:'What causes day and night on Earth?',options:['Earth\'s revolution','Earth\'s rotation','The moon','The sun moving'],answer:'Earth\'s rotation'},
    {q:'What is the chemical formula for table salt?',options:['NaCl','H2O','CO2','KCl'],answer:'NaCl'},
    {q:'What do we call animals that are active at night?',options:['Diurnal','Nocturnal','Hibernal','Migratory'],answer:'Nocturnal'},
    {q:'What is the main component of natural gas?',options:['Methane','Oxygen','Nitrogen','Carbon Dioxide'],answer:'Methane'},
    {q:'What causes the tides in the ocean?',options:['Wind','Moon\'s gravity','Sun\'s heat','Earthquakes'],answer:'Moon\'s gravity'},
    {q:'Which of these is an example of a food chain producer?',options:['Lion','Grass','Deer','Snake'],answer:'Grass'}
  ],
  '7-8':[
    {q:'What is the chemical symbol for water?',options:['H2O','O2','CO2','NaCl'],answer:'H2O'},
    {q:'What organ pumps blood through the body?',options:['Lungs','Liver','Heart','Kidney'],answer:'Heart'},
    {q:'What is the process by which plants make food?',options:['Respiration','Photosynthesis','Digestion','Osmosis'],answer:'Photosynthesis'},
    {q:'What particle carries a negative charge?',options:['Proton','Neutron','Electron','Photon'],answer:'Electron'},
    {q:'What is the chemical symbol for Sodium?',options:['S','So','Na','Sd'],answer:'Na'},
    {q:'What is the unit used to measure force?',options:['Watt','Newton','Joule','Pascal'],answer:'Newton'},
    {q:'What type of rock forms from cooled lava?',options:['Sedimentary','Metamorphic','Igneous','Fossil'],answer:'Igneous'},
    {q:'What is the pH of pure water?',options:['5','7','9','12'],answer:'7'},
    {q:'What organ filters waste from blood?',options:['Liver','Kidney','Lungs','Stomach'],answer:'Kidney'},
    {q:'What is the speed of light approximately?',options:['300,000 km/s','150,000 km/s','3,000 km/s','30,000 km/s'],answer:'300,000 km/s'},
    {q:'What is the basic unit of heredity called?',options:['Cell','Gene','Atom','Molecule'],answer:'Gene'},
    {q:'What is the process of cell division for growth called?',options:['Meiosis','Mitosis','Photosynthesis','Osmosis'],answer:'Mitosis'},
    {q:'Which law states force equals mass times acceleration?',options:['Newton\'s First Law','Newton\'s Second Law','Newton\'s Third Law','Law of Gravity'],answer:'Newton\'s Second Law'},
    {q:'What is the chemical symbol for Gold?',options:['Gd','Go','Au','Ag'],answer:'Au'},
    {q:'What type of energy is stored in food?',options:['Kinetic','Chemical','Thermal','Sound'],answer:'Chemical'},
    {q:'Which organ produces insulin in the body?',options:['Liver','Pancreas','Kidney','Stomach'],answer:'Pancreas'},
    {q:'What is the unit of electrical resistance?',options:['Volt','Ampere','Ohm','Watt'],answer:'Ohm'},
    {q:'What do we call substances that speed up chemical reactions?',options:['Reactants','Catalysts','Products','Solvents'],answer:'Catalysts'},
    {q:'What is the process of splitting light into colors called?',options:['Reflection','Refraction','Dispersion','Diffraction'],answer:'Dispersion'},
    {q:'Which of these is an example of a chemical change?',options:['Melting ice','Burning paper','Cutting wood','Boiling water'],answer:'Burning paper'}
  ],
  '9-10':[
    {q:'What is Newton\'s First Law about?',options:['Inertia','Gravity','Energy','Momentum'],answer:'Inertia'},
    {q:'What is the atomic number of Carbon?',options:['6','8','12','14'],answer:'6'},
    {q:'What type of bond shares electrons between atoms?',options:['Ionic','Covalent','Metallic','Hydrogen'],answer:'Covalent'},
    {q:'What is the powerhouse organelle responsible for producing ATP?',options:['Golgi Body','Mitochondria','Ribosome','Vacuole'],answer:'Mitochondria'},
    {q:'What is the SI unit of electric current?',options:['Volt','Ampere','Ohm','Watt'],answer:'Ampere'},
    {q:'What is Avogadro\'s number approximately?',options:['6.022×10²³','3.14×10²³','9.8×10²³','1.6×10²³'],answer:'6.022×10²³'},
    {q:'What is Ohm\'s Law formula?',options:['V=IR','F=ma','E=mc²','P=IV'],answer:'V=IR'},
    {q:'What type of lens is used to correct short-sightedness?',options:['Convex','Concave','Bifocal','Cylindrical'],answer:'Concave'},
    {q:'What is Newton\'s Third Law about?',options:['Inertia','Action-reaction pairs','Gravity','Momentum'],answer:'Action-reaction pairs'},
    {q:'What is the process of DNA copying itself called?',options:['Transcription','Translation','Replication','Mutation'],answer:'Replication'},
    {q:'What is the SI unit of energy?',options:['Watt','Joule','Newton','Pascal'],answer:'Joule'},
    {q:'What type of chemical bond forms when electrons are transferred?',options:['Covalent','Ionic','Metallic','Hydrogen'],answer:'Ionic'},
    {q:'What is Boyle\'s Law about?',options:['Pressure and volume','Temperature and volume','Pressure and temperature','Mass and volume'],answer:'Pressure and volume'},
    {q:'What is the formula for kinetic energy?',options:['mgh','½mv²','mc²','Fd'],answer:'½mv²'},
    {q:'What is the term for the bending of light as it passes between media?',options:['Reflection','Refraction','Diffraction','Dispersion'],answer:'Refraction'},
    {q:'What organelle is responsible for photosynthesis in plants?',options:['Mitochondria','Chloroplast','Nucleus','Ribosome'],answer:'Chloroplast'},
    {q:'What is the chemical name for baking soda?',options:['Sodium chloride','Sodium bicarbonate','Sodium hydroxide','Sodium carbonate'],answer:'Sodium bicarbonate'},
    {q:'What is the term for two atoms of the same element with different neutrons?',options:['Isomers','Isotopes','Ions','Allotropes'],answer:'Isotopes'},
    {q:'What is the term for a chemical reaction that releases heat?',options:['Endothermic','Exothermic','Isothermic','Adiabatic'],answer:'Exothermic'},
    {q:'What is the term for the minimum energy needed to start a reaction?',options:['Bond energy','Activation energy','Kinetic energy','Potential energy'],answer:'Activation energy'}
  ]
};
let sciScore=0, sciStreak=0;
function initScience(grade){ sciScore=0; sciStreak=0; nextSciQuestion(grade); }
function nextSciQuestion(grade){
  const band=bandFor(grade);
  document.getElementById('sci-grade-tag').textContent=bandLabel(band);
  const pick=pickNoRepeat('sci-'+band, sciBanks[band]);
  document.getElementById('sci-question').textContent=pick.q;
  const speakBtn=document.getElementById('sci-speak-btn');
  if(speakBtn) speakBtn.style.display=(band==='1-2'?'inline-block':'none');
  const container=document.getElementById('sci-answers'); container.innerHTML='';
  [...pick.options].sort(()=>Math.random()-0.5).forEach(opt=>{
    const btn=document.createElement('button'); btn.textContent=opt;
    btn.onclick=()=>{
      if(opt===pick.answer){ btn.classList.add('correct'); sciScore+=10; sciStreak+=1; document.getElementById('sci-feedback').textContent='✅ Correct!'; }
      else { btn.classList.add('wrong'); sciStreak=0; document.getElementById('sci-feedback').textContent=`❌ Answer was ${pick.answer}`; }
      document.getElementById('sci-score').textContent=sciScore; document.getElementById('sci-streak').textContent=sciStreak;
      setTimeout(()=>nextSciQuestion(grade), 900);
    };
    container.appendChild(btn);
  });
  document.getElementById('sci-feedback').textContent='';
}

// ─── Olympiad ────────────────────────────────────────────────────────
const olyBanks={
  '1-2':[
    {q:'Which is bigger: 5 or 8?',options:['5','8','Same','Cannot say'],answer:'8'},
    {q:'What comes next: 1, 2, 3, ?',options:['4','5','2','1'],answer:'4'},
    {q:'Which shape has 3 sides?',options:['Square','Circle','Triangle','Rectangle'],answer:'Triangle'},
    {q:'Which is the odd one out: Apple, Banana, Carrot, Mango?',options:['Apple','Banana','Carrot','Mango'],answer:'Carrot'},
    {q:'Which is smaller: 3 or 7?',options:['3','7','Same','Cannot say'],answer:'3'},
    {q:'What comes before 10?',options:['8','9','11','7'],answer:'9'},
    {q:'Which shape has 4 equal sides?',options:['Triangle','Circle','Square','Oval'],answer:'Square'},
    {q:'Which is the odd one out: Red, Blue, Happy, Green?',options:['Red','Blue','Happy','Green'],answer:'Happy'},
    {q:'What comes next: 2, 4, 6, ?',options:['7','8','9','10'],answer:'8'},
    {q:'How many fingers are on one hand?',options:['4','5','6','10'],answer:'5'},
    {q:'Which comes first in the alphabet: B or D?',options:['B','D','Same','Neither'],answer:'B'},
    {q:'If you have 2 apples and get 2 more, how many do you have?',options:['2','3','4','5'],answer:'4'},
    {q:'Which shape has no corners?',options:['Square','Triangle','Circle','Rectangle'],answer:'Circle'},
    {q:'What comes after Tuesday?',options:['Monday','Wednesday','Thursday','Sunday'],answer:'Wednesday'},
    {q:'If you have 6 toys and give away 2, how many do you have?',options:['3','4','5','6'],answer:'4'}
  ],
  '3-4':[
    {q:'If today is Monday, what day is it after 3 days?',options:['Wednesday','Thursday','Friday','Tuesday'],answer:'Thursday'},
    {q:'Find the missing number: 2, 4, 6, ?, 10',options:['7','8','9','12'],answer:'8'},
    {q:'A dozen means how many?',options:['10','12','15','20'],answer:'12'},
    {q:'Which number is a multiple of both 2 and 3?',options:['4','6','9','10'],answer:'6'},
    {q:'What is half of 24?',options:['10','12','14','8'],answer:'12'},
    {q:'Which comes next: A, C, E, ?',options:['F','G','H','D'],answer:'G'},
    {q:'How many sides does a hexagon have?',options:['5','6','7','8'],answer:'6'},
    {q:'If 3 pens cost ₹15, what does 1 pen cost?',options:['₹3','₹4','₹5','₹6'],answer:'₹5'},
    {q:'What is 7 x 8?',options:['54','56','58','64'],answer:'56'},
    {q:'A week has 7 days. How many days are in 2 weeks?',options:['12','14','16','21'],answer:'14'},
    {q:'What is 144 divided by 12?',options:['10','11','12','13'],answer:'12'},
    {q:'A class has 30 students, 18 are girls. How many are boys?',options:['10','12','14','16'],answer:'12'},
    {q:'What is half of 100?',options:['25','40','50','60'],answer:'50'},
    {q:'If a rope is 24m and cut into 4 equal pieces, how long is each piece?',options:['4m','6m','8m','12m'],answer:'6m'},
    {q:'What is 9 x 9?',options:['72','81','90','99'],answer:'81'}
  ],
  '5-6':[
    {q:'If a train travels 60 km in 1 hour, how far in 3 hours?',options:['120 km','150 km','180 km','200 km'],answer:'180 km'},
    {q:'What is the next number: 1, 4, 9, 16, ?',options:['20','24','25','36'],answer:'25'},
    {q:'A shopkeeper had 45 apples and sold 28. How many are left?',options:['17','18','15','27'],answer:'17'},
    {q:'Which of these is a prime number?',options:['21','27','29','33'],answer:'29'},
    {q:'What is the LCM of 4 and 6?',options:['8','10','12','24'],answer:'12'},
    {q:'What comes next: 2, 6, 18, 54, ?',options:['108','162','144','216'],answer:'162'},
    {q:'If a dozen eggs cost ₹60, what do 2 dozen cost?',options:['₹100','₹110','₹120','₹90'],answer:'₹120'},
    {q:'What is the perimeter of a square with side 9cm?',options:['18cm','27cm','36cm','81cm'],answer:'36cm'},
    {q:'What is the LCM of 8 and 12?',options:['16','24','32','48'],answer:'24'},
    {q:'A number is tripled to get 27. What is the number?',options:['6','8','9','12'],answer:'9'},
    {q:'What is the average of 10, 20, and 30?',options:['15','20','25','30'],answer:'20'},
    {q:'What is the next number: 3, 9, 27, ?',options:['54','63','81','90'],answer:'81'},
    {q:'What is 3/4 expressed as a percentage?',options:['70%','75%','80%','85%'],answer:'75%'},
    {q:'A cyclist covers 45 km in 3 hours. What is the speed?',options:['12 km/h','15 km/h','18 km/h','20 km/h'],answer:'15 km/h'},
    {q:'What is the missing number: 100, 81, 64, ?, 36',options:['49','56','52','48'],answer:'49'}
  ],
  '7-8':[
    {q:'If x + 5 = 12, what is 2x?',options:['12','14','24','10'],answer:'14'},
    {q:'What is the next term: 3, 6, 12, 24, ?',options:['30','36','48','40'],answer:'48'},
    {q:'A rectangle has length 8 and width 5. What is its area?',options:['13','26','40','45'],answer:'40'},
    {q:'Which of these fractions is the largest?',options:['1/2','2/3','3/4','5/8'],answer:'3/4'},
    {q:'If 5 workers finish a job in 12 days, how long will 10 workers take?',options:['4 days','6 days','8 days','10 days'],answer:'6 days'},
    {q:'What is the value of √144?',options:['11','12','13','14'],answer:'12'},
    {q:'What is 15% of 200?',options:['20','25','30','35'],answer:'30'},
    {q:'What is the cube of 4?',options:['12','16','48','64'],answer:'64'},
    {q:'What is the value of x if 2x - 4 = 10?',options:['5','6','7','8'],answer:'7'},
    {q:'A circle has a radius of 7cm. What is its circumference (π=22/7)?',options:['22cm','44cm','66cm','88cm'],answer:'44cm'},
    {q:'A number increased by 20% becomes 60. What was the original number?',options:['45','48','50','55'],answer:'50'},
    {q:'What is the next term: 1, 1, 2, 3, 5, 8, ?',options:['10','11','13','15'],answer:'13'},
    {q:'What is 60% of 150?',options:['80','85','90','95'],answer:'90'},
    {q:'A sum of ₹500 earns ₹50 simple interest in 1 year. What is the rate?',options:['8%','9%','10%','12%'],answer:'10%'},
    {q:'What is the simplified form of 24/36?',options:['1/2','2/3','3/4','5/6'],answer:'2/3'}
  ],
  '9-10':[
    {q:'If a train covers 300 km in 4 hours, what is its average speed?',options:['65 km/h','70 km/h','75 km/h','80 km/h'],answer:'75 km/h'},
    {q:'What is the value of x if 3x - 7 = 20?',options:['7','8','9','10'],answer:'9'},
    {q:'What is the sum of interior angles of a hexagon?',options:['540°','720°','900°','360°'],answer:'720°'},
    {q:'Simplify: 2^5 ÷ 2^2',options:['4','8','16','2'],answer:'8'},
    {q:'What is the probability of rolling a 4 on a fair die?',options:['1/2','1/4','1/6','1/3'],answer:'1/6'},
    {q:'If f(x) = 2x + 3, what is f(5)?',options:['11','12','13','14'],answer:'13'},
    {q:'What is the value of x if x² = 81?',options:['7 or -7','8 or -8','9 or -9','10 or -10'],answer:'9 or -9'},
    {q:'What is the sum of the first 10 natural numbers?',options:['45','50','55','60'],answer:'55'},
    {q:'If two angles of a triangle are 45° and 45°, what is the third?',options:['45°','60°','90°','100°'],answer:'90°'},
    {q:'What is the value of 10 choose 2 (10C2)?',options:['20','35','45','90'],answer:'45'},
    {q:'If the roots of x² - 5x + 6 = 0 are added, what is the sum?',options:['3','4','5','6'],answer:'5'},
    {q:'What is the volume of a cube with side 4cm?',options:['16 cu cm','48 cu cm','64 cu cm','32 cu cm'],answer:'64 cu cm'},
    {q:'What is the value of cos(60°)?',options:['0','0.5','1','√3/2'],answer:'0.5'},
    {q:'What is the slope of the line y = 3x + 5?',options:['3','5','8','1/3'],answer:'3'},
    {q:'What is the compound interest on ₹1000 at 10% for 2 years?',options:['₹200','₹205','₹210','₹215'],answer:'₹210'}
  ]
};
let olyScore=0, olyStreak=0;
function initOlympiad(grade){ olyScore=0; olyStreak=0; nextOlyQuestion(grade); }
function nextOlyQuestion(grade){
  const band=bandFor(grade);
  document.getElementById('oly-grade-tag').textContent=bandLabel(band);
  const pick=pickNoRepeat('oly-'+band, olyBanks[band]);
  document.getElementById('oly-question').textContent=pick.q;
  const container=document.getElementById('oly-answers'); container.innerHTML='';
  [...pick.options].sort(()=>Math.random()-0.5).forEach(opt=>{
    const btn=document.createElement('button'); btn.textContent=opt;
    btn.onclick=()=>{
      if(opt===pick.answer){ btn.classList.add('correct'); olyScore+=10; olyStreak+=1; document.getElementById('oly-feedback').textContent='✅ Correct!'; }
      else { btn.classList.add('wrong'); olyStreak=0; document.getElementById('oly-feedback').textContent=`❌ Answer was ${pick.answer}`; }
      document.getElementById('oly-score').textContent=olyScore; document.getElementById('oly-streak').textContent=olyStreak;
      setTimeout(()=>nextOlyQuestion(grade), 900);
    };
    container.appendChild(btn);
  });
  document.getElementById('oly-feedback').textContent='';
}

// ─── Spelling Bee ────────────────────────────────────────────────────
const beeBanks={
  '1-2':['CAT','DOG','SUN','HAT','RUN','BED','CUP','PEN','BALL','FISH','BOOK','RAIN','STAR','MOON','TREE','FROG','MILK','CAKE','BIRD','FIRE'],
  '3-4':['ELEPHANT','RAINBOW','PLANET','LIBRARY','BICYCLE','VOLCANO','GARDEN','FOREST','KITCHEN','WINDOW','PENCIL','MOUNTAIN','CALENDAR','FESTIVAL','BASKET','BLANKET','CANDLE','COMPASS','DIAMOND','DRAGON'],
  '5-6':['DINOSAUR','TELESCOPE','ADVENTURE','CONTINENT','MICROSCOPE','ATMOSPHERE','KNOWLEDGE','JOURNEY','TREASURE','GLACIER','CURIOUS','FRAGILE','ABSENCE','AMBITION','ANCIENT','AQUARIUM','BALANCE','CAPACITY','CENTURY','CHAMPION'],
  '7-8':['PHOTOSYNTHESIS','DEMOCRACY','ECOSYSTEM','HYPOTHESIS','REVOLUTION','METAPHOR','CONSCIENCE','RHYTHM','INDEPENDENCE','ARCHITECTURE','TEMPERATURE','GEOGRAPHY','NECESSARY','VACUUM','ABUNDANT','ACCELERATE','ACCOMPANY','ADEQUATE','ADVOCATE','AMBIGUOUS'],
  '9-10':['ENTREPRENEUR','PHILOSOPHY','ALGORITHM','RENAISSANCE','EQUILIBRIUM','ARTICULATE','BUREAUCRACY','SILHOUETTE','PHENOMENON','INFRASTRUCTURE','PERSEVERANCE','SUSTAINABLE','CONSCIENTIOUS','ONOMATOPOEIA','ABERRATION','AMBIVALENT','ANACHRONISM','ANTAGONIST','AUSPICIOUS','BELLIGERENT']
};
let beeScore=0, beeStreak=0, currentBeeWord='';
function initBee(grade){ beeScore=0; beeStreak=0; nextBeeWord(grade); }
function nextBeeWord(grade){
  const band=bandFor(grade);
  document.getElementById('bee-grade-tag').textContent=bandLabel(band);
  currentBeeWord=pickNoRepeat('bee-'+band, beeBanks[band]);
  document.getElementById('bee-input').value='';
  document.getElementById('bee-feedback').textContent='';
  document.getElementById('bee-status').textContent='Tap "Hear the word" to begin';
}
function checkBeeSpelling(){
  const val=document.getElementById('bee-input').value.trim().toUpperCase();
  if(val===currentBeeWord){ beeScore+=10; beeStreak+=1; document.getElementById('bee-feedback').textContent='✅ Correct!'; }
  else { beeStreak=0; document.getElementById('bee-feedback').textContent=`❌ It was ${currentBeeWord}`; }
  document.getElementById('bee-score').textContent=beeScore; document.getElementById('bee-streak').textContent=beeStreak;
  setTimeout(()=>nextBeeWord(gradeFromURL()), 1400);
}

// ─── Mental Maths ────────────────────────────────────────────────────
function genMentalScenario(band){
  let a,b,answer,text;
  if(band==='1-2'){
    const type=Math.floor(Math.random()*3);
    if(type===0){ a=Math.floor(Math.random()*8)+2; b=Math.floor(Math.random()*5)+1; answer=a+b; text=`You have ${a} marbles. Your friend gives you ${b} more. How many marbles now?`; }
    else if(type===1){ a=Math.floor(Math.random()*10)+5; b=Math.floor(Math.random()*a); answer=a-b; text=`There are ${a} birds on a tree. ${b} fly away. How many birds are left?`; }
    else { a=Math.floor(Math.random()*5)+2; b=Math.floor(Math.random()*4)+1; answer=a*b; text=`You have ${a} boxes with ${b} apples in each. How many apples in total?`; }
  } else if(band==='3-4'){
    const type=Math.floor(Math.random()*3);
    if(type===0){ a=Math.floor(Math.random()*6)+2; b=Math.floor(Math.random()*20)+10; answer=a*b; text=`A shop sells pencils in packs of ${b}. If you buy ${a} packs, how many pencils in total?`; }
    else if(type===1){ a=Math.floor(Math.random()*50)+20; b=Math.floor(Math.random()*a/2); answer=a-b; text=`You had ₹${a} pocket money and spent ₹${b} on a toy. How much money is left?`; }
    else { b=Math.floor(Math.random()*6)+2; answer=Math.floor(Math.random()*10)+2; a=b*answer; text=`${a} chocolates are shared equally among ${b} kids. How many chocolates does each kid get?`; }
  } else if(band==='5-6'){
    const type=Math.floor(Math.random()*3);
    if(type===0){ a=Math.floor(Math.random()*8)+2; b=Math.floor(Math.random()*40)+20; answer=a*b; text=`A bus travels at ${b} km/h. How far does it go in ${a} hours?`; }
    else if(type===1){ a=Math.floor(Math.random()*10)*10+50; b=[10,20,25,50][Math.floor(Math.random()*4)]; answer=Math.round(a*b/100); text=`A book costs ₹${a}. It is on sale for ${b}% off. How much do you save?`; }
    else { a=Math.floor(Math.random()*30)+10; b=Math.floor(Math.random()*30)+10; answer=a+b; text=`A recipe needs ${a}g of flour and ${b}g of sugar. What is the total weight?`; }
  } else if(band==='7-8'){
    const type=Math.floor(Math.random()*3);
    if(type===0){ a=Math.floor(Math.random()*5)+2; b=Math.floor(Math.random()*100)+50; answer=Math.round(b/a); text=`${b} students are split evenly into ${a} classrooms. About how many students per classroom?`; }
    else if(type===1){ a=Math.floor(Math.random()*10)+5; b=Math.floor(Math.random()*15)+5; answer=a*b; text=`A rectangular garden is ${a}m long and ${b}m wide. What is its area in square metres?`; }
    else { a=Math.floor(Math.random()*20)*5+50; b=[10,15,20][Math.floor(Math.random()*3)]; answer=Math.round(a*(1+b/100)); text=`A phone costs ₹${a}. Its price increases by ${b}%. What is the new price?`; }
  } else {
    const type=Math.floor(Math.random()*3);
    if(type===0){ a=Math.floor(Math.random()*5)+2; b=Math.floor(Math.random()*200)+100; answer=Math.round(b*(a/100)); text=`A ₹${b} item has ${a}% GST added. How much is the GST amount (rounded)?`; }
    else if(type===1){ a=Math.floor(Math.random()*40)+20; b=Math.floor(Math.random()*5)+2; answer=Math.round(a/b*10)/10; text=`A car covers ${a} km using ${b} litres of fuel. What is its mileage (km per litre)?`; }
    else { a=Math.floor(Math.random()*8)+2; b=Math.floor(Math.random()*10)+5; answer=a*b; text=`A worker earns ₹${b*10} per hour and works ${a} hours. What is the total pay (in tens of rupees)?`; }
  }
  return {text, answer};
}
let mmScore=0, mmStreak=0, mmAnswer=0;
function initMentalMath(grade){ mmScore=0; mmStreak=0; nextMentalMathQuestion(grade); }
function nextMentalMathQuestion(grade){
  const band=bandFor(grade);
  document.getElementById('mm-grade-tag').textContent=bandLabel(band);
  const q=genMentalScenario(band); mmAnswer=q.answer;
  document.getElementById('mm-question').textContent=q.text;
  document.getElementById('mm-input').value='';
  document.getElementById('mm-feedback').textContent='';
}
function checkMentalMath(){
  const val=parseFloat(document.getElementById('mm-input').value);
  if(val===mmAnswer){ mmScore+=10; mmStreak+=1; document.getElementById('mm-feedback').textContent='✅ Correct!'; }
  else { mmStreak=0; document.getElementById('mm-feedback').textContent=`❌ Answer was ${mmAnswer}`; }
  document.getElementById('mm-score').textContent=mmScore; document.getElementById('mm-streak').textContent=mmStreak;
  setTimeout(()=>nextMentalMathQuestion(gradeFromURL()), 1100);
}
