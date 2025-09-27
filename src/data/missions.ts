import EventEmitter from 'events';

type MissionType = 'main' | 'side' | 'dummy' | 'computed';

type MissionFlags = { type?: MissionType, offset?: number };

const replacements = {
  '{nh}': '**any Normal / Hard operation**',
  '{zd}': '**any Zero Dam Normal / Eternal Night operation**',
  '{space}': '**any Space City Normal / Hard operation**',
  '{space or brakkesh}': '**any Space City / Brakkesh Normal / Hard operations**',
  '{special}':
    'special class enemies (Shieldbearer, Sniper, Rocketeer, Machine Gunner, Flamethrower, or Boss Guard)',
  '{ahsarah special}':
    'Ahsarah special class enemies (Shieldbearer, Sniper, Rocketeer, Machine Gunner, Flamethrower, Boss Guard)',
  '{haavk special}':
    'Haavk special class enemies (Shieldbearer, Sniper, Machine Gunner, or Flamethrower)',
  '{green}': '<div class="quality-indicator green"></div>',
  '{blue}': '<div class="quality-indicator blue"></div>',
  '{purple}': '<div class="quality-indicator purple"></div>',
  '{gold}': '<div class="quality-indicator gold"></div>',
  '{red}': '<div class="quality-indicator red"></div>',
  '{common}': '<div class="quality-indicator green"></div>',
  '{rare}': '<div class="quality-indicator blue"></div>',
  '{epic}': '<div class="quality-indicator purple"></div>',
  '{legendary}': '<div class="quality-indicator gold"></div>',
  '{exotic}': '<div class="quality-indicator red"></div>',
  '{purchase}': '(purchase from the T&E Lab Supply Station)',
};

const missionDescriptionReplacements = (raw: string) => {
  const replaced = Object.entries(replacements)
    .reduce((acc, [from, to]) => {
      let newAcc = acc;
      while (newAcc.includes(from)) {
        newAcc = newAcc.replace(from, to);
      }
      return newAcc;
    }, raw);

  const unhandledPattern = /\{[^}]+}/g;
  if (unhandledPattern.test(replaced)) {
    throw Error(`Unhandled pattern in mission description: ${replaced}`);
  }
  return replaced;
};

export class Mission extends EventEmitter {
  name: string;
  description?: string = undefined;
  children: Mission[];
  private flags: MissionFlags;
  parent: Mission | null = null;
  stars: number = 0;
  locked: boolean = false;
  recompute: () => void = () => {};

  private _completed: boolean = false;

  constructor(name: string,
    children: Mission[] = [],
    flags: MissionFlags = {}) {
    super();
    this.name = name;
    this.children = children;
    this.flags = flags;
  }

  get isMainMission() { return this.flags.type === 'main'; }
  get isSideMission() { return this.flags.type === 'side'; }
  get isDummyMission() { return this.flags.type === 'dummy'; }
  get isComputedMission() { return this.flags.type === 'computed'; }

  get offset() { return this.flags.offset ?? 0; }

  get isRealMission() {
    return this.flags.type === 'main' || this.flags.type === 'side';
  }

  private withCondition(condition: string) {
    this.description = (this.description ?? '') + `\n<div class="condition">❗ ${condition}</div>\n `;
    return this;
  }

  withoutDying() {
    return this.withCondition('If extraction fails during the mission, the mission progress will be reset.');
  }

  inASingleMatch() {
    return this.withCondition('Complete all mission objectives in a single match, or the mission progress will be reset.');
  }

  tourist() {
    return this.withCondition('Must not be equipped with any helmets, weapons, chest rigs or backpacks when entering the match.');
  }

  withoutMeds() {
    return this.withCondition('Must not use any medical items during the match.');
  }

  withoutVest() {
    return this.withCondition('Must not be equipped with any ballistic vests when entering the match.');
  }

  withEntryValue(value: string) {
    return this.withCondition(`Entry gear value must be >=${value} Tekniq Alloys.`);
  }

  objective(objectiveDescription?: string) {
    if (objectiveDescription) {
      const replacedDescription = missionDescriptionReplacements(objectiveDescription);
      this.description = (this.description ? `${this.description}\n- ${replacedDescription}` : `- ${replacedDescription}`);
    }
    return this;
  }

  get completed() {
    return this._completed;
  }

  set completed(value: boolean) {
    if (this._completed !== value) {
      console.log(`Mission "${this.name}" completed state changed to`, value);
      this._completed = value;
      this.emit('completeChange', value);
    }
  }

  setComplete(value: boolean) {
    this.completed = value;
    return this;
  }

  setStars(count: number) {
    this.stars = count;
    return this;
  }

  setLocked(value: boolean) {
    this.locked = value;
    return this;
  }

  private addChild(child: Mission) {
    this.children.push(child);
    child.parent = this;
    return this;
  }

  follows(parent: Mission) {
    parent.addChild(this);
    return this;
  }

  onCompleteChange(handler: (newValue: boolean) => void) {
    this.on('completeChange', handler);
  }
}

export const mainMission = (name: string) => new Mission(name, [], { type: 'main' });

export const sideMission = (name: string, offset?: number) =>
  new Mission(name, [], { type: 'side', offset });

export const computedMission = (name: string, dependencies: Mission[], computeFunction: (self: Mission, dependencies: Mission[]) => boolean) => {
  const mission = new Mission(name, [], { type: 'computed' });
  const recompute = mission.recompute = () => {
    console.log(`Recomputing computed mission "${mission.name}" due to dependency change`);
    dependencies.forEach(d => console.log(`${d.name}: ${d.completed}`));
    const newValue = computeFunction(mission, dependencies);
    console.log(`Computed mission "${mission.name}" new value:`, newValue);
    mission.setComplete(newValue);
  };
  for (const dep of dependencies) {
    dep.onCompleteChange(() => recompute());
  }
  return mission;
};

export const createMissions = (type: 'main' | 'side', namePrefix: string, ...names: string[]) => {
  const constructor = type === 'main' ? mainMission : sideMission;
  const missions = names.map((name) => {
    return constructor(`${namePrefix} - ${name}`);
  });

  for (let i = 1; i < missions.length; i++) {
    missions[i].follows(missions[i - 1]);
  }

  return [missions, missions[0], missions[missions.length - 1]] as const;
};
