/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint @stylistic/newline-per-chained-call: ["error", { "ignoreChainWithDepth": 1 }] */
/* eslint @stylistic/max-len: ["error", { "code": 400 }] */
/* eslint @stylistic/function-call-argument-newline: ["error", "always"] */
/* eslint @stylistic/function-paren-newline: ["error", { "minItems": 4 }] */
/* eslint @stylistic/padding-line-between-statements: [
    "error",
    { blankLine: "always", prev: "*", next: "const" }
] */

import { computedMission, createMissions, Mission } from './missions';

// Main mission chain
// add a dummy root mission to anchor phase 1 side-missions
const rootMission = new Mission('Root - Entrance',
  [],
  { type: 'dummy' });

const m = (name: string) => new Mission(name,
  [],
  { type: 'main' });

const s = (name: string, offset?: number) => new Mission(name,
  [],
  { type: 'side', offset });

// Phase 1
const [, phase1FirstMission, phase1LastMission] = createMissions(
  'main',
  'Phase 1 - Main Objective: Warm-Up',
  m('Into the Flames')
    .objectives('In {nh}, extract with _5 items/gear worth >= 12,500 in total_.'),
  m('Ignite the Flame')
    .objectives('In {nh}, use _any assault rifle_ to kill _5 enemy soldiers_.'),
  m('Flame of Legacy')
    .objectives('In {nh}, extract _1 time (earnings >= 350,000)_.'),
  m('Stealth Outlook')
    .objectives('In {br}, go to the specified location _at the high ground of Ahsarah Camp_ and investigate.',
      'In {br}, go to the first specified location _in front of the outer gate of New Tower of Babel_ and investigate.',
      'In {br}, go to the second specified location _in front of the outer gate of New Tower of Babel_ and investigate.'),
  m('Fighting Spirit')
    .objectives('In {nh}, use any _assault rifle_ to kill _1 enemy operator_.',
      'In {nh}, use any _submachine gun_ to kill _1 enemy operator_.',
      'In {nh}, extract with a total of _6 operator ID tags_.'),

  m('Basic Work')
    .objective('In {zd}, successfully _extract 2 times (earnings >= 500,000)_.'),
  m('Reach for the Sky')
    .objectives('In {space}, complete _3 tasks_.',
      'In {space}, kill _6 {special}_.'),
);

phase1FirstMission.follows(rootMission);
phase1LastMission.setStars(10);

const [, phase1_1_start, phase1_1_end] = createMissions(
  'side',
  'Phase 1 - Supply Deployment Operation',
  m('Deep Customization - 1')
    .objectives('In {nh}, use _AKS-74 Assault Rifle_ to kill _5 enemy soldiers_.'),
  m('Deep Customization - 2')
    .objectives('In {nh}, use _CAR-15 Assault Rifle_ to kill _5 {special}_.'),
  m('Deep Customization - 3')
    .objectives('In {nh}, while equipped with {purple} _HMP Special Ops Vest_, use _any assault rifle/submachine gun_ to kill _2 enemy operators_.'),
  m('Deep Customization - 4')
    .objectives('In {nh}, while equipped with {green} _HT Tatical Vest_, use _any assault rifle/submachine gun/shotgun_ to kill _2 enemy operators_.'),
  m('Deep Customization - 5')
    .objectives('In {nh}, kill _3 enemy operators_.')
    .withEntryValue('400,000'),
);
phase1_1_start.follows(rootMission);
phase1_1_end.setStars(3);

// Side missions from reference image: 'Reconnaissance and Supply Lines'
const [, phase1_recon, phase1_recon_end] = createMissions(
  'side',
  'Phase 1 - Reconnaissance and Supply Lines',
  m('Clever Tactics')
    .objectives('Submit {gold} _Gold Pen_ x1',
      'Submit {gold} _Military Network Module_ x1',
      'Submit {blue} _Memory Card_ x5'),
  m('Change of Position')
    .objectives('In {zd}, go to the specified location _inside the AC East Wing secret room_ and place the mission item {gold} _Modified Gold Pen_.',
      'In {zd}, go to the specified location _inside the Barracks main building 2F_ and place the mission item {gold} _Modified Gold Pen_.',
      'In {zd}, go to the specified location _inside the Visitor Center exterior exhibition hall_ and place the mission item {gold} _Modified Gold Pen_.')
    .inASingleMatch(),
  m('Pick the Fruit')
    .objectives(
      'In {zd}, go to the specified location in _the Major Substation main building_ and obtain the mission item {purple} _Haavk Movement Observation Record_.',
      'In {zd}, go to the specified location on _the Cement Plant 2F_ and obtain the misison item {purple} _Haavk Information ID Key_.',
      'In {zd}, extract with the mission item {purple} _Haavk Movement Observation Record_ 1 time.',
      'In {zd}, extract with the mission item {purple} _Haavk Information ID Key_ 1 time.',
    )
    .inASingleMatch(),
  m('Medical Aid')
    .objectives('In {br}, go to the specified location _inside Brakkesh Camp_ and place the mission item {purple} _Encrypted Router_.',
      'In {br}, go to the specified location _inside Brakkesh Camp_ and place the mission item {blue} _LCD Screen_.',
      'In {br}, go to the specified location _inside Brakkesh Camp_ and place the mission item {blue} _Solar Panel_.')
    .inASingleMatch(),
  m('Tourist: Masquerade Ball')
    .objectives('In {nh}, extract 1 time.')
    .tourist(),
);
phase1_recon.follows(rootMission);
phase1_recon_end.setStars(3);

// Side missions from reference image: 'Escapist\'s Trick: Basic'
const [, phase1_escapist, phase1_escapist_end] = createMissions(
  'side',
  'Phase 1 - Escapist\'s Trick: Basic',
  m('Strategic Advance - 1')
    .objectives('In {zd}, successfully extract 1 time from the _Industrial Elevator / River Bank Paid Extraction_.'),
  m('Strategic Advance - 2')
    .objectives('In {br}, successfully extract 1 time from _Hammam Powered Extraction Point/Outside the New Tower of Babel Powered Extraction Point_.'),
  m('Strategic Advance - 3')
    .objectives('In {zd}, successfully extract 2 times _(earnings >= 500,000)_.'),
  m('Strategic Advance - 4')
    .objectives('In {space}, successfully extract 1 time _(earnings >= 500,000)_.'),
  m('Strategic Advance - 5')
    .objectives('In {nh}, extract 1 time _(earnings >= 750,000)_.',
      'In {nh}, extract with a total of 3 {purple} Purple or better Craftwork collectibles')
    .inASingleMatch(),
);
phase1_escapist.follows(rootMission);
phase1_escapist_end.setStars(2);

// Side missions from reference image: "Logistics Support"
const [, phase1_logistics, phase1_logistics_end] = createMissions(
  'side',
  'Phase 1 - Logistics Support',
  m('Strong Assurance: Attachment')
    .objectives('Produce {purple} _Prism Universal 2x Optic_ 1 time at the Black Site.'),
  m('Strong Assurance: Protection')
    .objectives('Produce {gold} _FS Composite Vest_ 1 time at the Black Site.',
      'Produce {gold} _Precision Vest Repair Kit_ 1 time at the Black Site.'),
  m('Strong Assurance: Medical')
    .objectives('Produce {gold} _Field Med Crate_ 1 time at the Black Site.',
      'Produce {gold} _Black Hawk Field Chest Rig_ 1 time at the Black Site.'),
  m('Strong Assurance: Firepower')
    .objectives('Produce {gold} _7.62x54R BT_ 1 tiume at the Black Site.',
      'Produce {gold} _6.8x51mm Hybrid_ 1 time at the Black Site.'),
  m('Strong Assurance: Bedrock')
    .objectives('Produce {red} _Premium Vest Repair Kit_ 1 time at the Black Site.'),
);
phase1_logistics.follows(rootMission);
phase1_logistics_end.setStars(2);

const phase2StartGate = computedMission('Phase 2 Start Gate',
  [phase1LastMission, phase1_1_end, phase1_recon_end, phase1_escapist_end, phase1_logistics_end],
  (self, deps) => deps.reduce((acc, m) => acc + (m.completed ? m.stars : 0),
    0) >= self.stars)
  .setStars(16);
phase2StartGate.follows(phase1LastMission);

// -----------------------
// Phase 2
// -----------------------
// Main mission chain for Phase 2 (follows Phase 1 final mission)
const [p2main, phase2FirstMission, phase2LastMission] = createMissions(
  'main',
  'Phase 2 - Main Objective: Lifting the Veil',
  m('Clearance Operation - 1')
    .objectives('In {space}, go _within the shielded area of the Central Zone_ and investigate.',
      'In {space}, {goto} in _the Control Room of the Central Command Zone_ and obtain the mission item {purple} _Haavk Information ID Key_.',
      'In {space}, extract with the mission item {purple} _Haavk Information ID Key_.')
    .inASingleMatch(),
  m('Clearance Operation - 2')
    .objectives('In {nh}, kill _3 enemy operators_.'),
  m('Clearance Operation - 3')
    .objectives('In {br}, {goto} near _the pyramid sculpture in front of the main entrance of the New Tower of Babel_ and investigate.',
      'In {br}, go to _the water storage facility at the outskirts of New Tower of Babel_ and obtain the mission item {purple} _Haavk Shielding Device Controller_.',
      'In {br}, extract with the mission item {purple} _Haavk Shielding Device Controller_.')
    .inASingleMatch(),
  m('Clearance Operation: Reverse Engineering')
    .objectives(
      'Submit {red} _Positioning Receiver_ x1',
      'Submit {gold} _Military Network Module_ x1',
      'Submit {gold} _Programmable Processor_ x1',
      'Submit {purple} _ECM Jammer_ x5',
    ),
  m('Skyfall Aegis')
    .objectives('In {space}, {goto} in _the Server Room on L4 of the Bouyancy Lab in the Central Zone_ and investigate.',
      'In {space}, {goto} in _the CEO Office outer suite in the Central Zone_ and place the mission item {gold} _Anti-Jamming Device_.',
      'In {space}, {goto} in _the Server Room on L2 of the Black Chamber in the Central Zone_ and investigate.')
    .inASingleMatch()
    .withEquippedItemsOnEntry('{gold} _Anti-Jamming Device_'),
  m('Bone-Deep Scars')
    .objectives('In {br}, go to the specified location _in the Interrogation Monitoring Room of New Tower of Babel_ and investigate.',
      'In {br}, go to the specified location _in the Machine Room of New Tower of Babel_ and place the mission item {gold} _Anti-Jamming Device_.',
      'in {br}, go to the specified location _in the Medical Room of New Tower of Babel_ and investigate.')
    .inASingleMatch()
    .withEquippedItemsOnEntry('{gold} _Anti-Jamming Device_'),
  m('Armed Escort')
    .objectives('In {nh}, kill _3 enemy operators_.')
    .inASingleMatch(),
  m('Approaching Storm')
    .objectives(
      'In {zd}, go to the specified location _in the Dam vault_ and obtain the mission item {purple} _Raven\'s Invitation Letter_.',
      'In {zd}, go to the specified location _in the Dam vault_ and obtain the mission item {purple} _Weathered Raven Pendant_.',
      'In {zd}, extract with the mission item {purple} _Raven\'s Invitation Letter_ 1 time.',
      'In {zd}, extract with the mission item {purple} _Weathered Raven Pendant_ 1 time.',
    )
    .inASingleMatch(),
);
phase2LastMission.setStars(10);
phase2FirstMission.follows(phase2StartGate);
console.log(p2main);

// Side mission: Turmoil in Ahsarah
const [, phase2_turmoil, phase2_turmoil_last] = createMissions(
  'side',
  'Phase 2 - Turmoil in Ahsarah',
  m('Deterrence Directive')
    .objectives('In {nh}, kill any _16 Ahsarah Guard common soldiers_.',
      'In {nh}, kill any _8 {ahsarah special}_.')
    .withoutDying(),
  m('Eastward Diversion')
    .objectives('In {nh}, kill _2 enemy operators_.')
    .inASingleMatch(),
  m('Evaporation Order')
    .objectives(
      'In {nh}, kill _1 Ahsarah Shieldbearer_.',
      'In {nh}, kill _1 Ahsarah Rocketeer_.',
      'In {nh}, kill _1 Ahsarah Machine Gunner_.',
      'In {nh}, kill _1 Ahsarah Sniper_.',
      'In {nh}, kill _1 Ahsarah Flamethrower_.',
    )
    .withoutDying(),
  m('Twin Fall')
    .objectives('In {zd}, kill _Saeed_ 1 time.',
      'In {space}, kill _Desmoulins_ 1 time.'),
  m('Tourist of Ahsarah')
    .objectives('In {space}, extract 1 time.',
      'In {br}, extract 1 time.')
    .withCondition('When players enter, they must equip any Ahsarah-style ballistic vest & any Ahsarah-style helmet, and cannot equip any weapons, chest rigs, or backpacks.'),
);
phase2_turmoil_last.setStars(5);
phase2_turmoil.follows(phase2StartGate);

// Side mission: Profiling Ahsarah
const [, phase2_profiling, phase2_profiling_last] = createMissions(
  'side',
  'Phase 2 - Profiling Ahsarah',
  m('Ahsarah Guard Profile - 1')
    .objectives('In {zd}, investigate _5 different Ahsarah Guard military trucks_.'),
  m('Ahsarah Guard Profile - 2')
    .objectives('In {zd}, open _5 sewers_ for the first time.'),
  m('Ahsarah Guard Profile - 3')
    .objectives('In {zd}, investigate _10 different Ahsarah Guard flags_.'),
  m('Ahsarah Guard Profile - 4')
    .objectives(
      'In {br}, {goto} at _the reception desk of the Blue River Hotel_ and investigate.',
      'In {br}, {goto} at _the reception desk of teh Brakkesh Grand Hammam_ and investigate.',
      'In {br}, {goto} inside _Ahsarah Camp_ and investigate.',
      'In {br}, {goto} in _the front hall of Royal Museum_ and investigate.',
      'In {br}, {goto} in _Athanya Ruins sector_ and investigate.',
    )
    .inASingleMatch(),
  m('Swift Moment')
    .objectives('In {nh}, use _any assault rifle_ to kill _1 enemy operator_.',
      'In {nh}, use _any pistol_ to kill _1 enemy operator_.',
      'In {nh}, extract 1 time.')
    .inASingleMatch(),
);
phase2_profiling.follows(phase2StartGate);
phase2_profiling_last.setStars(4);

// Side mission: Edge and Steel
const [, phase2_edge, phase2_edge_last] = createMissions(
  'side',
  'Phase 2 - Edge and Steel',
  m('Search and Eliminate - 1')
    .objectives('Submit {gold} _High-Performance Engine Oil_ x1.',
      'Submit {gold} _Army Multi-Purpose Watch_ x1.'),
  m('Search and Eliminate - 2')
    .objectives('In {nh}, use firearms equipped with _any drum magazine_ to kill _2 enemy operators_ in total as _any Assault/Recon Operator_.'),
  m('Search and Eliminate - 3')
    .objectives('In {nh}, use any firearm with _Accuracy >=99_ to kill _2 enemy operators_ in total as _any Assault/Recon Operator_.'),
  m('Search and Eliminate - 4')
    .objectives('In {nh}, kill _2 enemy operators_ in total as _Nox/Tempest_.',
      'In {nh}, extract 1 time _(earnings >= 750,000) as _Luna/Hackclaw_.'),
  m('Search and Eliminate - 5')
    .objectives('In {nh}, complete _1 {flagship}_ as _any Assault/Recon Operator_.',
      'In {nh}, successfully extract 1 time as _any Assault/Recon Operator_.')
    .inASingleMatch(),
);
phase2_edge.follows(phase2StartGate);
phase2_edge_last.setStars(3);

// Side mission: Protection and Construction
const [, phase2_protection, phase2_protection_last] = createMissions(
  'side',
  'Phase 2 - Protection and Construction',
  m('Control and Secure - 1')
    .objectives('Submit {gold} _Military Network Module_ x1.',
      'Submit {gold} _Military Map Case_ x1.'),
  m('Control and Secure - 2')
    .objectives('In {nh}, equip {gold} _Mask-1 Iron Helmet_ and {gold} _Elite Vest_ to kill _2 enemy operators_ in total as _any Engineer/Support Operator_.'),
  m('Control and Secure - 3')
    .objectives('In {nh}, complete _1 Safe Supplies task_ as _any Engineer/Support Operator_.',
      'In {nh}, complete _1 Breach Specialist task_ as _any Engineer/Support Operator_.',
      'In {nh}, complete _3 HVT Elimination tasks_ as _any Engineer/Support Operator_.'),
  m('Control and Secure - 4')
    .objectives('In {nh}, extract 1 time using _Uluru/Shepherd_ _(earnings >=750,000)_.',
      'In {nh}, heal yourself for _500 HP_ in total as _Stinger/Toxik_.'),
  m('Control and Secure - 5')
    .objectives('In {nh}, complete _1 {flagship}_ as _any Engineer/Support Operator_.',
      'In {nh}, successfully extract 1 time as _any Engineer/Support Operator_.')
    .inASingleMatch(),
);
phase2_protection.follows(phase2StartGate);
phase2_protection_last.setStars(3);

// Additional Phase 2 spare side stories from attachments
const [phase2_encyclopedic_missions, phase2_encyclopedic, phase2_encyclopedic_last] = createMissions(
  'side',
  'Phase 2 - Encyclopedic Insight: Basic Collection',
  m('Broad Knowledge - 1')
    .objectives('In {nh}, extract with a total of _5_ {purple} Purple or better _Tool & Material collectibles_.'),
  m('Broad Knowledge - 2')
    .objectives('In {nh}, extract with _8 intel collectibles_ of {purple} Purple quality or better.'),
  m('Broad Knowledge - 3')
    .objectives('In {nh}, extract with a total of _5_ {purple} Purple or better _Household Item collectibles_.'),
  m('Broad Knowledge - 4')
    .objectives('In {nh}, extract with a total of _8_ {gold} Gold or better _Craftwork collectibles_.'),
  m('Broad Knowledge - 5')
    .objectives('In {nh}, extract with _2_ {purple} Purple or better _Craftwork collectibles_.',
      'In {nh}, extract with _2_ {purple} Purple or better _Tool & Material collectibles_.',
      'In {nh}, extract with _2_ {purple} Purple or better _Intel collectibles_.')
    .inASingleMatch(),
);
phase2_encyclopedic.follows(phase2StartGate);
phase2_encyclopedic_missions.forEach(m => m.setLocked(true));
phase2_encyclopedic_last.setStars(3);

const [phase2_deepenemy_missions, phase2_deepenemy, phase2_deepenemy_last] = createMissions(
  'side',
  'Phase 2 - Deep Into Enemy Lines',
  m('Chaos')
    .objectives('In {nh}, kill _20 enemy soldiers_.'),
  m('Vehicles Lost')
    .objectives('In {nh}, kill _12 {special}_.'),
  m('Lose-Lose Situation')
    .objectives('In {nh}, kill _8 {ahsarah special}_.',
      'In {nh}, kill _8 {haavk special}_.'),
  m('Losing Two Birds to One Stone')
    .objectives('In {nh}, kill _6 bosses in total (including Reis, Saeed, Desmoulins, Raven, Warden\'s escort or vehicle)_.'),
  m('No Regrets')
    .objectives('In {nh}, kill _any boss_ 1 time (including Reis, Saeed, Desmoulins, Raven, Warden)_.'),
);
phase2_deepenemy.follows(phase2StartGate);
phase2_deepenemy_missions.forEach(m => m.setLocked(true));
phase2_deepenemy_last.setStars(2);

const phase3StartGate = computedMission('Phase 3 Start Gate',
  [phase2LastMission, phase2_turmoil_last, phase2_profiling_last, phase2_edge_last, phase2_protection_last, phase2_encyclopedic_last, phase2_deepenemy_last],
  (self, deps) => deps.reduce((acc, m) => acc + (m.completed ? m.stars : 0),
    0) >= self.stars)
  .setStars(22);
phase3StartGate.follows(phase2LastMission);

// -----------------------
// Phase 3
// -----------------------
// Main mission chain for Phase 3 (first mission follows Phase 2 final mission)
// Title: Main Objective: Secrets of the Invitation Letter
const [, phase3FirstMission, phase3LastMission] = createMissions(
  'main',
  'Phase 3 - Main Objective: Secrets of the Invitation Letter',
  m('An Eye for an Eye')
    .objectives('In {nh}, kill any _8 Ahsarah Guard common soldiers_.',
      'In {nh}, kill any _3 {ahsarah special}_.')
    .inASingleMatch(),
  m('Echoes of the Past')
    .objectives('In {nh}, kill _3 enemy operators_.')
    .inASingleMatch(),
  m('Evil Unleashed')
    .objectives('In {br}, kill any _6 enemy soldiers_ within the _Brakkesh Old Town area_.',
      'In {br}, kill _1 enemy operator_ within the _Brakkesh Old Town area_.',
      'In {br}, {goto} in _Ahsarah Camp_ and place {gold} _Raven Pendant_.')
    .inASingleMatch(),
  m('Spider\'s Thread')
    .objectives('In {nh}, kill _3 enemy operators_.',
      'In {nh}, extract 1 time.'),
  m('Bedside')
    .objectives('In {space}, {goto} in _the CEO Office outer suite in the Central Zone_ and obtain the mission item {gold} _Altered Prison ID Card_.',
      'In {space}, extract 1 time from the _Helicopter/Rocket Extraction Point_.')
    .inASingleMatch()
    .withEquippedItemsOnEntry('{gold} _Anti-Jamming Device_'),
  m('Broken Chains')
    .objectives('In {nh}, extract 1 time _(earnings >= 1,250,000)_.'),
  m('Total Suppression')
    .objectives('In {zd}, kill _2 enemy operators_ in total.',
      'In {br}, kill _2 enemy operators_ in total.',
      'In {space}, kill _2 enemy operators_ in total.'),
  m('Morning Roll Call')
    .objectives('In {nh}, kill _3 enemy operators_.',
      'In {nh}, complete _1 {flagship}_.')
    .inASingleMatch(),
);
phase3FirstMission.follows(phase3StartGate);
phase3LastMission.setStars(10);

// Side mission: Combat Specialist: Golden Gunner (Season 3-1)
const [, phase3_gunner, phase3_gunner_last] = createMissions(
  'side',
  'Phase 3 - Combat Specialist: Golden Gunner',
  m('Golden Gunner - 1')
    .objectives('Submit _KC17 Assault Rifle_ x1 modified as required.'),
  m('Golden Gunner - 2')
    .objectives('In {nh}, use _KC17 Assault Rifle_ to kill _3 enemy operators_.')
    .withEntryValue('750,000'),
  m('Golden Gunner - 3')
    .objectives('Submit _AKM Assault Rifle_ x1 modified as required.'),
  m('Golden Gunner - 4')
    .objectives('In {nh}, use _AKM Assault Rifle_ to kill _3 enemy operators_.')
    .withEntryValue('750,000'),
  m('Golden Gunner - 5')
    .objectives('Submit _PKM General Machine Gun_ x1 modified as required.'),
  m('Golden Gunner - 6')
    .objectives('In {nh}, use _PKM General Machine Gun_ to kill _3 enemy operators_.')
    .withEntryValue('750,000'),
  m('Golden Gunner - 7')
    .objectives('In {nh}, use _KC17 Assault Rifle_ to kill _1 enemy operator_.',
      'In {nh}, use _AKM Assault Rifle_ to kill _1 enemy operator_.',
      'In {nh}, use _PKM General Machine Gun_ to kill _1 enemy operator_.')
    .withoutDying(),
);
phase3_gunner.follows(phase3StartGate);
phase3_gunner_last.setStars(5);

// Side mission: Combat Specialist: Sniper Elite (Season 3-2)
const [, phase3_sniper, phase3_sniper_last] = createMissions(
  'side',
  'Phase 3 - Combat Specialist: Sniper Elite',
  m('Sniper Elite - 1')
    .objectives('In {nh}, use _any marksman rifle_ to kill _3 enemy operators_ in total.'),
  m('Sniper Elite - 2')
    .objectives('In {nh}, use any firearm equipped with _variable magnification scope_ to kill _3 enemy operators_ in total.'),
  m('Sniper Elite - 3')
    .objectives('In {nh}, use {red} _7.62x54R SNB_ or {gold} _7.62x54R BT_ to kill _3 enemy operators_ in total.'),
  m('Sniper Elite - 4')
    .objectives('In {nh}, use _any sniper rifle_ to kill _3 enemy operators_ from _beyond 30m_.'),
  m('Sniper Elite - 5')
    .objectives('In {nh}, use _M700 Sniper Rifle_ to kill _1 enemy operator_.',
      'In {nh}, use _PSG-1 Marksman Rifle_ to kill _1 enemy operator_.',
      'In {nh}, use _any pistol_ to kill _1 enemy operator_.')
    .withoutDying(),
);
phase3_sniper.follows(phase3StartGate);
phase3_sniper_last.setStars(5);

// Side mission: Bat Specialist: Sector Hunter (Season 3-3)
const [, phase3_sector, phase3_sector_last] = createMissions(
  'side',
  'Phase 3 - Bat Specialist: Sector Hunter',
  m('Sector Hunter: Dam')
    .objectives('In {zd}, kill _3 operators_ in total within the specified area _in the central Dam sector_.'),
  m('Sector Hunter: Grove')
    .objectives('In {nh}, kill _3 enemy operators_.')
    .inASingleMatch(),
  m('Sector Hunter: New Tower of Babel')
    .objectives('In {br}, kill _3 operators_ in total within the specified area _in southern Brakkesh_.'),
  m('Sector Hunter: Central District')
    .objectives('In {space}, kill _3 operators_ in total within the specified area _in central Space City_.'),
  m('Eternal Heart: Return')
    .objectives('In {nh}, kill _2 enemy operators_.')
    .withoutVest()
    .withoutDying(),
);
phase3_sector.follows(phase3StartGate);
phase3_sector_last.setStars(4);

// Side mission: Ability Expert: Patrol the World (Season 3-4)
const [, phase3_grandtour, phase3_grandtour_last] = createMissions(
  'side',
  'Phase 3 - Ability Expert: Patrol the World',
  m('Grand Tour: Dam')
    .objectives('In {zd}, investigate the specified location _on the second floor of the Visitor Center_ within the _first 15 min_ of the match.'),
  m('Grand Tour: Grove')
    .objectives('In {nh}, extract 1 time _(earnings >=1,250,000)_.',
      'In {nh}, kill _2 enemy operators_.')
    .inASingleMatch(),
  m('Grand Tour: Space City')
    .objectives(
      'In {space}, investigate the specified location _in the Dormitory Area_ within the _first 15 min_ of the match.',
      'In {space}, investigate the specified location _on the first floor of Central Command Zone_ within the _first 15 min_ of the match.',
      'In {space}, investigate the specified location _in the printing workshop of Industrial Zone_ within the _first 15 min_ of the match.',
      'In {space}, investigate the specified location _at the horizontal test track_ within the _first 15 min_ of the match.',
    )
    .inASingleMatch(),
  m('Grand Tour: Brakkesh')
    .objectives(
      'In {br}, investigate the specified location _at the front desk of Brakkesh Grand Hammam_ within the _first 15 min_ of the match.',
      'In {br}, investigate the specified location _at the front desk of Lanting Hotel_ within the _first 15 min_ of the match.',
      'In {br}, investigate the specified location _inside Ahsarah Camp_ within the _first 15 min_ of the match.',
      'In {br}, investigate the specified location _at the statue in front of the Museum_ within the _first 15 min_ of the match.',
      'In {br}, investigate the specified location _at the pyramid sculpture outside the New Tower of Babel_ within the _first 15 min_ of the match.',
    )
    .inASingleMatch(),
  m('Ultimate Standard: Return')
    .objectives('In {nh}, complete _3 tasks_.',
      'In {nh}, complete _1 {flagship}_.',
      'In {nh}, extract 1 time.')
    .inASingleMatch(),
);
phase3_grandtour.follows(phase3StartGate);
phase3_grandtour_last.setStars(4);

const [phase3_escapist_missions, phase3_escapist_spare, phase3_escapist_last] = createMissions(
  'side',
  'Phase 3 - Escapist\'s Trick: Jack of All Trades',
  m('Escapist\'s Trick: Out of Pocket')
    .objectives('In {zd}, extract 1 time from the _River Bank Paid Extraction Point_.',
      'In {ln}, extract 1 time from the _Shoreline Paid Extraction Point_.'),
  m('Escapist\'s Arts: Slip Through the Cracks')
    .objectives('In {zd}, extract 1 time from the _Dam Top/Maintenance Tunnel (Bagless Extraction Point)_.',
      'In {br}, extract 1 time from the _Path to Grove (Bagless Extraction Point}_.',
      'In {space}, extract 1 time from the _Test Track Extraction Point (Bagless Extraction Point)_.'),
  m('Escapist\'s Trick: Baton Pass')
    .objectives('In {br}, successfully extract 1 time from _Hammam Powered Extraction Point/Outside the New Tower of Babel Powered Extraction Point_.',
      'In {space}, extract 1 time from the _Helicopter Powered Extraction Point_.')
    .withoutDying(),
  m('Escapist\'s Trick: Big Score')
    .objectives('In {space}, extract 1 time from the _Rocket Extraction Point_ (requires activation through Operation Ascended).',
      'In {br}, extract 1 time from the _Helipad Doctor Extraction Point_ (requires activation through Operation Asylum).'),
  m('Escapist\'s Trick: Supreme Solo')
    .objectives('In {br}, extract 1 time from the _New Tower of Babel Rooftop Extraction Point_.'),
);
phase3_escapist_spare.follows(phase3StartGate);
phase3_escapist_missions.forEach(m => m.setLocked(true));
phase3_escapist_last.setStars(3);

const [phase3_encyclopedic_missions, phase3_encyclopedic_cont, phase3_encyclopedic_last] = createMissions(
  'side',
  'Phase 3 - Encyclopedic Insight: Broad Knowledge (cont.)',
  m('Broad Knowledge - 6')
    .objectives('In {nh}, extract with a total of 5 {purple} Purple or better _Medical Item collectibles_.'),
  m('Broad Knowledge - 7')
    .objectives('In {nh}, extract with a total of 5 {purple} Purple or better _Energy Fuel collectibles_.'),
  m('Broad Knowledge - 8')
    .objectives('In {nh}, extract with a total of 5 {purple} Purple or better _Household collectibles_.'),
  m('Broad Knowledge - 9')
    .objectives('In {nh}, extract with a total of 5 {gold} Gold or better _Electronic Productt collectibles_.'),
  m('Broad Knowledge - 10')
    .objectives('In {nh}, extract with a total of 3 {purple} Purple or better _Craftwork collectibles_.',
      'In {nh}, extract with a total of 3 {purple} Purple or better _Tool & Material collectibles_.',
      'In {nh}, extract with a total of 3 {purple} Purple or better _Intel collectibles_.')
    .withoutDying(),
);
phase3_encyclopedic_cont.follows(phase3StartGate);
phase3_encyclopedic_missions.forEach(m => m.setLocked(true));
phase3_encyclopedic_last.setStars(3);

const [phase3_collector_missions, phase3_collector, phase3_collector_last] = createMissions(
  'side',
  'Phase 3 - Path to the Great Collector',
  m('Shadow of Stealth')
    .objectives('In {nh}, open _5 Courier Cartons_ for the first time.'),
  m('Personal Belongings')
    .objectives('In {nh}, open _5 Premium Suitcases_ for the first time.'),
  m('Box Affection')
    .objectives('In {nh}, open _5 Flight Cases_ for the first time.'),
  m('Boundless Link')
    .objectives('In {nh}, hack _5 Hacker Computers_ for the first time.'),
  m('Code of Thieves')
    .objectives('In {nh}, open _5 safes_ for the first time.'),
);
phase3_collector.follows(phase3StartGate);
phase3_collector_missions.forEach(m => m.setLocked(true));
phase3_collector_last.setStars(3);

const phase4StartGate = computedMission('Phase 4 Start Gate',
  [phase3LastMission, phase3_gunner_last, phase3_sniper_last, phase3_sector_last, phase3_grandtour_last, phase3_escapist_last, phase3_encyclopedic_last, phase3_collector_last],
  (self, deps) => deps.reduce((acc, m) => acc + (m.completed ? m.stars : 0),
    0) >= self.stars)
  .setStars(24);
phase4StartGate.follows(phase3LastMission);

// Phase 4
// Final phase main missions (placeholders)
// Title: Final Phase: Silent Scream
const [, phase4FirstMission, phase4LastMission] = createMissions(
  'main',
  'Phase 4 - Final Phase: Silent Scream',
  m('Apex Benchmark')
    .objectives('In {nh}, complete _3 {flagship}_.')
    .withoutDying(),
  m('Silent Scream - 2')
    .objectives(),
  m('Silent Scream - 3')
    .objectives(),
  m('Silent Scream - 4')
    .objectives(),
  m('Silent Scream - 5')
    .objectives(),
  m('Silent Scream - 6')
    .objectives(),
  m('Silent Scream - 7')
    .objectives(),
  m('Silent Scream - 8')
    .objectives(),
);
phase4FirstMission.follows(phase4StartGate);

export const ROOT_MISSION = rootMission;
export const FINAL_MISSION = phase4LastMission;

export const MISSION_DISPLAY_OFFSETS: number[] = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
];
