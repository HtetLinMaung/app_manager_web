import { createContext, useReducer } from "react";

export const appContext = createContext(null);

const map = {
  Application: [],
};

const initialState = {
  sortItems: { ...map },
  loading: false,
  token: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_STATE":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default function AppProvider({ children }) {
  return (
    <appContext.Provider value={useReducer(reducer, initialState)}>
      {children}
    </appContext.Provider>
  );
}
