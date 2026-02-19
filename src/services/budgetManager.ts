import type { Trip, Activity } from "../models.js";

export const calculateTotalCost = (trip: Trip): number => {
  return trip.activities.reduce(
    (sum: number, activity) => sum + activity.cost,
    0,
  );
};

export const getHighCostActivities = (
  activities: Activity[],
  threshold: number,
) => {
  return activities.filter((activity) => activity.cost >= threshold);
};
