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

## Notes

### Create sample mp4

Use this command to generate an mp4 file, pressing ctrl-c to end

```
ffmpeg -re -f lavfi -i "smptehdbars=rate=30:size=640x480" \
-f lavfi -i "sine=frequency=1000:sample_rate=44100" \
-vf drawtext="text='YOUR MESSAGE %{localtime\:%X}':rate=30:x=(w-tw)/2:y=(h-lh)/2:fontsize=48:fontcolor=white:box=1:boxcolor=black" \
-f flv -c:v h264 -profile:v baseline -pix_fmt yuv420p -preset ultrafast -tune zerolatency -crf 28 -g 60 -c:a aac \
 output.mp4
```

### FFMPEG - Send MP4 file to Janus (exmple2.sh)

```
ffmpeg -re -stream_loop -1 -i ./output.mp4 -s 426x240 -c:v libx264 -profile:v \
 baseline -b:v 1M -r 24 -g 60 \
 -c:a libopus -b:a 96K -ar 44100 \
 -an -f rtp rtp://janus.4devz.com:5004 \
 -vn -f rtp rtp://janus.4devz.com:5002
```

### FFMPEG (RTSP to Janus) - Retransmit video from network security camera and send to Janus video on port 5004 and audio on port 5002.

__Test with Streaming Demo "External h264 source (live)"__

```
# Video Only
ffmpeg -re -stream_loop -1 -i ./output2.mp4 -s 426x240 -c:v libx264 -profile:v \
 baseline -b:v 1M -r 24 -g 60 \
 -an -f rtp rtp://janus.4devz.com:5004
```

```
# Video and audio stream ( audio is currently distorted for some reason )
ffmpeg -rtsp_transport tcp -i rtsp://user:password@192.168.0.81:554 \
  -vcodec copy -an -f rtp rtp://janus.4devz.com:5004 \
  -vn -acodec copy -f rtp rtp://janus.4devz.com:5002
```

### Gstreamer to Janus

__example1.sh Test with Streaming Demo "Multistream Test"__

```
# example1.sh
gst-launch-1.0 \
  videotestsrc ! \
    video/x-raw,width=320,height=240,framerate=15/1 ! \
    videoscale ! videorate ! videoconvert ! timeoverlay ! \
    vp8enc error-resilient=1 ! \
      rtpvp8pay mtu=1200 ! udpsink host=janus.4devz.com port=5104
```

## Janus Server Configuration Demo

* URL https://janus.4devz.com/demos/streamingtest.html
* Config File: /usr/local/etc/janus/janus.plugin.streaming.jcfg

__Configuration__

```
# Audio port 5002
# Video port 5004
rtp-h264: {
        type = "rtp"
        id = 99
        description = "External h264 source"
        metadata = "You can use this metadata section to put any info you want!"
        audio = true
        video = true
        audioport = 5002
        audiopt = 111
        audiocodec = "opus"
        videoport = 5004
        videopt = 100
        videocodec = "h264"
        h264_profile = "42e01f"
        secret = "adminpwd"
}

# Audio port 5102
# Video1 port 5104
# Video2 port 5106
multistream-test: {
        type = "rtp"
        id = 123
        description = "Multistream test (1 audio, 2 video)"
        metadata = ""
        media = (
                {
                        type = "audio"
                        mid = "a"
                        label = "Audio stream"
                        port = 5102
                        pt = 111
                        codec = "opus"
                },
                {
                        type = "video"
                        mid = "v1"
                        label = "Video stream #1"
                        port = 5104
                        pt = 100
                        codec = "vp8"
                },
                {
                        type = "video"
                        mid = "v2"
                        label = "Video stream #2"
                        port = 5106
                        pt = 100
                        codec = "vp8"
                }
        )
        secret = "adminpwd"
}
```