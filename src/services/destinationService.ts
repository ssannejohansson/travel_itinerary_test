import type { DestinationInfo, RestCountry } from "../models.js";

const countryAPI: string = "https://restcountries.com/v3.1/name/";

export const getDestinationInfo = async (
  country: string,
): Promise<DestinationInfo[]> => {
  try {
    const response = await fetch(countryAPI + country);

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data: RestCountry[] = await response.json();
    // Limit to 3 countries
    return data.slice(0, 3).map(
      (country): DestinationInfo => ({
        name: country.name.common,
        capital: country.capital ?? [],
        currency: country.currencies
          ? (Object.keys(country.currencies)[0] ?? "N/A")
          : "N/A",
      }),
    );
  } catch {
    throw new Error("API request failed");
  }
};

//const result = await getDestinationOptions("Sweden");
//console.log(result);
