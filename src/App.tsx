import React, { useState } from "react";
import AuthenticationPage from "./pages/auth/AuthenticationPage";
import HomePage from "./pages/home/HomePage";
import { User } from "./services/AuthenticationService";
// import Home from "./pages/home/Home";

function App() {
  // App maintains the global User state
  const [user, setUser] = useState<User | null>(null);

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
