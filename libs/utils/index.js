// hex to number ...
// sha256???...
export default {
    // new Uint8Array(buffer)
    uint8ArrayToHexStr (arr) {
        let hexArr = Array.prototype.map.call(arr, function (bit) {
            return ('00' + bit.toString(16)).slice(-2);
        });
        return hexArr.join('');
    },
    hexToArrayBuffer(hex) {
        let typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
            return parseInt(h, 16);
        }));
        return typedArray;
    },
    getStrBytesCount(str) {
        let count = 0;
        for (let i = 0; i < str.length; i++){
            let c = str.charAt(i);
            let bytes = /^[\u0000-\u00ff]$/.test(c) ? 1 : 2;
            count += bytes;
        }
        return count;
    },
    strToArrayBuffer(str) {
        let buf = new ArrayBuffer(str.length * 2);
        let bufView = new Uint16Array(buf);
        for (var i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return bufView;
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