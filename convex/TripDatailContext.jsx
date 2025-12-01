import { createContext, useContext } from "react";

export const TripDetailContext = createContext(null);

export const useTripDetail = () => useContext(TripDetailContext);
