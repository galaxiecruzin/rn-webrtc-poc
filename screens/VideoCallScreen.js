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
    // local stream
    const [stream, setStream] = useState(null);

    useEffect(() => {
        let peerConstraints = {
            iceServers: [
                {
                    urls: 'stun:stun.l.google.com:19302'
                }
            ]
        };
        
        let peerConnection = new RTCPeerConnection( peerConstraints );
        
        peerConnection.addEventListener( 'connectionstatechange', event => {
            switch( peerConnection.connectionState ) {
                case 'closed':
                    // You can handle the call being disconnected here.
                    break;
            };
        } );
        
        peerConnection.addEventListener( 'icecandidate', event => {
            // When you find a null candidate then there are no more candidates.
            // Gathering of candidates has finished.
            if ( !event.candidate ) { return; };
        
            // Send the event.candidate onto the person you're calling.
            // Keeping to Trickle ICE Standards, you should send the candidates immediately.
        } );
        
        peerConnection.addEventListener( 'icecandidateerror', event => {
            // You can ignore some candidate errors.
            // Connections can still be made even when errors occur.
        } );
        
        peerConnection.addEventListener( 'iceconnectionstatechange', event => {
            switch( peerConnection.iceConnectionState ) {
                case 'connected':
                case 'completed':
                    // You can handle the call being connected here.
                    // Like setting the video streams to visible.
                    break;
            };
        } );
        
        peerConnection.addEventListener( 'negotiationneeded', event => {
            // You can start the offer stages here.
            // Be careful as this event can be called multiple times.
        } );
        
        peerConnection.addEventListener( 'signalingstatechange', event => {
            switch( peerConnection.signalingState ) {
                case 'closed':
                    // You can handle the call being disconnected here.
        
                    break;
            };
        } );
        
        peerConnection.addEventListener( 'track', event => {
            // Grab the remote track from the connected participant.
            remoteMediaStream = remoteMediaStream || new MediaStream();
            remoteMediaStream.addTrack( event.track, remoteMediaStream );
        } );
        
        // Add our stream to the peer connection.
        // localMediaStream.getTracks().forEach( 
        //     track => peerConnection.addTrack( track, localMediaStream );
        // );
    }); 

  const start = async () => {
      console.log('start');
      if (!stream) {
        let connection;
        try {
          Janus.init({
            debug: "all",
            callback: () => {
              self.janus = new Janus({
                server: 'https://janus.4devz.com:8089/janus',
                success: () => {
                  console.log("Janus.init complete.")
                }
              });
              // self.janus.attach({
              //   onmessage: function(msg, jsep) {
              //   Janus.debug(" ::: Got a message (listener) :::");
              //   Janus.debug(JSON.stringify(msg));
              //   }
              // });
              self.janus.attach({
                plugin: "janus.plugin.streaming",
                // stream: undefined,
                opaqueId: 'streamingtest-BUwO26IIZ3Os',
                success: function(pluginHandle) {
                  console.log("Plugin attached! (" + pluginHandle.getPlugin() + ", id=" + pluginHandle.getId() + ")");
                  // pluginHandle.send({"message": {}});
                }
              });
            }
          });
          // let s = await mediaDevices.getUserMedia({ video: true });
          // setStream(s);
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