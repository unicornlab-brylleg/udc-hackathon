import React from "react";
import CallCard from "./CallCard";
import { Call, DeviceManager } from "@azure/communication-calling";
import { DeviceOptions } from "../../../services/DeviceService";

type CallPageProps = {
  call: Call;
  deviceManager: DeviceManager;
  deviceOptions: DeviceOptions;
};

const CallPage = ({ call, deviceManager, deviceOptions }: CallPageProps) => {
  return (
    <CallCard
      call={call}
      deviceManager={deviceManager}
      selectedCameraDeviceId={deviceOptions?.selectedCameraDeviceId}
      cameraDeviceOptions={deviceOptions?.cameraDeviceOptions}
      speakerDeviceOptions={deviceOptions?.speakerDeviceOptions}
      microphoneDeviceOptions={deviceOptions?.microphoneDeviceOptions}
      onShowCameraNotFoundWarning={(show: unknown) => {
        console.warn("Camera not found!");
        // this.setState({ showCameraNotFoundWarning: show });
      }}
      onShowSpeakerNotFoundWarning={(show: unknown) => {
        console.warn("Speaker not found!");
        // this.setState({ showSpeakerNotFoundWarning: show });
      }}
      onShowMicrophoneNotFoundWarning={(show: unknown) => {
        console.warn("Microphone not found!");
        // this.setState({ showMicrophoneNotFoundWarning: show });
      }}
    />
    // <></>
  );
};

export default CallPage;
