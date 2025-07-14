import {
  createContext,
  JSX,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { Mission, ROOT_MISSION } from "./data/missions";
import "./MissionTree.css";

import classNames from "classnames";
import { z } from "zod";

// traverse through missions and dump them into rows

// starting with the root mission, find the next main mission and add it to the same row
// then find side missions and add them to rows above and below

let maxDepth = -1;
type MissionEntry = { mission: Mission; depth: number };
type Row = { missions: MissionEntry[] };

const rows: Row[] = [];

const getOrCreateOffsetRow = (
  fromRow: Row,
  offset: number,
  depth: number
): Row => {
  const fromIndex = rows.indexOf(fromRow);
  const index = fromIndex + offset;
  if (index < 0) {
    const newRow: Row = { missions: [] };
    rows.unshift(newRow);
    return newRow;
  } else {
    if (index >= rows.length) {
      const newRow: Row = { missions: [] };
      rows.push(newRow);
      return newRow;
    } else {
      const existingRow = rows[index];
      return existingRow;
    }
  }
};

const mainRow: Row = { missions: [] };
rows.push(mainRow);

const sideMissionOffsets: number[] = [-1, 1, -2, 2, -3, 3];
const visitMission = (mission: Mission, row: Row, depth: number) => {
  maxDepth = Math.max(maxDepth, depth);
  row.missions.push({ mission, depth });
  if (mission.flags.main) {
    // If this is a main mission, get the next main mission and traverse it in the same row
    const nextMainMission = mission.children.find((m) => m.flags.main);
    if (nextMainMission) {
      visitMission(nextMainMission, row, depth + 1);
    }
    // Visit side missions
    const sideMissions = mission.children.filter((m) => !m.flags.main);
    sideMissions.forEach((sideMission, index) => {
      const offset =
        sideMission.flags.offset ??
        sideMissionOffsets[index % sideMissionOffsets.length];
      const sideRow = getOrCreateOffsetRow(row, offset, depth);
      visitMission(sideMission, sideRow, depth + 1);
    });
  } else {
    // Expect non-main missions to have only one child
    if (mission.children.length > 1) {
      console.warn(
        `Non-main mission "${mission.name}" has more than one child, which is unexpected.`
      );
    }
    const nextMission = mission.children[0];
    if (nextMission) {
      visitMission(nextMission, row, depth + 1);
    }
  }
};

visitMission(ROOT_MISSION, mainRow, 0);

const storageSchema = z.record(z.string(), z.boolean());
const loadMissionStates = () => {
  const baseState: Record<string, boolean> = {};

  let missionQueue: Mission[] = [ROOT_MISSION];
  while (missionQueue.length > 0) {
    const mission = missionQueue.shift()!;
    baseState[mission.name] = false; // Initialize all missions as not completed
    missionQueue.push(...mission.children);
  }

  try {
    const storedState = localStorage.getItem("missions") || "{}";
    const parsedState = storageSchema.safeParse(JSON.parse(storedState));
    if (parsedState.success) {
      for (const [missionName, completed] of Object.entries(parsedState.data)) {
        if (baseState.hasOwnProperty(missionName)) {
          baseState[missionName] = completed;
        } else {
          console.warn(`Unknown mission "${missionName}" in stored state.`);
        }
      }
    } else {
      console.error("Invalid stored state", parsedState.error);
    }
  } catch (error) {
    console.error("Error loading mission states", error);
  }
  return baseState;
};

const MissionTreeContext = createContext<{
  missionStates: Record<string, boolean>;
  setMissionState: (missionName: string, completed: boolean) => void;
}>({
  missionStates: {},
  setMissionState: () => {},
});

export const MissionTreeContextProvider = ({
  children,
}: PropsWithChildren<{}>) => {
  const [missionStates, setMissionStates] = useState<Record<string, boolean>>(
    loadMissionStates()
  );

  const setMissionState = (missionName: string, completed: boolean) => {
    setMissionStates((prev) => ({
      ...prev,
      [missionName]: completed,
    }));
  };

  useEffect(() => {
    localStorage.setItem("missions", JSON.stringify(missionStates));
  }, [missionStates]);

  return (
    <MissionTreeContext.Provider value={{ missionStates, setMissionState }}>
      {children}
    </MissionTreeContext.Provider>
  );
};

export const MissionTreeSection = () => {
  const { missionStates, setMissionState } = useContext(MissionTreeContext);

  const elementRows = rows.map((row) => [] as JSX.Element[]);

  for (let i = 0; i <= maxDepth; i++) {
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex];
      const missionEntry = row.missions.find((m) => m.depth === i);
      if (missionEntry) {
        const isCompleted = missionStates[missionEntry.mission.name] || false;
        elementRows[rowIndex].push(
          <div
            className={classNames("mission", {
              isCompleted,
              isBranch:
                !missionEntry.mission.flags.main &&
                missionEntry.mission.parent?.flags.main,
            })}
            key={`${rowIndex}_${i}`}
            onClick={() => {
              setMissionState(missionEntry.mission.name, !isCompleted);
            }}
          >
            {missionEntry.mission.name}
          </div>
        );
      } else {
        elementRows[rowIndex].push(
          <div className="mission empty" key={`${rowIndex}_${i}`}></div>
        );
      }
    }
  }

  return (
    <div className="MissionTree">
      {elementRows.map((row, index) => (
        <div className="row" key={index}>
          {row}
        </div>
      ))}
    </div>
  );
};
