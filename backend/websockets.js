const skytrac = require('./services/skytrac');
const socketEvent = {
    SUBSCRIBE: "subscribe",
    UNSUBSCRIBE: "unsubscribe",
    MESSAGE: "message",
    FLIGHTDATA: "flightData",
    CONNECTIONS_AMOUNT: "connectionsAmount",
    CONNECT: "connect",
    DISCONNECT: "disconnect"
};
const socketChannel = {
    FLIGHTDATA: "flightData",
};

const rxjs = require('rxjs');


class Manager {
    constructor(io) {
        this.io = io;
        this.data = null;
        this.onConnect = this.onConnect.bind(this);
        this.onSubscribe = this.subscribe.bind(this);
        this.onDisconnect = this.disconnect.bind(this);

        this.io.on(socketEvent.CONNECT, this.onConnect);
        this.available_rooms = ['flightData'];

        // this.observable = new rxjs.Observable(subscriber => {
        //     let self = this;
        //     setInterval(() => {
        //         if (!Object.keys(self.io.sockets.adapter.rooms).includes('flightData')) {
        //             subscriber.next(0);
        //         } else {
        //             let connectionsAmount = this.io.sockets.adapter.rooms['flightData'].length;
        //             subscriber.next(connectionsAmount);
        //         }
        //     }, 1000);
        // });
        // var self = this;
        // this.observable.subscribe({
        //     next(x) {
        //         self.sendToRoom('flightData', socketEvent.CONNECTIONS_AMOUNT_UPDATE, x);
        //     },
        //     error(err) { console.error('something wrong occurred: ' + err); },
        //     complete() { console.log('done'); }
        // });
        // let data = [];
    }

    onConnect(socket) {
        console.log('User connected: ' + socket.id);
        socket.emit(socketEvent.MESSAGE, "connected");
        socket.on(socketEvent.SUBSCRIBE, (channel) => this.subscribe(socket, channel));
        socket.on(socketEvent.UNSUBSCRIBE, (channel) => this.unsubscribe(socket, channel));
        socket.on(socketEvent.DISCONNECT, () => this.disconnect(socket));
    }

    disconnect(socket) {
        console.log('User disconnected: ' + socket.id);
        let connectionsAmount = 0;
        socket.emit(socketEvent.MESSAGE, "disconnected");
    }

    subscribe(socket, room) {
        // check if the room is defined
        if (this.available_rooms.includes(room)) {
            socket.join(room);
            // socket.emit(socketEvent.MESSAGE, `Subscribed to ${room}`);
            this.sendToRoom(room, socketEvent.MESSAGE, `Subscribed to ${room}`);
        }
    }

    unsubscribe(socket, room) {
        if (!this.io.sockets.adapter.rooms[room] || !this.io.sockets.adapter.rooms[room].length || !Object.keys(this.io.sockets.adapter.rooms[room].sockets).includes(socket.id)) return;
        this.sendToRoom(room, socketEvent.MESSAGE, `Unsubscribed to ${room}`);
        socket.leave(room);
        // socket.emit(socketEvent.MESSAGE, `Unsubscribed to ${room}`);
    }

    sendToRoom(room, eventType, data) {
        // Check if the room exists
        if (Object.keys(this.io.sockets.adapter.rooms).includes(room)) {
            console.log(`Sending ${eventType} to all observers of ${room}`);
            this.io.to(room).emit(eventType, data);
        } else {
            console.log(`No observers in the room to send data to`);
        }
    }

    pollData() {
        skytrac.getData().then(data => {
            console.log(data);
            this.data.push(data);
        })
    }

}

module.exports = { Manager: Manager };