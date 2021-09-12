import React, { useState, useEffect } from "react";
import CallCard from "./CallCard";
import {
  Call,
  DeviceManager,
  RemoteParticipant,
  RemoteVideoStream,
} from "@azure/communication-calling";
import { DeviceOptions } from "../../../services/DeviceService";
import { Text } from "@fluentui/react/lib/Text";
import { Stack } from "office-ui-fabric-react/lib/components/Stack";
import SidePane from "./side-pane/SidePane";
import { cardStyle } from "../../shared/styles";
import CallingService from "../../../services/CallingService";

type CallPageProps = {
  call: Call;
  deviceManager: DeviceManager;
  deviceOptions: DeviceOptions;
};

const CallPage = ({ call, deviceManager, deviceOptions }: CallPageProps) => {
  // Shared states
  const [remoteParticipants, setRemoteParticipants] = useState<
    RemoteParticipant[]
  >([]);
  const [remoteParticipantStreams, setRemoteParticipantStreams] = useState<
    RemoteVideoStream[]
  >([]);

  // Services
  const callingService = new CallingService();

  // Lifecycle
  useEffect(() => {
    async function attachListeners() {
      await callingService.attachParticipantsListener(
        call,
        remoteParticipants,
        setRemoteParticipants,
        remoteParticipantStreams,
        setRemoteParticipantStreams
      );
    }
    attachListeners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Or [] if effect doesn't need props or state

  return (
    // <CallCard
    //   call={call}
    //   deviceManager={deviceManager}
    //   selectedCameraDeviceId={deviceOptions?.selectedCameraDeviceId}
    //   cameraDeviceOptions={deviceOptions?.cameraDeviceOptions}
    //   speakerDeviceOptions={deviceOptions?.speakerDeviceOptions}
    //   microphoneDeviceOptions={deviceOptions?.microphoneDeviceOptions}
    //   onShowCameraNotFoundWarning={(show: unknown) => {
    //     console.warn("Camera not found!");
    //     // this.setState({ showCameraNotFoundWarning: show });
    //   }}
    //   onShowSpeakerNotFoundWarning={(show: unknown) => {
    //     console.warn("Speaker not found!");
    //     // this.setState({ showSpeakerNotFoundWarning: show });
    //   }}
    //   onShowMicrophoneNotFoundWarning={(show: unknown) => {
    //     console.warn("Microphone not found!");
    //     // this.setState({ showMicrophoneNotFoundWarning: show });
    //   }}
    // />
    <div
      style={{
        height: "100vh",
        width: "100vw",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack
        tokens={{ childrenGap: 20 }}
        style={{
          alignItems: "center",
          justifyItems: "center",
          padding: 16,
        }}
      >
        {/* Control Bar */}
        <Stack.Item grow>
          <div style={cardStyle}>
            <Text variant="xLarge">Control Bar</Text>
          </div>
        </Stack.Item>
        {/* Main Panel */}
        <Stack.Item grow>
          <Stack
            tokens={{ childrenGap: 20 }}
            style={{
              alignItems: "center",
              justifyItems: "center",
              // padding: 16,
            }}
            horizontal
          >
            {/* Video Pane */}
            <Stack.Item grow>
              <div style={cardStyle}>
                <Text variant="xLarge">Video Pane</Text>
              </div>
            </Stack.Item>
            {/* Side Pane */}
            <Stack.Item grow>
              <div style={cardStyle}>
                <SidePane call={call} remoteParticipants={remoteParticipants} />
              </div>
            </Stack.Item>
          </Stack>
        </Stack.Item>
      </Stack>
    </div>
  );
};

export default CallPage;
