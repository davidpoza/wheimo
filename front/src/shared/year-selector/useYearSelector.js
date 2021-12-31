import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';

export default function useYearSelector({ user, calculateDateRangeList, isMobile, callback }) {
  const [index, setIndex] = useState();
  const currentYear = parseInt(dayjs().format('YYYY'), 10);
  const rangesList = useMemo(() => calculateDateRangeList(isMobile), [isMobile, calculateDateRangeList]);
  const { from, to } = rangesList?.[index] || {};

  useEffect(() => {
    setIndex(rangesList.findIndex(r => r.year === currentYear && Math.abs(dayjs(r.to).diff(dayjs())) >= 0)); // we choose the range with is not passed yet
  }, [currentYear, rangesList]);

  useEffect(() => {
    (async () => {
      if (user?.token && from && to) {
        callback({ token: user?.token, from, to });
      }
    })();
  }, [callback, user, index, from, to]);

  const moveBack = () => {
    if (index > 0) setIndex(index - 1);
  };

  const moveForward = () => {
    if (index < rangesList.length-1) setIndex(index + 1);
  };

  return {
    from,
    to,
    moveBack,
    moveForward
  };
}