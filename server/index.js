const {Server} = require("socket.io")


const io = new Server(8000, {
    cors: true
})

const emailSocketIdMap = new Map()
const socketIdEmailMap = new Map()

io.on("connection", socket => {
    console.log("socket connected", socket.id)

    socket.on("room:join", data => {
        const {email, room} = data

        emailSocketIdMap.set(email, socket.id)
        socketIdEmailMap.set(socket.id, email)

        io.to(room).emit("user:joined", {email, id: socket.id})
        socket.join(room)

        io.to(socket.id).emit("room:join", data)
    })

    socket.on("user:call", ({to, offer}) => {
        io.to(to).emit("incomming:call", {from: socket.id, offer})
    })

    socket.on("call:accepted",({to, answer}) =>{
        io.to(to).emit("call:accepted", { from: socket.id, answer })
    } )
})