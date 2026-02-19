import inquirer from "inquirer";
import type { Activity, Trip, ActivityTemplate } from "../models.js";

import {
  createTrip,
  addActivityToTrip,
  getActivitiesByDate,
  sortActivitiesChronologically,
  filterActivitiesByCategory,
} from "../services/itineraryEngine.js";

import {
  calculateTotalCost,
  getHighCostActivities,
} from "../services/budgetManager.js";
import { getDestinationInfo } from "../services/destinationService.js";

const promptSelectTrip = async (trips: Trip[]): Promise<Trip | null> => {
  if (trips.length === 0) {
    console.log("Please create a trip first.");
    return null;
  }

  const { tripId } = await inquirer.prompt<{ tripId: string }>([
    {
      type: "rawlist",
      name: "tripId",
      message: "Select a trip:",
      choices: trips.map((trip) => ({
        name: `${trip.destination} (${trip.startDate.toDateString()})`,
        value: trip.id,
      })),
    },
  ]);

  return trips.find((trip) => trip.id === tripId) ?? null;
};

export const handleCreateTrip = async (trips: Trip[]): Promise<void> => {
  const { country } = await inquirer.prompt([
    {
      type: "rawlist",
      name: "country",
      message: "Choose your destination:",
      choices: ["Sweden", "Iceland", "Norway"],
    },
  ]);

  const { dateRange } = await inquirer.prompt([
    {
      type: "rawlist",
      name: "dateRange",
      message: "Choose your dates",
      choices: [
        "2026-03-01 - 2026-03-04",
        "2026-03-07 - 2026-03-10",
        "2026-03-14 - 2026-03-17",
      ],
    },
  ]);

  const [startStr] = dateRange.split(" - ");
  const startDate = new Date(startStr);

  const newTrip = createTrip(country, startDate);
  trips.push(newTrip);

  console.log(
    `Created trip to ${newTrip.destination} starting ${newTrip.startDate.toDateString()}`,
  );
};

export const handleAddActivity = async (
  trips: Trip[],
  activityTemplates: ActivityTemplate[],
): Promise<void> => {
  if (trips.length === 0) {
    console.log("Please choose a destination first");
    return;
  }

  // Later: prompt user to pick a trip. For now:
  const selectedTrip = await promptSelectTrip(trips);
  if (!selectedTrip) return;

  console.log(`Add activities to your trip to ${selectedTrip.destination}`);

  const { selectedAct } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "selectedAct",
      message: "Choose your activities:",
      choices: activityTemplates.map((t) => t.name),
    },
  ]);

  selectedAct.forEach((name: string) => {
    const template = activityTemplates.find((t) => t.name === name);
    if (!template) return;

    // Combine trip date + template time into a Date
    const yyyyMmDd = selectedTrip.startDate.toISOString().slice(0, 10);
    const startTime = new Date(`${yyyyMmDd}T${template.time}:00`);

    const added = addActivityToTrip(selectedTrip, {
      name: template.name,
      cost: template.cost,
      category: template.category,
      startTime,
    });

    console.log(`Added: ${added.name} - ${added.cost}`);
  });
};

export const handleViewActivitiesByDate = async (
  trips: Trip[],
): Promise<void> => {
  if (trips.length === 0) {
    console.log("Please create a trip first");
    return;
  }

  const selectedTrip = await promptSelectTrip(trips);
  if (!selectedTrip) return;

  const { day } = await inquirer.prompt([
    {
      type: "input",
      name: "day",
      message: "Enter day (YYYY-MM-DD):",
      validate: (input: string) =>
        Number.isFinite(new Date(input).getTime())
          ? true
          : "Use format YYYY-MM-DD",
    },
  ]);

  const chosenDate = new Date(day);

  const filtered = getActivitiesByDate(selectedTrip.activities, chosenDate);
  const sorted = sortActivitiesChronologically(filtered);

  if (sorted.length === 0) {
    console.log("No activities found for that day.");
    return;
  }

  console.log(`Activities on ${chosenDate.toDateString()}:`);
  sorted.forEach((activity: Activity) => {
    console.log(
      `- ${activity.name} at ${activity.startTime.toTimeString().slice(0, 5)} — ${activity.cost}`,
    );
  });
};

export const handleFilterByCategory = async (trips: Trip[]): Promise<void> => {
  if (trips.length === 0) {
    console.log("Create a trip first.");
    return;
  }

  const selectedTrip = await promptSelectTrip(trips);
  if (!selectedTrip) return;

  const { category } = await inquirer.prompt([
    {
      type: "rawlist",
      name: "category",
      message: "Pick category:",
      choices: ["food", "transport", "sightseeing"],
    },
  ]);

  const filtered = filterActivitiesByCategory(
    selectedTrip.activities,
    category,
  );

  if (filtered.length === 0) {
    console.log("No activities in that category.");
    return;
  }

  filtered.forEach((activity: Activity) =>
    console.log(`- ${activity.name} — ${activity.cost}`),
  );
};

export const handleViewBudget = async (trips: Trip[]): Promise<void> => {
  if (trips.length === 0) {
    console.log("Please create a trip first.");
    return;
  }

  const selectedTrip = await promptSelectTrip(trips);
  if (!selectedTrip) return;

  const total = calculateTotalCost(selectedTrip);
  console.log(`Total cost: ${total}`);

  const { highlight } = await inquirer.prompt([
    {
      name: "highlight",
      type: "confirm",
      message: "Do you want to highlight expensive activities?",
    },
  ]);

  if (!highlight) return;

  const { threshold } = await inquirer.prompt([
    {
      name: "threshold",
      type: "number",
      message: "What's your threshold?",
    },
  ]);

  const expensive = getHighCostActivities(selectedTrip.activities, threshold);

  if (expensive.length === 0) {
    console.log("No activities exceed your threshold");
    return;
  }

  console.log("High-cost activities:");
  expensive.forEach((activity: Activity) => {
    console.log(`${activity.name} - ${activity.cost}`);
  });
};

export const handleShowTripInformation = async (
  trips: Trip[],
): Promise<void> => {
  if (trips.length === 0) {
    console.log("Please create a trip first");
    return;
  }

  const selectedTrip = await promptSelectTrip(trips);
  if (!selectedTrip) return;
  console.log(`Looking up destination info for ${selectedTrip.destination}...`);

  try {
    const countries = await getDestinationInfo(selectedTrip.destination);

    if (countries.length === 0) {
      console.log("No destination info found");
      return;
    }

    console.log("Destination info:");
    countries.forEach((countryInfo) => {
      const capital = Array.isArray(countryInfo.capital)
        ? countryInfo.capital.join(", ")
        : (countryInfo.capital ?? "N/A");
      console.log(
        `${countryInfo.name} | Capital: ${capital} | Currency: ${countryInfo.currency}`,
      );
    });
    console.log("");
  } catch {
    console.log("Could not fetch destination info. Try again.");
  }
};
