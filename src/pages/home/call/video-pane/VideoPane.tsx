import React from "react";
import { cardStyle } from "../../../shared/styles";
import { utils } from "../Utils";
import { ParticipantStream } from "../../../../services/CallingService";
import VideoStream from "./VideoStream";

type VideoPaneProps = {
  remoteParticipantStreams: ParticipantStream[];
};

const VideoPane = ({ remoteParticipantStreams }: VideoPaneProps) => {
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
