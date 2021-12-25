import React, { useEffect } from 'react';
// import { ResponsiveHeatMap } from '@nivo/heatmap';
import ReactTooltip from 'react-tooltip';
import dayjs from 'dayjs';
import CalendarHeatmap from 'react-calendar-heatmap';

export default function Heatmap({ rawData, isMobile, from, to }) {
  useEffect(() => {
    ReactTooltip.rebuild();
  }, [rawData]);


  const calculateColor = (value) => {
    if (!value) {
      return 'color-empty';
    } else if (value.count > 0 && value.count <= 20) {
      return 'color-scale-1';
    } else if (value.count > 20 && value.count <= 50) {
      return 'color-scale-2';
    }
    return 'color-scale-3';
  };

  /**
   * realDate is used in tooltip, and is the real date, but date if one day before just to make weeks start on monday
   */
  const mapper = e => {
    return ({
      realDate: e.day,
      date: dayjs(e.day, 'YYYY-MM-DD').subtract(1, 'day').format('YYYY-MM-DD'), // workaround to start week on monday
      count: Math.round(Math.abs(e.totalAmount))
    });
  };

  return ( from && to
    ? <>
        <CalendarHeatmap
          horizontal={isMobile ? false : true}
          gutterSize={1}
          startDate={dayjs(from, 'YYYY-MM-DD').subtract(2, 'day').format('YYYY-MM-DD')}
          endDate={dayjs(to, 'YYYY-MM-DD').subtract(1, 'day').format('YYYY-MM-DD')}
          values={rawData.map(mapper)}
          tooltipDataAttrs={(value) => ({
            'data-tip': value?.count ? `${dayjs(value.realDate, 'YYYY-MM-DD').format('DD/MM/YYYY')} ${value.count}€` : undefined
          })}
          classForValue={calculateColor}
          showWeekdayLabels
          weekdayLabels={
            [
              'Mon',
              'Tue',
              'Wed',
              'Thr',
              'Fri',
              'Sat',
              'Sun'
            ]
          }
        />
        <ReactTooltip />
      </>
    : null
  );
}

Heatmap.propTypes = {

};
