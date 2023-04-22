import {parseISO, format} from 'date-fns';

export const parseDate = date => {
  const newDate = parseISO(date);
  const formattedDate = format(newDate, 'MM/dd hh:mm aaa');
  return formattedDate;
};
