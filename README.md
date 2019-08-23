# Vue Native CLI

## Build Native Mobile apps using Vue

> Vue Native is a wrapper around the APIs of React Native. So, with Vue Native, you can do everything what you can do with React Native.

Vue Native CLI is a basic command line interface that generates a simple 1 page application with [Expo](https://docs.expo.io/versions/latest/workflow/expo-cli/), or optionally with [React Native CLI](https://github.com/react-native-community/cli)

## Installation Prerequisites

Since Vue Native is a wrapper around React Native, to use the CLI, you must have either `expo-cli` or `react-native-cli` installed globally.

To install Expo globally, use the following command:
```
$ npm install -g expo-cli
```

If you wish to use React Native CLI instead, use the following command to install it globally:
```
$ npm install -g react-native-cli
```

You will also need [Android Studio](https://developer.android.com/studio) / [Xcode](https://developer.apple.com/xcode/) for development.

## Installation

Once the prerequisites have been installed, you are all set to install `vue-native-cli`.

```
$ npm install -g vue-native-cli
```

## Usage

### For Expo users

Generate an app with the following command:

```
$ vue-native init <projectName>
```

This will create a project folder with the specified name in the current working directory.

To start the development server, execute the following commands:

```
$ cd <projectName>
$ npm start
```

Alternatively, you may use `expo start` to start the development server.
`expo start --ios` and `expo start --android` can be used to directly start the application on the respective platform emulators.

### For React Native CLI users

Generate an app with the following command:

```
$ vue-native init <projectName> --no-expo
```

Once the setup is complete, `cd` into the project directory and start the developement server as follows:

```
$ cd <projectName>
$ npm start
```

You may also use `react-native` commands directly. For example to run the application on an iPhone X simulator (assuming Xcode is installed), run

```
$ react-native run-ios --simulator "iPhone X"
```

## Useful links

- [The official Vue Native documentation](https://vue-native.io/docs/installation.html)
- [The Vue Native KitchenSink app](https://github.com/GeekyAnts/KitchenSink-Vue-Native)
