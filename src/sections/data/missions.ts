type MissionFlags = { main?: boolean; offset?: number };

export class Mission {
  name: string;
  children: Mission[];
  flags: MissionFlags;
  parent: Mission | null = null;
  constructor(name: string, children: Mission[] = [], flags: MissionFlags = {}) {
    this.name = name;
    this.children = children;
    this.flags = flags;
  }

  addChild(child: Mission) {
    this.children.push(child);
    child.parent = this;
    return this;
  }

  follows(parent: Mission) {
    parent.addChild(this);
    return this;
  }
}

const mainMission = (name: string) => new Mission(name, [], { main: true });
const sideMission = (name: string, offset?: number) => new Mission(name, [], { offset });

// Main mission chain
const firingPoint = mainMission("Firing Point");
const strengthInNumbers = mainMission("Strength in Numbers").follows(firingPoint);
const handledWithEase = mainMission("Handled with Ease").follows(strengthInNumbers);
const damGood = mainMission("Dam Good").follows(handledWithEase);
const museumHeist = mainMission("Museum Heist").follows(damGood);
const wingsOfAscension = mainMission("Wings of Ascension").follows(museumHeist);
const giveAndTake = mainMission("Give and Take").follows(wingsOfAscension);
const starsAcrossTheSky = mainMission("Stars Across the Sky").follows(giveAndTake);
const clearingTheShadows = mainMission("Clearing the Shadows").follows(starsAcrossTheSky);
const covertProcessAttributionDismantle = mainMission("Covert Process: Attribution Dismantle").follows(clearingTheShadows);
const smokeAndMirrors1 = mainMission("Smoke and Mirrors - 1").follows(covertProcessAttributionDismantle);
const exposingTheShadowsGlobal = mainMission("Exposing the Shadows: Global").follows(smokeAndMirrors1);
const smokeAndMirrorsSpaceCity = mainMission("Smoke and Mirrors - Space City").follows(exposingTheShadowsGlobal);
const smokeAndMirrors2 = mainMission("Smoke and Mirrors - 2").follows(smokeAndMirrorsSpaceCity);
const mostWanted = mainMission("Most Wanted").follows(smokeAndMirrors2);
const turbulentWaters = mainMission("Turbulent Waters").follows(mostWanted);
const hitAndRun = mainMission("Hit and Run").follows(turbulentWaters);
const blitzOperation = mainMission("Blitz Operation").follows(hitAndRun);
const haavkEmployeeBenefits = mainMission("Haavk: Employee Benefits").follows(blitzOperation);
const silentAssassin = mainMission("Silent Assassin").follows(haavkEmployeeBenefits);
const shadowIdentity = mainMission("Shadow Identity").follows(silentAssassin);
const ironEvidence = mainMission("Iron Evidence").follows(shadowIdentity);
const pathOfRedemptionTravelLight = mainMission("Path of Redemption: Travel Light").follows(ironEvidence);
const pathOfRedemptionTheLongRoad = mainMission("Path of Redemption: The Long Road").follows(pathOfRedemptionTravelLight);
const pathOfRedemptionNoLongerAlone = mainMission("Path of Redemption: No Longer Alone").follows(pathOfRedemptionTheLongRoad);
const lostContact = mainMission("Lost Contact").follows(pathOfRedemptionNoLongerAlone);
const pathOfRedemptionTheFirstKnock = mainMission("Path of Redemption: TheFirstKnock").follows(lostContact);
const pathofRedemptionFlyHighInTheDark = mainMission("Path of Redemption: Fly High in the Dark").follows(pathOfRedemptionTheFirstKnock);

// Collectors
const collector1 = sideMission("Collector - 1").follows(handledWithEase);
const collector2 = sideMission("Collector - 2").follows(handledWithEase);
const collector3 = sideMission("Collector - 3").follows(exposingTheShadowsGlobal);
const collector4 = sideMission("Collector - 4").follows(exposingTheShadowsGlobal);
const collector5 = sideMission("Collector - 5").follows(shadowIdentity);
const collector6 = sideMission("Collector - 6").follows(shadowIdentity);

// Deep customization missions
const deepCustomization1 = sideMission("Deep Customization - 1", -2).follows(firingPoint);
const deepCustomization2 = sideMission("Deep Customization - 2", -2).follows(deepCustomization1);
const deepCustomization3 = sideMission("Deep Customization - 3", -2).follows(deepCustomization2);
const deepCustomization4 = sideMission("Deep Customization - 4", -2).follows(deepCustomization3);
const deepCustomizationBlackSite = sideMission("Deep Customization: Black Site", -2).follows(deepCustomization4);

// Classified secrets
const classifiedSecrets = sideMission("Classified Secrets", 2).follows(firingPoint);
const homelandDefense1 = sideMission("Homeland Defense - 1", 2).follows(classifiedSecrets);
const homelandDefense2 = sideMission("Homeland Defense - 2", 2).follows(homelandDefense1);
const homelandDefense3 = sideMission("Homeland Defense - 3", 2).follows(homelandDefense2);
const touristOpenRoad = sideMission("Tourist: Open Road", 2).follows(homelandDefense3);

// from clearing the shadows:
// broad knowledge 1, 2, 3, 4, 5
const broadKnowledge1 = sideMission("Broad Knowledge - 1", -2).follows(clearingTheShadows);
const broadKnowledge2 = sideMission("Broad Knowledge - 2", -2).follows(broadKnowledge1);
const broadKnowledge3 = sideMission("Broad Knowledge - 3", -2).follows(broadKnowledge2);
const broadKnowledge4 = sideMission("Broad Knowledge - 4", -2).follows(broadKnowledge3);
const broadKnowledge5 = sideMission("Broad Knowledge - 5", -2).follows(broadKnowledge4);

// from clearing the shadows:
// clearing the shadows: zero dam, probe the shadows, unraveling the web, exposing the shadows: zero dam, tourist: bridging the divide
const clearingTheShadowsZeroDam = sideMission("Clearing the Shadows: Zero Dam", 2).follows(clearingTheShadows);
const probeTheShadows = sideMission("Probe the Shadows", 2).follows(clearingTheShadowsZeroDam);
const unravelingTheWeb = sideMission("Unraveling the Web", 2).follows(probeTheShadows);
const exposingTheShadowsZeroDam = sideMission("Exposing the Shadows: Zero Dam", 2).follows(unravelingTheWeb);
const touristBridgingTheDivide = sideMission("Tourist: Bridging the Divide", 2).follows(exposingTheShadowsZeroDam);

// from most wanted:
// grit your teeth, rock solid, fatal trick, switcheroo, unknown side mission
const gritYourTeeth = sideMission("Grit Your Teeth").follows(mostWanted);
const rockSolid = sideMission("Rock Solid").follows(gritYourTeeth);
const fatalTrick = sideMission("Fatal Trick").follows(rockSolid);
const switcheroo = sideMission("Switcheroo").follows(fatalTrick);
const masterBenchmark = sideMission("Master Benchmark").follows(switcheroo);

// from most wanted:
// extreme warrior, thunder strike 1, thunder strike 2, escape fund, unbroken spirit
const extremeWarrior = sideMission("Extreme Warrior").follows(mostWanted);
const thunderStrike1 = sideMission("Thunder Strike - 1").follows(extremeWarrior);
const thunderStrike2 = sideMission("Thunder Strike - 2").follows(thunderStrike1);
const escapeFund = sideMission("Escape Fund").follows(thunderStrike2);
const unbrokenSpirit = sideMission("Unbroken Spirit").follows(escapeFund);

// from iron evidence:
// sniper elite 1, 2, 3, 4, sniper elite - cqb marksman
const sniperElite1 = sideMission("Sniper Elite - 1").follows(ironEvidence);
const sniperElite2 = sideMission("Sniper Elite - 2").follows(sniperElite1);
const sniperElite3 = sideMission("Sniper Elite - 3").follows(sniperElite2);
const sniperElite4 = sideMission("Sniper Elite - 4").follows(sniperElite3);
const sniperEliteCQBMarksman = sideMission("Sniper Elite: CQB Marksman").follows(sniperElite4);

// from iron evidence:
// golden gunner 1, 2, 3, 4, 5
const goldenGunner1 = sideMission("Golden Gunner - 1").follows(ironEvidence);
const goldenGunner2 = sideMission("Golden Gunner - 2").follows(goldenGunner1);
const goldenGunner3 = sideMission("Golden Gunner - 3").follows(goldenGunner2);
const goldenGunner4 = sideMission("Golden Gunner - 4").follows(goldenGunner3);
const goldenGunner5 = sideMission("Golden Gunner - 5").follows(goldenGunner4);
const goldenGunner6 = sideMission("Golden Gunner - 6").follows(goldenGunner5);
const goldenGunner7 = sideMission("Golden Gunner - 7").follows(goldenGunner6);

export const ROOT_MISSION = firingPoint;
