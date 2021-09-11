import { Spinner, SpinnerSize } from "@fluentui/react/lib/Spinner";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import React from "react";

type LoadingPageProps = {
  loadingMessage: string;
};

const LoadingPage = ({ loadingMessage }: LoadingPageProps) => {
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
      <Stack
        tokens={{ childrenGap: 20 }}
        style={{ alignItems: "center", justifyItems: "center" }}
      >
        <Text variant="large">{loadingMessage}</Text>
        <Spinner size={SpinnerSize.large}></Spinner>
      </Stack>
    </div>
  );
};

export default LoadingPage;
