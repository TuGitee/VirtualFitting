let hostname = window.location.hostname;
export default {
    // ws: new WebSocket(`ws://${hostname}:8000/ws`),
    ws: new WebSocket("ws://127.0.0.1:8000/ws"),
}