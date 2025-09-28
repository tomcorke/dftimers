import './App.css';

import { MapTimersSection } from './sections/MapTimerDisplay';
// import {
//   CollectorMissionContextProvider,
//   CollectorSection,
// } from './sections/CollectorDisplay';
import KoFi from './components/KoFi';
import {
  MissionTreeSection,
} from './sections/MissionTreeDisplay';
import { Metadata } from './components/Metadata';
import { MissionTreeContextProvider } from './sections/MissionTreeContext';
import { OtherProjects } from './components/OtherProjects';

const App = () => {
  return (
    <div className="App">
      <div className="sections">
        {/* <CollectorMissionContextProvider>
          <CollectorSection />
        </CollectorMissionContextProvider> */}
        <MapTimersSection />
        <MissionTreeContextProvider>
          <MissionTreeSection />
        </MissionTreeContextProvider>
      </div>
      <Metadata />
      <OtherProjects />
      <KoFi />
    </div>
  );
};

export { App };
