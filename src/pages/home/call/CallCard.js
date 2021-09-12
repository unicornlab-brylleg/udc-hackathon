import React from "react";
import LocalVideoPreviewCard from "./LocalVideoPreviewCard";
import { Features } from "@azure/communication-calling";
import { utils } from "./Utils";

export default class CallCard extends React.Component {
  constructor(props) {
    super(props);
    this.callFinishConnectingResolve = undefined;
    this.call = props.call;
    this.deviceManager = props.deviceManager;
    this.state = {
      callState: this.call.state,
      callId: this.call.id,
      remoteParticipants: this.call.remoteParticipants,
      allRemoteParticipantStreams: [],
      videoOn: !!this.call.localVideoStreams[0],
      micMuted: false,
      onHold:
        this.call.state === "LocalHold" || this.call.state === "RemoteHold",
      screenShareOn: this.call.isScreenShareOn,
      cameraDeviceOptions: props.cameraDeviceOptions
        ? props.cameraDeviceOptions
        : [],
      speakerDeviceOptions: props.speakerDeviceOptions
        ? props.speakerDeviceOptions
        : [],
      microphoneDeviceOptions: props.microphoneDeviceOptions
        ? props.microphoneDeviceOptions
        : [],
      selectedCameraDeviceId: props.selectedCameraDeviceId,
      selectedSpeakerDeviceId: this.deviceManager.selectedSpeaker?.id,
      selectedMicrophoneDeviceId: this.deviceManager.selectedMicrophone?.id,
      showSettings: false,
      showLocalVideo: false,
      callMessage: undefined,
      dominantSpeakerMode: false,
      dominantRemoteParticipant: undefined,
    };
  }

  async componentWillMount() {
    if (this.call) {
      // this.deviceManager.on("videoDevicesUpdated", async (e) => {
      //   let newCameraDeviceToUse = undefined;
      //   e.added.forEach((addedCameraDevice) => {
      //     newCameraDeviceToUse = addedCameraDevice;
      //     const addedCameraDeviceOption = {
      //       key: addedCameraDevice.id,
      //       text: addedCameraDevice.name,
      //     };
      //     this.setState((prevState) => ({
      //       cameraDeviceOptions: [
      //         ...prevState.cameraDeviceOptions,
      //         addedCameraDeviceOption,
      //       ],
      //     }));
      //   });
      //   // When connectnig a new camera, ts device manager automatically switches to use this new camera and
      //   // this.call.localVideoStream[0].source is never updated. Hence I have to do the following logic to update
      //   // this.call.localVideoStream[0].source to the newly added camera. This is a bug. Under the covers, this.call.localVideoStreams[0].source
      //   // should have been updated automatically by the sdk.
      //   if (newCameraDeviceToUse) {
      //     try {
      //       await this.call.localVideoStreams[0]?.switchSource(
      //         newCameraDeviceToUse
      //       );
      //       this.setState({ selectedCameraDeviceId: newCameraDeviceToUse.id });
      //     } catch (error) {
      //       console.error(
      //         "Failed to switch to newly added video device",
      //         error
      //       );
      //     }
      //   }

      //   e.removed.forEach((removedCameraDevice) => {
      //     this.setState((prevState) => ({
      //       cameraDeviceOptions: prevState.cameraDeviceOptions.filter(
      //         (option) => {
      //           return option.key !== removedCameraDevice.id;
      //         }
      //       ),
      //     }));
      //   });

      //   // If the current camera being used is removed, pick a new random one
      //   if (
      //     !this.state.cameraDeviceOptions.find((option) => {
      //       return option.key === this.state.selectedCameraDeviceId;
      //     })
      //   ) {
      //     const newSelectedCameraId = this.state.cameraDeviceOptions[0]?.key;
      //     const cameras = await this.deviceManager.getCameras();
      //     const videoDeviceInfo = cameras.find((c) => {
      //       return c.id === newSelectedCameraId;
      //     });
      //     await this.call.localVideoStreams[0]?.switchSource(videoDeviceInfo);
      //     this.setState({ selectedCameraDeviceId: newSelectedCameraId });
      //   }
      // });

      // this.deviceManager.on("audioDevicesUpdated", (e) => {
      //   e.added.forEach((addedAudioDevice) => {
      //     const addedAudioDeviceOption = {
      //       key: addedAudioDevice.id,
      //       text: addedAudioDevice.name,
      //     };
      //     if (addedAudioDevice.deviceType === "Speaker") {
      //       this.setState((prevState) => ({
      //         speakerDeviceOptions: [
      //           ...prevState.speakerDeviceOptions,
      //           addedAudioDeviceOption,
      //         ],
      //       }));
      //     } else if (addedAudioDevice.deviceType === "Microphone") {
      //       this.setState((prevState) => ({
      //         microphoneDeviceOptions: [
      //           ...prevState.microphoneDeviceOptions,
      //           addedAudioDeviceOption,
      //         ],
      //       }));
      //     }
      //   });

      //   e.removed.forEach((removedAudioDevice) => {
      //     if (removedAudioDevice.deviceType === "Speaker") {
      //       this.setState((prevState) => ({
      //         speakerDeviceOptions: prevState.speakerDeviceOptions.filter(
      //           (option) => {
      //             return option.key !== removedAudioDevice.id;
      //           }
      //         ),
      //       }));
      //     } else if (removedAudioDevice.deviceType === "Microphone") {
      //       this.setState((prevState) => ({
      //         microphoneDeviceOptions: prevState.microphoneDeviceOptions.filter(
      //           (option) => {
      //             return option.key !== removedAudioDevice.id;
      //           }
      //         ),
      //       }));
      //     }
      //   });
      // });

      // this.deviceManager.on("selectedSpeakerChanged", () => {
      //   this.setState({
      //     selectedSpeakerDeviceId: this.deviceManager.selectedSpeaker?.id,
      //   });
      // });

      // this.deviceManager.on("selectedMicrophoneChanged", () => {
      //   this.setState({
      //     selectedMicrophoneDeviceId: this.deviceManager.selectedMicrophone?.id,
      //   });
      // });

      // this.call.localVideoStreams.forEach((lvs) => {
      //   this.setState({ videoOn: true });
      // });

      // this.call.on("localVideoStreamsUpdated", (e) => {
      //   e.added.forEach((lvs) => {
      //     this.setState({ videoOn: true });
      //   });
      //   e.removed.forEach((lvs) => {
      //     this.setState({ videoOn: false });
      //   });
      // });

      // this.call.on("idChanged", () => {
      //   console.log("Call id Changed ", this.call.id);
      //   this.setState({ callId: this.call.id });
      // });

      // this.call.on("isMutedChanged", () => {
      //   console.log("Local microphone muted changed ", this.call.isMuted);
      //   this.setState({ micMuted: this.call.isMuted });
      // });

      // this.call.on("isScreenSharingOnChanged", () => {
      //   this.setState({ screenShareOn: this.call.isScreenShareOn });
      // });

      const dominantSpeakersChangedHandler = async () => {
        try {
          if (this.state.dominantSpeakerMode) {
            const newDominantSpeakerIdentifier = this.call.api(
              Features.DominantSpeakers
            ).dominantSpeakers.speakersList[0];
            if (newDominantSpeakerIdentifier) {
              console.log(
                `DominantSpeaker changed, new dominant speaker: ${
                  newDominantSpeakerIdentifier
                    ? utils.getIdentifierText(newDominantSpeakerIdentifier)
                    : `None`
                }`
              );

              // Set the new dominant remote participant
              const newDominantRemoteParticipant =
                utils.getRemoteParticipantObjFromIdentifier(
                  this.call,
                  newDominantSpeakerIdentifier
                );

              // Get the new dominant remote participant's stream tuples
              const streamsToRender = [];
              for (const streamTuple of this.state
                .allRemoteParticipantStreams) {
                if (
                  streamTuple.participant === newDominantRemoteParticipant &&
                  streamTuple.stream.isAvailable
                ) {
                  streamsToRender.push(streamTuple);
                  if (
                    !streamTuple.streamRendererComponentRef.current.getRenderer()
                  ) {
                    await streamTuple.streamRendererComponentRef.current.createRenderer();
                  }
                }
              }

              const previousDominantSpeaker =
                this.state.dominantRemoteParticipant;
              this.setState({
                dominantRemoteParticipant: newDominantRemoteParticipant,
              });

              if (previousDominantSpeaker) {
                // Remove the old dominant remote participant's streams
                this.state.allRemoteParticipantStreams.forEach(
                  (streamTuple) => {
                    if (streamTuple.participant === previousDominantSpeaker) {
                      streamTuple.streamRendererComponentRef.current.disposeRenderer();
                    }
                  }
                );
              }

              // Render the new dominany speaker's streams
              streamsToRender.forEach((streamTuple) => {
                streamTuple.streamRendererComponentRef.current.attachRenderer();
              });
            } else {
              console.warn("New dominant speaker is undefined");
            }
          }
        } catch (error) {
          console.error(error);
        }
      };

      const dominantSpeakerIdentifier = this.call.api(Features.DominantSpeakers)
        .dominantSpeakers.speakersList[0];
      if (dominantSpeakerIdentifier) {
        this.setState({
          dominantRemoteParticipant:
            utils.getRemoteParticipantObjFromIdentifier(
              dominantSpeakerIdentifier
            ),
        });
      }

      this.call
        .api(Features.DominantSpeakers)
        .on("dominantSpeakersChanged", dominantSpeakersChangedHandler);
    }
  }

  async toggleDominantSpeakerMode() {
    try {
      if (this.state.dominantSpeakerMode) {
        // Turn off dominant speaker mode
        this.setState({ dominantSpeakerMode: false });
        // Render all remote participants's streams
        for (const streamTuple of this.state.allRemoteParticipantStreams) {
          if (
            streamTuple.stream.isAvailable &&
            !streamTuple.streamRendererComponentRef.current.getRenderer()
          ) {
            await streamTuple.streamRendererComponentRef.current.createRenderer();
            streamTuple.streamRendererComponentRef.current.attachRenderer();
          }
        }
      } else {
        // Turn on dominant speaker mode
        this.setState({ dominantSpeakerMode: true });
        // Dispose of all remote participants's stream renderers
        const dominantSpeakerIdentifier = this.call.api(
          Features.DominantSpeakers
        ).dominantSpeakers.speakersList[0];
        if (!dominantSpeakerIdentifier) {
          this.state.allRemoteParticipantStreams.forEach((v) => {
            v.streamRendererComponentRef.current.disposeRenderer();
          });

          // Return, no action needed
          return;
        }

        // Set the dominant remote participant obj
        const dominantRemoteParticipant =
          utils.getRemoteParticipantObjFromIdentifier(
            this.call,
            dominantSpeakerIdentifier
          );
        this.setState({ dominantRemoteParticipant: dominantRemoteParticipant });
        // Dispose of all the remote participants's stream renderers except for the dominant speaker
        this.state.allRemoteParticipantStreams.forEach((v) => {
          if (v.participant !== dominantRemoteParticipant) {
            v.streamRendererComponentRef.current.disposeRenderer();
          }
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    return (
      <div className="ms-Grid mt-2">
        <div className="ms-Grid-row">
          {this.state.callState === "Connected" && (
            <div className="ms-Grid-col ms-sm12 ms-lg12 ms-xl12 ms-xxl3">
              <div>
                {this.state.showLocalVideo && (
                  <div className="mb-3">
                    <LocalVideoPreviewCard
                      selectedCameraDeviceId={this.state.selectedCameraDeviceId}
                      deviceManager={this.deviceManager}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
