import React, { useState } from "react";
import AuthenticationPage from "./pages/auth/AuthenticationPage";
import HomePage from "./pages/home/HomePage";
import { User } from "./services/AuthenticationService";
// import Home from "./pages/home/Home";

function App() {
  // Shared states
  const [user, setUser] = useState<User | null>(null); // Determines whether to render Auth or Home page

  return (
    <>
      {user ? (
        <HomePage user={user} />
      ) : (
        <AuthenticationPage setUser={setUser} />
      )}
    </>
  );
}

export default App;
