import { Server, Socket } from "socket.io";
import { handleDeregisterForMatching, handleDisconnect, handleRegisterForMatching } from "../controller/socket-controller";

export function registerEventHandlers(socket: Socket, io: Server) {
    handleRegisterForMatching(socket, io);
    handleDeregisterForMatching(socket);
    handleDisconnect(socket);
}

