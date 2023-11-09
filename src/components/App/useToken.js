import {createContext, useContext, useState} from 'react';

const TokenContext = createContext();


export function TokenContextProvider({children}) {
  const storageKey = 'token';
  const getToken = () => {
    const tokenString = localStorage.getItem(storageKey);
    const userToken = JSON.parse(tokenString);
    return userToken?.token
  };


  const saveToken = userToken => {
    localStorage.setItem(storageKey, JSON.stringify(userToken));
    setToken(userToken.token);
  };

  const clearToken = () => {
    localStorage.removeItem(storageKey);
    setToken(null);
  };

  const [token, setToken] = useState(getToken());
  return <TokenContext.Provider value={{
    setToken: saveToken,
    clearToken,
    token
  }}>{children}</TokenContext.Provider>;
}
export function useToken() {
  return useContext(TokenContext);
}
