import React, { useState } from "react";
import { User } from "../../services/AuthenticationService";
import CallPage from "./CallPage";
import LobbyPage from "./LobbyPage";

type HomePageProps = {
  user: User;
};

const HomePage = ({ user }: HomePageProps) => {
  // Home maintains the shared Call state
  const [call, setCall] = useState(null);

  return <>{call ? <CallPage call={call} /> : <LobbyPage user={user} />}</>;
};

export default HomePage;
