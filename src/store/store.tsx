import { createContext, useContext } from "react";
import RootStore from "./RootStore";

const context = createContext({
  rootStore: new RootStore()
});

export const useContextRootStore = () => useContext(context);
