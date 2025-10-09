type DailyTimeSpan = {
  startHour: number
  endHour: number
};
type WeeklyTimeSpan = {
  startWeekHour: number
  endWeekHour: number
};

type TimeSpan = DailyTimeSpan | WeeklyTimeSpan;

type SimpleTimeSpan = [number, number];

const toTimeSpans = (times: (TimeSpan | SimpleTimeSpan)[]): TimeSpan[] => {
  return times.map((time) => {
    if (Array.isArray(time)) {
      return { startHour: time[0], endHour: time[1] };
    }
    return time;
  });
};

const isInDailyTimeSpan = (timeSpan: DailyTimeSpan, currentDailyTimeSeconds: number): boolean => {
  const startTimeSeconds = timeSpan.startHour * 3600;
  const endTimeSeconds = timeSpan.endHour * 3600;
  return (startTimeSeconds <= currentDailyTimeSeconds && endTimeSeconds > currentDailyTimeSeconds);
};

const isInWeeklyTimeSpan = (timeSpan: WeeklyTimeSpan, currentWeeklyTimeSeconds: number): boolean => {
  const startTimeSeconds = timeSpan.startWeekHour * 3600;
  const endTimeSeconds = timeSpan.endWeekHour * 3600;
  const nextWeekCurrentTimeSeconds = currentWeeklyTimeSeconds + 7 * 24 * 3600;
  console.log(`isInWeeklyTimeSpan: currentWeeklyTimeSeconds=${currentWeeklyTimeSeconds}, nextWeekCurrentTimeSeconds=${nextWeekCurrentTimeSeconds}, startTimeSeconds=${startTimeSeconds}, endTimeSeconds=${endTimeSeconds}`);
  return (startTimeSeconds <= currentWeeklyTimeSeconds && endTimeSeconds > currentWeeklyTimeSeconds)
    || (startTimeSeconds <= nextWeekCurrentTimeSeconds && endTimeSeconds > nextWeekCurrentTimeSeconds);
};

const isInTimeSpan = (timeSpan: TimeSpan, currentWeeklyTimeSeconds: number): boolean => {
  const currentDailyTimeSeconds = currentWeeklyTimeSeconds % (24 * 3600);
  if ('startHour' in timeSpan) {
    return isInDailyTimeSpan(timeSpan, currentDailyTimeSeconds);
  }
  else if ('startWeekHour' in timeSpan) {
    return isInWeeklyTimeSpan(timeSpan, currentWeeklyTimeSeconds);
  }
  return false;
};

export class MapTimer {
  name: string;
  times: TimeSpan[];

  constructor(name: string, times: (TimeSpan | SimpleTimeSpan)[]) {
    this.name = name;
    this.times = toTimeSpans(times);
  }

  static nowWeeklySeconds(): number {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 (Sun) to 6 (Sat)
    return dayOfWeek * 24 * 3600 + now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  }

  static nowWeeklySecondsUTC(): number {
    const now = new Date();
    const dayOfWeek = now.getUTCDay(); // 0 (Sun) to 6 (Sat)
    console.log(`dayOfWeek: ${dayOfWeek}, now.getUTCHours(): ${now.getUTCHours()}, now.getUTCMinutes(): ${now.getUTCMinutes()}, now.getUTCSeconds(): ${now.getUTCSeconds()}`);
    return dayOfWeek * 24 * 3600 + now.getUTCHours() * 3600 + now.getUTCMinutes() * 60 + now.getUTCSeconds();
  }

  static offsetHours(): number {
    const now = new Date();
    return now.getTimezoneOffset() / 60;
  }

  nextOrCurrentTimeSpan(currentWeeklyTimeSecondsUTC: number): TimeSpan | undefined {
    const nextTimeSpan = this.times.find((time) => {
      return isInTimeSpan(time, currentWeeklyTimeSecondsUTC);
    });

    if (nextTimeSpan) {
      return nextTimeSpan;
    }

    const nextDayFirstTimeSpan = this.times[0];
    if (nextDayFirstTimeSpan) {
      if ('startWeekHour' in nextDayFirstTimeSpan) {
        return {
          startWeekHour: nextDayFirstTimeSpan.startWeekHour + 24,
          endWeekHour: nextDayFirstTimeSpan.endWeekHour + 24,
        };
      }

      return {
        startHour: nextDayFirstTimeSpan.startHour + 24,
        endHour: nextDayFirstTimeSpan.endHour + 24,
      };
    }

    return undefined;
  }

  nextOrCurrentTimeSpanStartSeconds(currentWeeklyTimeSecondsUTC: number): number {
    const nextTimeSpan = this.nextOrCurrentTimeSpan(currentWeeklyTimeSecondsUTC);
    let nextTimeSpanStartSeconds: number | undefined;
    if (nextTimeSpan) {
      if ('startWeekHour' in nextTimeSpan) {
        nextTimeSpanStartSeconds = nextTimeSpan.startWeekHour * 3600;
      }
      else {
        nextTimeSpanStartSeconds = nextTimeSpan.startHour * 3600;
      }
    }
    if (nextTimeSpanStartSeconds === undefined) {
      throw new Error('No next time span found');
    }
    return nextTimeSpanStartSeconds;
  }

  nextOrCurrentTimeSpanEndSeconds(currentWeeklyTimeSecondsUTC: number): number {
    const nextTimeSpan = this.nextOrCurrentTimeSpan(currentWeeklyTimeSecondsUTC);
    let nextTimeSpanEndSeconds: number | undefined;
    if (nextTimeSpan) {
      if ('endWeekHour' in nextTimeSpan) {
        nextTimeSpanEndSeconds = nextTimeSpan.endWeekHour * 3600;
      }
      else {
        nextTimeSpanEndSeconds = nextTimeSpan.endHour * 3600;
      }
    }
    if (nextTimeSpanEndSeconds === undefined) {
      throw new Error('No next time span found');
    }
    return nextTimeSpanEndSeconds;
  }

  secondsUntilNextEnd(): number {
    const now = MapTimer.nowWeeklySecondsUTC();
    return this.nextOrCurrentTimeSpanEndSeconds(now) - now;
  }

  isLive(simTime?: number): boolean {
    const realNow = MapTimer.nowWeeklySecondsUTC();
    const now = simTime ?? realNow;
    return this.times.some(time => isInTimeSpan(time, now));
  }
}

export type MapTimerDef = {
  title: string
  timers: MapTimer[]
};
