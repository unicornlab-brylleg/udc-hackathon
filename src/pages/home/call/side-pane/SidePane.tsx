import React from "react";
import { Text } from "@fluentui/react/lib/Text";
import { Stack } from "@fluentui/react";
import { Call, RemoteParticipant } from "@azure/communication-calling";
import ParticipantCard from "./ParticipantCard";
import { cardStyle } from "../../../shared/styles";

type SidePaneProps = {
  call: Call;
  remoteParticipants: RemoteParticipant[];
};

const SidePane = ({ call, remoteParticipants }: SidePaneProps) => {
  return (
    <div style={cardStyle}>
      <Stack
        tokens={{ childrenGap: 20 }}
        style={{
          alignItems: "center",
          justifyItems: "center",
        }}
      >
        <Text variant="xLarge">Participants</Text>
        {remoteParticipants.length === 0 && (
          <p className="text-center">
            No other participants currently in the call
          </p>
        )}
        {remoteParticipants.map((remoteParticipant) => (
          <ParticipantCard call={call} remoteParticipant={remoteParticipant} />
        ))}
      </Stack>
    </div>
  );
};

export default SidePane;
