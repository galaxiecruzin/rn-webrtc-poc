#!/bin/bash

ffmpeg -re -stream_loop -1 -i ./output.mp4 -s 426x240 -c:v libx264 -profile:v \
 baseline -b:v 1M -r 24 -g 60 \
 -c:a libopus -b:a 96K -ar 48000 \
 -an -f rtp rtp://janus.4devz.com:5004 \
 -vn -f rtp rtp://janus.4devz.com:5002