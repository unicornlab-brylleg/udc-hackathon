import React, { useState, useEffect } from "react";
import AuthenticationPage from "./pages/auth/AuthenticationPage";
import HomePage from "./pages/home/HomePage";
import { User } from "./services-old/AuthenticationService";
import { initializeIcons } from "@fluentui/react/lib/Icons";
import authManager from "./manager/AuthManager";
import {observer} from 'mobx-react-lite';
// import Home from "./pages/home/Home";

function App() {

  const { user } = authManager;

  useEffect(() => {
    initializeIcons();
  }, []);

  useEffect(() => {
    console.log('user changed!', user?.token)
  }, [user]);

  return (
    <>
      {user ? (
        <HomePage user={user} />
      ) : (
        <AuthenticationPage />
      )}
    </>
  );
}

export default observer(App);
