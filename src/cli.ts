import inquirer from "inquirer";
import type { Trip } from "./models.js";
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

const activityTemplates = [
  {
    name: "Flight to Sweden",
    cost: 2000,
    category: "transport" as const,
    time: "09:00",
  },
  {
    name: "Museum",
    cost: 200,
    category: "sightseeing" as const,
    time: "11:00",
  },
  { 
    name: "Lunch", 
    cost: 150, 
    category: "food" as const, 
    time: "13:00" 
},
  { 
    name: "Zoo", 
    cost: 300, 
    category: "sightseeing" as const, 
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
          "Filter activities (cy category)",
          "View Budget",
          "Show Destination Info",
          "Exit",
        ],
      },
    ]);

    if (action === "Create Trip") {
      await handleCreateTrip(trips);
    }

    if (action === "Add Activity") {
      await handleAddActivity(trips, activityTemplates);
    }

    if (action === "View Activities (by day)") {
      await handleViewActivitiesByDate(trips);
    }

    if (action === "Filter activities (cy category)") {
      await handleFilterByCategory(trips);
    }

    if (action === "View Budget") {
        await handleViewBudget(trips);
    }

    if (action === "Show Destination Info") {
      await handleShowTripInformation(trips);
    }

    if (action === "Exit") {
      console.log("See you next time!");
      running = false;
      break;
    }
  }
};

const showMenu = (): void => {
  console.clear(); // Makes sure the terminal is cleared before the app runs
  console.log("\n ---- TRAVEL ITINERARY ----");
  mainMenu();
};

showMenu();
