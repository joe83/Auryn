import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    View,
    Text,
    Button,
    BackHandler
  } from 'react-native';
  import {
    ButtonRef,
    Composition,
    ImageRef,
    TextRef,
    TimelineRef,
    Fragment,
    ViewRef,
    TouchableHighlight,
    Video,
    Image
  } from 'react-native-youi';
  import Scrubber from './scrubber.youi.js'

class VideoPlayer extends Component {
    constructor(props) {
      super(props);
      this.state = {
        videoSource: {
          uri: "http://amssamples.streaming.mediaservices.windows.net/3d7eaff9-39fa-442f-81cc-f2ea7db1797e/TearsOfSteelTeaser.ism/manifest(format=m3u8-aapl)",
          type: "HLS"
        },
        mediaState: '',
        playbackState: '',
        duration: 0,
        currentTime: 0,
        formattedTime: "00:00",
        muted: true,
        paused: true
      };
    }
    componentWillUnmount() {
      this.setState({
        paused: true,
        videoSource: {}
      })

    }
    componentDidMount() {
      // this.setState({
      //   this.inTimeline.play();
      // })

    }

    render() {
      return (
      <View style={styles.container}>
        <Video
                style={styles.video}
                ref={(ref) => {this.video=ref}}
                paused={this.state.paused}
                source={this.state.videoSource}
                muted={this.state.muted}

                onBufferingStarted={() => console.log("onBufferingStarted called.")}
                onBufferingEnded={() => console.log("onBufferingEnded called.")}
                onErrorOccurred={() => console.log("onErrorOccurred called.")}
                onPreparing={() => console.log("onPreparing called.") }
                onReady={() => this.setState({paused: false})}
                onPlaying={() => console.log("onPlaying called.")}
                onPaused={() => console.log("onPaused called.")}
                onPlaybackComplete={() => {
                  this.props.onBack()
                  console.log("onPlaybackComplete called.")
                }}
                onFinalized={() => console.log("onFinalized called.")}
                onCurrentTimeUpdated={(currentTime) => {
                  var s = Math.floor(currentTime.nativeEvent.currentTime / 1000)
                  var m = Math.floor(s / 60)
                  var h = Math.floor(s / 3600)
                  h = h < 1 ? '' : h + ':'
                  m = m < 10 ? '0' + m : m;
                  s = s < 10 ? '0' + s : s;

                  var time = h + m + ':' + s;
                  this.setState({
                    currentTime: currentTime.nativeEvent.currentTime,
                    formattedTime: time
                  })}
                }
                onDurationChanged={(duration) => {
                  this.setState({
                    duration: duration.nativeEvent.duration
                  })}
                }
                onStateChanged={(playerState) => {
                  this.setState({
                    playbackState: playerState.nativeEvent.playbackState,
                    mediaState: playerState.nativeEvent.mediaState
                  })}
                }
              />

        <Composition source="Player_Main">
          <ViewRef name="Playback-Controls">
            <TimelineRef name="In"
              onLoad={(timeline) => {
              this.inTimeline = timeline;
              timeline.play();
              }}/>
            <TextRef name="Placeholder-Time" text={this.state.formattedTime}/>
            <ViewRef name="PlayPause-Container">
              <TimelineRef name="In"
                onLoad={(timeline) => {
                this.inTimeline = timeline;
                timeline.play();
              }}/>
              <ButtonRef
                name="Btn-PlayPause"
                onClick={() => {
                  this.setState({paused: !this.state.paused})
                  this.focusInTimeline.play();
                  if (this.state.paused)
                    this.toggleOnTimeline.play();
                  else
                  this.toggleOffTimeline.play();
                }}>
                  <TimelineRef name="Toggle-On"
                  onLoad={(timeline) => {
                    this.toggleOnTimeline=timeline;
                    if (this.state.paused)
                      timeline.play();
                  }}/>
                  <TimelineRef name="FocusIn"
                  onLoad={(timeline) => {
                    this.focusInTimeline=timeline;
                    if (!this.state.paused)
                      timeline.play();
                  }}/>
                  <TimelineRef name="Toggle-Off"
                  onLoad={(timeline) => {
                    this.toggleOffTimeline=timeline;
                  }}/>
              </ButtonRef>
            </ViewRef>
            <ViewRef name="Btn-Back-Container">
              <TimelineRef name="In"
                onLoad={(timeline) => {
                this.inTimeline = timeline;
                timeline.play();
              }}/>
              <ButtonRef
                name="Btn-Back"
                onClick={() => {
                  this.video.seek(-1)
                }}/>
              </ViewRef>
          </ViewRef>
        </Composition>

        <Scrubber style={styles.scrubber} duration={this.state.duration} currentTime={this.state.currentTime} />

      </View>
      );
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    video: {
      flex: 1,
      position: 'absolute',
      color: 'white',
      fontSize: 20,
      width: 1280,
      height: 720
    },
  });
export default VideoPlayer
