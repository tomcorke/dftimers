import { use, useEffect, useState } from "react";
import "./App.css";

import { MAP_TIMERS, MapTimer } from "./timers/map-timer";
import classNames from "classnames";

const DateTimeDisplay = ({
  secondsFromMidnight,
  withSeconds = false,
}: {
  secondsFromMidnight: number;
  withSeconds?: boolean;
}) => {
  const hours = Math.floor(secondsFromMidnight / 3600);
  const minutes = Math.floor((secondsFromMidnight % 3600) / 60);
  const seconds = secondsFromMidnight % 60;
  return (
    <span>
      {hours.toString().padStart(2, "0")}:{minutes.toString().padStart(2, "0")}
      {withSeconds ? `:${seconds.toString().padStart(2, "0")}` : ""}
    </span>
  );
};

const App = () => {
  const [now, setNow] = useState(MapTimer.nowSeconds());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(MapTimer.nowSeconds());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={"App"}>
      <h1>Delta Force Timers</h1>
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
              <h2>
                {timer.name}
                {isLive ? " (LIVE)" : ""}
              </h2>
              <div className={"time"}>
                {isLive ? "Current" : "Next"}:{" "}
                <DateTimeDisplay
                  secondsFromMidnight={timer.nextOrCurrentTimeSpanStartSeconds(
                    now
                  )}
                />{" "}
                -{" "}
                <DateTimeDisplay
                  secondsFromMidnight={timer.nextOrCurrentTimeSpanEndSeconds(
                    now
                  )}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { App };
