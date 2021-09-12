import React, { useState } from "react";
import { cardStyle } from "../../../shared/styles";
import { Stack } from "@fluentui/react/lib/Stack";
import { IconButton } from "@fluentui/react/lib/components/Button";
import {
  Call,
  DeviceManager,
  LocalVideoStream,
} from "@azure/communication-calling";

type ControlBarProps = {
  call: Call;
  deviceManager: DeviceManager;
  selectedCameraID: string;
  setSelectedCameraID: Function;
};

const ControlBar = ({
  call,
  deviceManager,
  selectedCameraID,
  setSelectedCameraID,
}: ControlBarProps) => {
  // Local States
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isSharingScreen, setIsSharingScreen] = useState(false);

  // Handle video on and off
  async function handleVideoOnOff() {
    try {
      const cameras = await deviceManager.getCameras();
      const cameraDeviceInfo = cameras.find((cameraDeviceInfo) => {
        return cameraDeviceInfo.id === selectedCameraID;
      });
      let localVideoStream: LocalVideoStream;
      if (selectedCameraID) {
        localVideoStream = new LocalVideoStream(cameraDeviceInfo!);
      } else if (!isVideoOn) {
        const cameras = await deviceManager.getCameras();
        localVideoStream = new LocalVideoStream(cameras[0]);
      }

      if (call.localVideoStreams[0]) {
        await call.stopVideo(call.localVideoStreams[0]);
      } else {
        await call.startVideo(localVideoStream!);
      }
      setIsVideoOn(call.localVideoStreams[0] ? true : false);
    } catch (e) {
      console.error(e);
    }
  }

  // Handle mic on and off
  async function handleMicOnOff() {
    try {
      if (!call.isMuted) {
        await call.mute();
      } else {
        await call.unmute();
      }
      setIsMicOn(!call.isMuted);
    } catch (e) {
      console.error(e);
    }
  }

  // Handle screen sharing on and off
  async function handleScreenSharingOnOff() {
    try {
      if (call.isScreenSharingOn) {
        await call.stopScreenSharing();
      } else {
        await call.startScreenSharing();
      }
      setIsSharingScreen(call.isScreenSharingOn);
    } catch (e) {
      console.error(e);
    }
  }

  // Handle drop call
  async function dropCall() {
    call.hangUp();
  }

  return (
    <div style={cardStyle}>
      <Stack horizontal tokens={{ childrenGap: 8 }}>
        <IconButton
          iconProps={{ iconName: isVideoOn ? "Video" : "VideoOff" }}
          onClick={handleVideoOnOff}
          style={{ color: "black" }}
        />
        <IconButton
          iconProps={{ iconName: isMicOn ? "Microphone" : "MicOff" }}
          onClick={handleMicOnOff}
          style={{ color: "black" }}
        />
        <IconButton
          iconProps={{ iconName: isSharingScreen ? "Cancel" : "ScreenCast" }}
          onClick={handleScreenSharingOnOff}
          style={{ color: "black" }}
        />
        <IconButton
          iconProps={{ iconName: "DeclineCall" }}
          onClick={dropCall}
          style={{ color: "red" }}
        />
      </Stack>
    </div>
  );
};

export default ControlBar;
