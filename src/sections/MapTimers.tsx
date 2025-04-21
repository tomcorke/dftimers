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
  const hours = Math.floor(adjustedSecondsFromMidnight / 3600);
  const minutes = Math.floor((adjustedSecondsFromMidnight % 3600) / 60);
  const seconds = adjustedSecondsFromMidnight % 60;
  return (
    <span>
      {hours.toString().padStart(2, "0")}:{minutes.toString().padStart(2, "0")}
      {withSeconds ? `:${seconds.toString().padStart(2, "0")}` : ""}
    </span>
  );
};

export const MapTimersSection = () => {
  const [now, setNow] = useState(MapTimer.nowSecondsUTC());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(MapTimer.nowSecondsUTC());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="section MapTimers">
      <h2>Delta Force Timers</h2>
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
    </div>
  );
};
