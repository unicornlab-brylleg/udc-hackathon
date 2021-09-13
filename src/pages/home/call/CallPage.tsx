import React, { useState, useEffect } from "react";
import {
  Call,
  DeviceManager,
  RemoteParticipant,
} from "@azure/communication-calling";
import { DeviceOptions } from "../../../services/DeviceService";
import { Stack } from "@fluentui/react/lib/Stack";
import SidePane from "./side-pane/SidePane";
import CallingService, {
  ParticipantStream,
} from "../../../services/CallingService";
import ControlBar from "./control-bar/ControlBar";
import VideoPane from "./video-pane/VideoPane";

type CallPageProps = {
  call: Call;
  deviceManager: DeviceManager;
  // deviceOptions: DeviceOptions;
  isMicOnInitially: boolean;
  isCamOnInitially: boolean;
};

const CallPage = ({
  call,
  deviceManager,
  // deviceOptions,
  isMicOnInitially,
  isCamOnInitially,
}: CallPageProps) => {
  // Shared states
  const [remoteParticipants, setRemoteParticipants] = useState<
    RemoteParticipant[]
  >([]);
  const [remoteParticipantStreams, setRemoteParticipantStreams] = useState<
    ParticipantStream[]
  >([]);
  const [selectedCameraID, setSelectedCameraID] = useState("");

  // Services
  const callingService = new CallingService();

  // Lifecycle
  useEffect(() => {
    // Attach needed listeners
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
    // Subscribe to remote participant streams
    call.remoteParticipants.forEach((rp) =>
      // this.subscribeToRemoteParticipant(rp)
      callingService.subscribeToRemoteParticipant(
        rp,
        remoteParticipants,
        setRemoteParticipants,
        remoteParticipantStreams,
        setRemoteParticipantStreams
      )
    );
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
        <ControlBar
          call={call}
          deviceManager={deviceManager}
          selectedCameraID={selectedCameraID}
          setSelectedCameraID={setSelectedCameraID}
          isMicOnInitially={isMicOnInitially}
          isCamOnInitially={isCamOnInitially}
        />
        {/* Main Panel */}
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
          <VideoPane
            call={call}
            remoteParticipantStreams={remoteParticipantStreams}
          />
          {/* Side Pane */}
          <SidePane call={call} remoteParticipants={remoteParticipants} />
        </Stack>
      </Stack>
    </div>
  );
};

export default CallPage;
