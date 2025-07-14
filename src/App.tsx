import { use, useEffect, useState } from "react";
import "./App.css";

import classNames from "classnames";
import { MapTimersSection } from "./sections/MapTimerDisplay";
import {
  CollectorMissionContextProvider,
  CollectorSection,
} from "./sections/CollectorDisplay";
import KoFi from "./components/KoFi";
import {
  MissionTreeContextProvider,
  MissionTreeSection,
} from "./sections/MissionTreeDisplay";

const App = () => {
  return (
    <div className={"App"}>
      <div className="sections">
        <CollectorMissionContextProvider>
          <CollectorSection />
        </CollectorMissionContextProvider>
        <MapTimersSection />
        <MissionTreeContextProvider>
          <MissionTreeSection />
        </MissionTreeContextProvider>
      </div>
      <KoFi />
    </div>
  );
};

export { App };
