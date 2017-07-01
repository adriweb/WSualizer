const wsUri = "ws://localhost:8000";
let socket;

$(function() {
    const output = document.getElementById("output");

    function setStatus(msg, color)
    {
        $("#ws_status").html(`<span style="color: ${color};"><b>${msg}</b></span>`);
    }

    function testWebSocket()
    {
        socket = new WebSocket(wsUri);
        $("#ws_server").text(wsUri);

        socket.onopen    = (evt) => { setStatus('OK', 'green'); doSend("WebSocket rocks"); };
        socket.onerror   = (evt) => { setStatus('error', 'red'); };
        socket.onmessage = (evt) => { onMessage(evt); };
    }

    function onMessage(evt)
    {
        writeToScreen(`<span style="color: blue;">RESPONSE: ${evt.data}</span>`);
    }

    function doSend(message)
    {
        writeToScreen("SENT: " + message);
        socket.send(message);
    }

    function writeToScreen(message)
    {
        const pre = document.createElement("p");
        pre.style.wordWrap = "break-word";
        pre.innerHTML = message;
        output.appendChild(pre);
    }

    testWebSocket();
});
