import * as filesystem from "fs";
import * as paths from "path";

export default class Attachments {

    public static move(subfolder: string, imageItem: { filename: string, serverPath: string }) {
        var directory = paths.join("media", subfolder);

        if (!filesystem.existsSync(directory))
            filesystem.mkdirSync(directory);
        
        filesystem.renameSync(paths.join(imageItem.serverPath), paths.join(directory, imageItem.filename));
    }
    
}