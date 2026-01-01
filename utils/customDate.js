const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "saturday",
];
const getWeekDay = (date) => {
  return DAYS[new Date(date * 1000).getDay()];
};

export { getWeekDay };
