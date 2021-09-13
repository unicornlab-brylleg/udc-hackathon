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

type LobbyPageProps = {
  user: User;
  callManager: CallManager;
  setDeviceOptions: Function;
};

const LobbyPage = ({ user, callManager, setDeviceOptions }: LobbyPageProps) => {
  // Local States
  const [groupCallID, setGroupCallID] = useState(
    "29228d3e-040e-4656-a70e-890ab4e173e5"
  );
  const [fieldErrorMessage, setfieldErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      // [2] Join group call
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
          <TextField
            required
            label="Group Call ID"
            value={groupCallID}
            onChange={(event, text) => setGroupCallID(text ?? "")}
            errorMessage={fieldErrorMessage}
          />
          {isLoading ? (
            <Spinner size={SpinnerSize.large}></Spinner>
          ) : (
            <PrimaryButton onClick={joinGroupCall}>Join Call</PrimaryButton>
          )}
        </Stack>
      </div>
    </div>
  );
};

export default LobbyPage;
