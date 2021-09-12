import React from "react";
import { utils } from "./Utils";
export default class StreamRenderer extends React.Component {
  constructor(props) {
    super(props);
    this.stream = props.stream;
    this.remoteParticipant = props.remoteParticipant;
    this.componentId = `${utils.getIdentifierText(
      this.remoteParticipant.identifier
    )}-${this.stream.mediaStreamType}-${this.stream.id}`;
    this.videoContainerId = this.componentId + "-videoContainer";
    this.renderer = undefined;
    this.view = undefined;
    this.dominantSpeakerMode = props.dominantSpeakerMode;
    this.dominantRemoteParticipant = props.dominantRemoteParticipant;
    this.state = {
      isSpeaking: false,
      displayName: this.remoteParticipant.displayName?.trim(),
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.dominantSpeakerMode !== prevProps.dominantSpeakerMode) {
      this.dominantSpeakerMode = prevProps.dominantSpeakerMode;
    }

    if (
      this.dominantRemoteParticipant !== prevProps.dominantRemoteParticipant
    ) {
      this.dominantRemoteParticipant = prevProps.dominantRemoteParticipant;
    }
  }

  // render() {
  //   return (
  //     <div
  //       id={this.componentId}
  //       className={`py-3 ms-Grid-col ms-sm-12 ms-lg12 ms-xl12 ${
  //         this.stream.mediaStreamType === "ScreenSharing"
  //           ? `ms-xxl12`
  //           : `ms-xxl6`
  //       }`}
  //     >
  //       <div
  //         className={`${
  //           this.state.isSpeaking ? `speaking-border-for-video` : ``
  //         }`}
  //         id={this.videoContainerId}
  //       >
  //         <h4 className="video-title">
  //           {this.state.displayName
  //             ? this.state.displayName
  //             : utils.getIdentifierText(this.remoteParticipant.identifier)}
  //         </h4>
  //       </div>
  //     </div>
  //   );
  // }
}
