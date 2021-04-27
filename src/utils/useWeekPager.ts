import { isLastDayOfMonth } from "date-fns";

interface Props {
  nextMode: string
} 

export const useWeekPager = (props: Props) => {
  let nextMode = props.nextMode;

  // Utils
  const getISODate = (date: Date): string => {
    return date.toISOString().slice(0, 10);
  };

  const getWeekDays = (date: Date): Array<Date> => {
    const firstDate = new Date(date.setDate(date.getDate() - 4));
    const selectedWeek: Array<Date> = [];
    for (let i = 0; i < 7; i++) {
      firstDate.setDate(firstDate.getDate() + 1);
      selectedWeek.push(new Date(firstDate));
    }
    return selectedWeek;
  };

  // state
  let firstDayOfWeek = 0;

  // Week
  let selectedWeek = getWeekDays(new Date);

  const setWeek = ( value: Array<Date>): void => {
    selectedWeek = value || selectedWeek;
  };

  const getCalendarWeek = (date: Date) => {
    const firstDate = new Date(
      date.setDate(date.getDate() - date.getDay() + firstDayOfWeek)
    );
    const week = [new Date(firstDate)];
    while (
      firstDate.setDate(firstDate.getDate() + 1) &&
      firstDate.getDay() !== firstDayOfWeek
    ) {
      week.push(new Date(firstDate));
    }
    return week;
  };

  const getCalendarMonth = (date: Date) => {
    const firstDate = new Date(
      date.setDate(date.getDate() - (date.getDate() - 1))
    );
    const month = [new Date(firstDate)];
    while (!isLastDayOfMonth(firstDate)) {
      firstDate.setDate(firstDate.getDate() + 1);
      month.push(new Date(firstDate));
    }
    return month;
  };

  const getWeek = (date: Date): Array<Date> => {
    const controls: { [ key: string ] : Function } = {
      "day": getWeekDays,
      "week": getCalendarWeek,
      "month": getCalendarMonth
    };
    const mode = nextMode || "week";
    return controls[mode](date);
  };

  const checkWeek = () => {
    selectedWeek = getWeek(new Date());
    return selectedWeek;
  };


  // Day
  let selectedDay = new Date();
  const setDay = (value: Date) => {
    selectedDay = value || selectedDay;
  };


  // controls
  const next = () => {
    const dayIndex = nextMode == "day" ? 3 : selectedWeek.length - 1;
    const date = new Date(selectedWeek[dayIndex].setDate(selectedWeek[dayIndex].getDate() + 1));

    selectedDay = date;
  };

  const previous = () => {
    const dayIndex = nextMode == "day" ? 3 : 0;
    const date = new Date(selectedWeek[dayIndex].setDate(selectedWeek[dayIndex].getDate() - 1));
    selectedDay = date;
  };


  return {
    // state
    selectedDay,
    selectedWeek,    
    startDate: selectedWeek[0],
    endDate: selectedWeek[6],
    checkWeek,


    // methods
    controls: {
      setWeek,
      setDay,
      previous,
      next
    }
  };
};