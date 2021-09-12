import React, { useEffect } from "react";
import { cardStyle } from "../../../shared/styles";
import { utils } from "../Utils";
import { ParticipantStream } from "../../../../services/CallingService";
import VideoStream from "./VideoStream";
import { Call } from "@azure/communication-calling";

type VideoPaneProps = {
  call: Call;
  remoteParticipantStreams: ParticipantStream[];
};

const VideoPane = ({ call, remoteParticipantStreams }: VideoPaneProps) => {
  //   // Lifecycle
  //   useEffect(() => {
  //     async function dominantSpeakersChangedHandler() {
  //       try {
  //         const newDominantSpeakerIdentifier = call.api(Features.DominantSpeakers)
  //           .dominantSpeakers.speakersList[0];
  //         if (newDominantSpeakerIdentifier) {
  //           console.log(
  //             `DominantSpeaker changed, new dominant speaker: ${
  //               newDominantSpeakerIdentifier
  //                 ? utils.getIdentifierText(newDominantSpeakerIdentifier)
  //                 : `None`
  //             }`
  //           );

  //           // Set the new dominant remote participant
  //           const newDominantRemoteParticipant =
  //             utils.getRemoteParticipantObjFromIdentifier(
  //               this.call,
  //               newDominantSpeakerIdentifier
  //             );

  //           // Get the new dominant remote participant's stream tuples
  //           const streamsToRender = [];
  //           for (const streamTuple of this.state.allRemoteParticipantStreams) {
  //             if (
  //               streamTuple.participant === newDominantRemoteParticipant &&
  //               streamTuple.stream.isAvailable
  //             ) {
  //               streamsToRender.push(streamTuple);
  //               if (
  //                 !streamTuple.streamRendererComponentRef.current.getRenderer()
  //               ) {
  //                 await streamTuple.streamRendererComponentRef.current.createRenderer();
  //               }
  //             }
  //           }

  //           const previousDominantSpeaker = this.state.dominantRemoteParticipant;
  //           this.setState({
  //             dominantRemoteParticipant: newDominantRemoteParticipant,
  //           });

  //           if (previousDominantSpeaker) {
  //             // Remove the old dominant remote participant's streams
  //             this.state.allRemoteParticipantStreams.forEach((streamTuple) => {
  //               if (streamTuple.participant === previousDominantSpeaker) {
  //                 streamTuple.streamRendererComponentRef.current.disposeRenderer();
  //               }
  //             });
  //           }

  //           // Render the new dominany speaker's streams
  //           streamsToRender.forEach((streamTuple) => {
  //             streamTuple.streamRendererComponentRef.current.attachRenderer();
  //           });
  //         } else {
  //           console.warn("New dominant speaker is undefined");
  //         }
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     }

  //     const dominantSpeakerIdentifier = this.call.api(Features.DominantSpeakers)
  //       .dominantSpeakers.speakersList[0];
  //     if (dominantSpeakerIdentifier) {
  //       this.setState({
  //         dominantRemoteParticipant: utils.getRemoteParticipantObjFromIdentifier(
  //           dominantSpeakerIdentifier
  //         ),
  //       });
  //     }

  //     this.call
  //       .api(Features.DominantSpeakers)
  //       .on("dominantSpeakersChanged", dominantSpeakersChangedHandler);
  //   }, []);

  return (
    <div style={cardStyle}>
      {remoteParticipantStreams.map((v) => (
        <VideoStream
          key={`${utils.getIdentifierText(v.participant.identifier)}-${
            v.stream.mediaStreamType
          }-${v.stream.id}`}
          remoteParticipant={v.participant}
          remoteVideoStream={v.stream}
          // ref={v.streamRendererComponentRef}
        />
      ))}
    </div>
  );
};

export default VideoPane;
