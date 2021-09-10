import React, { useState } from "react";
import Authentication from "./pages/auth/Authentication";
import Home from "./pages/home/Home";
import { User } from "./services/AuthenticationService";
// import Home from "./pages/home/Home";

function App() {
  // Global App State
  const [user, setUser] = useState<User | null>(null);

  return (
    <>{user ? <Home user={user} /> : <Authentication setUser={setUser} />}</>
  );
}

export default App;
