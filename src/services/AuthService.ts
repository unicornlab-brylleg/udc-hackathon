import { CommunicationIdentityClient } from "@azure/communication-identity";
import { connectionString } from "./config.json";

interface ACSUser {
  firstName: string;
  lastName: string;
  token: string;
}

class AuthService {
  static async fetchUserInfo(): Promise<ACSUser> {
    const communicationIdentityClient = new CommunicationIdentityClient(
      connectionString
    );
    const user = await communicationIdentityClient.createUserAndToken([
      "voip",
    ]);
    const fetchedFirstName = 'John'; // replace with first name fetched from server
    const fetchedLastName = 'Doe'; // replace with last name fetched from server
    return {
      firstName: fetchedFirstName,
      lastName: fetchedLastName,
      token: user.token
    }
  }
}

export type { ACSUser };
export default AuthService;
