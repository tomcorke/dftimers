import { useEffect, useState } from 'react';

import { MapTimer } from '../data/map-timers';
import classNames from 'classnames';
// import { MAP_TIMERS_BREAK } from '../data/map-timers-break';
import { MAP_TIMERS_WILDFIRE } from '../data/map-timers-wildire';

const DateTimeDisplay = ({
  secondsFromMidnight,
  withSeconds = false,
  withOffset = true,
  withOffsetDisplay = false,
}: {
  secondsFromMidnight: number
  withSeconds?: boolean
  withOffset?: boolean
  withOffsetDisplay?: boolean
}) => {
  const offsetHours = withOffset ? MapTimer.offsetHours() : 0;
  const adjustedSecondsFromMidnight = secondsFromMidnight - offsetHours * 3600;
  let hours = Math.floor(adjustedSecondsFromMidnight / 3600);
  if (hours >= 24) {
    hours -= 24;
  }
  const minutes = Math.floor((adjustedSecondsFromMidnight % 3600) / 60);
  const seconds = adjustedSecondsFromMidnight % 60;

  const invertedOffset = 0 - offsetHours;
  const offsetDisplay
    = withOffsetDisplay && invertedOffset !== 0
      ? ` (UTC${invertedOffset >= 0 ? '+' : ''}${invertedOffset})`
      : '';

  return (
    <span>
      {hours.toString().padStart(2, '0')}
      :
      {minutes.toString().padStart(2, '0')}
      {withSeconds ? `:${seconds.toString().padStart(2, '0')}` : ''}
      {offsetDisplay}
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

export const MapTimersSection = () => {
  const [now, setNow] = useState(() => MapTimer.nowSecondsUTC());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(MapTimer.nowSecondsUTC());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const currentHour = Math.floor(now / 3600);

  const MAP_TIMERS = MAP_TIMERS_WILDFIRE;

  return (
    <div className="section MapTimers">
      <h2>
        {MAP_TIMERS.title}
      </h2>
      <div className="currentTime">
        Current Time:
        {' '}
        <DateTimeDisplay
          secondsFromMidnight={now}
          withSeconds={true}
          withOffsetDisplay={true}
        />
      </div>

      <div className="timers">
        {MAP_TIMERS.timers.map((timer) => {
          const isOpen = timer.isLive();

          const nextStart = timer.nextOrCurrentTimeSpanStartSeconds(now);
          const nextEnd = timer.nextOrCurrentTimeSpanEndSeconds(now);
          const is24h = Math.abs(nextEnd - nextStart) === 86400;

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
                  <DateTimeDisplay
                    secondsFromMidnight={timer.nextOrCurrentTimeSpanStartSeconds(
                      now,
                    )}
                    withOffset={true}
                  />
                  {' '}
                  -
                  {' '}
                  <DateTimeDisplay
                    secondsFromMidnight={timer.nextOrCurrentTimeSpanEndSeconds(
                      now,
                    )}
                    withOffset={true}
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
          return (
            <div
              key={hour}
              className={classNames('hour-key', {
                live: hour === currentHour,
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
              const simTime = hour * 3600;
              const isLive = timer.isLive(simTime);
              return (
                <div
                  key={`${timer.name}_hour_${hour}`}
                  data-hour={hour}
                  data-sim-time={simTime}
                  data-current-hour={currentHour}
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
