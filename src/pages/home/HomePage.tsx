import React, { useState, useEffect } from "react";
import { User } from "../../services/AuthenticationService";
import CallingService, { CallManager } from "../../services/CallingService";
import DeviceService, { DeviceOptions } from "../../services/DeviceService";
import LoadingPage from "../shared/LoadingPage";
import CallPage from "./call/CallPage";
import LobbyPage from "./lobby/LobbyPage";
import { DeviceManager } from "@azure/communication-calling";

type HomePageProps = {
  user: User;
};

const HomePage = ({ user }: HomePageProps) => {
  // Shared States
  const [call, setCall] = useState(null); // Determines whether to render Lobby or Call page
  const [callManager, setCallManager] = useState<CallManager | null>(null); // Manages calls; configured onMount
  const [deviceManager, setDeviceManager] = useState<DeviceManager | null>(
    null
  ); // Manages devices and permissions; configured onMount
  const [deviceOptions, setDeviceOptions] = useState<DeviceOptions | null>(
    null
  ); // Contains data on device options for a call; set by Lobby Page upon joining a call

  // Services
  const callingService = new CallingService();
  const deviceService = new DeviceService();

  // Lifecycle
  useEffect(() => {
    // Initialize call service
    async function initializeCallService() {
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
      // Retrieve device manager
      const deviceManagerTemp = await deviceService.retrieveDeviceManager(
        callManagerTemp.callClient
      );
      setDeviceManager(deviceManagerTemp);
    }
    if (!callManager) initializeCallService();
    // TODO: Clean up call service
    // return () => {
    //   callingService.detachCallListener(callManager!.callAgent);
    // };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callManager, user.firstName, user.lastName, user.token]);

  // UI
  return (
    // Wait for useEffect/onMount to setup Call and Device Managers // TODO: Handle scenario where setup fails
    <>
      {callManager === null || deviceManager === null ? (
        <LoadingPage loadingMessage="Initializing call service..." />
      ) : (
        // Render Call or Lobby page based on Call state
        <>
          {call ? (
            // Wait for Lobby Page to configure Device Options state // TODO: Handle scenario where configuration fails
            <>
              {deviceOptions === null ? (
                <LoadingPage loadingMessage="Joining call..." />
              ) : (
                <CallPage
                  call={call}
                  deviceManager={deviceManager}
                  deviceOptions={deviceOptions}
                />
              )}
            </>
          ) : (
            <LobbyPage
              user={user}
              callManager={callManager}
              setDeviceOptions={setDeviceOptions}
            />
          )}
        </>
      )}
    </>
  );
};

export default HomePage;
