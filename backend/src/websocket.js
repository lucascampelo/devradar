const socketio = require('socket.io')

const parseStringAsArray = require('./utils/parseStringAsArray')
const calculateDistance = require('./utils/calculateDistance')

let io;
const connections = [];

exports.setupWebsocket = (server) => {
    io = socketio(server);

    io.on('connection', socket => {
        const { latitude, longitude, techs } = socket.handshake.query;

        connections.push({
            id: socket.id,
            coordinates: {
                latitude: Number(latitude),
                longitude: Number(longitude),
            },
            techs: parseStringAsArray(techs),
        })
    })
}

exports.findConnections = (coordinates, techs) => {
    return connections.filter(connection => {
        const haveTechs = connection.techs ? connection.techs.find(item => techs.includes(item)) : true

        return calculateDistance(coordinates, connection.coordinates) < 10
            && haveTechs
    })
}

exports.sendMessage = (to, message, data) => {
    to.forEach(connection => {
        io.to(connection.id).emit(message, data)
    })
}
