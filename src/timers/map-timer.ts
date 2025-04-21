type TimeSpan = {
  startHour: number;
  endHour: number;
};

export class MapTimer {
  name: string;
  times: TimeSpan[];

  constructor(name: string, times: TimeSpan[]) {
    this.name = name;
    this.times = times;
  }

  static nowSeconds(): number {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60;
    return (
      now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds() + offset
    );
  }

  nextOrCurrentTimeSpan(currentTimeSeconds: number): TimeSpan | undefined {
    // get current time as seconds since midnight
    // get next time span's star hour as seconds since midnight
    // if no time span has a start greater than current time, add 24 hours to earliest time span and use that
    // return difference between next time span's start time and current time
    const nextTimeSpan = this.times.find((time) => {
      const startTimeSeconds = time.startHour * 3600;
      const endTimeSeconds = time.endHour * 3600;
      return (
        (startTimeSeconds < currentTimeSeconds &&
          endTimeSeconds > currentTimeSeconds) ||
        startTimeSeconds > currentTimeSeconds
      );
    });
    if (nextTimeSpan) {
      return nextTimeSpan;
    }
    const nextDayFirstTimeSpan = this.times[0];
    if (nextDayFirstTimeSpan) {
      return {
        startHour: nextDayFirstTimeSpan.startHour + 24,
        endHour: nextDayFirstTimeSpan.endHour + 24,
      };
    }
    return undefined;
  }

  nextOrCurrentTimeSpanStartSeconds(currentTimeSeconds: number): number {
    const nextTimeSpan = this.nextOrCurrentTimeSpan(currentTimeSeconds);
    let nextTimeSpanStartSeconds: number | undefined;
    if (nextTimeSpan) {
      nextTimeSpanStartSeconds = nextTimeSpan.startHour * 3600;
    }
    if (!nextTimeSpanStartSeconds) {
      throw new Error("No next time span found");
    }
    return nextTimeSpanStartSeconds;
  }

  nextOrCurrentTimeSpanEndSeconds(currentTimeSeconds: number): number {
    const nextTimeSpan = this.nextOrCurrentTimeSpan(currentTimeSeconds);
    let nextTimeSpanEndSeconds: number | undefined;
    if (nextTimeSpan) {
      nextTimeSpanEndSeconds = nextTimeSpan.endHour * 3600;
    }
    if (!nextTimeSpanEndSeconds) {
      throw new Error("No next time span found");
    }
    return nextTimeSpanEndSeconds;
  }

  secondsUntilNextEnd(): number {
    const now = MapTimer.nowSeconds();
    return this.nextOrCurrentTimeSpanEndSeconds(now) - now;
  }

  isLive(): boolean {
    const now = MapTimer.nowSeconds();
    const nextTimeSpan = this.nextOrCurrentTimeSpan(now);
    if (nextTimeSpan) {
      const startTimeSeconds = nextTimeSpan.startHour * 3600;
      const endTimeSeconds = nextTimeSpan.endHour * 3600;
      return startTimeSeconds < now && endTimeSeconds > now;
    }
    return false;
  }
}

const intervals = (
  start: number,
  duration: number,
  gap: number
): TimeSpan[] => {
  let times: TimeSpan[] = [];
  for (let i = start; i < 24; i += duration + gap) {
    times.push({ startHour: i, endHour: i + duration });
  }
  return times;
};

export const MAP_TIMERS: MapTimer[] = [
  new MapTimer("Space City: Normal", intervals(0, 2, 2)),
  new MapTimer("Brakkesh: Normal", intervals(2, 2, 2)),
  new MapTimer("Space City: Hard", [
    { startHour: 0, endHour: 1 },
    { startHour: 4, endHour: 5 },
    { startHour: 8, endHour: 9 },
    { startHour: 20, endHour: 21 },
  ]),
  new MapTimer("Zero Dam: Night (Normal)", [
    { startHour: 1, endHour: 3 },
    { startHour: 5, endHour: 7 },
    { startHour: 17, endHour: 19 },
    { startHour: 21, endHour: 23 },
  ]),
  new MapTimer("Layali: Normal", [
    { startHour: 3, endHour: 4 },
    { startHour: 7, endHour: 8 },
    { startHour: 19, endHour: 20 },
    { startHour: 23, endHour: 24 },
  ]),
];
