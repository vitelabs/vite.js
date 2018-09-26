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
    },
    strToUtf8Bytes (str) {
        if (!str) {
            return null;
        }
        var back = [];
        // var byteSize = 0;
        for (var i = 0; i < str.length; i++) {
            var code = str.charCodeAt(i);
            if (0x00 <= code && code <= 0x7f) {
                // byteSize += 1;
                back.push(code);
            } else if (0x80 <= code && code <= 0x7ff) {
                // byteSize += 2;
                back.push((192 | (31 & (code >> 6))));
                back.push((128 | (63 & code)));
            } else if ((0x800 <= code && code <= 0xd7ff) 
                        || (0xe000 <= code && code <= 0xffff)) {
                // byteSize += 3;
                back.push((224 | (15 & (code >> 12))));
                back.push((128 | (63 & (code >> 6))));
                back.push((128 | (63 & code)));
            }
        }
        for (i = 0; i < back.length; i++) {
            back[i] &= 0xff;
        }
        return new Uint8Array(back);
    }
};