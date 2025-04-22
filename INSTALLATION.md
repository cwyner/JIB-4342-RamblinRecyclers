# Installation Guide

## Prerequisistes
- **Node.js**: At least Version 14.x.
  Install from [here](https://nodejs.org/).
- **Expo CLI**
  `npm install --global expo-cli`
- **Git**
  Install from [here](https://git-scm.com/downloads)
- One of the following:\
  **[Expo Go](https://expo.dev/go)**\
  **[Android Studio](https://www.bing.com/search?q=android+studio&cvid=8b177a138c3b4168a80a762762ac5bbf&gs_lcrp=EgRlZGdlKgYIABBFGDkyBggAEEUYOTIGCAEQLhhAMgYIAhAAGEAyBggDEAAYQDIGCAQQABhAMgYIBRAAGEAyBggGEAAYQDIGCAcQABhA0gEIMTg4OGowajmoAgiwAgE&FORM=ANAB01&PC=U531)**\
  **[XCode](https://developer.apple.com/xcode/)**

*For Android Studio, you must create a virtual device. Click [here](https://developer.android.com/studio/run/managing-avds) for instructions.*\
*For XCode, you must install a simulator. Click [here](https://developer.apple.com/documentation/xcode/downloading-and-installing-additional-xcode-components) for instructions.*

## Clone the Repository
Download and extract the repo or run the command below:\
`git clone https://github.com/cwyner/JIB-4342-RamblinRecyclers.git`

## Install Dependencies
After cloning the repository, open a terminal in the project's root directory, and run
`npm install`.

## Prebuilding
Run `npx expo prebuild --clean`\
Your project directory should now contain the `ios/` and `android/` directories.

## Firebase Registration
1. **Create a Firebase project**  
   - Go to the [Firebase Console](https://console.firebase.google.com/).  
   - Click **Add project** and follow the prompts.

2. **Register your app**  
   - In your Firebase project, click **Add app** → choose **iOS** and/or **Android**.  
   - For iOS you will download a `GoogleService-Info.plist`.  
   - For Android you will download a `google-services.json`.

3. **Download the config files**  
   - **iOS:** `GoogleService-Info.plist` -> Place in ios/ directory
   - **Android:** `google-services.json` -> Place in android/ directory

4. **Update config**
   - Starting from the root directory, navigate to `app/_layout.tsx`, and replace the code below with your project credentials:
     `
      const firebaseConfig = {
        apiKey: 'YOUR_API_KEY',
        authDomain: 'YOUR_DOMAIN.firebaseapp.com',
        projectId: 'YOUR_PROJECT_ID',
        storageBucket: 'YOUR_PROJECT_ID.appspot.com',
        messagingSenderId: 'SENDER_ID',
        appId: 'APP_ID',
      };
     `
## Running the app
*If you plan on using a simulator make sure you have followed the instructions for Android Studio and/or Xcode.* \
*If you want to run the app directly on your phone follow the directions for Expo Go*
***All the above scenarios are either/or, so you can use Expo Go, an Android virtual device, or an iOS simulator.***

### Running with Expo Go
1. Make sure your computer and phone are connected to the same network.
2. Run `npx expo start` and a QR code should appear in your terminal.
3. Press s
4. Open the Expo Go app on your phone.
5. Scan the QR code from the app.

### Running with Android Simulator
1. Run `npx expo start`
2. Press a to start the Android simulator

### Running with iOS Simulator
1. Run `npx expo start`
2. Press i to start the Android simulator.
