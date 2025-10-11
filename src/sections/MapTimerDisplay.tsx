import { useEffect, useState } from 'react';
import { format, addSeconds, setHours, setMinutes, setSeconds, addHours, addDays } from 'date-fns';

import { MapTimer } from '../data/map-timers';
import classNames from 'classnames';
// import { MAP_TIMERS_BREAK } from '../data/map-timers-break';
import { MAP_TIMERS_WILDFIRE } from '../data/map-timers-wildire';

const WeeklyHourDisplay = (weekHour: number) => {
  const currentWeekHour = (new Date()).getDay() * 24 + (new Date()).getHours();
  const isSameDay = Math.floor(weekHour / 24) === Math.floor(currentWeekHour / 24);
  return '0';
};

const getOffsetHours = (): number => {
  const now = new Date();
  return now.getTimezoneOffset() / 60;
};

const RelativeDateTimeDisplay = ({
  date,
}: {
  date: Date
}) => {
  const now = new Date();
  const isSameDay = date.toDateString() === now.toDateString();
  return (
    <span>
      {isSameDay ? format(date, 'HH:00') : format(date, 'EEE HH:00')}
    </span>
  );
};

const HOURS = Array.from({ length: 24 }, (_, i) => i);

// Abbreviate names like so:
// "Space City: Normal" -> "SC: Normal"
const abbreviate = (name: string) => {
  const parts = name.split(':');
  if (parts.length > 1) {
    const firstPart = parts[0].trim();
    const secondPart = parts[1].trim();
    const firstPartAbbr = firstPart
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('');
    return `${firstPartAbbr}: ${secondPart}`;
  }
  return name;
};

const dateFromWeeklyHour = (weekHour: number): Date => {
  const now = new Date();
  // reset to start of the week
  // then add week hours
  const startOfWeek = addDays(now, -now.getDay());
  const date = setHours(setMinutes(setSeconds(startOfWeek, 0), 0), 0);
  return addHours(date, weekHour);
};

export const MapTimersSection = () => {
  const [now, setNow] = useState(() => new Date());

  const dayStartHour = now.getDay() * 24;
  const currentWeekHour = dayStartHour + now.getHours();

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const MAP_TIMERS = MAP_TIMERS_WILDFIRE;

  return (
    <div className="section MapTimers">
      <h2>
        {MAP_TIMERS.title}
      </h2>
      <div className="currentTime">
        Current Time:
        {' '}
        {format(now, 'HH:mm:ss')}
      </div>

      <div className="timers">
        {MAP_TIMERS.timers.map((timer) => {
          const isOpen = timer.isLive(currentWeekHour);

          const nextStart = timer.nextOrCurrentStartWeekHour(currentWeekHour);
          const nextEnd = timer.nextOrCurrentEndWeekHour(currentWeekHour);
          const is24h = Math.abs(nextEnd - nextStart) === 24;

          const nextStartDate = dateFromWeeklyHour(nextStart);
          const nextEndDate = dateFromWeeklyHour(nextEnd);

          return (
            <div
              key={timer.name}
              className={classNames('timer', { live: isOpen })}
            >
              <h3>
                {timer.name}
                {isOpen && !is24h ? ' (OPEN)' : ''}
              </h3>
              {!is24h && (
                <div className="time">
                  {isOpen ? 'Current' : 'Next'}
                  :
                  {' '}
                  <RelativeDateTimeDisplay
                    date={nextStartDate}
                  />
                  {' '}
                  -
                  {' '}
                  <RelativeDateTimeDisplay
                    date={nextEndDate}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="timeline">
        <div className="name">UTC</div>
        {HOURS.map((hour) => {
          const weekHour = hour + dayStartHour;
          return (
            <div
              key={hour}
              className={classNames('hour-key', {
                live: weekHour === currentWeekHour,
              })}
            >
              {hour}
            </div>
          );
        })}
        {MAP_TIMERS.timers.map((timer) => {
          return [
            <div key={`${timer.name}_name`} className="name">
              {abbreviate(timer.name)}
            </div>,
            HOURS.map((hour) => {
              const weekHour = hour + dayStartHour;
              const isLive = timer.isLive(weekHour);
              return (
                <div
                  key={`${timer.name}_hour_${hour}`}
                  data-hour={hour}
                  data-current-hour={currentWeekHour % 24}
                  className={classNames('hour', { live: isLive })}
                />
              );
            }),
          ];
        })}
      </div>
    </div>
  );
};
