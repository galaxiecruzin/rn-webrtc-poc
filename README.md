# Sample Mobile App

## Mobile App Project Setup Requirements

__General Requirements__

* NVM - https://github.com/nvm-sh/nvm

__iOS Requirements__

* Xcode - https://apps.apple.com/us/app/xcode/id497799835
* RVM https://rvm.io/rvm/install
* Cocoapods - https://guides.cocoapods.org/using/getting-started.html

__Android Requirements__

* Android Studio - https://developer.android.com/studio

### First Time Setup

```
nvm install
nvm use
npm install
cd ios
# If using RVM
rvm system # if you have 2.6 or 2.7 installed
# or
rvm install "ruby-2.6.0"
rvm use 2.6.0
pod install
cd ..
```

### Building and Running the App

In the first terminal

```
nvm use
npm run start
```

Build iOS app in a second terminal

```
nvm use
npm run ios
```

Build Android app in a another terminal

```
nvm use
npm run android
```
