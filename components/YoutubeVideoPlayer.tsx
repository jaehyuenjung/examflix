import React from "react";
import YouTube from "react-youtube";

class YouTubeVideoPlayer extends React.Component {
  render() {
    const opts = {
      playerVars: {
        autoplay: 1,
      },
    };

    return (
      <YouTube videoId="TcMBFSGVi1c" opts={opts} onReady={this._onReady} />
    );
  }

  _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.playVideo();
  }
}

export default YouTubeVideoPlayer;
