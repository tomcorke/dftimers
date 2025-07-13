type TimeSpan = {
  startHour: number;
  endHour: number;
};

type SimpleTimeSpan = [number, number];

const toTimeSpans = (times: (TimeSpan | SimpleTimeSpan)[]): TimeSpan[] => {
  return times.map((time) => {
    if (Array.isArray(time)) {
      return { startHour: time[0], endHour: time[1] };
    }
    return time;
  });
};

export class MapTimer {
  name: string;
  times: TimeSpan[];

  constructor(name: string, times: (TimeSpan | SimpleTimeSpan)[]) {
    this.name = name;
    this.times = toTimeSpans(times);
  }

  static nowSeconds(): number {
    const now = new Date();
    return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  }

  static nowSecondsUTC(): number {
    const now = new Date();
    return (
      now.getUTCHours() * 3600 + now.getUTCMinutes() * 60 + now.getUTCSeconds()
    );
  }

  static offsetHours(): number {
    const now = new Date();
    return now.getTimezoneOffset() / 60;
  }

  nextOrCurrentTimeSpan(currentTimeSecondsUTC: number): TimeSpan | undefined {
    const nextTimeSpan = this.times.find((time) => {
      const startTimeSeconds = time.startHour * 3600;
      const endTimeSeconds = time.endHour * 3600;
      return (
        (startTimeSeconds <= currentTimeSecondsUTC &&
          endTimeSeconds > currentTimeSecondsUTC) ||
        startTimeSeconds > currentTimeSecondsUTC
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

  nextOrCurrentTimeSpanStartSeconds(currentTimeSecondsUTC: number): number {
    const nextTimeSpan = this.nextOrCurrentTimeSpan(currentTimeSecondsUTC);
    let nextTimeSpanStartSeconds: number | undefined;
    if (nextTimeSpan) {
      nextTimeSpanStartSeconds = nextTimeSpan.startHour * 3600;
    }
    if (nextTimeSpanStartSeconds === undefined) {
      throw new Error("No next time span found");
    }
    return nextTimeSpanStartSeconds;
  }

  nextOrCurrentTimeSpanEndSeconds(currentTimeSecondsUTC: number): number {
    const nextTimeSpan = this.nextOrCurrentTimeSpan(currentTimeSecondsUTC);
    let nextTimeSpanEndSeconds: number | undefined;
    if (nextTimeSpan) {
      nextTimeSpanEndSeconds = nextTimeSpan.endHour * 3600;
    }
    if (nextTimeSpanEndSeconds === undefined) {
      throw new Error("No next time span found");
    }
    return nextTimeSpanEndSeconds;
  }

  secondsUntilNextEnd(): number {
    const now = MapTimer.nowSecondsUTC();
    return this.nextOrCurrentTimeSpanEndSeconds(now) - now;
  }

  isLive(simTime?: number): boolean {
    const realNow = MapTimer.nowSecondsUTC();
    const now = simTime ?? realNow;
    const nextTimeSpan = this.nextOrCurrentTimeSpan(now);
    if (nextTimeSpan) {
      const startTimeSeconds = nextTimeSpan.startHour * 3600;
      const endTimeSeconds = nextTimeSpan.endHour * 3600;
      return startTimeSeconds <= now && endTimeSeconds > now;
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
  new MapTimer("Zero Dam: Normal", [{ startHour: 0, endHour: 24 }]),
  new MapTimer("Layali Grove: Normal", [{ startHour: 0, endHour: 24 }]),
  new MapTimer("Space City: Normal", [
    [0, 2],
    [4, 6],
    [10, 14],
    [16, 18],
    [22, 24],
  ]),
  new MapTimer("Space City: Hard", [
    [2, 4],
    [6, 8],
    [10, 12],
    [14, 16],
    [18, 20],
    [22, 24],
  ]),
  new MapTimer("Brakkesh: Normal", [
    [2, 4],
    [8, 10],
    [14, 16],
    [20, 22],
  ]),
  new MapTimer("Zero Dam: Night", [
    [6, 8],
    [18, 20],
  ]),
  new MapTimer("Tide Prison: Hard", [
    [0, 2],
    [4, 6],
    [8, 10],
    [12, 14],
    [16, 18],
    [20, 22],
  ]),
];
