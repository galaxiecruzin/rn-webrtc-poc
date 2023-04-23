#!/bin/sh

gst-launch-1.0 \
  videotestsrc ! \
    video/x-raw,width=320,height=240,framerate=15/1 ! \
    videoscale ! videorate ! videoconvert ! timeoverlay ! \
    vp8enc error-resilient=1 ! \
      rtpvp8pay mtu=1200 ! udpsink host=janus.4devz.com port=5104
