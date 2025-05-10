import {
  LocalUser,
  RemoteUser,
  useIsConnected,
  useJoin,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  usePublish,
  useRemoteUsers,
} from "agora-rtc-react";
import { useEffect, useState } from "react";
import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";

export const InteractiveLiveStreaming = () => {
  // Create client with role "host"
  const client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
  client.setClientRole("host");

  return (
    <AgoraRTCProvider client={client}>
      <Basics />
    </AgoraRTCProvider>
  );
};

const Basics = () => {
  const [calling, setCalling] = useState(false);
  const isConnected = useIsConnected();

  const [appId, setAppId] = useState("f23344f83d8e4ebfb27ed5354bca021b");
  const [channel, setChannel] = useState("liveclass");
  const [token, setToken] = useState("007eJxTYFh4dE/ulosvvnlF730kLnzwxJteK87tCxyCWAWeXVGtW3hfgSHNyNjYxCTNwjjFItUkNSktycg8NcXU2NQkKTnRwMgwyeeNXEZDICPDlWWiDIxQCOJzMuRklqUm5yQWFzMwAAC5piOe");

  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);

  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);

  useJoin(
    { appid: appId, channel: channel, token: token ? token : null },
    calling
  );
  usePublish([localMicrophoneTrack, localCameraTrack]);

  const remoteUsers = useRemoteUsers();

  return (
    <div style={{ padding: 20 }}>
      {!isConnected ? (
        <>
          <h3>Join Live Stream</h3>
          <input
            onChange={(e) => setAppId(e.target.value)}
            placeholder="App ID"
            value={appId}
            style={{ display: "block", marginBottom: 10 }}
          />
          <input
            onChange={(e) => setChannel(e.target.value)}
            placeholder="Channel Name"
            value={channel}
            style={{ display: "block", marginBottom: 10 }}
          />
          <input
            onChange={(e) => setToken(e.target.value)}
            placeholder="Token"
            value={token}
            style={{ display: "block", marginBottom: 10 }}
          />
          <button disabled={!appId || !channel} onClick={() => setCalling(true)}>
            Join Channel
          </button>
        </>
      ) : (
        <>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
            {/* Local user video */}
            <div>
              <LocalUser
                audioTrack={localMicrophoneTrack}
                cameraOn={cameraOn}
                micOn={micOn}
                playAudio={false}
                videoTrack={localCameraTrack}
                style={{ width: 400, height: 300, borderRadius: 10 }}
              />
              <p style={{ textAlign: "center" }}>You</p>
            </div>

            {/* Remote users */}
            {remoteUsers.map((user) => (
              <div key={user.uid}>
                <RemoteUser
                  user={user}
                  style={{ width: 400, height: 300, borderRadius: 10 }}
                />
                <p style={{ textAlign: "center" }}>User {user.uid}</p>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div style={{ marginTop: 20 }}>
            <button onClick={() => setMic((m) => !m)}>
              {micOn ? "Disable Mic" : "Enable Mic"}
            </button>
            <button onClick={() => setCamera((c) => !c)}>
              {cameraOn ? "Disable Camera" : "Enable Camera"}
            </button>
            <button onClick={() => setCalling(false)}>
              Leave Channel
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default InteractiveLiveStreaming;
