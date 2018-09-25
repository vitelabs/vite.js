export default {
    bytesToHex(arr) {
        let hexArr = Array.prototype.map.call(arr, function (bit) {
            return ('00' + bit.toString(16)).slice(-2);
        });
        return hexArr.join('');
    },
    hexToBytes(hex) {
        let typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
            return parseInt(h, 16);
        }));
        return typedArray;
    },
    getBytesSize(str) {
        let count = 0;
        for (let i = 0; i < str.length; i++){
            let c = str.charAt(i);
            let bytes = /^[\u0000-\u00ff]$/.test(c) ? 1 : 2;
            count += bytes;
        }
        return count;
    },
    strToHex(str) {
        var hex = '';
        for(let i=0; i<str.length; i++) {
            hex += ''+str.charCodeAt(i).toString(16);
        }
        return hex;
    },
    hexToStr (hex) {
        var string = '';
        for (let i = 0; i < hex.length; i += 2) {
            string += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        return string;
    }
};