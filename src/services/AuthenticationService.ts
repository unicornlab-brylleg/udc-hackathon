import { CommunicationIdentityClient } from "@azure/communication-identity";
import { connectionString } from "./config.json";

type User = {
  firstName: string;
  lastName: string;
  id: string;
  token: string;
};

class AuthenticationService {
  // Identitiy client
  communicationIdentityClient = new CommunicationIdentityClient(
    connectionString
  );

  // Create user
  async createUser(firstName: string, lastName: string): Promise<User> {
    try {
      console.log(`Creating user account for ${firstName} ${lastName}...`);
      const user = await this.communicationIdentityClient.createUserAndToken([
        "voip",
      ]);
      console.log(
        `Created new credentials ${JSON.stringify(
          user,
          null,
          2
        )} for ${firstName} ${lastName}!`
      );
      return {
        firstName: firstName,
        lastName: lastName,
        id: user.user.communicationUserId,
        token: user.token,
      };
    } catch (error) {
      console.error(`Error creating user account due to ${error}!`);
      throw Error("Error creating user!");
    }
  }
}

export type { User };
export default AuthenticationService;
