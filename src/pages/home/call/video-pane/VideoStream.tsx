import {
  RemoteParticipant,
  RemoteVideoStream,
  VideoStreamRenderer,
} from "@azure/communication-calling";
import { Text } from "@fluentui/react/lib/Text";
import React, { useState, useEffect } from "react";
import { utils } from "../Utils";

type VideoStreamProps = {
  remoteParticipant: RemoteParticipant;
  remoteVideoStream: RemoteVideoStream;
};

const VideoStream = ({
  remoteParticipant,
  remoteVideoStream,
}: VideoStreamProps) => {
  // Local States
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [renderer, setRenderer] = useState<VideoStreamRenderer | null>(null);
  //   const [view, setView] = useState<VideoStreamRendererView | null>(null);
  const displayName = remoteParticipant.displayName?.trim();
  const componentID = `${utils.getIdentifierText(
    remoteParticipant.identifier
  )}-${remoteVideoStream.mediaStreamType}-${remoteVideoStream.id}`;
  const videoContainerID = componentID + "-videoContainer";

  // LifeCycles
  useEffect(() => {
    async function setupVideoStream() {
      document.getElementById(componentID)!.hidden = true;

      // Attach listener to determine whether participant is speaking
      remoteParticipant.on("isSpeakingChanged", () => {
        setIsSpeaking(remoteParticipant.isSpeaking);
      });

      // Attach listener to determine whether participant is muted (to set is speaking to false)
      remoteParticipant.on("isMutedChanged", () => {
        if (remoteParticipant.isMuted) {
          setIsSpeaking(false);
        }
      });

      remoteVideoStream.on("isAvailableChanged", async () => {
        try {
          // if (
          //   this.dominantSpeakerMode &&
          //   this.dominantRemoteParticipant !== this.remoteParticipant
          // ) {
          //   return;
          // }

          if (remoteVideoStream.isAvailable && !renderer) {
            console.log(
              `[App][StreamMedia][id=${remoteVideoStream.id}][isAvailableChanged] isAvailable=${remoteVideoStream.isAvailable}`
            );
            await createAndAttachRenderer();
            // attachRenderer();
          } else {
            console.log(
              `[App][StreamMedia][id=${remoteVideoStream.id}][isAvailableChanged] isAvailable=${remoteVideoStream.isAvailable}`
            );
            disposeRenderer();
          }
        } catch (e) {
          console.error(e);
        }
      });

      // if (
      //   this.dominantSpeakerMode &&
      //   this.dominantRemoteParticipant !== this.remoteParticipant
      // ) {
      //   return;
      // }

      try {
        console.log(
          `[App][StreamMedia][id=${remoteVideoStream.id}] checking initial value - isAvailable=${remoteVideoStream.isAvailable}`
        );
        if (remoteVideoStream.isAvailable && !renderer) {
          await createAndAttachRenderer();
          //   attachRenderer();
        }
      } catch (e) {
        console.error(e);
      }
      // return () => {
      //   cleanup;
      // };
    }
    setupVideoStream();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Methods
  async function createAndAttachRenderer() {
    console.info(
      `[App][StreamMedia][id=${remoteVideoStream.id}][renderStream] attempt to render stream type=${remoteVideoStream.mediaStreamType}, id=${remoteVideoStream.id}`
    );
    if (!renderer) {
      const rendererTemp = new VideoStreamRenderer(remoteVideoStream);
      setRenderer(rendererTemp);
      const view = await rendererTemp.createView();
      console.log(`viewTemp: ${view.target}`);
      //   setView(view);
      console.log(`viewTemp 2: ${view.target}`);
      console.log(`View: ${view.target}`);
      console.info(
        `[App][StreamMedia][id=${remoteVideoStream.id}][renderStream] createView resolved, appending view`
      );
      try {
        console.log(`View 2: ${view.target}`);
        if (!view.target) {
          throw new Error(
            `[App][StreamMedia][id=${remoteVideoStream.id}][attachRenderer] target is undefined. Must create renderer first`
          );
        }
        document.getElementById(componentID)!.hidden = false;
        document.getElementById(videoContainerID)!.appendChild(view.target);
      } catch (e) {
        console.error(e);
      }
    } else {
      throw new Error(
        `[App][StreamMedia][id=${remoteVideoStream.id}][createRenderer] stream already has a renderer`
      );
    }
  }

  //   async function attachRenderer() {
  //     try {
  //       console.log(`View 2: ${JSON.stringify(view)}`);
  //       if (!view?.target) {
  //         throw new Error(
  //           `[App][StreamMedia][id=${remoteVideoStream.id}][attachRenderer] target is undefined. Must create renderer first`
  //         );
  //       }
  //       document.getElementById(componentID)!.hidden = false;
  //       document.getElementById(videoContainerID)!.appendChild(view.target);
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   }

  function disposeRenderer() {
    if (renderer) {
      renderer.dispose();
      setRenderer(null);
      document.getElementById(componentID)!.hidden = true;
    } else {
      console.warn(
        `[App][StreamMedia][id=${remoteVideoStream.id}][disposeRender] no renderer to dispose`
      );
    }
  }

  return (
    <div id={componentID}>
      <div
        className={`${isSpeaking ? `speaking-border-for-video` : ``}`}
        id={videoContainerID}
      >
        <Text>
          {displayName
            ? displayName
            : utils.getIdentifierText(remoteParticipant.identifier)}
        </Text>
      </div>
    </div>
  );
};

export default VideoStream;
