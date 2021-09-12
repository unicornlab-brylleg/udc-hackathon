import React, { useEffect, useState } from "react";
import { Call, RemoteParticipant } from "@azure/communication-calling";
import { utils } from "../Utils";
import { Persona, PersonaSize } from "@fluentui/react/lib/components/Persona";
import { Stack } from "@fluentui/react/lib/components/Stack";
import { Icon } from "@fluentui/react/lib/components/Icon";
import { IconButton } from "@fluentui/react/lib/components/Button";

type ParticipantCardProps = {
  call: Call;
  remoteParticipant: RemoteParticipant;
};

const ParticipantCard = ({ call, remoteParticipant }: ParticipantCardProps) => {
  // Local States
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const id = utils.getIdentifierText(remoteParticipant.identifier);

  // Lifecycle
  useEffect(() => {
    // Attach listener to determine if participant is speaking
    remoteParticipant.on("isSpeakingChanged", () => {
      setIsSpeaking(remoteParticipant.isSpeaking);
    });
    // Attach listener to determine if participant is muted
    remoteParticipant.on("isMutedChanged", () => {
      setIsMuted(remoteParticipant.isMuted);
      if (remoteParticipant.isMuted) {
        setIsSpeaking(false);
      }
    });
  }, []);

  // Methods
  function removeParticipant() {
    call
      .removeParticipant(remoteParticipant.identifier)
      .catch((e) => console.error(e));
  }

  return (
    <Stack
      horizontal
      style={{
        alignItems: "center",
        justifyItems: "center",
      }}
    >
      <Persona
        className={isSpeaking ? `speaking-border-for-initials` : ``}
        size={PersonaSize.size40}
        text={
          remoteParticipant.displayName ? remoteParticipant.displayName : id
        }
        //   secondaryText={this.state.state}
        //   styles={{
        //     primaryText: { color: "#edebe9" },
        //     secondaryText: { color: "#edebe9" },
        //   }}
      />
      {<Icon iconName={isMuted ? "MicOff" : "Microphone"} />}
      <IconButton
        iconProps={{ iconName: "ChromeClose" }}
        style={{ color: "red" }}
        onClick={removeParticipant}
      />
    </Stack>
  );
};

export default ParticipantCard;
