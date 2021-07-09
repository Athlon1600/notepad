function sizeInBytes(str) {
    return new Blob([str]).size;
}

function humanFileSize(size) {
    var i = Math.floor(Math.log(size) / Math.log(1024));
    return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
}

export class TextUtil {

    static wordCount(text) {

        if (!text) {
            return 0;
        }

        return text.split(/\s+/).filter(function (word) {
            return !!word;
        }).length;
    }

    static lineCount(text) {

        if (!text) {
            return 0;
        }

        return text.split(/\r?\n/).length;
    }
}

