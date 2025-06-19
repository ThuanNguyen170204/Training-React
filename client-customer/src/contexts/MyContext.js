import { createContext, useState } from "react";

export const MyContext = createContext();

export function MyProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [token, setToken] = useState("");

  return (
    <MyContext.Provider value={{ customer, setCustomer, token, setToken }}>
      {children}
    </MyContext.Provider>
  );
}

export default MyContext;
