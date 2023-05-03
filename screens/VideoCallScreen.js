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
                    opaqueId: 'streamingtest-z4yYO366Y7oP',
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
                          success: function(ourjsep) {
                            Janus.debug("onmessage() -> Got SDP!", ourjsep);
                            let body = { request: "start" };
                            streaming.send({ message: body, jsep: ourjsep });
                            //$('#watch').html("Stop").removeAttr('disabled').unbind('click').click(stopStream);
                          },
                          error: function(error) {
                            Janus.error("onmessage() -> WebRTC error:", error);
                            //bootbox.alert("WebRTC error... " + error.message);
                          }
                        });
                      }
                    },
                    onlocaltrack: function(track, added) {
                      // This will NOT be invoked, we chose recvonly
                    },
                    onremotetrack: function(track, mid, added, metadata) {
                        // Invoked after send has got us a PeerConnection
                        // This is info on a remote track: when added, we can choose to render
                        // This is info on a remote track: when added, we can choose to render
                        // You can query metadata to get some more information on why track was added or removed
                        // metadata fields:
                        //   - reason: 'created' | 'ended' | 'mute' | 'unmute'
                    },
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