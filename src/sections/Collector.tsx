import {
  createContext,
  PropsWithChildren,
  use,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import update from "immutability-helper";

import "./Collector.css";

import { MAP_TIMERS, MapTimer } from "./timers/map-timer";
import classNames from "classnames";
import { z } from "zod";
import { useStoredState } from "../helpers/useStoredState";

type Quality = "common" | "uncommon" | "rare" | "epic" | "legendary" | "exotic";

class CollectorItem {
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

class CollectorMission {
  name: string;
  items: CollectorItem[];
  constructor(name: string, items: CollectorItem[]) {
    this.name = name;
    this.items = items;
  }
}

const SEASON_ID = "Season 5";

const COLLECTOR_MISSIONS = [
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

type ButtonOnClickProps = {
  shift: boolean;
};

const Button = ({
  onClick,
  disabled,
  className,
  children,
}: PropsWithChildren<{
  className: string;
  onClick: (props: ButtonOnClickProps) => void;
  disabled: boolean;
}>) => {
  return (
    <div
      className={classNames("button", className, { disabled })}
      onClick={(e) => {
        if (!disabled) {
          onClick({ shift: e.shiftKey });
        }
      }}
    >
      <span>{children}</span>
    </div>
  );
};

const AddButton = ({
  onClick,
  disabled,
}: {
  onClick: (props: ButtonOnClickProps) => void;
  disabled: boolean;
}) => {
  return (
    <Button className="add" onClick={onClick} disabled={disabled}>
      +
    </Button>
  );
};

const RemoveButton = ({
  onClick,
  disabled,
}: {
  onClick: (props: ButtonOnClickProps) => void;
  disabled: boolean;
}) => {
  return (
    <Button className="remove" onClick={onClick} disabled={disabled}>
      −
    </Button>
  );
};

const oldStorageSchema = z.record(z.string(), z.record(z.string(), z.number()));
const newFlatStorageSchema = z.record(z.string(), z.number());

const storageSchema = oldStorageSchema.or(newFlatStorageSchema);

const getComplexItemKey = (missionName: string, itemName: string) => {
  return `${SEASON_ID}_${missionName}_${itemName}`.replace(/\s+/g, "_");
};

const ensureNewStorageFormat = (
  data: z.infer<typeof storageSchema>
): z.infer<typeof newFlatStorageSchema> => {
  const oldParsedData = oldStorageSchema.safeParse(data);
  if (oldParsedData.success) {
    // Convert old format to new flat format
    const newData: Record<string, number> = {};
    for (const [missionName, items] of Object.entries(oldParsedData.data)) {
      for (const [itemName, collected] of Object.entries(items)) {
        const complexItemKey = getComplexItemKey(missionName, itemName);
        newData[complexItemKey] = collected;
      }
    }
    return newData;
  }
  return data as z.infer<typeof newFlatStorageSchema>;
};

const loadCollectorMissionStates = () => {
  const baseState = COLLECTOR_MISSIONS;
  try {
    const storedState = localStorage.getItem("collector") || "{}";
    const parsedState = storageSchema.safeParse(JSON.parse(storedState));
    if (parsedState.success) {
      const newParsedData = ensureNewStorageFormat(parsedState.data);

      const collectorMissions = COLLECTOR_MISSIONS.map((mission) => {
        const items = mission.items.map((item) => {
          const itemKey = getComplexItemKey(mission.name, item.name);
          const storedItem = newParsedData[itemKey];
          return new CollectorItem(
            item.name,
            item.quality,
            item.needed,
            item.newThisSeason,
            item.requiresExtraction,
            storedItem || 0
          );
        });
        return new CollectorMission(mission.name, items);
      });
      return collectorMissions;
    } else {
      console.error("Invalid stored state", parsedState.error);
      return baseState;
    }
  } catch (e) {
    console.error(e);
    return baseState;
  }
};

const CollectorMissionContext = createContext<{
  collectorMissionStates: CollectorMission[];
  updateCollectorMission: (
    missionIndex: number,
    newMissionState: CollectorMission
  ) => void;
}>({
  collectorMissionStates: [],
  updateCollectorMission: () => {},
});

export const CollectorMissionContextProvider = ({
  children,
}: PropsWithChildren<{}>) => {
  const [collectorMissionStates, setCollectorMissionStates] = useState(
    loadCollectorMissionStates()
  );

  useEffect(() => {
    localStorage.setItem(
      "collector",
      JSON.stringify(
        collectorMissionStates.reduce((acc, mission) => {
          return {
            ...acc,
            ...mission.items.reduce((missionAcc, item) => {
              const itemKey = getComplexItemKey(mission.name, item.name);
              return { ...missionAcc, [itemKey]: item.collected };
            }, {} as Record<string, number>),
          };
        }, {} as Record<string, number>)
      )
    );
  }, [collectorMissionStates]);

  const updateCollectorMission = useCallback(
    (missionIndex: number, newMissionState: CollectorMission) => {
      setCollectorMissionStates((prevState) =>
        update(prevState, {
          [missionIndex]: { $set: newMissionState },
        })
      );
    },
    []
  );

  return (
    <CollectorMissionContext.Provider
      value={{ collectorMissionStates, updateCollectorMission }}
    >
      {children}
    </CollectorMissionContext.Provider>
  );
};

const NewThisSeasonIndicator = () => {
  return <div className="newThisSeason">✦</div>;
};

const RequiresExtractionIndicator = () => {
  return <div className="requiresExtraction">✦</div>;
};

const CollectorMissionDisplay = ({
  missionIndex,
}: {
  missionIndex: number;
}) => {
  const { collectorMissionStates, updateCollectorMission } = useContext(
    CollectorMissionContext
  );
  const [minimised, setMinimised] = useStoredState(
    `collector_mission_minimised__${missionIndex}`,
    false,
    z.boolean()
  );

  const mission = collectorMissionStates[missionIndex];

  const updateMissionItem = useCallback(
    (itemIndex: number, newValue: number) => {
      const newMissionState = update(mission, {
        items: { [itemIndex]: { collected: { $set: newValue } } },
      });
      updateCollectorMission(missionIndex, newMissionState);
    },
    [mission, missionIndex, updateCollectorMission]
  );

  const missionComplete = mission.items.every(
    (item) => item.collected >= item.needed
  );

  useEffect(() => {
    if (missionComplete && !minimised) {
      setMinimised(true);
    }
  }, [missionComplete]);

  return (
    <div
      className={classNames("mission", {
        complete: missionComplete,
        minimised,
      })}
    >
      <div className="header">
        <h3>
          {mission.name}
          {missionComplete ? " (COMPLETE)" : ""}
        </h3>
        <Button
          className="toggle"
          onClick={() => setMinimised(!minimised)}
          disabled={false}
        >
          {minimised ? "+" : "−"}
        </Button>
      </div>
      {minimised ? null : (
        <div className="items">
          {mission.items.map((item, itemIndex) => {
            return (
              <div
                className={classNames("item", item.quality, {
                  complete: item.collected >= item.needed,
                })}
                key={`${mission.name}_${item.name}`}
              >
                <div className="name">
                  {item.name}
                  {item.newThisSeason ? <NewThisSeasonIndicator /> : null}
                  {item.requiresExtraction ? (
                    <RequiresExtractionIndicator />
                  ) : null}
                </div>
                <div className="progress">{item.progressString}</div>
                <div className="buttonGroup">
                  <AddButton
                    onClick={({ shift }) =>
                      updateMissionItem(
                        itemIndex,
                        shift ? item.needed : item.collected + 1
                      )
                    }
                    disabled={item.collected >= item.needed}
                  />
                  <RemoveButton
                    onClick={({ shift }) =>
                      updateMissionItem(
                        itemIndex,
                        shift ? 0 : item.collected - 1
                      )
                    }
                    disabled={item.collected <= 0}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const CollectorSection = () => {
  const { collectorMissionStates } = useContext(CollectorMissionContext);

  const [minimised, setMinimised] = useStoredState(
    `collector_section_minimised`,
    false,
    z.boolean()
  );

  const anyNewSeasonItems = useMemo(() => {
    return collectorMissionStates.some((mission) =>
      mission.items.some((item) => item.newThisSeason)
    );
  }, [collectorMissionStates]);
  const anyItemRequiresExtraction = useMemo(() => {
    return collectorMissionStates.some((mission) =>
      mission.items.some((item) => item.requiresExtraction)
    );
  }, [collectorMissionStates]);

  return (
    <div className="section Collector">
      <div className="header">
        <h2>Collector</h2>
        <Button
          className="toggle"
          onClick={() => setMinimised(!minimised)}
          disabled={false}
        >
          {minimised ? "+" : "−"}
        </Button>
      </div>
      {minimised ? null : (
        <>
          <div className="missions">
            {collectorMissionStates.map((mission, missionIndex) => {
              return (
                <CollectorMissionDisplay
                  key={mission.name}
                  missionIndex={missionIndex}
                />
              );
            })}
          </div>
          <div className="legend">
            {anyNewSeasonItems ? (
              <div>
                <NewThisSeasonIndicator /> New items this season
              </div>
            ) : null}
            {anyItemRequiresExtraction ? (
              <div>
                <RequiresExtractionIndicator /> Requires extraction with item,
                not submission of unbound item
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
};
