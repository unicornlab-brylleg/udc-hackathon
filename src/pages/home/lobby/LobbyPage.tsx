import React, { useState } from "react";
import { Text } from "@fluentui/react/lib/Text";
import { User } from "../../../services/AuthenticationService";
import { Stack } from "@fluentui/react/lib/components/Stack/Stack";
import { TextField } from "@fluentui/react/lib/components/TextField/TextField";
import { Spinner, SpinnerSize } from "@fluentui/react/lib/Spinner";
import { PrimaryButton } from "@fluentui/react/lib/components/Button";
import { CallManager } from "../../../services/CallingService";
import DeviceService from "../../../services/DeviceService";
import { mainCardStyle } from "../../shared/styles";
import { Icon } from "@fluentui/react/lib/components/Icon";
import { Toggle } from "@fluentui/react/lib/components/Toggle";

type LobbyPageProps = {
  user: User;
  callManager: CallManager;
  setDeviceOptions: Function;
  setIsMicOn: Function;
  setIsCamOn: Function;
};

const LobbyPage = ({
  user,
  callManager,
  setDeviceOptions,
  setIsMicOn,
  setIsCamOn,
}: LobbyPageProps) => {
  // Local States
  const [groupCallID, setGroupCallID] = useState(
    "29228d3e-040e-4656-a70e-890ab4e173e5"
  );
  const [fieldErrorMessage, setfieldErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMicOnLocal, setIsMicOnLocal] = useState(true); // whether mic is on, local state
  const [isCamOnLocal, setIsCamOnLocal] = useState(true); // whether cam is on, local state

  // Services
  const deviceService = new DeviceService();

  // Methods
  async function joinGroupCall() {
    // Field validation
    if (groupCallID && groupCallID.trim() !== "") {
      setIsLoading(true);
      // [1] Get call and device options options
      const deviceManager = await deviceService.retrieveDeviceManager(
        callManager.callClient
      );
      const [callOptions, deviceOptions] =
        await deviceService.getCallAndDeviceOptions(true, deviceManager);
      setDeviceOptions(deviceOptions);
      // setDeviceOptions(deviceOptions);
      // [2] Set shared mic and cam states
      setIsMicOn(isMicOnLocal);
      setIsCamOn(isCamOnLocal);
      // [3] Join group call
      callManager.callAgent.join({ groupId: groupCallID }, callOptions);
      setIsLoading(false);
    } else setfieldErrorMessage("Please enter a group ID!");
  }

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
      }}
    >
      {/* Center Card */}
      <div style={mainCardStyle}>
        <Stack
          tokens={{ childrenGap: 20 }}
          style={{ alignItems: "center", justifyItems: "center" }}
        >
          <Text variant="xLarge">
            Welcome, {user.firstName} {user.lastName}!
          </Text>
          {/* Group ID Field */}
          <TextField
            required
            label="Group Call ID"
            value={groupCallID}
            onChange={(event, text) => setGroupCallID(text ?? "")}
            errorMessage={fieldErrorMessage}
          />
          {/* Join Button */}
          {isLoading ? (
            <Spinner size={SpinnerSize.large}></Spinner>
          ) : (
            <PrimaryButton onClick={joinGroupCall}>Join Call</PrimaryButton>
          )}
          {/* Mic and Video Options */}
          <Stack horizontal tokens={{ childrenGap: 5 }}>
            <Icon iconName={isMicOnLocal ? "Microphone" : "MicOff"} />
            <Toggle
              defaultChecked
              onChange={(evt, value) => setIsMicOnLocal(value ?? true)}
            />
            <div style={{ width: 10 }} />
            <Icon iconName={isCamOnLocal ? "Video" : "VideoOff"} />
            <Toggle
              defaultChecked
              onChange={(evt, value) => setIsCamOnLocal(value ?? true)}
            />
          </Stack>
        </Stack>
      </div>
    </div>
  );
};

export default LobbyPage;
