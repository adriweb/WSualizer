/* WebSocket stuff */
const wsUri = "ws://localhost:8000";
let socket;
let doSend;

/* Objects/Data stuff */
const objects = {};

/* Action handlers */
const outputTbody = $("#output tbody");
$("#sendMsg").on("click",  () => { let what; if ((what = $("#textbox").val()).length) { socket.send(what); } });
$("#clearMsg").on("click", () => { $("#textbox").val(""); });
$("#clearLog").on("click", () => { outputTbody.empty(); });

/* Let's go */
$(function()
{
    function writeToScreen(message, type)
    {
        outputTbody.append(`<tr class="type-${type}"><td>${new Date().toISOString().replace(/[ZT]/g, ' ')}</td>
                                                     <td>${type}</td>
                                                     <td><pre>${message}</pre></td></tr>`);
    }

    function setStatus(msg, color)
    {
        $("#ws_status").html(`<span style="color: ${color};"><b>${msg}</b></span>`);
    }

    function onMessage(evt)
    {
        writeToScreen(evt.data, "RECEIVED");
    }

    doSend = function(msg)
    {
        writeToScreen(msg, "SENT");
        socket.send(msg);
    };

    $("#ws_server").text(wsUri);
    socket = new WebSocket(wsUri);
    socket.onopen    = (evt) => { setStatus('OK', 'green'); };
    socket.onerror   = (evt) => { setStatus('error', 'red'); };
    socket.onclose   = (evt) => { setStatus('closed', 'black'); };
    socket.onmessage = (msg) => { onMessage(msg); };
});
