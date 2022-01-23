import { app, protocol } from "electron";
import * as Path from "path";

export default class StaticDataProtocol {
    private static readonly ProtocolName = "datadragon";

    public static registerStaticDataProtocol() {
        protocol.registerFileProtocol(StaticDataProtocol.ProtocolName, (request, callback) => {
            const url = request.url.replace(StaticDataProtocol.ProtocolName + '://getMediaFile/', '')
            try {
                console.log("getting file: ", url);
                return callback({path: Path.join(app.getPath('userData'), 'tiltTool', url)})
            }
            catch (error) {
                console.error(error)
                return callback("404")
            }
        });
    }

    public static initializeProtocolPriviliges() {
        protocol.registerSchemesAsPrivileged([{scheme: StaticDataProtocol.ProtocolName, privileges: {standard: true, secure: true, supportFetchAPI: true}}]);
    }
}