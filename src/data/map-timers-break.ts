import { MapTimer, MapTimerDef } from './map-timers';

export const MAP_TIMERS_BREAK: MapTimerDef = {
  title: 'Season 6: Wildfire',
  timers: [
    new MapTimer('Zero Dam: Normal', [{ startHour: 0, endHour: 24 }]),
    new MapTimer('Layali Grove: Normal', [{ startHour: 0, endHour: 24 }]),
    new MapTimer('Space City: Normal', [
      [0, 2],
      [4, 6],
      [10, 14],
      [16, 18],
      [22, 24],
    ]),
    new MapTimer('Space City: Hard', [
      [2, 4],
      [6, 8],
      [10, 12],
      [14, 16],
      [18, 20],
      [22, 24],
    ]),
    new MapTimer('Brakkesh: Normal', [
      [2, 4],
      [8, 10],
      [14, 16],
      [20, 22],
    ]),
    new MapTimer('Zero Dam: Night', [
      [6, 8],
      [18, 20],
    ]),
    new MapTimer('Tide Prison: Hard', [
      [0, 2],
      [4, 6],
      [8, 10],
      [12, 14],
      [16, 18],
      [20, 22],
    ]),
  ] };
