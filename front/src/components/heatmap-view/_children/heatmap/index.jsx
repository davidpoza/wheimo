import React, { useEffect } from 'react';
// import { ResponsiveHeatMap } from '@nivo/heatmap';
import ReactTooltip from 'react-tooltip';
import CalendarHeatmap from 'react-calendar-heatmap';

export default function Heatmap({ rawData, month, year }) {
  useEffect(() => {
    ReactTooltip.rebuild();
  }, [rawData]);
  const dow2Text = (d, lang) => {
    switch (d) {
      case 0:
        return lang === 'es' ? 'Lun': 'Mon';
      case 1:
        return lang === 'es' ? 'Mar': 'Tue';
      case 2:
        return lang === 'es' ? 'Mie': 'Wed';
      case 3:
        return lang === 'es' ? 'Jue': 'Thu';
      case 4:
        return lang === 'es' ? 'Vie': 'Fri';
      case 5:
        return lang === 'es' ? 'Sab': 'Sat';
      case 6:
        return lang === 'es' ? 'Dom': 'Sun';
      default:
        return;
    }
  };
  const colors = [
    'hsl(182, 70%, 50%)',
    'hsl(205, 70%, 50%)',
    'hsl(12,64%,55%)'
  ];
  const calculateColor = (value) => {
    const absVal = Math.abs(value);
    if (absVal === 0) return colors[0];
    if (absVal > 0 && absVal < 20) return colors[1];
    return colors[2];
  };

  const rawDataAmountMapper = ({ week, dow }) => {
    const date = `${year}-${String(month).padStart(2, '0')}-${String(week*7 + dow - 1).padStart(2, '0')}`;
    return (Math.abs(rawData.filter((e) => e.day === date)?.[0]?.['totalAmount']) || 0).toFixed(2);
  };

  const buildArray = () => {
    if (!rawData) return [];
    return [0, 1, 2, 3, 4, 5, 6].map((dow) => { // loop within days of the week
      const w1Val = rawDataAmountMapper({ dow, week: 0 });
      const w2Val = rawDataAmountMapper({ dow, week: 1 });
      const w3Val = rawDataAmountMapper({ dow, week: 2 });
      const w4Val = rawDataAmountMapper({ dow, week: 3 });
      const w5Val = rawDataAmountMapper({ dow, week: 4 });

      return({
        dayOfTheWeek: dow2Text(dow),
        week1: w1Val,
        week2: w2Val,
        week3: w3Val,
        week4: w4Val,
        week5: w5Val,
        week1Color: calculateColor(w1Val),
        week2Color: calculateColor(w2Val),
        week3Color: calculateColor(w3Val),
        week4Color: calculateColor(w4Val),
        week5Color: calculateColor(w5Val),
      });
    });
  };

  const keys = [
    'week1',
    'week2',
    'week3',
    'week4',
    'week5',
  ];


  return (<>
    <CalendarHeatmap
      horizontal={false}
      gutterSize={1}
      startDate={new Date('2021-01-01')}
      endDate={new Date('2021-12-31')}
      values={rawData.map(e => {
        return ({
          date: e.day,
          count: Math.round(Math.abs(e.totalAmount))
        });
      })}
      // titleForValue={(value) => value?.count ? `${value?.count}€` : ''}
      tooltipDataAttrs={(value) => ({'data-tip': value?.count ? `${value.count}€` : undefined })}
      classForValue={(value) => {
        if (!value) {
          return 'color-empty';
        } else if (value.count > 0 && value.count <= 20) {
          return 'color-scale-1';
        } else if (value.count > 20 && value.count <= 50) {
          return 'color-scale-2';
        }
        return 'color-scale-3';
      }}
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
  </>);
}

Heatmap.propTypes = {

};
