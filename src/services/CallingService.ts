import {
  CallClient,
  CallAgent,
  DeviceManager,
  LocalVideoStream,
} from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";

// Extend global window type to add callAgent property to satisfy TS
declare global {
  interface Window {
    callAgent: CallAgent;
  }
}

type CallManager = {
  callAgent: CallAgent;
  deviceManager: DeviceManager;
};

type CallOptions = {
  videoOptions: {
    localVideoStreams: LocalVideoStream[];
  };
  audioOptions: {
    muted: boolean;
  };
};

type DeviceOptions = {
  selectedCameraDeviceId: string;
  cameraDeviceOptions: Device[];
  selectedSpeakerDeviceId: string;
  speakerDeviceOptions: Device[];
  selectedMicrophoneDeviceId: string;
  microphoneDeviceOptions: Device[];
  deviceManagerWarning: string;
};

type Device = {
  key: string;
  text: string;
};

class CallingService {
  // Create call manager
  async createAndSetupCallManager(
    userToken: string,
    userDisplayName: string,
    updatedCallState: Function
  ): Promise<CallManager> {
    try {
      console.log("Creating and setting up call manager...");
      // Retrieve token
      const tokenCredential = new AzureCommunicationTokenCredential(userToken);
      // Setup call agent
      const callClient = new CallClient();
      const callAgent = await callClient.createCallAgent(tokenCredential, {
        displayName: userDisplayName,
      });
      window.callAgent = callAgent;
      // Attach call listener
      callAgent.on("callsUpdated", (e) => {
        console.log(`callsUpdated, added=${e.added}, removed=${e.removed}`);

        e.added.forEach((call) => {
          updatedCallState(call);
          //   this.setState({ call: call });
          //   const diagnosticChangedListener = (diagnosticInfo) => {
          //     const rmsg = `UFD Diagnostic changed:
          //         Diagnostic: ${diagnosticInfo.diagnostic}
          //         Value: ${diagnosticInfo.value}
          //         Value type: ${diagnosticInfo.valueType}
          //         Media type: ${diagnosticInfo.mediaType}`;
          //     if (this.state.ufdMessages.length > 0) {
          //       this.setState({ ufdMessages: [...this.state.ufdMessages, rmsg] });
          //     } else {
          //       this.setState({ ufdMessages: [rmsg] });
          //     }
          //   };
          //   call
          //     .api(Features.Diagnostics)
          //     .media.on("diagnosticChanged", diagnosticChangedListener);
          //   call
          //     .api(Features.Diagnostics)
          //     .network.on("diagnosticChanged", diagnosticChangedListener);
        });

        e.removed.forEach((call) => {
          console.log(
            `callEndReason: ${call.callEndReason?.code} ${call.callEndReason?.subCode}`
          );
          updatedCallState(null);
          //   if (this.state.call && this.state.call === call) {
          //     this.displayCallEndReason(this.state.call.callEndReason);
          //   }
        });
      });
      // Setup device manager and retrieve permissions
      const deviceManager = await callClient.getDeviceManager();
      console.log(`deviceManager: ${deviceManager.selectedSpeaker?.name}`);
      await deviceManager.askDevicePermission({ audio: true, video: true });
      console.log("Call manager created and setup successfully!");
      return { callAgent, deviceManager };
    } catch (error) {
      console.error(`Error setting up call manager!`);
      throw Error("Error setting up call manager!");
    }
  }
  // Get call options
  async getCallOptions(
    withVideo: boolean,
    deviceManager: DeviceManager
  ): Promise<[CallOptions, DeviceOptions]> {
    let callOptions: CallOptions = {
      videoOptions: {
        localVideoStreams: [],
      },
      audioOptions: {
        muted: false,
      },
    };

    let deviceOptions: DeviceOptions = {
      selectedCameraDeviceId: "",
      cameraDeviceOptions: [],
      selectedSpeakerDeviceId: "",
      speakerDeviceOptions: [],
      selectedMicrophoneDeviceId: "",
      microphoneDeviceOptions: [],
      deviceManagerWarning: "",
    };

    let cameraWarning = undefined;
    let speakerWarning = undefined;
    let microphoneWarning = undefined;

    // On iOS, device permissions are lost after a little while, so re-ask for permissions
    await deviceManager.askDevicePermission({ video: true, audio: true });

    // Get first (primary) camera
    const cameras = await deviceManager.getCameras();
    const cameraDevice = cameras[0];
    if (cameraDevice && cameraDevice?.id !== "camera:") {
      deviceOptions.selectedCameraDeviceId = cameraDevice?.id;
      deviceOptions.cameraDeviceOptions = cameras.map((camera) => {
        return { key: camera.id, text: camera.name };
      });
    }
    if (withVideo) {
      try {
        if (!cameraDevice || cameraDevice?.id === "camera:") {
          throw new Error("No camera devices found.");
        } else if (cameraDevice) {
          callOptions.videoOptions = {
            localVideoStreams: [new LocalVideoStream(cameraDevice)],
          };
        }
      } catch (error: any) {
        cameraWarning = error.message;
      }
    }

    try {
      const speakers = await deviceManager.getSpeakers();
      const speakerDevice = speakers[0];
      if (!speakerDevice || speakerDevice.id === "speaker:") {
        throw new Error("No speaker devices found.");
      } else if (speakerDevice) {
        deviceOptions.selectedSpeakerDeviceId = speakerDevice.id;
        deviceOptions.speakerDeviceOptions = speakers.map((speaker) => {
          return { key: speaker.id, text: speaker.name };
        });
        await deviceManager.selectSpeaker(speakerDevice);
      }
    } catch (error: any) {
      speakerWarning = error.message;
    }

    try {
      const microphones = await deviceManager.getMicrophones();
      const microphoneDevice = microphones[0];
      if (!microphoneDevice || microphoneDevice.id === "microphone:") {
        throw new Error("No microphone devices found.");
      } else {
        deviceOptions.selectedMicrophoneDeviceId = microphoneDevice.id;
        deviceOptions.microphoneDeviceOptions = microphones.map(
          (microphone) => {
            return { key: microphone.id, text: microphone.name };
          }
        );
        await deviceManager.selectMicrophone(microphoneDevice);
      }
    } catch (error: any) {
      microphoneWarning = error.message;
    }

    if (cameraWarning || speakerWarning || microphoneWarning) {
      deviceOptions.deviceManagerWarning = `${
        cameraWarning ? cameraWarning + " " : ""
      } ${speakerWarning ? speakerWarning + " " : ""} ${
        microphoneWarning ? microphoneWarning + " " : ""
      }`;
      console.warn(deviceOptions.deviceManagerWarning);
    }

    return [callOptions, deviceOptions];
  }
}

export type { CallManager, CallOptions, DeviceOptions };
export default CallingService;
