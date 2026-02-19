import inquirer from "inquirer";
import type { Trip, ActivityTemplate } from "./models.js";
import {
  handleCreateTrip,
  handleAddActivity,
  handleViewActivitiesByDate,
  handleFilterByCategory,
  handleViewBudget,
  handleShowTripInformation,
} from "./handlers/menuHandlers.js";

// TEST TRIP
const trips: Trip[] = [];

const activityTemplates: ActivityTemplate[] = [
  {
    name: "Flight to Sweden",
    cost: 2000,
    category: "transport",
    time: "09:00",
  },
  {
    name: "Museum",
    cost: 200,
    category: "sightseeing",
    time: "11:00",
  },
  { 
    name: "Lunch", 
    cost: 150, 
    category: "food", 
    time: "13:00" 
},
  { 
    name: "Zoo", 
    cost: 300, 
    category: "sightseeing", 
    time: "16:00" 
},
];


// MENU


const mainMenu = async (): Promise<void> => {
  let running = true;

  while (running) {
    const { action } = await inquirer.prompt([
      {
        type: "rawlist",
        name: "action",
        message: "What would you like to do?",
        choices: [
          "Create Trip",
          "Add Activity",
          "View Activities (by day)",
          "Filter activities (by category)",
          "View Budget",
          "Show Destination Info",
          "Exit",
        ],
      },
    ]);

   switch (action) {
  case "Create Trip":
    await handleCreateTrip(trips);
    break;
  case "Add Activity":
    await handleAddActivity(trips, activityTemplates);
    break;
  case "View Activities (by day)":
    await handleViewActivitiesByDate(trips);
    break;
  case "Filter activities (by category)":
    await handleFilterByCategory(trips);
    break;
  case "View Budget":
    await handleViewBudget(trips);
    break;
  case "Show Destination Info":
    await handleShowTripInformation(trips);
    break;
  case "Exit":
    console.log("See you next time!");
    running = false;
    break;
}
}}

const showMenu = async (): Promise<void> => {
  console.clear(); // Makes sure the terminal is cleared before the app runs
  console.log("\n ---- TRAVEL ITINERARY ----");
  await mainMenu();
};

showMenu();
