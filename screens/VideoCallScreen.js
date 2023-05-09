import {mediaDevices, MediaStream, RTCIceCandidate, RTCPeerConnection, RTCSessionDescription, RTCView} from 'react-native-webrtc';
import React from 'react';
import {Dimensions, FlatList, StatusBar, View} from 'react-native';
import Janus from '../lib/Janus';
import JanusStreamingPlugin from '../lib/plugins/streaming/JanusStreamingPlugin';

Janus.setDependencies({
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  MediaStream,
});

class VideoCallScreen extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
          stream: null,
          publishers: [],
      };
  }

  async initJanus(stream) {
      try {
          this.setState(state => ({
              publishers: [
                  {
                      publisher: null,
                      stream: stream,
                  },
              ],
          }));

          this.janus = new Janus('ws://janus.4devz.com:8188');
          // this.janus.setApiSecret('janusrocks');
          await this.janus.init();
          this.streaming = new JanusStreamingPlugin(this.janus);
          await this.streaming.createPeer();
          await this.streaming.connect();
          // this.streaming.watch(99);
      } catch (e) {
          console.error('main', JSON.stringify(e));
      }
  }

  getMediaStream = async () => {
      let isFront = true;
      let sourceInfos = await mediaDevices.enumerateDevices();
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
          const sourceInfo = sourceInfos[i];
          console.log(sourceInfo);
          if (sourceInfo.kind == 'videoinput' && sourceInfo.facing == (isFront ? 'front' : 'environment')) {
              videoSourceId = sourceInfo.deviceId;
          }
      }

      let stream = await mediaDevices.getUserMedia({
          audio: true,
          video: {
              facingMode: (isFront ? 'user' : 'environment'),
          },
      });
      await this.initJanus(stream);
  };

  async componentDidMount() {
      this.getMediaStream();
  }

  componentWillUnmount = async () => {
      if (this.janus) {
          await this.janus.destroy();
      }
  };

  renderView() {
  }

  render() {
      return (
          <View style={{flex: 1, width: '100%', height: '100%', backgroundColor: '#000000', flexDirection: 'row'}}>
              <StatusBar translucent={true} barStyle={'light-content'}/>
              <FlatList
                  data={this.state.publishers}
                  numColumns={2}
                  keyExtractor={(item, index) => {
                      if (item.publisher === null) {
                          return `rtc-default`;
                      }
                      return `rtc-${item.publisher.id}`;
                  }}
                  renderItem={({item}) => (
                      <RTCView style={{
                          flex: 1,
                          height: (Dimensions.get('window').height / 2),
                      }} objectFit={'cover'} streamURL={item.stream.toURL()}/>
                  )}
              />
          </View>
      );
  }
}

export default VideoCallScreen;


// import React, {useEffect, useState} from 'react';
// import {Button, StyleSheet, SafeAreaView, Text, View} from 'react-native';

// import WebRTC, {
//   RTCPeerConnection,
//   RTCIceCandidate,
//   RTCSessionDescription,
//   RTCView,
//   MediaStream,
//   MediaStreamTrack,
//   getUserMedia,
// } from 'react-native-webrtc';

// import Janus from '../lib/janus';

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

// var janus = null;
// const server = 'https://janus.4devz.com:8089/janus'; // 'wss://janus.4devz.com:8188/',
// const iceServers = 'stun.l.google.com:19302';
/**
  'stun1.l.google.com:19302',
  'stun2.l.google.com:19302',
  'stun3.l.google.com:19302',
  'stun4.l.google.com:19302',
];
*/
// let streaming = null;

// export const VideoCallScreen = () => {
//   const selectedStream = 99;
//   const [opaqueId, setOpaqueId] = useState(null);
//   const [stream, setStream] = useState(null);
//   const [remoteStream, setRemoteStream] = useState(null);
//   const [janusInit, setJanusInit] = useState(null);
//   const [streamsList, setStreamsList] = useState(null);

//   const updateStreamsList = () => {
//     // if streaming
//     streaming.send({
//       message: {request: 'list'},
//       success: result => {
//         // console.log('pluginHandle.send -> result:', result);
//         _streamsList = {};
//         if (result['list'] && Array.isArray(result['list'])) {
//           let list = result['list'];
//           for (let mp in list) {
//             Janus.debug(
//               '  >> [' +
//                 list[mp]['id'] +
//                 '] ' +
//                 list[mp]['description'] +
//                 ' (' +
//                 list[mp]['type'] +
//                 ')',
//             );
//             // Check the nature of the available streams, and if there are some multistream ones
//             list[mp].legacy = true;
//             if (list[mp].media) {
//               let audios = 0,
//                 videos = 0;
//               for (let mi in list[mp].media) {
//                 if (!list[mp].media[mi]) continue;
//                 if (list[mp].media[mi].type === 'audio') audios++;
//                 else if (list[mp].media[mi].type === 'video') videos++;
//                 if (audios > 1 || videos > 1) {
//                   list[mp].legacy = false;
//                   break;
//                 }
//               }
//             }
//             // Keep track of all the available streams
//             _streamsList[list[mp]['id']] = list[mp];
//             setStreamsList(_streamsList);
//             // console.log('streamsList', _streamsList);
//           }
//         }
//       },
//     });
//   };

//   const getStreamInfo = () => {
//     // console.log('getStreamInfo()');
//     // if(!selectedStream || !streamsList[selectedStream])
//     //     return;
//     // Send a request for more info on the mountpoint we subscribed to
//     let body = {
//       request: 'info',
//       id: parseInt(selectedStream) || selectedStream,
//     };
//     streaming.send({
//       message: body,
//       success: function (result) {
//         console.log('getStreamInfo()', result);
//         setStream(result);
//       },
//     });
//   };

//   const startStream = () => {
//     // Tell server we want to watch
//     console.log('startStream()');
//     if (streaming) {
//       streaming.send({message: {request: 'watch', id: selectedStream}});
//       getStreamInfo();
//     }
//   };

//   const init = async () => {
//     let _opaqueId = 'streamingtest-' + Janus.randomString(12);
//     setOpaqueId(_opaqueId);
//     console.log('init() ... ');
//     if (!stream) {
//       try {
//         Janus.init({
//           debug: 'all',
//           callback: () => {
//             janus = new Janus({
//               server: server,
//               iceServers: iceServers,
//               success: () => {
//                 console.log('Janus.init complete.');
//                 setJanusInit(true);
//                 janus.attach({
//                   plugin: 'janus.plugin.streaming',
//                   opaqueId: _opaqueId,
//                   success: function (pluginHandle) {
//                     streaming = pluginHandle;
//                     console.log(
//                       'Plugin attached! (' +
//                         pluginHandle.getPlugin() +
//                         ', id=' +
//                         pluginHandle.getId() +
//                         ')',
//                     );
//                     // Get list of streams
//                     updateStreamsList();
//                   },
//                   error: function (error) {
//                     console.error('  -- Error attaching plugin... ', error);
//                   },
//                   iceState: function (state) {
//                     console.log('ICE state changed to ' + state);
//                   },
//                   webrtcState: function (on) {
//                     console.log(
//                       'Janus says our WebRTC PeerConnection is ' +
//                         (on ? 'up' : 'down') +
//                         ' now',
//                     );
//                   },
//                   slowLink: function (uplink, lost, mid) {
//                     console.warn(
//                       'Janus reports problems ' +
//                         (uplink ? 'sending' : 'receiving') +
//                         ' packets on mid ' +
//                         mid +
//                         ' (' +
//                         lost +
//                         ' lost packets)',
//                     );
//                   },
//                   onmessage: function (msg, jsep) {
//                     console.log(' ::: Got a message :::', msg);
//                     let result = msg['result'];
//                     if (result) {
//                       if (result['status']) {
//                         let status = result['status'];
//                         if (status === 'starting')
//                           console.log('Starting, please wait...');
//                         else if (status === 'started') console.log('Started');
//                         else if (status === 'stopped') stopStream();
//                       } else if (msg['streaming'] === 'event') {
//                         // Does this event refer to a mid in particular?
//                         // let mid = result["mid"] ? result["mid"] : "0";
//                         // Is simulcast in place?
//                         // let substream = result["substream"];
//                         // let temporal = result["temporal"];
//                         // if((substream !== null && substream !== undefined) || (temporal !== null && temporal !== undefined)) {
//                         //     if(!simulcastStarted[mid]) {
//                         //         simulcastStarted[mid] = true;
//                         //         addSimulcastButtons(mid);
//                         //     }
//                         //     // We just received notice that there's been a switch, update the buttons
//                         //     updateSimulcastButtons(mid, substream, temporal);
//                         // }
//                         // Is VP9/SVC in place?
//                         // let spatial = result["spatial_layer"];
//                         // temporal = result["temporal_layer"];
//                         // if((spatial !== null && spatial !== undefined) || (temporal !== null && temporal !== undefined)) {
//                         //     if(!svcStarted[mid]) {
//                         //         svcStarted[mid] = true;
//                         //         addSvcButtons(mid);
//                         //     }
//                         //     // We just received notice that there's been a switch, update the buttons
//                         //     updateSvcButtons(mid, spatial, temporal);
//                         // }
//                       }
//                     } else if (msg['error']) {
//                       console.log(msg['error']);
//                       return;
//                     }
//                     if (jsep) {
//                       console.log('Handling SDP as well...', jsep);
//                       let stereo = jsep.sdp.indexOf('stereo=1') !== -1;
//                       // Offer from the plugin, let's answer
//                       streaming.createAnswer({
//                         jsep: jsep,
//                         // We only specify data channels here, as this way in
//                         // case they were offered we'll enable them. Since we
//                         // don't mention audio or video tracks, we autoaccept them
//                         // as recvonly (since we won't capture anything ourselves)
//                         tracks: [{type: 'data'}],
//                         // customizeSdp: function (jsep) {
//                         //   if (stereo && jsep.sdp.indexOf('stereo=1') == -1) {
//                         //     // Make sure that our offer contains stereo too
//                         //     jsep.sdp = jsep.sdp.replace(
//                         //       'useinbandfec=1',
//                         //       'useinbandfec=1;stereo=1',
//                         //     );
//                         //   }
//                         // },
//                         success: function (jsep) {
//                           Janus.debug('Got SDP!', jsep);
//                           let body = {request: 'start'};
//                           streaming.send({message: body, jsep: jsep});
//                           // $('#watch').html("Stop").removeAttr('disabled').unbind('click').click(stopStream);
//                         },
//                         error: function (error) {
//                           console.log('WebRTC error:', error);
//                           // bootbox.alert("WebRTC error... " + error.message);
//                         },
//                       });
//                     }
//                   },
//                   onremotetrack: function (track, mid, on, metadata) {
//                     console.log(
//                       'Remote track (mid=' +
//                         mid +
//                         ') ' +
//                         (on ? 'added' : 'removed') +
//                         (metadata ? ' (' + metadata.reason + ') ' : '') +
//                         ':',
//                       track,
//                     );
//                     // TODO ------------------------------------------------
//                     // When stream is received do something with it, such as,
//                     // setRemoteStream();
//                     // or add all tracks to an array of tracks
//                     // TODO ------------------------------------------------
//                   },
//                   ondataopen: function (label, protocol) {
//                     console.log(
//                       'The DataChannel is available!',
//                       label,
//                       protocol,
//                     );
//                   },
//                   ondata: function (data) {
//                     console.log('We got data from the DataChannel!', data);
//                   },
//                   oncleanup: function () {
//                     console.log(' ::: Got a cleanup notification :::');
//                   },
//                 });
//               },
//               error: function (error) {
//                 console.error(error);
//               },
//               destroyed: function () {
//                 // window.location.reload(); // TODO
//               },
//             });
//           },
//         });
//       } catch (e) {
//         console.error(e);
//       }
//     }
//   };

//   const stopStream = () => {
//     console.log('stop');
//     let body = {request: 'stop'};
//     if (streaming) {
//       streaming.send({message: body});
//       streaming.hangup();
//     }
//     streaming = null;
//     setStream(null);
//   };

//   useEffect(() => {
//     // init();
//     console.log('Ready to init.');
//   }, []);

//   const renderStream = () => {
//     console.log("reanderStream() ");
//     if (remoteStream) {
//       // const keys = Object.keys(stream);
//       console.log("renderStream -> remoteStream", JSON.stringify(remoteStream));
//       // // <RTCView streamURL={url} style={styles.stream} />
//       return (
//         <>
//           <Text>The Stream</Text>
//         </>
//       );
//       /**
//        *
//           {streamsList.map((stream) => (
//             <Text>{stream.description}</Text>
//           ))}
//        */
//     } else {
//       return (
//         <Text>No Video</Text>
//       );
//     }
//   }

//   return (
//     <SafeAreaView style={styles.body}>
//       {renderStream()}
//       <View style={styles.footer}>
//         {!janusInit &&
//           <Button title="Init" onPress={init} />
//         }
//         {janusInit &&
//           <Button title="Start" onPress={startStream} />
//         }
//         <Button title="Stop" onPress={stopStream} />
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   body: {
//     backgroundColor: '#fff',
//     ...StyleSheet.absoluteFill,
//   },
//   headerText: {
//     color: '#fff',
//     fontSize: 50,
//   },
//   stream: {
//     flex: 1,
//   },
//   footer: {
//     backgroundColor: '#ccc',
//     position: 'absolute',
//     bottom: 20,
//     left: 0,
//     right: 0,
//   },
// });
