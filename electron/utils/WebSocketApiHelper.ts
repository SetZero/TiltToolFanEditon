import ApiDataHelper from "./ApiDataHelper";
import WebSocket, { EventEmitter } from "ws";


enum MessageTypes {
    Welcome = 0,
    Prefix = 1,
    Call = 2,
    CallResult = 3,
    CallError = 4,
    Subscribe = 5,
    Unsubscribe = 6,
    Publish = 7,
    Event = 8
}

export default class WebSocketApiHelper {
    private apiDataHelper: ApiDataHelper;

    public constructor(dataHelper: ApiDataHelper) {
        this.apiDataHelper = dataHelper;
    }

    private subscribeTo(ws: WebSocket, event: string) {
        ws.send('[' + MessageTypes.Subscribe + ', "' + event + '"]');
    }

    private parseMessage(data: string) {
        const regex = /\[(\d+),\s*"([A-Za-z]+)",\s*({.*})\]/;
        const match = regex.exec(data);
        if (match) {
            return {
                type: parseInt(match[1]),
                event: match[2],
                data: match[3]
            };
        }
    }

    private processData(ws: WebSocket, data: string) {
        const message = this.parseMessage(data);
        if (message) {
            switch (message.type) {
                case MessageTypes.Welcome:
                    console.log('Got welcome message from league client');
                    this.subscribeTo(ws, "OnJsonApiEvent");
                    break;
                case MessageTypes.Prefix:
                    break;
                case MessageTypes.Call:
                    break;
                case MessageTypes.CallResult:
                    break;
                case MessageTypes.CallError:
                    break;
                case MessageTypes.Subscribe:
                    break;
                case MessageTypes.Unsubscribe:
                    break;
                case MessageTypes.Publish:
                    break;
                case MessageTypes.Event:
                    try {
                        if(message.event === "OnJsonApiEvent") {
                            const event = JSON.parse(message.data);
                            this.processLeagueEvent(event);
                        }
                    } catch (e) {
                        console.log("Message could not be parsed: " + data);
                    }
                    break;
                default:
                    break;
            }
        }
    }

    private processLeagueEvent(event: any) {
        switch(event.eventType) {
            case "Update":
                console.log("ApiUpdateEvent: " + event.uri);
                break;
            case "Create":
                console.log("ApiCreateEvent: " /*+ event.data.payload*/);
                break;
            case "Delete":
                console.log("ApiDeleteEvent");
                break;
            default:
                console.log("Unknown event: " + event.eventType);
        }
    }

    public async start() {
        const ws = new WebSocket('wss://riot:' + this.apiDataHelper.apiData?.password + '@127.0.0.1:' + this.apiDataHelper.apiData?.port + '/', 'wamp', {
            rejectUnauthorized: false
        });
        ws.on('open', () => {
            console.log('Connected to ws');
            this.subscribeTo(ws, 'OnJsonApiEvent');
        });

        ws.on('message', (data: string) => {
            this.processData(ws, data);
        });
    }
}