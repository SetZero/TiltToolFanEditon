import { app, protocol } from "electron";
import * as Path from "path";

export default class StaticDataProtocol {
    public static registerStaticDataProtocol() {
        protocol.registerFileProtocol('datadragon', (request, callback) => {
            const url = request.url.replace('datadragon://getMediaFile/', '')
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
}