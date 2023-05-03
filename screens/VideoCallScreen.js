import React, {useEffect, useState} from 'react';
import {
  Button,
  StyleSheet,
  SafeAreaView,
  View,
} from 'react-native';

import WebRTC, {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStream,
    MediaStreamTrack,
    getUserMedia,
  } from 'react-native-webrtc';

// import janusClient from '../lib/JanusClient';
import Janus from '../lib/janus';

/**
 * 
 * MediaStream
    addTrack(track: MediaStreamTrack): void;
    removeTrack(track: MediaStreamTrack): void;
    getTracks(): MediaStreamTrack[];
    getTrackById(trackId: any): MediaStreamTrack | undefined;
    getAudioTracks(): MediaStreamTrack[];
    getVideoTracks(): MediaStreamTrack[];
    clone(): never;
    toURL(): string;
    release(releaseTracks?: boolean): void; 
 */


export const VideoCallScreen = () => {
  const [stream, setStream] = useState(null);
  const [streaming, setStreaming] = useState();

  const start = async () => {
      console.log('start');
      if (!stream) {
        try {
          Janus.init({
            debug: "all",
            callback: () => {
              self.janus = new Janus({
                server: ['wss://janus.4devz.com:8188/', 'https://janus.4devz.com:8089/janus'],
                success: () => {
                  console.log("Janus.init complete.");
                  self.janus.attach({
                    plugin: "janus.plugin.streaming",
                    // stream: undefined,
                    opaqueId: 'streamingtest-BUwO26IIZ3Os',
                    success: function(pluginHandle) {
                      setStreaming(pluginHandle);
                      console.log("Plugin attached! (" + pluginHandle.getPlugin() + ", id=" + pluginHandle.getId() + ")");
                      // Get list of streams
                      pluginHandle.send({ message: { request: "list" }, 
                        success: (result) => {
                          console.log("pluginHandle.send -> result:", result);
                          // Tell server we want to watch
                          pluginHandle.send({ message: { request: "watch", id: 99} });
                        }
                      });
                    },
                    onmessage: (message, jsep) => {
                      console.log("onmessage()...", message);
                      if (message.error) {
                        console.log("onmessage() -> error:", message);
                        return;
                      }
                      if (jsep) {
                        console.log("onmessage()...if jsep true");
                        // create answer
                        let stereo = (jsep.sdp.indexOf("stereo=1") !== -1);
                        console.log("onmessage()...createAnswer");
                        streaming.createAnswer({
                          jsep: jsep,
                          tracks: [
                            { type: 'data' }
                          ],
                          customizeSdp: function(jsep) {
                            console.log("onmessage() -> customizeSdp()");
                            if(stereo && jsep.sdp.indexOf("stereo=1") == -1) {
                              // Make sure that our offer contains stereo too
                              jsep.sdp = jsep.sdp.replace("useinbandfec=1", "useinbandfec=1;stereo=1");
                            }
                          },
                          success: function(jsep) {
                            Janus.debug("onmessage() -> Got SDP!", jsep);
                            let body = { request: "start" };
                            streaming.send({ message: body, jsep: jsep });
                            //$('#watch').html("Stop").removeAttr('disabled').unbind('click').click(stopStream);
                          },
                          error: function(error) {
                            Janus.error("onmessage() -> WebRTC error:", error);
                            //bootbox.alert("WebRTC error... " + error.message);
                          }
                        });
                      }
                    }
                  });
                },
              });
            }
          });
        } catch(e) {
            console.error(e);
        }
      }
  };

  const stop = () => {
        console.log('stop');
        if (stream) {
          stream.release();
          setStream(null);
        }
  };

  return (
    <SafeAreaView style={styles.body}>
        {
        stream &&
          <RTCView
            streamURL={stream.toURL()}
            style={styles.stream} />
        }
        <View
          style={styles.footer}>
          <Button
            title = "Start"
            onPress = {start} />
          <Button
            title = "Stop"
            onPress = {stop} />
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: "#fff",
    ...StyleSheet.absoluteFill
  },
  headerText: {
    color: '#fff',
    fontSize: 50
  },
  stream: {
    flex: 1
  },
  footer: {
    backgroundColor: "#ccc",
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0
  },
});