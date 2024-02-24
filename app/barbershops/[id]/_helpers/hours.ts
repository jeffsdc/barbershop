import { addMinutes, setHours, setMinutes, format } from "date-fns";

export function generateDayTimeList(date: Date): string[] {
  const startTime = setMinutes(setHours(date, 9), 0); //Setting the hours for the opening barbershop
  const endTime = setMinutes(setHours(date, 21), 0);  //Setting the hours for the closing barbershop
  const interval = 45; //Setting the interval for the service in barbershop
  const timeList: string[] = [];

  let currentTime = startTime;

  while (currentTime <= endTime) {
    timeList.push(format(currentTime, "HH:mm"));
    currentTime = addMinutes(currentTime, interval);
  }

  return timeList;
}