/* WebSocket stuff */
const wsUri = "ws://localhost:8000";
let socket;
let doSend;

const display = $("#display");

/* Objects/Data stuff */
const objects = {};

/* Action handlers */
const outputTbody = $("#output tbody");
$("#sendMsg").on("click",  () => { let what; if ((what = $("#textbox").val()).length) { socket.send(what); } });
$("#clearMsg").on("click", () => { $("#textbox").val(""); });
$("#clearLog").on("click", () => { outputTbody.empty(); });

function getStatusClassFromStatus(status)
{
    switch (status)
    {
        case "":
            return "";
        default:
            return 'default';
    }
}

function addToDisplay(data)
{
    let target = (data.parent && data.parent.length) ? display.find(`#${data.parent} .exec-children`) : display;
    const statusClass = getStatusClassFromStatus(data.status);
    const statusDetails = data.statusDetails ? (` (${data.statusDetails})`) : "";
    const template = $(`<div class="exec-wrapper" id="${data.uuid}">
                            <div class="panel exec-panel panel-${statusClass}">
                                <div class="panel-heading"><b>${data.protocol}</b> | <tt>${data.uuid}</tt></div>
                                <div class="panel-body">
                                    <b>Request: ${data.reqname}</b><br>
                                    <b>${data.reqargs}</b><br>
                                    <b>Try #${data.tryNum}</b>
                                </div>
                                <div class="panel-footer">${data.status}${statusDetails}</div>
                            </div>
                            <div class="exec-children" style="display: none;"></div>
                        </div>`);
    target.show();
    if ($("#"+data.uuid).length) {
        // replace
    } else {
        // create
        target.append(template);
    }
}

/* Let's go */
$(function()
{
    function writeToLog(message, type)
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

        console.log("onMessage", evt);
        writeToLog(evt.data, "RECEIVED");
    }

    doSend = function(msg)
    {
        writeToLog(msg, "SENT");
        socket.send(msg);
    };

    $("#ws_server").text(wsUri);
    socket = new WebSocket(wsUri, 'echo');
    socket.onopen    = (evt) => { setStatus('OK', 'green'); };
    socket.onerror   = (evt) => { setStatus('error', 'red'); };
    socket.onclose   = (evt) => { setStatus('closed', 'black'); };
    socket.onmessage = (msg) => { onMessage(msg); };
});
