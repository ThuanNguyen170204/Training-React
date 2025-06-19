import React from "react";
import { useState } from "react";
const MyContext = React.createContext();

export const MyProvider = ({ children }) => {
  const [message, setMessage] = useState("");

  return (
    <MyContext.Provider value={{ message, setMessage }}>
      {children}
    </MyContext.Provider>
  );
};
export default MyContext;
