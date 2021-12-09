import {
  CallClient,
  CallAgent,
  Call,
  RemoteParticipant,
  RemoteVideoStream,
} from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";
import React from "react";

// Extend global window type to add callAgent property to satisfy TS
declare global {
  interface Window {
    callAgent: CallAgent;
  }
}

type CallManager = {
  callClient: CallClient;
  callAgent: CallAgent;
};

type ParticipantStream = {
  stream: RemoteVideoStream;
  participant: RemoteParticipant;
  streamRendererComponentRef: React.RefObject<any>;
};

class CallingService {
  // Create call manager
  async createAndSetupCallManager(
    userToken: string,
    userDisplayName: string
    // updatedCallState: Function
  ): Promise<CallManager> {
    console.log("Creating and setting up call manager...");
    // Retrieve token
    const tokenCredential = new AzureCommunicationTokenCredential(userToken);
    // Setup call agent
    const callClient = new CallClient();
    const callAgent = await callClient.createCallAgent(tokenCredential, {
      displayName: userDisplayName,
    });
    window.callAgent = callAgent;
    console.log("Call manager created and setup successfully!");
    return { callClient, callAgent };
  }
  // Attach call listener
  async attachCallListener(callAgent: CallAgent, updateCallState: Function) {
    console.log("Attaching call listener...");
    // Attach call listener
    callAgent.on("callsUpdated", (e) => {
      console.log(`Call listener triggered!`);
      e.added.forEach((call) => {
        console.log(`Call started! ID: ${call.id}`);
        updateCallState(call);
      });
      e.removed.forEach((call) => {
        console.log(
          `Call ended! Reason: ${call.callEndReason?.code} ${call.callEndReason?.subCode}`
        );
        updateCallState(null);
      });
    });
    console.log("Success attaching call listener!");
  }

  // Detach call listener
  async detachCallListener(callAgent: CallAgent) {
    console.warn("detachCallListener() not implemented!");
    // TODO: Implement me
  }

  // Subscribe to remote participant's video stream
  subscribeToRemoteParticipant(
    participant: RemoteParticipant,
    remoteParticipants: RemoteParticipant[],
    setRemoteParticipants: Function,
    remoteParticipantStreams: ParticipantStream[],
    setRemoteParticipantStreams: Function
  ) {
    if (
      !remoteParticipants.find((p) => {
        return p === participant;
      })
    ) {
      setRemoteParticipants((prevState: RemoteParticipant[]) => {
        return [...prevState, participant];
      });
    }

    const addToListOfAllRemoteParticipantStreams = (
      participantStreams: readonly RemoteVideoStream[]
    ) => {
      if (participantStreams) {
        let participantStreamTuples = participantStreams.map((stream) => {
          return {
            stream,
            participant,
            streamRendererComponentRef: React.createRef(),
          };
        });
        participantStreamTuples.forEach((participantStreamTuple) => {
          if (
            !remoteParticipantStreams.find((v: any) => {
              return v === participantStreamTuple;
            })
          ) {
            setRemoteParticipantStreams((prevState: RemoteVideoStream[]) => [
              ...prevState,
              participantStreamTuple,
            ]);
          }
        });
      }
    };

    const removeFromListOfAllRemoteParticipantStreams = (
      participantStreams: RemoteVideoStream[]
    ) => {
      participantStreams.forEach((streamToRemove: RemoteVideoStream) => {
        const tupleToRemove = remoteParticipantStreams.find((v: any) => {
          return v.stream === streamToRemove;
        });
        if (tupleToRemove) {
          setRemoteParticipantStreams(
            remoteParticipantStreams.filter((streamTuple: any) => {
              return streamTuple !== tupleToRemove;
            })
          );
        }
      });
    };

    const handleVideoStreamsUpdated = (e: any) => {
      addToListOfAllRemoteParticipantStreams(e.added);
      removeFromListOfAllRemoteParticipantStreams(e.removed);
    };

    addToListOfAllRemoteParticipantStreams(participant.videoStreams);
    participant.on("videoStreamsUpdated", handleVideoStreamsUpdated);
  }

  // Attach participants listener
  async attachParticipantsListener(
    call: Call,
    remoteParticipants: RemoteParticipant[],
    setRemoteParticipants: Function,
    remoteParticipantStreams: ParticipantStream[],
    setRemoteParticipantStreams: Function
  ) {
    console.log("Attaching participants listener...");
    call.on("remoteParticipantsUpdated", (e) => {
      console.log(
        `Call=${call.id}, remoteParticipantsUpdated, added=${e.added}, removed=${e.removed}`
      );
      e.added.forEach((p) => {
        console.log("participantAdded", p);
        this.subscribeToRemoteParticipant(
          p,
          remoteParticipants,
          setRemoteParticipants,
          remoteParticipantStreams,
          setRemoteParticipantStreams
        );
      });
      e.removed.forEach((p) => {
        setRemoteParticipants(
          remoteParticipants.filter((remoteParticipant) => {
            return remoteParticipant !== p;
          })
        );
        setRemoteParticipantStreams(
          remoteParticipantStreams.filter((s: any) => {
            return s.participant !== p;
          })
        );
      });
    });
    console.log("Listening for participant changes!");
  }
}

export type { CallManager, ParticipantStream };
export default CallingService;
