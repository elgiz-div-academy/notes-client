import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as dateFns from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function renderComponent(
  Component: React.ReactNode | (() => JSX.Element)
) {
  switch (typeof Component) {
    case "function":
      return Component();
    default:
      return Component;
  }
}

export function roundTimeToNearestPick(
  date: Date,
  direction: 1 | -1 = 1,
  hourMultiplier = 1
) {
  let startOfCurrentEdge;
  if (hourMultiplier >= 1) {
    startOfCurrentEdge = dateFns.roundToNearestHours(date, {
      nearestTo: hourMultiplier as any,
    });
  } else {
    startOfCurrentEdge = dateFns.roundToNearestMinutes(date, {
      nearestTo: (hourMultiplier * 60) as any,
    });
  }

  // Calculate the rounded time
  let roundedTime;
  if (direction === 1) {
    roundedTime = dateFns.addMinutes(startOfCurrentEdge, hourMultiplier * 60);
  } else if (direction === -1) {
    roundedTime = dateFns.addMinutes(
      startOfCurrentEdge,
      -(hourMultiplier * 60)
    );
  } else {
    throw new Error(
      "Invalid direction. Use 1 for rounding up or -1 for rounding down."
    );
  }

  return roundedTime;
}

export function createDistanceBetweenTwoTimes(
  date: Date,
  {
    from,
    to,
    hourMultiplier,
    fromNow,
  }: { from: number; to: number; hourMultiplier: number; fromNow?: boolean } = {
    from: 12,
    to: 23,
    hourMultiplier: 1,
    fromNow: true,
  }
) {
  const result = [];
  let currentDate = new Date(date);

  // Set the start time
  if (fromNow) {
    currentDate = dateFns.startOfHour(dateFns.addHours(currentDate, 1));
    let minDate = new Date(date);
    minDate = dateFns.startOfHour(dateFns.setHours(date, from));
    if (!dateFns.isSameDay(currentDate, minDate)) {
      currentDate = dateFns.endOfHour(new Date(date));
    } else if (dateFns.isBefore(currentDate, minDate)) {
      currentDate = minDate;
    }
  } else {
    currentDate.setHours(from, 0, 0, 0);
  }

  let endDate = new Date(currentDate);
  endDate = dateFns.startOfHour(dateFns.setHours(endDate, to));

  while (currentDate <= endDate) {
    result.push(new Date(currentDate));

    if (hourMultiplier >= 1) {
      currentDate = dateFns.addHours(currentDate, hourMultiplier);
    } else {
      currentDate = dateFns.addMinutes(currentDate, hourMultiplier * 60);
    }
  }

  return result;
}

export function generateHourArray({
  baseDate = new Date(),
  distance = -3,
  count = 8,
  hourMultiplier = 1,
  min = 12,
  max = 23,
  fillGap = false,
}) {
  const hourArray = [];

  // Calculate the start hour to be placed at the 4th index (3 hours before baseDate)
  let startDate = dateFns.startOfHour(
    dateFns.addHours(baseDate, distance * hourMultiplier)
  );

  let startHour = +startDate.getHours();

  if (fillGap === true) {
    if (startHour === 12) {
    }
  }

  // Populate the array with hours for count hours, starting from startHour
  for (let i = 0; i < count; i++) {
    const currentHour = dateFns.addHours(startDate, hourMultiplier * i);

    const isMin =
      min && dateFns.isBefore(currentHour, dateFns.setHours(startDate, min));
    const isMax =
      max && dateFns.isAfter(currentHour, dateFns.setHours(startDate, max));
    // Check if the currentHour is within the min and max limits
    if (isMin) continue;

    if (isMax) break;

    const hourToPush = dateFns.isEqual(currentHour, baseDate)
      ? baseDate
      : currentHour;
    hourArray.push(hourToPush);
  }

  return hourArray;
}

export function getDayBounds(date = new Date()) {
  const start = dateFns.startOfDay(date);
  const end = dateFns.endOfDay(date);
  return { start, end };
}
