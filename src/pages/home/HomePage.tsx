import React, { useState, useEffect } from "react";
import { User } from "../../services/AuthenticationService";
import CallingService, { CallManager } from "../../services/CallingService";
import LoadingPage from "../shared/LoadingPage";
import CallPage from "./CallPage";
import LobbyPage from "./LobbyPage";

type HomePageProps = {
  user: User;
};

const HomePage = ({ user }: HomePageProps) => {
  // Home maintains the shared Call and CallManager state
  const [call, setCall] = useState(null);
  const [callManager, setCallManager] = useState<CallManager | null>(null);

  // Lifecycle
  useEffect(() => {
    // Initialize call service
    async function initializeCallService() {
      // Services
      const callingService = new CallingService();
      // Setup call manager
      const callManagerTemp = await callingService.createAndSetupCallManager(
        user.token,
        `${user.firstName} ${user.lastName}`
      );
      setCallManager(callManagerTemp);
      // Attach call listener
      await callingService.attachCallListener(
        callManagerTemp.callAgent,
        setCall
      );
    }
    if (!callManager) initializeCallService();
    // TODO: Clean up call service
    // return () => {
    //   callingService.detachCallListener(callManager!.callAgent);
    // };
  }, [callManager, user.firstName, user.lastName, user.token]);

  return (
    <>
      {callManager === null ? (
        <LoadingPage loadingMessage="Initializing call service..." />
      ) : (
        <>
          {call ? (
            <CallPage call={call} />
          ) : (
            <LobbyPage user={user} callManager={callManager} />
          )}
        </>
      )}
    </>
  );
};

export default HomePage;
