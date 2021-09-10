import React, { useState } from "react";
import { Text } from "@fluentui/react/lib/Text";
import { User } from "../../services/AuthenticationService";
import { Stack } from "@fluentui/react/lib/components/Stack/Stack";
import { TextField } from "@fluentui/react/lib/components/TextField/TextField";
import { Spinner, SpinnerSize } from "@fluentui/react/lib/Spinner";
import { PrimaryButton } from "@fluentui/react/lib/components/Button";

type HomeProps = {
  user: User;
};

const Home = ({ user }: HomeProps) => {
  // States
  const [groupCallID, setGroupCallID] = useState("");
  const [fieldErrorMessage, setfieldErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  return (
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
      <div
        style={{
          border: "1px solid black",
          boxShadow: "0px 0px 10px #959da5",
          padding: 32,
        }}
      >
        <Stack
          tokens={{ childrenGap: 20 }}
          style={{ alignItems: "center", justifyItems: "center" }}
        >
          <Text variant="xLarge">
            Welcome, {user.firstName} {user.lastName}!
          </Text>
          <TextField
            required
            label="Group Call ID"
            onChange={(event, text) => setGroupCallID(text ?? "")}
            errorMessage={fieldErrorMessage}
          />
          {isLoading ? (
            <Spinner size={SpinnerSize.large}></Spinner>
          ) : (
            <PrimaryButton onClick={() => {}}>Join Call</PrimaryButton>
          )}
        </Stack>
      </div>
    </div>
  );
};

export default Home;
