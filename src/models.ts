export type Activity = {
  id: string;
  name: string;
  cost: number;
  category: "food" | "transport" | "sightseeing";
  startTime: Date;
};
export type Trip = {
  id: string;
  destination: string;
  startDate: Date;
  activities: Activity[];
};

export type ActivityTemplate = {
  name: string;
  cost: number;
  category: Activity["category"];
};

export type DestinationInfo = {
  name: string;
  capital: string[] | string;
  currency: string;
};