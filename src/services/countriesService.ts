import { ICountry } from "../types/Country";
import apiClient from "../utils/apiClient";

export const fetchCountries = async (): Promise<ICountry[]> => {
  const { data } = await apiClient.get<ICountry[]>('');
  return data;
};