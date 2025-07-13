type Quality = "common" | "uncommon" | "rare" | "epic" | "legendary" | "exotic";

export class CollectorItem {
  name: string;
  quality: Quality;
  needed: number;
  collected: number;
  newThisSeason: boolean = false;
  requiresExtraction: boolean = false;
  constructor(
    name: string,
    quality: Quality,
    needed: number,
    newThisSeason: boolean = false,
    requiresExtraction: boolean = false,
    collected: number = 0
  ) {
    this.name = name;
    this.quality = quality;
    this.needed = needed;
    this.newThisSeason = newThisSeason;
    this.requiresExtraction = requiresExtraction;
    this.collected = collected;
  }
  get progressString(): string {
    return `${this.collected}/${this.needed}`;
  }
  get progressPercent(): number {
    return Math.floor((this.collected / this.needed) * 100);
  }
}

export class CollectorMission {
  name: string;
  items: CollectorItem[];
  constructor(name: string, items: CollectorItem[]) {
    this.name = name;
    this.items = items;
  }
}

const SEASON_ID = "Season 5";

export const COLLECTOR_MISSIONS = [
  new CollectorMission("Collector 1", [
    new CollectorItem("Any [Tool & Material]", "epic", 5),
    new CollectorItem("Any [Electronic Product]", "epic", 5),
  ]),
  new CollectorMission("Collector 2", [
    new CollectorItem("Any [Household Item]", "epic", 5),
    new CollectorItem("Any [Medical Item]", "epic", 5),
  ]),
  new CollectorMission("Collector 3", [
    new CollectorItem("Spray Paint", "uncommon", 8),
    new CollectorItem("Bucket of Paint", "rare", 3),
    new CollectorItem("Spinning Handsaw ", "epic", 3),
    new CollectorItem("High-Output Crusher", "epic", 3),
    new CollectorItem("Electric Vehicle Battery", "epic", 2),
  ]),
  new CollectorMission("Collector 4", [
    new CollectorItem("Military Explosives", "legendary", 2),
    new CollectorItem("Programmable Processor", "legendary", 2),
    new CollectorItem("Cordless Portable Drill", "rare", 3),
    new CollectorItem("Bag of Cement", "rare", 3),
    new CollectorItem("Gas Tank", "rare", 4),
  ]),
  new CollectorMission("Collector 5", [
    new CollectorItem("Golden Laurel Crown", "legendary", 1, true),
    new CollectorItem("Cryptex", "legendary", 1, true),
    new CollectorItem("Luxury Mechanical Watch", "exotic", 1),
  ]),
  new CollectorMission("Collector 6", [
    new CollectorItem("Quantum Storage", "exotic", 1),
    new CollectorItem("Military Control Terminal", "exotic", 1),
  ]),
];

export const getComplexItemKey = (missionName: string, itemName: string) => {
  return `${SEASON_ID}_${missionName}_${itemName}`.replace(/\s+/g, "_");
};
