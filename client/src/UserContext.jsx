import {createContext, useEffect, useState} from "react";
import axios from "axios";
import {data} from "autoprefixer";

export const UserContext = createContext({});

export function UserContextProvider({children}) {
  const [user,setUser] = useState(null);
  const [ready,setReady] = useState(false);
  useEffect(() => {
    if (!user) {
      axios.get('/profile').then(({data}) => {
        setUser(data);
        setReady(true);
      });
    }
  }, []);
  return (
    <UserContext.Provider value={{user,setUser,ready}}>
      {children}
    </UserContext.Provider>
  );
}



  // export function UserContextProvider({ children }) {
  //   const [user, setUser] = useState(null);
  //   const [ready, setReady] = useState(false);
  
  //   useEffect(() => {
  //     async function fetchUser() {
  //       try {
  //         const { data } = await axios.get('/account');
  //         setUser(data);
  //       } catch (error) {
  //         console.error("Error fetching profile:", error);
  //       } finally {
  //         setReady(true);
  //       }
  //     }
  //     fetchUser();
  //   }, []);