import { createContext } from "react";

export const DataContext = createContext();

export const ContextProvider = ({children}) => {
    const status = ["Active", "Inactive"];
   
    return(
        <DataContext.Provider value={{status}}>
            {children}
        </DataContext.Provider>
    )
}