import { use, useEffect, useState } from "react";
import "./App.css";

import classNames from "classnames";
import { MapTimersSection } from "./sections/MapTimerDisplay";
import {
  CollectorMissionContextProvider,
  CollectorSection,
} from "./sections/CollectorDisplay";
import KoFi from "./components/KoFi";

const App = () => {
  return (
    <div className={"App"}>
      <div className="sections">
        <CollectorMissionContextProvider>
          <CollectorSection />
        </CollectorMissionContextProvider>
        <MapTimersSection />
      </div>
      <KoFi />
    </div>
  );
};

export { App };
