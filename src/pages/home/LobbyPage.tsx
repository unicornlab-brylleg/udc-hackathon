import React, { useState } from "react";
import { Text } from "@fluentui/react/lib/Text";
import { User } from "../../services/AuthenticationService";
import { Stack } from "@fluentui/react/lib/components/Stack/Stack";
import { TextField } from "@fluentui/react/lib/components/TextField/TextField";
import { Spinner, SpinnerSize } from "@fluentui/react/lib/Spinner";
import { PrimaryButton } from "@fluentui/react/lib/components/Button";
import CallingService, {
  CallManager,
  DeviceOptions,
} from "../../services/CallingService";

type LobbyPageProps = {
  user: User;
};

const LobbyPage = ({ user }: LobbyPageProps) => {
  // States
  const [groupCallID, setGroupCallID] = useState("");
  const [fieldErrorMessage, setfieldErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [callManager, setCallManager] = useState<CallManager | null>(null);
  const [deviceOptions, setDeviceOptions] = useState<DeviceOptions | null>(
    null
  );

  // Services
  const callingService = new CallingService();

  // Methods
  async function joinGroupCall() {
    // Field validation
    if (groupCallID && groupCallID.trim() !== "") {
      setIsLoading(true);
      // Setup call manager
      const callManager = await callingService.createAndSetupCallManager(
        user.token,
        `${user.firstName} ${user.lastName}`
        // updateCall
      );
      setCallManager(callManager);
      // Get call options
      const [callOptions, deviceOptions] = await callingService.getCallOptions(
        true,
        callManager.deviceManager
      );
      setDeviceOptions(deviceOptions);
      // Join group call
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
      <div
        style={{
          border: "1px solid black",
          boxShadow: "0px 0px 10px #959da5",
          padding: 32,
        }}
      >
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
