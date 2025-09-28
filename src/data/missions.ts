import EventEmitter from 'events';
import { missionDescriptionReplacements } from './mission-text-utils';

type MissionType = 'main' | 'side' | 'dummy' | 'computed';

type MissionFlags = { type: MissionType, offset?: number };

export class Mission extends EventEmitter {
  name: string;
  description?: string = undefined;
  children: Mission[];
  type: MissionType;
  offset: number = 0;
  parent: Mission | null = null;
  stars: number = 0;
  locked: boolean = false;
  recompute: () => void = () => {};

  private _completed: boolean = false;

  constructor(name: string,
    children: Mission[] = [],
    flags: MissionFlags) {
    super();
    this.name = name;
    this.children = children;
    this.type = flags.type;
    this.offset = flags.offset ?? 0;
  }

  get isMainMission() { return this.type === 'main'; }
  get isSideMission() { return this.type === 'side'; }
  get isDummyMission() { return this.type === 'dummy'; }
  get isComputedMission() { return this.type === 'computed'; }

  setOffset(value: number) {
    this.offset = value;
    return this;
  }

  get isRealMission() {
    return this.type === 'main' || this.type === 'side';
  }

  withCondition(condition: string) {
    this.description = (this.description ?? '') + `\n<div class="condition">\n\n❗ ${condition}\n\n</div>\n`;
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

  withEquippedItemsOnEntry(...items: string[]) {
    this.withCondition(`Must be equipped with ${items.map(item => missionDescriptionReplacements(item)).join(', ')} when entering the match.`);
    console.log(this.description);
    return this;
  }

  objective(objectiveDescription?: string) {
    if (objectiveDescription) {
      const replacedDescription = missionDescriptionReplacements(objectiveDescription);
      this.description = (this.description ? `${this.description}\n- ${replacedDescription}` : `- ${replacedDescription}`);
    }
    return this;
  }

  objectives(...objectiveDescriptions: string[]) {
    for (const desc of objectiveDescriptions) {
      this.objective(desc);
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

export const createMissions = (type: 'main' | 'side', namePrefix: string, ...missionsOrNames: (string | Mission)[]) => {
  const constructor = type === 'main' ? mainMission : sideMission;
  const missions = missionsOrNames.map((m) => {
    if (m instanceof Mission) {
      m.name = `${namePrefix} - ${m.name}`;
      return m;
    }
    return constructor(`${namePrefix} - ${m}`);
  });

  for (let i = 1; i < missions.length; i++) {
    missions[i].follows(missions[i - 1]);
  }

  return [missions, missions[0], missions[missions.length - 1]] as const;
};
