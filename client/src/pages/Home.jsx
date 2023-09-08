import React, { useCallback, useEffect, useState } from 'react'
import {useNavigate} from "react-router-dom"
import { SINGLE_ROOM } from '../constants/routes'
import { JOIN_ROOM } from '../constants/socketConstant'
import { useSocket } from '../context/SocketProvider'

const Home = () => {
    const socket = useSocket()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [room, setRoom] = useState("")

    const handleRoomJoin = useCallback((data) => {
        const { email, room } = data

        navigate(`${SINGLE_ROOM}/${room}`)
    }, [])

    const handleSubmit = useCallback((e) => {
        e.preventDefault()
        socket.emit(JOIN_ROOM, { email, room })
    }, [socket, email, room])


    useEffect(() => {
        socket.on(JOIN_ROOM, handleRoomJoin)

        return () => {
            socket.off(JOIN_ROOM, handleRoomJoin)
        }
    }, [socket, handleRoomJoin])

    return (
        <div>
            <h1>Room</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='email'>Email</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" name='email' id='email' placeholder='Enter your email' />
                </div>

                <div>
                    <label htmlFor='room'>Room Id</label>
                    <input value={room} onChange={(e) => setRoom(e.target.value)} type="text" name='room' id='room' />
                </div>
                <div>
                    <button type='submit'>Join</button>
                </div>
            </form>
        </div>
    )
}

export default Home