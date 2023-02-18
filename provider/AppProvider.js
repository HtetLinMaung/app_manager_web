import { createContext, useReducer } from "react";

export const appContext = createContext(null);

const map = {
  Application: [],
  Container: [],
  Database: [],
  Deployment: [],
};

const initialState = {
  sortItems: { ...map },
  loading: false,
  token: "",
  containerIds: {},
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_STATE":
      return { ...state, ...action.payload };
    case "SET_CONTAINER_ID":
      return {
        ...state,
        containerIds: { ...state.containerIds, ...action.payload },
      };
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
