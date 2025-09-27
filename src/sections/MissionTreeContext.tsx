import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { ROOT_MISSION } from '../data/missions-wildfire';
import { Mission } from '../data/missions';
import { z } from 'zod';

const loadMissionsByName = () => {
  const allMissions: Mission[] = [];
  const missionQueue: Mission[] = [ROOT_MISSION];
  while (missionQueue.length > 0) {
    const mission = missionQueue.shift()!;
    allMissions.push(mission);
    missionQueue.push(...mission.children);
  }
  return Object.fromEntries(
    allMissions.map(m => [m.name, m]),
  );
};

const storageSchema = z.record(z.string(), z.boolean());
const loadMissionStates = (missionsByName: Record<string, Mission>) => {
  const baseState: Record<string, boolean> = {};

  const missionQueue: Mission[] = [ROOT_MISSION];
  let missionCount = 0;
  while (missionQueue.length > 0) {
    const mission = missionQueue.shift()!;
    baseState[mission.name] = false; // Initialize all missions as not completed
    missionQueue.push(...mission.children);
    missionCount++;
  }

  console.log(`Loaded ${missionCount} missions from data into state.`);

  try {
    const storedState = localStorage.getItem('missions') || '{}';
    const parsedState = storageSchema.safeParse(JSON.parse(storedState));
    if (parsedState.success) {
      for (const [missionName, completed] of Object.entries(parsedState.data)) {
        if (Object.prototype.hasOwnProperty.call(baseState, missionName)) {
          const mission = missionsByName[missionName];
          if (mission && mission.completed !== completed) {
            mission.setComplete(completed);
            baseState[missionName] = completed;
          }
        }
        else {
          console.warn(`Unknown mission "${missionName}" in stored state.`);
        }
      }
    }
    else {
      console.error('Invalid stored state', parsedState.error);
    }
  }
  catch (error) {
    console.error('Error loading mission states', error);
  }
  return baseState;
};

export const MissionTreeContext = createContext<{
  missionsByName: Record<string, Mission>
}>({
  missionsByName: {},
});

export const MissionTreeContextProvider = ({
  children,
}: PropsWithChildren<object>) => {
  const [missionsByName] = useState<Record<string, Mission>>(() => loadMissionsByName());
  const [missionStates, setMissionStates] = useState<Record<string, boolean>>(() => loadMissionStates(missionsByName));

  useEffect(() => {
    console.log('re-running computed mission states');
    // Trigger recomputation of all computed missions
    for (const mission of Object.values(missionsByName)) {
      if (mission.isComputedMission) {
        mission.recompute();
      }
    }

    console.log('setting onCompleteChange handlers');
    for (const mission of Object.values(missionsByName)) {
      mission.onCompleteChange((value) => {
        setMissionStates(prev => ({ ...prev, [mission.name]: value }));
      });
    }
  }, []);

  useEffect(() => {
    console.log('saving mission states', missionStates);
    localStorage.setItem('missions', JSON.stringify(missionStates));
  }, [missionStates]);

  return (
    <MissionTreeContext.Provider value={{ missionsByName }}>
      {children}
    </MissionTreeContext.Provider>
  );
};
