import type { DestinationInfo } from "../models.js";

export const getDestinationInfo = async (searchTerm: string): Promise<DestinationInfo[]> => {
  const response = await fetch(
    `https://restcountries.com/v3.1/name/${searchTerm}`,
  );

  if (!response.ok) {
    throw new Error("API request failed");
  }

  const data = await response.json();

  // Limit to 3 countries
  return data.slice(0, 3).map((country: any) => ({
    name: country.name.common,
    capital: country.capital,
    currency: country.currencies ? Object.keys(country.currencies)[0] : "N/A",
  }));
};

//const result = await getDestinationOptions("Sweden");
//console.log(result);




