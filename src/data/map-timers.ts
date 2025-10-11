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

const getOffsetHours = (): number => {
  const now = new Date();
  return 0 - now.getTimezoneOffset() / 60;
};

const toTimeSpans = (times: (TimeSpan | SimpleTimeSpan)[]): WeeklyTimeSpan[] => {
  // Time spans are defined in UTC
  // so they need to be offset to the user's local time zone.
  const offset = getOffsetHours();

  const normalisedTimes = times.map((time) => {
    if (Array.isArray(time)) {
      return { startHour: time[0] + offset, endHour: time[1] + offset };
    }
    else if ('startHour' in time) {
      return { startHour: time.startHour + offset, endHour: time.endHour + offset };
    }
    else if ('startWeekHour' in time) {
      return { startWeekHour: time.startWeekHour + offset, endWeekHour: time.endWeekHour + offset };
    }
    throw Error('Unexpected time span format');
  });

  const normalisedDailyTimes = normalisedTimes.filter((time): time is DailyTimeSpan => 'startHour' in time);
  const normalisedWeeklyTimes = normalisedTimes.filter((time): time is WeeklyTimeSpan => 'startWeekHour' in time);

  // start at hour 0 in a week
  // end at hout 7 * 24
  for (let day = 0; day < 7; day++) {
    const dayStartHour = day * 24;

    for (const time of normalisedDailyTimes) {
      const startHour = dayStartHour + time.startHour;
      const endHour = dayStartHour + time.endHour;
      normalisedWeeklyTimes.push({ startWeekHour: startHour, endWeekHour: endHour });
    }
  }

  return normalisedWeeklyTimes.sort((a, b) => a.startWeekHour - b.startWeekHour);
};

export class MapTimer {
  name: string;
  times: WeeklyTimeSpan[];

  constructor(name: string, times: (TimeSpan | SimpleTimeSpan)[]) {
    this.name = name;
    this.times = toTimeSpans(times);

    console.log(this.times);
  }

  isLive(weekHour: number): boolean {
    return this.times.some(time => weekHour >= time.startWeekHour && weekHour < time.endWeekHour);
  }

  nextOrCurrentTimeSpan(weekHour: number): WeeklyTimeSpan {
    for (const time of this.times) {
      const isCurrent = (time.startWeekHour <= weekHour && weekHour < time.endWeekHour);
      const isFuture = (weekHour < time.startWeekHour);
      if (isCurrent || isFuture) {
        return time;
      }
    }
    // If we didn't find any current or future time in the time spans,
    // return the first time span assuming that next week will happen.
    return this.times[0];
  }

  nextOrCurrentStartWeekHour(weekHour: number): number {
    const timeSpan = this.nextOrCurrentTimeSpan(weekHour);
    return timeSpan?.startWeekHour;
  }

  nextOrCurrentEndWeekHour(weekHour: number): number {
    const timeSpan = this.nextOrCurrentTimeSpan(weekHour);
    return timeSpan?.endWeekHour;
  }
}

export type MapTimerDef = {
  title: string
  timers: MapTimer[]
};
