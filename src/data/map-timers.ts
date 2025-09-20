type TimeSpan = {
  startHour: number
  endHour: number
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
    return now.getUTCHours() * 3600 + now.getUTCMinutes() * 60 + now.getUTCSeconds();
  }

  static offsetHours(): number {
    const now = new Date();
    return now.getTimezoneOffset() / 60;
  }

  nextOrCurrentTimeSpan(currentTimeSecondsUTC: number): TimeSpan | undefined {
    const nextTimeSpan = this.times.find((time) => {
      const startTimeSeconds = time.startHour * 3600;
      const endTimeSeconds = time.endHour * 3600;
      return (startTimeSeconds <= currentTimeSecondsUTC && endTimeSeconds > currentTimeSecondsUTC) || startTimeSeconds > currentTimeSecondsUTC;
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
      throw new Error('No next time span found');
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
      throw new Error('No next time span found');
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

export type MapTimerDef = {
  title: string
  timers: MapTimer[]
};
