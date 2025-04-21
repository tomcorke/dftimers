import { use, useEffect, useState } from "react";
import "./App.css";

import classNames from "classnames";
import { MapTimersSection } from "./sections/MapTimers";
import { CollectorSection } from "./sections/Collector";

const DateTimeDisplay = ({
  secondsFromMidnight,
  withSeconds = false,
}: {
  secondsFromMidnight: number;
  withSeconds?: boolean;
}) => {
  let hours = Math.floor(secondsFromMidnight / 3600);
  if (hours >= 24) {
    hours -= 24;
  }
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
  return (
    <div className={"App"}>
      <div className="sections">
        <MapTimersSection />
        {/* <CollectorSection /> */}
      </div>
    </div>
  );
};

export { App };
