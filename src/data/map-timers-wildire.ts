import { MapTimer, MapTimerDef } from './map-timers';

const day = 24;

export const MAP_TIMERS_WILDFIRE: MapTimerDef = {
  title: 'Season 6: Wildfire',
  timers: [
    new MapTimer('Zero Dam: Normal', [{ startHour: 0, endHour: 24 }]),
    new MapTimer('Layali Grove: Normal', [{ startWeekHour: 5 * day, endWeekHour: 8 * day }]),
    new MapTimer('Brakkesh: Normal', [
      [2, 4],
      [6, 8],
      [10, 12],
      [14, 16],
      [18, 20],
      [22, 24],
    ]),
    new MapTimer('Space City: Normal', [
      [0, 2],
      [4, 6],
      [8, 10],
      [12, 14],
      [16, 18],
      [20, 22],
    ]),
    new MapTimer('Space City: Hard', [
      [2, 4],
      [6, 8],
      [10, 12],
      [14, 16],
      [18, 20],
      [22, 24],
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
