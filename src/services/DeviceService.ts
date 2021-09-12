import {
  CallClient,
  DeviceManager,
  LocalVideoStream,
} from "@azure/communication-calling";

type CallOptions = {
  videoOptions: {
    localVideoStreams: LocalVideoStream[];
  };
  audioOptions: {
    muted: boolean;
  };
};

type Device = {
  key: string;
  text: string;
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

class DeviceService {
  // Retrieve device manager
  async retrieveDeviceManager(callClient: CallClient): Promise<DeviceManager> {
    return await callClient.getDeviceManager();
  }

  // Retrieve device permissions
  async retrieveDevicePermissions(callClient: CallClient) {
    // Setup device manager and retrieve permissions
    const deviceManager = await this.retrieveDeviceManager(callClient);
    console.log(`deviceManager: ${deviceManager.selectedSpeaker?.name}`);
    await deviceManager.askDevicePermission({ audio: true, video: true });
  }

  // Get call options
  async getCallAndDeviceOptions(
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

export type { CallOptions, DeviceOptions };
export default DeviceService;
