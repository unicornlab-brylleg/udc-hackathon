import React, { useState } from "react";
import { Text } from "@fluentui/react/lib/Text";
import { Stack } from "@fluentui/react/lib/Stack";
import { TextField } from "@fluentui/react/lib/TextField";
import { PrimaryButton } from "@fluentui/react";
import { Spinner, SpinnerSize } from "@fluentui/react/lib/Spinner";
import AuthenticationService, {
  User,
} from "../../services-old/AuthenticationService";
import { mainCardStyle } from "../shared/styles";

type AuthenticationPageProps = {
  setUser(user: User): void;
};

const AuthenticationPage = ({ setUser }: AuthenticationPageProps) => {
  // Local States
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fieldErrorMessage, setfieldErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Services
  const authenticationService = new AuthenticationService();

  // Methods
  async function createUser() {
    // Field validation
    if (
      firstName &&
      firstName.trim() !== "" &&
      lastName &&
      lastName.trim() !== ""
    ) {
      try {
        setIsLoading(true);
        setfieldErrorMessage("");
        const user = await authenticationService.createUser(
          firstName,
          lastName
        );
        setUser(user);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    } else setfieldErrorMessage("Please enter your full name!");
  }

  // UI
  return (
    // Background
    <div
      style={{
        height: "100vh",
        width: "100vw",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
      }}
    >
      {/* Center Card */}
      <div style={mainCardStyle}>
        <Stack
          tokens={{ childrenGap: 20 }}
          style={{ alignItems: "center", justifyItems: "center" }}
        >
          <Text variant="xLarge">Create Account</Text>
          <TextField
            required
            label="First Name"
            onChange={(event, text) => setFirstName(text ?? "")}
            errorMessage={fieldErrorMessage}
          />
          <TextField
            required
            label="Last Name"
            onChange={(event, text) => setLastName(text ?? "")}
            errorMessage={fieldErrorMessage}
          />
          {isLoading ? (
            <Spinner size={SpinnerSize.large}></Spinner>
          ) : (
            <PrimaryButton onClick={createUser}>Create</PrimaryButton>
          )}
        </Stack>
      </div>
    </div>
  );
};

export default AuthenticationPage;
