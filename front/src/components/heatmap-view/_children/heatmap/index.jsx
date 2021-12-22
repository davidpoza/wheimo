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


  return ( from && to
    ? <>
        <CalendarHeatmap
          horizontal={isMobile ? false : true}
          gutterSize={1}
          startDate={new Date(from)}
          endDate={new Date(to)}
          values={rawData.map(e => {
            return ({
              date: e.day,
              count: Math.round(Math.abs(e.totalAmount))
            });
          })}
          tooltipDataAttrs={(value) => ({
            'data-tip': value?.count ? `${dayjs(value.date, 'YYYY-MM-DD').format('DD/MM/YYYY')} ${value.count}€` : undefined
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
