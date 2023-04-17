let hostname = window.location.hostname;
export default {
    ws: new WebSocket(`ws://${hostname}/ws`),
}
