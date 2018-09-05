// hex to number ...
// sha256???...
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

    
    // return String.fromCharCode.apply(null, new Uint8Array(buf));
    toHex(s) {
        // utf8 to latin1
        s = unescape(encodeURIComponent(s));
        let h = '';
        for (let i = 0; i < s.length; i++) {
            h += s.charCodeAt(i).toString(16);
        }
        return h;
    },
    fromHex(h) {
        var s = '';
        for (var i = 0; i < h.length; i+=2) {
            s += String.fromCharCode(parseInt(h.substr(i, 2), 16));
        }
        return decodeURIComponent(escape(s));
    }
};