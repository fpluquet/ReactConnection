import React, { useState } from 'react';
import {BrowserRouter, Route, Routes, Switch} from 'react-router-dom';
import './App.css';
import Login from '../Login/Login';
import Dashboard from '../Dashboard/Dashboard';
import Preferences from '../Preferences/Preferences';

import {TokenContextProvider, useToken} from './useToken';

function App() {
  return (
    <TokenContextProvider>
      <InnerApp/>
    </TokenContextProvider>
  );
}
function InnerApp() {
  const { token, setToken } = useToken();
  if(!token) {
    return <Login setToken={setToken} />
  }
  return (
    <div className="wrapper">
      <h1>Application</h1>
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<Dashboard/>}>
          </Route>
          <Route path="/preferences" element={<Preferences/>}>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
