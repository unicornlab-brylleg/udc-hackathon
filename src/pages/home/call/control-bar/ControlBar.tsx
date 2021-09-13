import React, { useState, useEffect } from "react";
import { cardStyle } from "../../../shared/styles";
import { Stack } from "@fluentui/react/lib/Stack";
import { IconButton } from "@fluentui/react/lib/components/Button";
import {
  Call,
  DeviceManager,
  DiagnosticChangedEventArgs,
  Features,
  LocalVideoStream,
} from "@azure/communication-calling";
import { Icon } from "@fluentui/react";

type ControlBarProps = {
  call: Call;
  deviceManager: DeviceManager;
  selectedCameraID: string;
  setSelectedCameraID: Function;
  isMicOnInitially: boolean;
  isCamOnInitially: boolean;
};

type NetworkQuality = "" | "Good" | "Poor" | "Bad";
type NetworkQualityColor = "black" | "green" | "yellow" | "red";

const ControlBar = ({
  call,
  deviceManager,
  selectedCameraID,
  setSelectedCameraID,
  isMicOnInitially,
  isCamOnInitially,
}: ControlBarProps) => {
  // Local States
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(isMicOnInitially);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [networkQuality, setNetworkQuality] = useState<NetworkQuality>("");

  useEffect(() => {
    async function onMount() {
      // console.log(`isCamOnInitially: ${isCamOnInitially}`);
      // if (!isCamOnInitially && call.localVideoStreams[0])
      // call.stopVideo(call.localVideoStreams[0]);
      console.log(`isMicOnInitially: ${isMicOnInitially}`);
      if (!isMicOnInitially) call.mute();
      // Attach listener to determine network quality
      const networkQualityListener = (
        diagnosticInfo: DiagnosticChangedEventArgs
      ) => {
        const networkQuality = diagnosticInfo.value.valueOf();
        let networkQualityString: NetworkQuality;
        if (networkQuality === 1) networkQualityString = "Good";
        else if (networkQuality === 2) networkQualityString = "Poor";
        else networkQualityString = "Bad";
        console.log(`Network Quality: ${networkQualityString}`);
        setNetworkQuality(networkQualityString);
      };
      call
        .api(Features.Diagnostics)
        .network.on("diagnosticChanged", networkQualityListener);
    }
    onMount();
  }, []); // Or [] if effect doesn't need props or state

  // Handle video on and off
  async function handleVideoOnOff() {
    console.log(`Turning video ${isVideoOn}`);
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
    console.log(`Turning mic ${isMicOn}`);
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

  // Get the color assigned to a specific network quality
  function getNetworkQualityColor(
    networkQuality: NetworkQuality
  ): NetworkQualityColor {
    if (networkQuality === "Good") return "green";
    else if (networkQuality === "Poor") return "yellow";
    else if (networkQuality === "Bad") return "red";
    else return "black";
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
        <Stack.Item align="center">
          <Icon
            iconName="NetworkTower"
            style={{ color: getNetworkQualityColor(networkQuality) }}
          />
        </Stack.Item>
      </Stack>
    </div>
  );
};

export default ControlBar;
