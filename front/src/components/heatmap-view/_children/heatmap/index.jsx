import React, { useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import dayjs from 'dayjs';
import CalendarHeatmap from 'react-calendar-heatmap';
import i18n from 'utils/i18n';
import { connect } from 'react-redux';

function Heatmap({ rawData, isMobile, from, to, lng }) {
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
          monthLabels={
            [
              i18n.t('time.monthsShort.jan', {lng}),
              i18n.t('time.monthsShort.feb', {lng}),
              i18n.t('time.monthsShort.mar', {lng}),
              i18n.t('time.monthsShort.apr', {lng}),
              i18n.t('time.monthsShort.may', {lng}),
              i18n.t('time.monthsShort.jun', {lng}),
              i18n.t('time.monthsShort.jul', {lng}),
              i18n.t('time.monthsShort.aug', {lng}),
              i18n.t('time.monthsShort.sep', {lng}),
              i18n.t('time.monthsShort.oct', {lng}),
              i18n.t('time.monthsShort.nov', {lng}),
              i18n.t('time.monthsShort.dec', {lng}),
            ]
          }
          weekdayLabels={
            [
              i18n.t('time.weekdaysShort.mon', {lng}),
              i18n.t('time.weekdaysShort.tue', {lng}),
              i18n.t('time.weekdaysShort.wed', {lng}),
              i18n.t('time.weekdaysShort.thu', {lng}),
              i18n.t('time.weekdaysShort.fri', {lng}),
              i18n.t('time.weekdaysShort.sat', {lng}),
              i18n.t('time.weekdaysShort.san', {lng})
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

const mapStateToProps = (state) => ({
  lng: state.user?.current?.lang,
});

export default connect(mapStateToProps)(Heatmap);