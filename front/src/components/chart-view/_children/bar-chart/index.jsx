import React from 'react';
import { ResponsiveBar } from '@nivo/bar'
import dayjs from 'dayjs';


export default function BarChart({ rawData, from, to, tags }) {

  const mapper = obj => {
    const ret = [];
    ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].forEach(e => {
      ret.push({
        month: dayjs(e, 'MM').format('MMM'),
      });
    })

    Object.keys(obj)?.forEach((tag) => {
      return obj?.[tag]?.forEach(e => {
        const month = dayjs(e.month, 'YYYY-MM').format('MMM');
        const found = ret.findIndex(e => e.month === month);
        if (found !== -1) {
          ret[found] = {
            ...ret[found],
            [`${tag}`]: +Math.abs(e.totalAmount).toFixed(0),
          };
        }
      });
    });

    console.log(ret)
    return ret
      .sort((a, b) => dayjs(a.month, 'MMM').diff(dayjs(b.month, 'MMM')))
  };
  const data = mapper(rawData);
  return ( from && to
    ? <ResponsiveBar
        keys={tags}
        indexBy="month"
        groupMode="grouped"
        colors={{ scheme: 'set3' }}
        borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.1 ] ] }}
        borderWidth={1}
        colorBy="index"
        data={data}
        innerPadding={3}
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
