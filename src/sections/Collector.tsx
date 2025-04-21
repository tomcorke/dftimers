import { use, useEffect, useState } from "react";

import { MAP_TIMERS, MapTimer } from "./timers/map-timer";
import classNames from "classnames";

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
    new CollectorItem("Magazine", "rare", 2),
    new CollectorItem("Wooden Pipe", "rare", 2),
    new CollectorItem("Intel Document", "rare", 5),
    new CollectorItem("Portable Speaker", "epic", 2),
  ]),
  new CollectorMission("Collector 2", [
    new CollectorItem("Artificial Knee", "epic", 1),
    new CollectorItem("Implantable Defibrillator", "legendary", 1),
    new CollectorItem("Microscope", "rare", 3),
    new CollectorItem("Centrifuge", "epic", 1),
    new CollectorItem("Blood Pressure Monitor", "epic", 2),
  ]),
  new CollectorMission("Collector 3", [
    new CollectorItem("Thermometer", "uncommon", 5),
    new CollectorItem("Military Binoculars", "legendary", 3),
    new CollectorItem("something", "exotic", 3),
    new CollectorItem("something else", "exotic", 2),
    new CollectorItem("Ceremonial Knife", "epic", 2),
  ]),
  new CollectorMission("Collector 4", [
    new CollectorItem("Lamp", "epic", 3),
    new CollectorItem("Hookah", "epic", 3),
    new CollectorItem("Cup", "legendary", 2),
    new CollectorItem("Teapot", "epic", 3),
    new CollectorItem("Pot", "uncommon", 3),
    new CollectorItem("LEDX", "legendary", 2),
  ]),
  new CollectorMission("Collector 5", [
    new CollectorItem("Earring", "epic", 1),
    new CollectorItem("Router", "epic", 2),
    new CollectorItem("EV Battery", "epic", 2),
    new CollectorItem("SLR Camera", "legendary", 2),
    new CollectorItem("Military Thingy", "legendary", 1),
  ]),
  new CollectorMission("Collector 6", [
    new CollectorItem("Smoothbore", "exotic", 1),
    new CollectorItem("Radio", "legendary", 2),
    new CollectorItem("Digital Camera", "legendary", 1),
  ]),
];

export const CollectorSection = () => {
  return (
    <div className="section Collector">
      <h2>Collector</h2>
      {COLLECTOR_MISSIONS.map((mission) => {
        return (
          <div className="mission" key={mission.name}>
            <h3>{mission.name}</h3>
            <div className="items">
              {mission.items.map((item) => {
                return (
                  <div
                    className={classNames("item", item.quality)}
                    key={`${mission.name}_${item.name}`}
                  >
                    <div className="name">{item.name}</div>
                    <div className="progress">
                      {item.progressString} ({item.progressPercent}%)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
