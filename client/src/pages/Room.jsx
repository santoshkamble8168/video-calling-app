import React, {useEffect, useCallback, useState} from 'react'
import ReactPlayer from "react-player"

import peer from '../service/peer'
import { CALL_ACCEPTED, INCOMMING_CALL, USER_CALL, USER_JOINED } from '../constants/socketConstant'
import { useSocket } from '../context/SocketProvider'

const Room = () => {
  const socket = useSocket()

  const [remoteSocketId, setRemoteSocketId] = useState(null)
  const [myStream, setMyStream] = useState()

  const handleUserJoined = useCallback(({email, id}) => {
    console.log("email joined", email)
    setRemoteSocketId(id)
  }, [])

  const handleCall = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    })

    const offer = await peer.getOffer()
    socket.emit(USER_CALL, {
      to: remoteSocketId,
      offer
    })

    setMyStream(stream)

  }, [remoteSocketId, socket])

  const handleIncommingCall = useCallback( async ({from, offer}) => {
    setRemoteSocketId(from)
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    })
    setMyStream(stream)

    const answer = await peer.getAnswer(offer)
    socket.emit(CALL_ACCEPTED, {to: from, answer})
  }, [])

  const handleCallAccepted = useCallback(({from, answer}) => {
    peer.setLocalDescription(answer)
    console.log("call accepted")
  }, [])

  useEffect(() => {
    socket.on(USER_JOINED, handleUserJoined)
    socket.on(INCOMMING_CALL, handleIncommingCall)
    socket.on(CALL_ACCEPTED, handleCallAccepted)

    return () => {
      socket.off(USER_JOINED, handleUserJoined)
      socket.off(INCOMMING_CALL, handleIncommingCall)
      socket.on(CALL_ACCEPTED, handleCallAccepted)
    }
  }, [socket, handleUserJoined, handleIncommingCall, handleCallAccepted])

  return (
    <div>
      <h1>Room: </h1>
      <h4>{remoteSocketId ? "Connected" : "No one in the room"}</h4>
      {
        remoteSocketId && <button onClick={handleCall}>Call</button>
      }
      <div>
        {
          myStream && (
            <>
            <h2>Your stream</h2>
              <ReactPlayer playing muted width="500px" height="400px" url={myStream} />
            </>
          )
        }
      </div>
    </div>
  )
}

export default Room