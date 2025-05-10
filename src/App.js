// "use client"

// import {
//   LocalUser,
//   RemoteUser,
//   useIsConnected,
//   useJoin,
//   useLocalMicrophoneTrack,
//   useLocalCameraTrack,
//   usePublish,
//   useRemoteUsers,
//   useCurrentUID,
// } from "agora-rtc-react"
// import { useEffect, useState } from "react"
// import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react"

// export const InteractiveLiveStreaming = () => {
//   const [role, setRole] = useState("host") // Default to audience
//   // Create client with the selected role
//   const client = AgoraRTC.createClient({ mode: "live", codec: "vp8" })

//   // Set client role based on user selection
//   useEffect(() => {
//     if (client) {
//       client.setClientRole(role)
//     }
//   }, [client, role])

//   return (
//     <AgoraRTCProvider client={client}>
//       <div style={{ textAlign: "center", marginBottom: 20 }}>
//         <h2>Interactive Live Streaming</h2>
//         <div>
//           <button
//             onClick={() => setRole("host")}
//             style={{
//               backgroundColor: role === "host" ? "#4CAF50" : "#f0f0f0",
//               color: role === "host" ? "white" : "black",
//               padding: "8px 16px",
//               margin: "0 10px",
//               borderRadius: "4px",
//               border: "none",
//             }}
//           >
//             Join as Host
//           </button>
//           <button
//             onClick={() => setRole("audience")}
//             style={{
//               backgroundColor: role === "audience" ? "#2196F3" : "#f0f0f0",
//               color: role === "audience" ? "white" : "black",
//               padding: "8px 16px",
//               margin: "0 10px",
//               borderRadius: "4px",
//               border: "none",
//             }}
//           >
//             Join as Audience
//           </button>
//         </div>
//       </div>
//       <Basics role={role} client={client} />
//     </AgoraRTCProvider>
//   )
// }

// const Basics = ({ role, client }) => {
//   const [audienceList, setAudienceList] = useState([])
//   const [calling, setCalling] = useState(false)
//   const isConnected = useIsConnected()

//   const [appId, setAppId] = useState("f23344f83d8e4ebfb27ed5354bca021b")
//   const [channel, setChannel] = useState("liveclass")
//   const [token, setToken] = useState(
//     "007eJxTYFh4dE/ulosvvnlF730kLnzwxJteK87tCxyCWAWeXVGtW3hfgSHNyNjYxCTNwjjFItUkNSktycg8NcXU2NQkKTnRwMgwyeeNXEZDICPDlWWiDIxQCOJzMuRklqUm5yQWFzMwAAC5piOe",
//   )
//   const [uid, setUid] = useState("")

//   const isHost = role === "host"
//   const [micOn, setMic] = useState(isHost)
//   const [cameraOn, setCamera] = useState(isHost)

//   // Only create tracks for hosts
//   const { localMicrophoneTrack } = useLocalMicrophoneTrack(isHost && micOn)
//   const { localCameraTrack } = useLocalCameraTrack(isHost && cameraOn)

//   useJoin(
//     {
//       appid: appId,
//       channel: channel,
//       token: token ? token : null,
//       uid: uid ? uid : undefined,
//     },
//     calling,
//   )

//   // Only hosts publish their tracks
//   usePublish(isHost ? [localMicrophoneTrack, localCameraTrack] : [])

//   // Get remote users and force component to update when remoteUsers changes
//   const remoteUsers = useRemoteUsers()

//   // Add event listeners to detect user join/leave events
//   useEffect(() => {
//     if (isConnected) {
//       const handleUserJoined = (user) => {
//         console.log("User joined:", user)

//         // If user is not publishing audio or video (i.e., audience)
//         if (!user.hasAudio && !user.hasVideo) {
//           setAudienceList((prev) => {
//             if (!prev.some((u) => u.uid === user.uid)) {
//               return [...prev, user]
//             }
//             return prev
//           })
//         }

//         setForceUpdate((prev) => prev + 1)
//       }

//       const handleUserLeft = (user) => {
//         console.log("User left:", user)
//         setAudienceList((prev) => prev.filter((u) => u.uid !== user.uid))
//         setForceUpdate((prev) => prev + 1)
//       }

//       client.on("user-joined", handleUserJoined)
//       client.on("user-left", handleUserLeft)

//       return () => {
//         client.off("user-joined", handleUserJoined)
//         client.off("user-left", handleUserLeft)
//       }
//     }
//   }, [isConnected, client])


//   // State to force re-renders when users join/leave
//   const [forceUpdate, setForceUpdate] = useState(0)
//   console.log("Force update count:", forceUpdate)

//   useEffect(() => {
//     // Reset camera and mic when role changes
//     if (isHost) {
//       setMic(true)
//       setCamera(true)
//     } else {
//       setMic(false)
//       setCamera(false)
//     }
//   }, [isHost])

//   // Log remote users for debugging
//   useEffect(() => {
//     if (remoteUsers && remoteUsers.length > 0) {
//       console.log(
//         "Remote users updated:",
//         remoteUsers.map((user) => user.uid),
//       )
//     }
//   }, [remoteUsers, forceUpdate])

//   return (
//     <div style={{ padding: 20 }}>
//       {!isConnected ? (
//         <div style={{ maxWidth: 400, margin: "0 auto", padding: 20, backgroundColor: "#f9f9f9", borderRadius: 10 }}>
//           <h3>Join {isHost ? "as Host" : "as Audience"}</h3>
//           <input
//             onChange={(e) => setAppId(e.target.value)}
//             placeholder="App ID"
//             value={appId}
//             style={{ display: "block", marginBottom: 10, width: "100%", padding: 8 }}
//           />
//           <input
//             onChange={(e) => setChannel(e.target.value)}
//             placeholder="Channel Name"
//             value={channel}
//             style={{ display: "block", marginBottom: 10, width: "100%", padding: 8 }}
//           />
//           <input
//             onChange={(e) => setToken(e.target.value)}
//             placeholder="Token"
//             value={token}
//             style={{ display: "block", marginBottom: 10, width: "100%", padding: 8 }}
//           />
//           <input
//             onChange={(e) => setUid(e.target.value)}
//             placeholder="UID (Optional)"
//             value={uid}
//             style={{ display: "block", marginBottom: 10, width: "100%", padding: 8 }}
//           />
//           <button
//             disabled={!appId || !channel}
//             onClick={() => setCalling(true)}
//             style={{
//               width: "100%",
//               padding: 10,
//               backgroundColor: "#2196F3",
//               color: "white",
//               border: "none",
//               borderRadius: 5,
//               cursor: !appId || !channel ? "not-allowed" : "pointer",
//             }}
//           >
//             Join Channel
//           </button>
//         </div>
//       ) : (
//         <>
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 gap: 20,
//                 flexWrap: "wrap",
//                 justifyContent: "center",
//                 marginBottom: 20,
//               }}
//             >
//               {/* Only show local user preview for hosts */}
//               {isHost && (
//                 <div style={{ textAlign: "center" }}>
//                   {/* Host's Local Video */}
//                   <LocalUser
//                     audioTrack={localMicrophoneTrack}
//                     cameraOn={cameraOn}
//                     micOn={micOn}
//                     playAudio={false}
//                     videoTrack={localCameraTrack}
//                     style={{
//                       width: 400,
//                       height: 300,
//                       borderRadius: 10,
//                       border: "2px solid #4CAF50",
//                     }}
//                   />
//                   <p style={{ marginTop: 5 }}>You (Host)</p>

//                   {/* Remote Users */}
//                   {remoteUsers.length > 0 ? (
//                     remoteUsers.map((user) => (
//                       <div key={user.uid} style={{ textAlign: "center", marginTop: 20 }}>
//                         <RemoteUser
//                           user={user}
//                           style={{
//                             width: 400,
//                             height: 300,
//                             borderRadius: 10,
//                             border: "2px solid #2196F3",
//                           }}
//                         />
//                         <p style={{ marginTop: 5 }}>
//                           User {user.uid} (Audience)
//                         </p>
//                       </div>
//                     ))
//                   ) : (
//                     <div style={{ padding: 20 }}>
//                       <p>Waiting for others to join the stream...</p>
//                     </div>
//                   )}
//                 </div>
//               )}




//               {/* Remote users - key includes forceUpdate to ensure re-render */}
//               {remoteUsers.map((user) => (
//                 <div key={`${user.uid}-${forceUpdate}`} style={{ textAlign: "center" }}>
//                   <RemoteUser
//                     user={user}
//                     style={{ width: 400, height: 300, borderRadius: 10, border: "2px solid #2196F3" }}
//                   />
//                   <p style={{ marginTop: 5 }}>
//                     {user.uid ? `User ${user.uid}` : "Remote User"}
//                     {user.hasAudio === false && user.hasVideo === false ? " (Host)" : " (Audience)"}
//                   </p>
//                 </div>
//               ))}

//               {remoteUsers.length === 0 && (
//                 <div style={{ textAlign: "center", padding: 20 }}>
//                   <p>Waiting for others to join the stream...</p>
//                 </div>
//               )}
//             </div>

//             {/* Controls - only show mic and camera controls for hosts */}
//             <div style={{ marginTop: 20 }}>
//               {isHost && (
//                 <>
//                   <button
//                     onClick={() => setMic((m) => !m)}
//                     style={{
//                       margin: "0 10px",
//                       padding: "8px 16px",
//                       backgroundColor: micOn ? "#4CAF50" : "#f44336",
//                       color: "white",
//                       border: "none",
//                       borderRadius: 4,
//                     }}
//                   >
//                     {micOn ? "Mic On" : "Mic Off"}
//                   </button>
//                   <button
//                     onClick={() => setCamera((c) => !c)}
//                     style={{
//                       margin: "0 10px",
//                       padding: "8px 16px",
//                       backgroundColor: cameraOn ? "#4CAF50" : "#f44336",
//                       color: "white",
//                       border: "none",
//                       borderRadius: 4,
//                     }}
//                   >
//                     {cameraOn ? "Camera On" : "Camera Off"}
//                   </button>
//                 </>
//               )}
//               <button
//                 onClick={() => setCalling(false)}
//                 style={{
//                   margin: "0 10px",
//                   padding: "8px 16px",
//                   backgroundColor: "#f44336",
//                   color: "white",
//                   border: "none",
//                   borderRadius: 4,
//                 }}
//               >
//                 Leave Channel
//               </button>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   )
// }

// export default InteractiveLiveStreaming


// // final code 

"use client"

import {
  LocalUser,
  RemoteUser,
  useIsConnected,
  useJoin,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  usePublish,
  useRemoteUsers,
  useCurrentUID,
} from "agora-rtc-react"
import { useEffect, useState } from "react"
import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react"

export const InteractiveLiveStreaming = () => {
  const [role, setRole] = useState("host") // Default to host
  // Create client with the selected role
  const client = AgoraRTC.createClient({ mode: "live", codec: "vp8" })

  // Set client role based on user selection
  useEffect(() => {
    if (client) {
      client.setClientRole(role)
    }
  }, [client, role])

  return (
    <AgoraRTCProvider client={client}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <h2>Interactive Live Streaming</h2>
        <div>
          <button
            onClick={() => setRole("host")}
            style={{
              backgroundColor: role === "host" ? "#4CAF50" : "#f0f0f0",
              color: role === "host" ? "white" : "black",
              padding: "8px 16px",
              margin: "0 10px",
              borderRadius: "4px",
              border: "none",
            }}
          >
            Join as Host
          </button>
          <button
            onClick={() => setRole("audience")}
            style={{
              backgroundColor: role === "audience" ? "#2196F3" : "#f0f0f0",
              color: role === "audience" ? "white" : "black",
              padding: "8px 16px",
              margin: "0 10px",
              borderRadius: "4px",
              border: "none",
            }}
          >
            Join as Audience
          </button>
        </div>
      </div>
      <Basics role={role} client={client} />
    </AgoraRTCProvider>
  )
}

const Basics = ({ role, client }) => {
  const [audienceList, setAudienceList] = useState([])
  const [calling, setCalling] = useState(false)
  const isConnected = useIsConnected()
  const currentUID = useCurrentUID()

  const [appId, setAppId] = useState("f23344f83d8e4ebfb27ed5354bca021b")
  const [channel, setChannel] = useState("liveclass")
  const [token, setToken] = useState(
    "007eJxTYFh4dE/ulosvvnlF730kLnzwxJteK87tCxyCWAWeXVGtW3hfgSHNyNjYxCTNwjjFItUkNSktycg8NcXU2NQkKTnRwMgwyeeNXEZDICPDlWWiDIxQCOJzMuRklqUm5yQWFzMwAAC5piOe",
  )
  const [uid, setUid] = useState("")

  const isHost = role === "host"
  const [micOn, setMic] = useState(isHost)
  const [cameraOn, setCamera] = useState(isHost)

  // Only create tracks for hosts
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(isHost && micOn)
  const { localCameraTrack } = useLocalCameraTrack(isHost && cameraOn)

  useJoin(
    {
      appid: appId,
      channel: channel,
      token: token ? token : null,
      uid: uid ? uid : undefined,
    },
    calling,
  )

  // Only hosts publish their tracks
  usePublish(isHost ? [localMicrophoneTrack, localCameraTrack] : [])

  // Get remote users and force component to update when remoteUsers changes
  const remoteUsers = useRemoteUsers()

  // Add event listeners to detect user join/leave events
  useEffect(() => {
    if (isConnected) {
      const handleUserJoined = (user) => {
        console.log("User joined:", user)

        // If user is not publishing audio or video (i.e., audience)
        if (!user.hasAudio && !user.hasVideo) {
          setAudienceList((prev) => {
            if (!prev.some((u) => u.uid === user.uid)) {
              return [...prev, user]
            }
            return prev
          })
        }

        setForceUpdate((prev) => prev + 1)
      }

      const handleUserLeft = (user) => {
        console.log("User left:", user)
        setAudienceList((prev) => prev.filter((u) => u.uid !== user.uid))
        setForceUpdate((prev) => prev + 1)
      }

      client.on("user-joined", handleUserJoined)
      client.on("user-left", handleUserLeft)

      return () => {
        client.off("user-joined", handleUserJoined)
        client.off("user-left", handleUserLeft)
      }
    }
  }, [isConnected, client])

  // State to force re-renders when users join/leave
  const [forceUpdate, setForceUpdate] = useState(0)
  console.log("Force update count:", forceUpdate)

  // Update audience list from remoteUsers
  useEffect(() => {
    if (isConnected && remoteUsers.length > 0) {
      // Filter for users that are audience (not publishing audio/video)
      const audienceUsers = remoteUsers.filter(user => !user.hasAudio && !user.hasVideo);

      // Update audience list with current remote users
      setAudienceList(audienceUsers);
    }
  }, [remoteUsers, isConnected]);

  useEffect(() => {
    // Reset camera and mic when role changes
    if (isHost) {
      setMic(true)
      setCamera(true)
    } else {
      setMic(false)
      setCamera(false)
    }
  }, [isHost])

  // Log remote users for debugging
  useEffect(() => {
    if (remoteUsers && remoteUsers.length > 0) {
      console.log(
        "Remote users updated:",
        remoteUsers.map((user) => user.uid),
      )
    }
  }, [remoteUsers, forceUpdate])

  return (
    <div style={{ padding: 20 }}>
      {!isConnected ? (
        <div style={{ maxWidth: 400, margin: "0 auto", padding: 20, backgroundColor: "#f9f9f9", borderRadius: 10 }}>
          <h3>Join {isHost ? "as Host" : "as Audience"}</h3>
          <input
            onChange={(e) => setAppId(e.target.value)}
            placeholder="App ID"
            value={appId}
            style={{ display: "block", marginBottom: 10, width: "100%", padding: 8 }}
          />
          <input
            onChange={(e) => setChannel(e.target.value)}
            placeholder="Channel Name"
            value={channel}
            style={{ display: "block", marginBottom: 10, width: "100%", padding: 8 }}
          />
          <input
            onChange={(e) => setToken(e.target.value)}
            placeholder="Token"
            value={token}
            style={{ display: "block", marginBottom: 10, width: "100%", padding: 8 }}
          />
          <input
            onChange={(e) => setUid(e.target.value)}
            placeholder="UID (Optional)"
            value={uid}
            style={{ display: "block", marginBottom: 10, width: "100%", padding: 8 }}
          />
          <button
            disabled={!appId || !channel}
            onClick={() => setCalling(true)}
            style={{
              width: "100%",
              padding: 10,
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: 5,
              cursor: !appId || !channel ? "not-allowed" : "pointer",
            }}
          >
            Join Channel
          </button>
        </div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Audience Stats - Only show to host */}
            {isHost && (
              <div
                style={{
                  backgroundColor: "#e8f5e9",
                  padding: "10px 20px",
                  borderRadius: 8,
                  marginBottom: 20,
                  width: "100%",
                  maxWidth: 600,
                  textAlign: "center"
                }}
              >
                <h3 style={{ margin: "5px 0", color: "#2e7d32" }}>
                  Audience Stats
                </h3>
                <p style={{ fontSize: 16, marginBottom: 5 }}>
                  Current audience count: <strong>{audienceList.length}</strong>
                </p>
                {audienceList.length > 0 && (
                  <div>
                    <p style={{ marginBottom: 5, fontWeight: "bold" }}>Audience Members:</p>
                    <div style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      gap: 10
                    }}>
                      {audienceList.map(user => (
                        <span
                          key={user.uid}
                          style={{
                            backgroundColor: "#c8e6c9",
                            padding: "3px 10px",
                            borderRadius: 15,
                            fontSize: 14
                          }}
                        >
                          User {user.uid}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div
              style={{
                display: "flex",
                gap: 20,
                flexWrap: "wrap",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              {/* Only show local user preview for hosts */}
              {isHost && (
                <div style={{ textAlign: "center" }}>
                  {/* Host's Local Video */}
                  <LocalUser
                    audioTrack={localMicrophoneTrack}
                    cameraOn={cameraOn}
                    micOn={micOn}
                    playAudio={false}
                    videoTrack={localCameraTrack}
                    style={{
                      width: 400,
                      height: 300,
                      borderRadius: 10,
                      border: "2px solid #4CAF50",
                    }}
                  />
                  <p style={{ marginTop: 5 }}>You (Host)</p>
                </div>
              )}

              {/* Remote users - key includes forceUpdate to ensure re-render */}
              {remoteUsers.map((user) => (
                <div key={`${user.uid}-${forceUpdate}`} style={{ textAlign: "center" }}>
                  <RemoteUser
                    user={user}
                    style={{ width: 400, height: 300, borderRadius: 10, border: "2px solid #2196F3" }}
                  />
                  <p style={{ marginTop: 5 }}>
                    {user.uid ? `User ${user.uid}` : "Remote User"}
                    {user.hasAudio || user.hasVideo ? " (Host)" : " (Audience)"}
                  </p>
                </div>
              ))}

              {remoteUsers.length === 0 && (
                <div style={{ textAlign: "center", padding: 20 }}>
                  <p>Waiting for others to join the stream...</p>
                </div>
              )}
            </div>

            {/* Controls - only show mic and camera controls for hosts */}
            <div style={{ marginTop: 20 }}>
              {isHost && (
                <>
                  <button
                    onClick={() => setMic((m) => !m)}
                    style={{
                      margin: "0 10px",
                      padding: "8px 16px",
                      backgroundColor: micOn ? "#4CAF50" : "#f44336",
                      color: "white",
                      border: "none",
                      borderRadius: 4,
                    }}
                  >
                    {micOn ? "Mic On" : "Mic Off"}
                  </button>
                  <button
                    onClick={() => setCamera((c) => !c)}
                    style={{
                      margin: "0 10px",
                      padding: "8px 16px",
                      backgroundColor: cameraOn ? "#4CAF50" : "#f44336",
                      color: "white",
                      border: "none",
                      borderRadius: 4,
                    }}
                  >
                    {cameraOn ? "Camera On" : "Camera Off"}
                  </button>
                </>
              )}
              <button
                onClick={() => setCalling(false)}
                style={{
                  margin: "0 10px",
                  padding: "8px 16px",
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                }}
              >
                Leave Channel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default InteractiveLiveStreaming