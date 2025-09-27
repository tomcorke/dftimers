/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint @stylistic/newline-per-chained-call: ["error", { "ignoreChainWithDepth": 1 }] */
/* eslint @stylistic/max-len: ["error", { "code": 400 }] */
/* eslint @stylistic/function-call-argument-newline: ["error", "never"] */
/* eslint @stylistic/function-paren-newline: ["error", "never"] */
/* eslint @stylistic/padding-line-between-statements: [
    "error",
    { blankLine: "always", prev: "*", next: "const" }
] */

import { mainMission, sideMission } from './missions';

// Main mission chain
const firingPoint = mainMission('Firing Point')
  .objective('In {nh}, use any _light machine gun_ to kill _5 enemy soldiers_.');

const strengthInNumbers = mainMission('Strength in Numbers')
  .objective('In {nh}, extract with _5 items/gear of {purple} purple quality or higher_.')
  .follows(firingPoint);

const handledWithEase = mainMission('Handled with Ease')
  .objective('In {nh}, extract 1 time _(earnings >=350,000 Tekniq Alloys)_.')
  .follows(strengthInNumbers);

const damGood = mainMission('Dam Good')
  .objective('In {zd}, complete _3 tasks_')
  .objective('In {zd}, kill _5 {special}_')
  .follows(handledWithEase);

const museumHeist = mainMission('Museum Heist')
  .objective('In {nh}, complete _3 tasks in total_.')
  .objective('In {nh}, extract with _3 items/gear of {gold} gold quality or higher_.')
  .follows(damGood);

const wingsOfAscension = mainMission('Wings of Ascension')
  .objective('In {space}, complete _3 tasks_')
  .objective('In {space}, extract 1 time _(earnings >=500,000 Tekniq Alloys)_')
  .follows(museumHeist);

const giveAndTake = mainMission('Give and Take')
  .objective('In {nh}, kill _2 enemy operators_')
  .objective('In {nh}, extract with a total of _6 operator ID tags_.')
  .follows(wingsOfAscension);

const starsAcrossTheSky = mainMission('Stars Across the Sky')
  .objective('In {zd}, go to the trash can next to the construction site on the west side of the Administrative Center and obtain the mission item _Modified Satellite Phone_.')
  .objective('In {zd}, go to the trash can on the east side of the Administrative Center and obtain the mission item _Satellite Communication Cell Phone_.')
  .objective('In {zd}, place the mission item _Modified Satellite Phone_ in the truck container in front of the stash on the east side of the Administrative Center.')
  .objective('In {zd}, place the mission item _Satellite Communication Cell Phone_ in the truck container on the north side of the Administrative Center.')
  .follows(giveAndTake);

const clearingTheShadows = mainMission('Clearing the Shadows')
  .objective('In {nh}, extract with a total of _3 Secret Protocol Crates_.')
  .follows(starsAcrossTheSky);

const covertProcessAttributionDismantle = mainMission('Covert Process: Attribution Dismantle')
  .objective('In {space}, go to the specified location in the printing workshop and obtain the mission item _Polymer Plastic Material_.')
  .objective('In {space}, go to the specified location on the 2F of the Central Command Zone and obtain the mission item _Incubator Casing_.')
  .objective('In {space}, extract with the mission item _Polymer Plastic Material_.')
  .objective('In {space}, extract with the mission item _Incubator Casing_.')
  .follows(clearingTheShadows);

const smokeAndMirrors1 = mainMission('Smoke and Mirrors - 1')
  .objective('In {nh}, kill _3 enemy operators in total_.')
  .follows(covertProcessAttributionDismantle);

const exposingTheShadowsGlobal = mainMission('Exposing the Shadows: Global')
  .objective('In {nh}, extract with a total of _3 Secret Protocol Crates_.')
  .follows(smokeAndMirrors1);

const smokeAndMirrorsSpaceCity = mainMission('Smoke and Mirrors - Space City')
  .inASingleMatch()
  .objective('In {space}, place the mission item _3D Copy Secret Protocol Crate_ at the Eastern Suspension Bridge in Space City {purchase}.')
  .objective('In {space}, place the mission item _3D Copy Secret Protocol Crate_ at the Broken Bridge in the Space City launch area {purchase}.')
  .objective('In {space}, extract 1 time.')
  .follows(exposingTheShadowsGlobal);

const smokeAndMirrors2 = mainMission('Smoke and Mirrors - 2')
  .objective('In {nh}, extract 2 times in total _(earnings >=750,000 Tekniq Alloy per operation)_')
  .follows(smokeAndMirrorsSpaceCity);

const mostWanted = mainMission('Most Wanted')
  .withoutDying()
  .objective('In {nh}, kill _16 Haavk regular soldiers_')
  .objective('In {nh}, kill _8 {haavk special}_.')
  .follows(smokeAndMirrors2);

const turbulentWaters = mainMission('Turbulent Waters')
  .inASingleMatch()
  .objective('In {nh}, kill _10 enemy soldiers_.')
  .follows(mostWanted);

const hitAndRun = mainMission('Hit and Run')
  .inASingleMatch()
  .objective('In {nh}, complete _3 tasks in total_.')
  .objective('In {nh}, extract 1 time.')
  .follows(turbulentWaters);

const blitzOperation = mainMission('Blitz Operation')
  .inASingleMatch()
  .objective('In {nh}, extract 1 time.')
  .objective('In {nh}, kill _3 enemy operators in total_.')
  .follows(hitAndRun);

const haavkEmployeeBenefits = mainMission('Haavk: Employee Benefits')
  .objective('In {space}, investigate _15 vending machines_')
  .follows(blitzOperation);

const silentAssassin = mainMission('Silent Assassin')
  .objective('In {nh}, use any weapon with _sound suppression_ to kill _3 enemy operators_.')
  .objective('In {nh}, use a weapon equipped with _any scope_ to kill _3 enemy operators_.')
  .follows(haavkEmployeeBenefits);

const shadowIdentity = mainMission('Shadow Identity')
  .objective('Submit _{blue} Intel Document_ x3')
  .objective('Submit _{purple} Ahsarah Guard Confidential Files_ x2')
  .objective('Submit _{purple} Data: Military Intel_ x5')
  .objective('Submit _{gold} Neural Relink Medical Report_ x1')
  .follows(silentAssassin);

const ironEvidence = mainMission('Iron Evidence')
  .objective('In {zd}, place the mission item _Most Wanted File_ in the Central VIP Room at the Visitor Center {purchase}')
  .objective('In {zd}, place the mission item _Most Wanted File_ in the AC Manager\'s Office {purchase}')
  .objective('In {zd}, place the mission item _Most Wanted File_ in the conference room in the Central Command Zone {purchase}')
  .follows(shadowIdentity);

const pathOfRedemptionTravelLight = mainMission('Path of Redemption: Travel Light')
  .objective('In {nh}, extract 1 time _(earnings >=1,250,000 Tekniq Alloys per operation)_.')
  .follows(ironEvidence);

const pathOfRedemptionTheLongRoad = mainMission('Path of Redemption: The Long Road')
  .withoutDying()
  .objective('In {nh}, extract with _total earnings >=4,000,000 Tekniq Alloy._')
  .follows(pathOfRedemptionTravelLight);

const pathOfRedemptionNoLongerAlone = mainMission('Path of Redemption: No Longer Alone')
  .withoutDying()
  .objective('In {nh}, kill _any boss 2 times in total_ (including _Reis, Saeed, Desmoulins, Raven_).')
  .follows(pathOfRedemptionTheLongRoad);

const lostContact = mainMission('Lost Contact')
  .inASingleMatch()
  .objective('In {nh}, kill _1 enemy operator_ while carrying an undecoded _MandelBrick_.')
  .objective('In {nh}, decode _1 MandelBrick_.')
  .follows(pathOfRedemptionNoLongerAlone);

const pathOfRedemptionTheFirstKnock = mainMission('Path of Redemption: The First Knock')
  .withoutDying()
  .objective('In {nh}, kill _1 operator_.')
  .objective('In {nh}, kill _3 Ahsarah common soldiers_.')
  .objective('In {nh}, kill _3 Haavk common soldiers_.')
  .objective('In {nh}, kill _2 {ahsarah special}_.')
  .objective('In {nh}, kill _2 {haavk special}_.')
  .follows(lostContact);

const pathofRedemptionNightExtraction = mainMission('Path of Redemption: Night Extraction')
  .inASingleMatch()
  .objective('In {space}, go to the Central Command Zone 2F and pick up the mission item _{red} Extreme Criminal File_.')
  .objective('In {space}, complete _1 Operation Ascended task_.')
  .objective('In {space}, extract with the mission item _{red} Extreme Criminal File_.')
  .follows(pathOfRedemptionTheFirstKnock);

// Collectors
const collector1 = sideMission('Collector - 1')
  .objective('Submit unbound purple or better _{purple} Tool & Material_ collectible x5')
  .objective('Submit unbound purple or better _{purple} Electronic Product_ collectible x5')
  .follows(handledWithEase);

const collector2 = sideMission('Collector - 2')
  .objective('Submit unbound purple or better _{purple} Household_ collectible x5')
  .objective('Submit unbound purple or better _{purple} Medical_ collectible x5')
  .follows(handledWithEase);

const collector3 = sideMission('Collector - 3')
  .objective('Submit unbound _{green} Spray Paint_ x8')
  .objective('Submit unbound _{blue} Bucket of Paint_ x3')
  .objective('Submit unbound _{purple} Spinning Hacksaw_ x3')
  .objective('Submit unbound _{purple} High-power Crusher_ x3')
  .objective('Submit unbound _{purple} EV Battery_ x2')
  .follows(exposingTheShadowsGlobal);

const collector4 = sideMission('Collector - 4')
  .objective('Submit unbound _{gold} Military Explosive_ x2')
  .objective('Submit unbound _{gold} Programmable Processor_ x2')
  .objective('Submit unbound _{blue} Cordless Portable Drill_ x3')
  .objective('Submit unbound _{blue} Pack of Cement_ x3')
  .objective('Submit unbound _{blue} Gas Tank_ x4')
  .follows(exposingTheShadowsGlobal);

const collector5 = sideMission('Collector - 5')
  .objective('Submit unbound _{gold} Golden Laurel Crown_ x1')
  .objective('Submit unbound _{gold} Cryptex_ x1')
  .objective('Submit unbound _{red} Luxury Mechanical Watch_ x1')
  .follows(shadowIdentity);

const collector6 = sideMission('Collector - 6')
  .objective('Submit unbound _{red} Quantum Storage_ x1')
  .objective('Submit unbound _{red} Military Control Terminal_ x1')
  .follows(shadowIdentity);

// Deep customization missions
const deepCustomization1 = sideMission('Deep Customization - 1', -2)
  .objective('In {nh}, use *Bizon Submachine Gun* to kill _5 enemy soldiers_.')
  .follows(firingPoint);

const deepCustomization2 = sideMission('Deep Customization - 2')
  .objective('In {nh}, use *CAR-15 Assault Rifle* to kill _5 {special}_.')
  .follows(deepCustomization1);

const deepCustomization3 = sideMission('Deep Customization - 3')
  .objective('In {nh}, use *any pistol* to kill _2 enemy operators_')
  .follows(deepCustomization2);

const deepCustomization4 = sideMission('Deep Customization - 4')
  .objective('In {nh}, use *AKM Assault Rifle* to kill _2 enemy operators_')
  .follows(deepCustomization3);

const deepCustomizationBlackSite = sideMission('Deep Customization: Black Site')
  .objective('In {space}, place *Encrypted Router* at the specified location in the _Space City Dormitory Area_')
  .objective('In {space}, place *LCD Screen* at the specified location in the _Space City Dormitory Area_')
  .objective('In {space}, place *Solar Panel* at the specified location in the _Space City Dormitory Area_')
  .follows(deepCustomization4);

// Classified secrets
const classifiedSecrets = sideMission('Classified Secrets', 2)
  .objective('Submit _{gold} Cryptex_ x1')
  .objective('Submit _{gold} Music Box_ x1')
  .follows(firingPoint);

const homelandDefense1 = sideMission('Homeland Defense - 1')
  .objective('In {nh}, use any firearm equipped with a _3x scope or higher_ to kill 5 {special}.')
  .follows(classifiedSecrets);

const homelandDefense2 = sideMission('Homeland Defense - 2')
  .objective('In {nh}, use _SR-3M Compact Assault Rifle_ to kill _1 enemy operator_ while equipped with _{purple} Assault Vest_ and _{purple} MHS Tactical Helmet_.')
  .follows(homelandDefense1);

const homelandDefense3 = sideMission('Homeland Defense - 3')
  .objective('In {nh}, use _AKM Assault Rifle_ to kill _1 enemy operator_ while equipped with _{purple} DT-AVS Vest_ and _{purple} DICH Training Helmet_.')
  .follows(homelandDefense2);

const touristOpenRoad = sideMission('Tourist: Open Road')
  .tourist()
  .objective('In {nh}, extract 1 time.')
  .follows(homelandDefense3);

// from clearing the shadows:
// broad knowledge 1, 2, 3, 4, 5
const broadKnowledge1 = sideMission('Broad Knowledge - 1', -2)
  .objective('In {nh}, extract with _6 {purple} Household item collectibles of Purple quality or higher_.')
  .objective('Produce _{gold} Precision Vest Repair Kit_ 1 time at the Black Site.')
  .follows(clearingTheShadows);

const broadKnowledge2 = sideMission('Broad Knowledge - 2')
  .objective('In {nh}, extract with a total of _6 Purple or better {purple} Tool & Material collectibles_.')
  .objective('Produce _{gold} Hvk-2 Vest_ 1 time at the Black Site.')
  .follows(broadKnowledge1);

const broadKnowledge3 = sideMission('Broad Knowledge - 3')
  .objective('In {nh}, extract with _8 {purple} Intel collectibles of Purple quality or higher_.')
  .objective('Produce _{purple} OLIGHT Odin S Tactical Flashlight_ 2 times at the Black Site.')
  .follows(broadKnowledge2);

const broadKnowledge4 = sideMission('Broad Knowledge - 4')
  .objective('In {nh}, extract with _6 {purple} Medical Supplies collectibles of Purple quality or higher_.')
  .objective('Produce _{purple} M157 Fire Control System_ 2 times at the Black Site.')
  .follows(broadKnowledge3);

const swiftStorm = sideMission('Swift Storm')
  .inASingleMatch()
  .objective('In {nh}, use any _light machine gun_ to kill _1 enemy operator_.')
  .objective('In {nh}, use any _pistol_ to kill _1 enemy operator_.')
  .objective('In {nh}, extract 1 time.')
  .follows(broadKnowledge4);

// from clearing the shadows:
// clearing the shadows: zero dam, probe the shadows, unraveling the web, exposing the shadows: zero dam, tourist: bridging the divide
const clearingTheShadowsZeroDam = sideMission('Clearing the Shadows: Zero Dam', 2)
  .objective('In {zd}, investigate in front of the coded door in the western wilderness of the dam')
  .objective('In {zd}, investigate in front of the coded door at the underground tunnel entrance on teh west side of the dam.')
  .objective('In {zd}, investigate in front of the underground coded door next to the Major Substation at teh dam.')
  .follows(clearingTheShadows);

const probeTheShadows = sideMission('Probe the Shadows')
  .inASingleMatch()
  .objective('In {zd}, place _{blue} Camera_ at the specified location in the dam barracks tunnel.')
  .objective('In {zd}, place _{blue} Camera_ at the specified location in the underground tunnel next to the dam cement plant.')
  .objective('In {zd}, place _{blue} Camera_ at the specified location in the underground tunnel of the dam Administrative Center.')
  .follows(clearingTheShadowsZeroDam);

const unravelingTheWeb = sideMission('Unraveling the Web')
  .objective('In {zd}, investigate _8 different GTI/Delta Force/Dagger emblems_')
  .follows(probeTheShadows);

const exposingTheShadowsZeroDam = sideMission('Exposing the Shadows: Zero Dam')
  .objective('In {zd}, extract with any _2 Secret Protocol Crates_ in total.')
  .follows(unravelingTheWeb);

const touristBridgingTheDivide = sideMission('Tourist: Bridging the Divide')
  .tourist()
  .withoutDying()
  .objective('In {zd}, extract 1 time.')
  .objective('In {space or brakkesh}, extract 1 time.')
  .follows(exposingTheShadowsZeroDam);

// from most wanted:
// grit your teeth, rock solid, fatal trick, switcheroo, unknown side mission
const gritYourTeeth = sideMission('Grit Your Teeth')
  .inASingleMatch()
  .withoutMeds()
  .objective('In {nh}, kill _2 enemy operators_.')
  .follows(mostWanted);

const rockSolid = sideMission('Rock Solid')
  .objective('In {nh}, use _Uluru\'s Loitering Munition_ to deal _500 damage_ in total.')
  .objective('In {nh}, use _Uluru\'s Composite Incendiary_ to deal _500 damage_ in total.')
  .follows(gritYourTeeth);

const fatalTrick = sideMission('Fatal Trick')
  .objective('In {nh}, use _Toxik\'s "Dragonfly" Swarm System_ to affect _10 enemies_ in total.')
  .objective('In {nh}, kill _10 enemies_ affected by _Toxik\'s Blinding Gas_ in total.')
  .follows(rockSolid);

const switcheroo = sideMission('Switcheroo')
  .objective('In {nh}, complete _1 Safe Supplies task_.')
  .objective('In {nh}, extract 1 time _(earnings >=350,000)_.')
  .objective('In {space}, complete _2 Safe Supplies tasks_.')
  .objective('In {space}, extract 2 times _(earnings >=750,000 Tekniq Alloys)_.')
  .follows(fatalTrick);

const masterBenchmark = sideMission('Master Benchmark')
  .inASingleMatch()
  .objective('In {space}, complete _3 tasks_.')
  .objective('In {space}, complete _1 Operation Ascended task_.')
  .objective('In {space}, extract 1 time.')
  .follows(switcheroo);

// from most wanted:
// extreme warrior, thunder strike 1, thunder strike 2, escape fund, unbroken spirit
const extremeWarrior = sideMission('Extreme Warrior')
  .objective('In {nh}, kill _3 enemy operators_ in total while equipped with any _{red} protection level 6 ballistic vest and helmet_.')
  .follows(mostWanted);

const thunderStrike1 = sideMission('Thunder Strike - 1')
  .objective('In {nh}, kill _3 enemy operators_ in total using _a submachine gun_ equipped with any _blinding flashlight_, while wearing _{purple} D6 Tactical Helmet_.')
  .follows(extremeWarrior);

const thunderStrike2 = sideMission('Thunder Strike - 2')
  .objective('In {nh}, kill _3 enemy operators_ in total using _a shotgun_ equipped with any _blinding flashlight_ while equipped with _{gold} Mask-1 Iron Helmet_.')
  .follows(thunderStrike1);

const escapeFund = sideMission('Escape Fund')
  .inASingleMatch()
  .objective('In {zd}, place _{gold} Pure Gold Lighter_ at the specified location in the AC Manager\'s Office.')
  .objective('In {zd}, place _{blue} Weird Pirate Silver Coin_ at the specified location in the AC Manager\'s Office.')
  .objective('In {zd}, place _{gold} Pure Gold Lighter_ at the specified location in the Visitor Center VIP Room.')
  .objective('In {zd}, place _{blue} Weird Pirate Silver Coin_ at the specified location in the Visitor Center VIP Room.')
  .follows(thunderStrike2);

const unbrokenSpirit = sideMission('Unbroken Spirit')
  .withoutVest()
  .withoutDying()
  .objective('In {nh}, kill _2 enemy operators_')
  .follows(escapeFund);

// from iron evidence:
// sniper elite 1, 2, 3, 4, sniper elite - cqb marksman
const sniperElite1 = sideMission('Sniper Elite - 1')
  .objective('In {nh}, use _any marksman rifle_ to kill _3 enemy operators_ in total.')
  .follows(ironEvidence);

const sniperElite2 = sideMission('Sniper Elite - 2')
  .objective('In {nh}, use any firearm equipped wtih a _6x or higher scope_ to kill _3 enemy operators_ in total.')
  .follows(sniperElite1);

const sniperElite3 = sideMission('Sniper Elite - 3')
  .objective('In {nh}, use _{gold} 7.62x51mm M62_ or _{red} 7.62x51mm M61_ to kill _3 enemy operators_ in total.')
  .follows(sniperElite2);

const sniperElite4 = sideMission('Sniper Elite - 4')
  .objective('In {nh}, use a firearm equipped with any _ballistic computer scope_ to kill _3 enemy operators_ in total.')
  .follows(sniperElite3);

const sniperEliteCQBMarksman = sideMission('Sniper Elite: CQB Marksman')
  .withoutDying()
  .objective('In {nh}, use _P90 Submachine Gun_ to kill _1 enemy operator_.')
  .objective('In {nh}, use _K416 Assault Rifle_ to kill _1 enemy operator_.')
  .objective('In {nh}, use _SVD Sniper Rifle_ to kill _1 enemy operator_.')
  .follows(sniperElite4);

// from iron evidence:
// golden gunner 1, 2, 3, 4, 5
const goldenGunner1 = sideMission('Golden Gunner - 1')
  .objective('Submit _K437 Assault Rifle_ x1 modified as required.')
  .follows(ironEvidence);

const goldenGunner2 = sideMission('Golden Gunner - 2')
  .withEntryValue('750,000')
  .objective('In {nh}, use _K437 Assault Rifle_ to kill _3 enemy operators_.')
  .follows(goldenGunner1);

const goldenGunner3 = sideMission('Golden Gunner - 3')
  .objective('Submit _SCAR-H Battle Rifle_ x1 modified as required.')
  .follows(goldenGunner2);

const goldenGunner4 = sideMission('Golden Gunner - 4')
  .withEntryValue('750,000')
  .objective('In {nh}, use _SCAR-H Battle Rifle_ to kill _3 enemy operators_.')
  .follows(goldenGunner3);

const goldenGunner5 = sideMission('Golden Gunner - 5')
  .objective('Submit _ASh-12 Battle Rifle_ x1 modified as required.')
  .follows(goldenGunner4);

const goldenGunner6 = sideMission('Golden Gunner - 6')
  .withEntryValue('750,000')
  .objective('In {nh}, use _ASh-12 Battle Rifle_ to kill _3 enemy operators_.')
  .follows(goldenGunner5);

const goldenGunner7 = sideMission('Golden Gunner - 7')
  .withoutDying()
  .objective('In {nh}, use _AK-12 Assault Rifle_ to kill _1 enemy operator_.')
  .objective('In {nh}, use _SMG-45 Submachine Gun_ to kill _1 enemy operator_.')
  .objective('In {nh}, use _SCAR-H Battle Rifle_ to kill _1 enemy operator_.')
  .follows(goldenGunner6);

export const ROOT_MISSION = firingPoint;
export const FINAL_MISSION = pathofRedemptionNightExtraction;
export const MISSION_DISPLAY_OFFSETS: number[] = [0, -1, 1, -2, 2, -3, 3, -4, 4, -5, 5, -6, 6];
