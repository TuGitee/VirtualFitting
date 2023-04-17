let hostname = window.location.hostname;
export default {
    ws: new WebSocket(`wss://${hostname}/ws`),
}
