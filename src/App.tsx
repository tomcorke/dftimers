import './App.css';

import { MapTimersSection } from './sections/MapTimerDisplay';
// import {
//   CollectorMissionContextProvider,
//   CollectorSection,
// } from './sections/CollectorDisplay';
import KoFi from './components/KoFi';
// import {
//   MissionTreeContextProvider,
//   MissionTreeSection,
// } from './sections/MissionTreeDisplay';
import { Metadata } from './components/Metadata';

const App = () => {
  return (
    <div className="App">
      <div className="sections">
        {/* <CollectorMissionContextProvider>
          <CollectorSection />
        </CollectorMissionContextProvider> */}
        <MapTimersSection />
        {/* <MissionTreeContextProvider>
          <MissionTreeSection />
        </MissionTreeContextProvider> */}
      </div>
      <Metadata />
      <KoFi />
    </div>
  );
};

export { App };
