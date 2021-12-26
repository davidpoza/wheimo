import React from 'react';
import { ResponsiveBar } from '@nivo/bar'
import dayjs from 'dayjs';


export default function BarChart({ rawData, isMobile, from, to }) {
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

  const mapper = obj => {
    const ret = [];
    let year;
    Object.keys(obj)?.forEach((tag) => {
      return obj?.[tag]?.forEach(e => {
        if (!year) year = e.month.split('-')[0];
        ret.push({
          month: e.month,
          [`${tag}`]: Math.abs(e.totalAmount).toFixed(2),
        });
      });
    });
    if (year) {
      Object.keys(obj)?.forEach((tag) => {
        ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '11'].forEach(m => {
          if (!ret[`${year}-${m}`]) ret.push({ month: `${year}-${m}`, [`${tag}`]: 0 });
        });
      });
    }
    console.log(ret)
    return ret
      .sort((a, b) => dayjs(a.month, 'YYYY-MM').diff(dayjs(b.month, 'YYYY-MM')))
      .map(e => ({
        ...e,
        month: dayjs(e.month, 'YYYY-MM').format('MMM'),
      }));
  };

  return ( from && to
    ? <ResponsiveBar
        keys={['all']}
        indexBy="month"
        groupMode="grouped"
        colors={{ scheme: 'nivo' }}
        data={mapper(rawData)}
        margin={{ top: 50, right: 40, bottom: 50, left: 60 }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'month',
            legendPosition: 'middle',
            legendOffset: 40
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'expended in €',
            legendPosition: 'middle',
            legendOffset: -50
        }}
      />
    : null
  );
}

BarChart.propTypes = {

};
