import React, { useState } from "react";
import { cardStyle } from "../../../shared/styles";
import { Text } from "@fluentui/react/lib/Text";
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

  return (
    <div style={cardStyle}>
      <Stack horizontal>
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
      </Stack>
    </div>
  );
};

export default ControlBar;
