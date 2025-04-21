import { use, useEffect, useState } from "react";
import "./App.css";

import classNames from "classnames";
import { MapTimersSection } from "./sections/MapTimers";
import { CollectorSection } from "./sections/Collector";

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
