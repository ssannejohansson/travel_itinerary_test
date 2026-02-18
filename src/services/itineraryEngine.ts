// src/services/itineraryEngine.ts
import type { Activity, Trip } from "../models.js";

/**
 * Data you pass in when creating a new activity (from CLI prompts or templates).
 * The engine adds id + pushes into the trip.
 */
export type NewActivityData = {
  name: string;
  cost: number;
  category: Activity["category"];
  startTime: Date;
};

/**
 * Create a new trip object (engine does not push into trips[] — CLI owns state).
 */
export const createTrip = (destination: string, startDate: Date): Trip => {
  const newTrip: Trip = {
    id: generateId(),
    destination,
    startDate,
    activities: [],
  };

  return newTrip;
};

/**
 * Add a new activity to a specific trip.
 * Returns the created Activity so CLI can print confirmation.
 */
export const addActivityToTrip = (
  trip: Trip,
  activityData: NewActivityData,
): Activity => {
  const newActivity: Activity = {
    id: generateId(),
    name: activityData.name,
    cost: activityData.cost,
    category: activityData.category,
    startTime: activityData.startTime,
  };

  trip.activities.push(newActivity);
  return newActivity;
};

/**
 * Filter activities for a specific calendar day.
 * (Compares date-only, ignores time-of-day.)
 */
export const getActivitiesByDate = (
  activities: Activity[],
  date: Date,
): Activity[] => {
  const target = date.toDateString();
  return activities.filter(
    (activity) => activity.startTime.toDateString() === target,
  );
};

/**
 * Return a NEW array sorted by startTime (chronological).
 * Does not mutate the input array.
 */
export const sortActivitiesChronologically = (
  activities: Activity[],
): Activity[] => {
  return [...activities].sort(
    (a, b) => a.startTime.getTime() - b.startTime.getTime(),
  );
};

/**
 * Filter activities by category (food/transport/sightseeing).
 */
export const filterActivitiesByCategory = (
  activities: Activity[],
  category: Activity["category"],
): Activity[] => {
  return activities.filter((activity) => activity.category === category);
};

/**
 * Small helper to avoid repeating id logic.
 * Works in Node 22+ (crypto.randomUUID exists). Falls back if needed.
 */
const generateId = (): string => {
  // globalThis.crypto.randomUUID() exists in modern Node.
  const cryptoObj = (
    globalThis as unknown as { crypto?: { randomUUID?: () => string } }
  ).crypto;

  if (cryptoObj?.randomUUID) {
    return cryptoObj.randomUUID();
  }

  // Fallback: not perfect, but fine for CLI assignment
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};
