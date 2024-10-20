import { Server } from "socket.io";
import { handleEditorChanges } from "../controller/socket-controller";

export function handleEdits(io: Server) {
    handleEditorChanges(io);
}