import { CallClient, CallAgent } from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";

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
}

export type { CallManager };
export default CallingService;
