import { use, useEffect, useState } from "react";

import { MAP_TIMERS, MapTimer } from "./timers/map-timer";
import classNames from "classnames";

const DateTimeDisplay = ({
  secondsFromMidnight,
  withSeconds = false,
  withOffset = true,
}: {
  secondsFromMidnight: number;
  withSeconds?: boolean;
  withOffset?: boolean;
}) => {
  const offsetHours = withOffset ? MapTimer.offsetHours() : 0;
  const adjustedSecondsFromMidnight = secondsFromMidnight - offsetHours * 3600;
  let hours = Math.floor(adjustedSecondsFromMidnight / 3600);
  if (hours >= 24) {
    hours -= 24;
  }
  const minutes = Math.floor((adjustedSecondsFromMidnight % 3600) / 60);
  const seconds = adjustedSecondsFromMidnight % 60;
  return (
    <span>
      {hours.toString().padStart(2, "0")}:{minutes.toString().padStart(2, "0")}
      {withSeconds ? `:${seconds.toString().padStart(2, "0")}` : ""}
    </span>
  );
};

const HOURS = Array.from({ length: 24 }, (_, i) => i);

// Abbreviate names like so:
// "Space City: Normal" -> "SC: Normal"
const abbreviate = (name: string) => {
  const parts = name.split(":");
  if (parts.length > 1) {
    const firstPart = parts[0].trim();
    const secondPart = parts[1].trim();
    const firstPartAbbr = firstPart
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
    return `${firstPartAbbr}: ${secondPart}`;
  }
  return name;
};

export const MapTimersSection = () => {
  const [now, setNow] = useState(MapTimer.nowSecondsUTC());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(MapTimer.nowSecondsUTC());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const currentHour = Math.floor(now / 3600);

  return (
    <div className="section MapTimers">
      <h2>Map Timers</h2>
      <div className="currentTime">
        Current Time:{" "}
        <DateTimeDisplay secondsFromMidnight={now} withSeconds={true} />
      </div>

      <div className={"timers"}>
        {MAP_TIMERS.map((timer) => {
          const isLive = timer.isLive();
          return (
            <div
              key={timer.name}
              className={classNames("timer", { live: isLive })}
            >
              <h3>
                {timer.name}
                {isLive ? " (LIVE)" : ""}
              </h3>
              <div className={"time"}>
                {isLive ? "Current" : "Next"}:{" "}
                <DateTimeDisplay
                  secondsFromMidnight={timer.nextOrCurrentTimeSpanStartSeconds(
                    now
                  )}
                  withOffset={true}
                />{" "}
                -{" "}
                <DateTimeDisplay
                  secondsFromMidnight={timer.nextOrCurrentTimeSpanEndSeconds(
                    now
                  )}
                  withOffset={true}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="timeline">
        <div></div>
        {HOURS.map((hour) => {
          return (
            <div
              key={hour}
              className={classNames("hour-key", {
                live: hour === currentHour,
              })}
            >
              {hour}
            </div>
          );
        })}
        {MAP_TIMERS.map((timer) => {
          return [
            <div key={`${timer.name}_name`} className="name">
              {abbreviate(timer.name)}
            </div>,
            HOURS.map((hour) => {
              const simTime = hour * 3600;
              const isLive = timer.isLive(simTime);
              return (
                <div
                  key={`${timer.name}_hour_${hour}`}
                  data-hour={hour}
                  data-sim-time={simTime}
                  data-current-hour={currentHour}
                  className={classNames("hour", { live: isLive })}
                />
              );
            }),
          ];
        })}
      </div>
    </div>
  );
};
