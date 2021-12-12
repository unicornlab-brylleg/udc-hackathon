import React, { useEffect, useState } from "react";
import { Text } from "@fluentui/react/lib/Text";
import { Stack } from "@fluentui/react/lib/Stack";
import { TextField } from "@fluentui/react/lib/TextField";
import { PrimaryButton } from "@fluentui/react";
import { Spinner, SpinnerSize } from "@fluentui/react/lib/Spinner";
import AuthenticationService, {
  User,
} from "../../services-old/AuthenticationService";
import { mainCardStyle } from "../shared/styles";
import authManager from "../../manager/AuthManager";

const AuthenticationPage = () => {

  const { authenticateUser } = authManager;

  useEffect(() => {
    (
      async function() {
        authenticateUser();
      }
    )();
  }, [authenticateUser]);

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
      <p>Provisioning ACS user identity...</p>
      <Spinner size={SpinnerSize.large}></Spinner>
    </div>
  );
};

export default AuthenticationPage;
