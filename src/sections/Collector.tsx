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

import { MAP_TIMERS, MapTimer } from "./timers/map-timer";
import classNames from "classnames";
import { z } from "zod";

type Quality = "common" | "uncommon" | "rare" | "epic" | "legendary" | "exotic";

const IMAGES = {
  magazine: new URL(
    "../images/magazine.png?as=webp&width=100&height=100",
    import.meta.url
  ).href,
};

class CollectorItem {
  name: string;
  quality: Quality;
  needed: number;
  collected: number;
  constructor(
    name: string,
    quality: Quality,
    needed: number,
    collected: number = 0
  ) {
    this.name = name;
    this.quality = quality;
    this.needed = needed;
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

const COLLECTOR_MISSIONS = [
  new CollectorMission("Collector 1", [
    new CollectorItem("Ahsarah Fashion Weekly", "rare", 2),
    new CollectorItem("Wooden Carved Pipe", "rare", 2),
    new CollectorItem("Intel Document", "rare", 5),
    new CollectorItem("Portable Speaker", "epic", 2),
  ]),
  new CollectorMission("Collector 2", [
    new CollectorItem("Artificial Knee Joint", "epic", 1),
    new CollectorItem("Implantable Defibrillator", "legendary", 1),
    new CollectorItem("Electron Microscope", "rare", 3),
    new CollectorItem("Centrifuge", "epic", 1),
    new CollectorItem("Blood Pressure Meter", "epic", 2),
  ]),
  new CollectorMission("Collector 3", [
    new CollectorItem("Analog Thermometer", "uncommon", 5),
    new CollectorItem("Military Binoculars", "legendary", 3),
    new CollectorItem("Biochemical Incubator", "epic", 3),
    new CollectorItem("Heart Stent", "legendary", 2),
    new CollectorItem("Ceremonial Knife", "epic", 2),
  ]),
  new CollectorMission("Collector 4", [
    new CollectorItem("Ahsarah Specialty Lantern", "epic", 3),
    new CollectorItem("Ahsarah Glamour Hookah", "epic", 3),
    new CollectorItem("Ahsarah Specialty Wine Cup", "legendary", 2),
    new CollectorItem("Ahsarah Specialty Flask", "epic", 3),
    new CollectorItem("Ahsarah Specialty Ceramics", "uncommon", 3),
    new CollectorItem("LEDX", "legendary", 2),
  ]),
  new CollectorMission("Collector 5", [
    new CollectorItem("Empress Earring", "epic", 1),
    new CollectorItem("Encrypted Router", "epic", 2),
    new CollectorItem("EV Battery", "epic", 2),
    new CollectorItem("SLR Camera", "legendary", 2),
    new CollectorItem("Military Trajectory Computer", "legendary", 1),
  ]),
  new CollectorMission("Collector 6", [
    new CollectorItem("Smoothbore Gun Exhibit", "exotic", 1),
    new CollectorItem("Satellite Phone", "legendary", 2),
    new CollectorItem("Digital Camera", "legendary", 1),
  ]),
];

const Button = ({
  onClick,
  disabled,
  className,
  children,
}: PropsWithChildren<{
  className: string;
  onClick: () => void;
  disabled: boolean;
}>) => {
  return (
    <div
      className={classNames(className, { disabled })}
      onClick={() => {
        if (!disabled) {
          onClick();
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
  onClick: () => void;
  disabled: boolean;
}) => {
  return (
    <Button className="button add" onClick={onClick} disabled={disabled}>
      +
    </Button>
  );
};

const RemoveButton = ({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled: boolean;
}) => {
  return (
    <Button className="button remove" onClick={onClick} disabled={disabled}>
      −
    </Button>
  );
};

const storageSchema = z.record(z.string(), z.record(z.string(), z.number()));

const loadCollectorMissionStates = () => {
  const baseState = COLLECTOR_MISSIONS;
  try {
    const storedState = localStorage.getItem("collector") || "{}";
    const parsedState = storageSchema.safeParse(JSON.parse(storedState));
    if (parsedState.success) {
      const collectorMissions = COLLECTOR_MISSIONS.map((mission) => {
        const items = mission.items.map((item) => {
          const storedItem = parsedState.data[mission.name]?.[item.name];
          return new CollectorItem(
            item.name,
            item.quality,
            item.needed,
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
          acc[mission.name] = mission.items.reduce((acc, item) => {
            acc[item.name] = item.collected;
            return acc;
          }, {} as Record<string, number>);
          return acc;
        }, {} as Record<string, Record<string, number>>)
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

const CollectorMissionDisplay = ({
  missionIndex,
}: {
  missionIndex: number;
}) => {
  const { collectorMissionStates, updateCollectorMission } = useContext(
    CollectorMissionContext
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

  return (
    <div className="mission">
      <h3>{mission.name}</h3>
      <div className="items">
        {mission.items.map((item, itemIndex) => {
          return (
            <div
              className={classNames("item", item.quality)}
              key={`${mission.name}_${item.name}`}
            >
              <div className="name">{item.name}</div>
              <div className="progress">
                {item.progressString} ({item.progressPercent}%)
              </div>
              <div className="buttons">
                <AddButton
                  onClick={() =>
                    updateMissionItem(itemIndex, item.collected + 1)
                  }
                  disabled={item.collected >= item.needed}
                />
                <RemoveButton
                  onClick={() =>
                    updateMissionItem(itemIndex, item.collected - 1)
                  }
                  disabled={item.collected <= 0}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const CollectorSection = () => {
  const { collectorMissionStates } = useContext(CollectorMissionContext);

  return (
    <div className="section Collector">
      <h2>Collector</h2>
      {collectorMissionStates.map((mission, missionIndex) => {
        return (
          <CollectorMissionDisplay
            key={mission.name}
            missionIndex={missionIndex}
          />
        );
      })}
    </div>
  );
};
