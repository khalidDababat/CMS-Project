import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // user = {username ="Admin"}
  const [loading, setLoading] = useState(true);


  useEffect(() =>{
    const storedUser =localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if(storedUser && storedToken){
      setUser(JSON.parse(storedUser));
    } 

    setLoading(false);
  },[])

  const login = (userData) => {
    //console.log("eeeeeeeeeee", userData);
    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };
  const logOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logOut ,loading  }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
