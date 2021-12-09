import React, { useState, useEffect } from "react";
import { User } from "../../services-old/AuthenticationService";
import CallingService, { CallManager } from "../../services-old/CallingService";
import DeviceService, { DeviceOptions } from "../../services-old/DeviceService";
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
  const [isMicOn, setIsMicOn] = useState(true); // whether mic is on, set by lobby page, consumed by call page
  const [isCamOn, setIsCamOn] = useState(true); // whether cam is on, set by lobby page, consumed by call page

  // Services
  const callingService = new CallingService();
  const deviceService = new DeviceService();

  // Lifecycle
  useEffect(() => {
    // Initialize call service
    async function initializeCallService() {
      // [1] Setup call manager to be able to make and receive calls
      const callManagerTemp = await callingService.createAndSetupCallManager(
        user.token,
        `${user.firstName} ${user.lastName}`
      );
      setCallManager(callManagerTemp);
      // [2] Attach call listener to be able to listen to call events
      await callingService.attachCallListener(
        callManagerTemp.callAgent,
        setCall
      );
      // [3] Retrieve device manager to be able to manage devices
      const deviceManagerTemp = await deviceService.retrieveDeviceManager(
        callManagerTemp.callClient
      );
      setDeviceManager(deviceManagerTemp);
    }
    if (!callManager) initializeCallService(); // only initialize call service if not yet done so
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
                  userIdentifierObj={user.identifierObj}
                  userToken={user.token}
                  call={call}
                  deviceManager={deviceManager}
                  // deviceOptions={deviceOptions}
                  isMicOnInitially={isMicOn}
                  isCamOnInitially={isCamOn}
                />
              )}
            </>
          ) : (
            <LobbyPage
              user={user}
              callManager={callManager}
              setDeviceOptions={setDeviceOptions}
              setIsMicOn={setIsMicOn}
              setIsCamOn={setIsCamOn}
            />
          )}
        </>
      )}
    </>
  );
};

export default HomePage;
