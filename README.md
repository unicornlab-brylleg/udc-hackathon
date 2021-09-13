# UDC Hackathon

### Functional Requirements

- [x] Display video stream for at least 3 participants in a call
- [x] Display name/info in video (like teams)
- [x] Ability to configure on client side(as a config parameter) if participants enter session with their mic and camera enabled or disabled
- [x] Notify users of their network quality from the client end (Call Health)
- [ ] Dynamic layout to handle active speakers (should include –Adjust video tiles when participants turn off video.)
- [ ] Chat functionality with status updates when users enter or leave the session
- [x] Screen share

### Issues

- [x] Azure Communications Calling SDK → contains .api() method according to [docs](https://docs.microsoft.com/en-us/javascript/api/azure-communication-services/@azure/communication-calling/call?view=azure-communication-services-js) but not found in the actual SDK code
- [ ] Video stream dispose → video not being disposed properly because renderer state variable still null (state management issue)
- [ ] Joining session with camera on/off does not work (only mic configure does)
- [ ] Chat functionality failing due to failure of createChatThread() due to Ret Error

### References

- General

  [Azure Communication Services](https://docs.microsoft.com/en-us/azure/communication-services/)

  [UI Library overview - An Azure Communication Services concept document](https://docs.microsoft.com/en-US/azure/communication-services/concepts/ui-library/ui-library-overview)

- Setup

  [Quickstart - Add video calling to your app (JavaScript) - An Azure Communication Services quickstart](https://docs.microsoft.com/en-us/azure/communication-services/quickstarts/voice-video-calling/get-started-with-video-calling?pivots=platform-web)

  [Quickstart - Quickly create Azure Communication Services identities for testing - An Azure Communication Services quickstart](https://docs.microsoft.com/en-us/azure/communication-services/quickstarts/identity/quick-create-identity)

  For quick generation of identities and access tokens

- Configuration

  [Quickstart - Create and manage resources in Azure Communication Services - An Azure Communication Services quickstart](https://docs.microsoft.com/en-us/azure/communication-services/quickstarts/create-communication-resource?pivots=platform-azp&tabs=windows)

- Code Samples

  - React Templates

    [Group calling hero sample - An Azure Communication Services sample overview](https://docs.microsoft.com/en-us/azure/communication-services/samples/calling-hero-sample?pivots=platform-web)

    [Group Chat Hero Sample - An Azure Communication Services sample overview](https://docs.microsoft.com/en-us/azure/communication-services/samples/chat-hero-sample)

    [Azure Communication Services - Web calling sample - An Azure Communication Services sample](https://docs.microsoft.com/en-us/azure/communication-services/samples/web-calling-sample)

  - Others

- Other

  [@azure/communication-react](https://www.npmjs.com/package/@azure/communication-react)

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
