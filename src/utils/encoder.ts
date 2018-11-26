const blake = require('blakejs/blake2b');
declare enum Charset{
    utf16="utf16",
    utf8="utf8"
}

export default {
    bytesToHex(arr:Buffer=Buffer.from([])) {//？？？？
        let hexArr = Array.prototype.map.call(arr, function (bit:Number) {
            return ('00' + bit.toString(16)).slice(-2);
        });
        return hexArr.join('');
    },
    hexToBytes(hex:String) {
        let typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
            return parseInt(h, 16);
        }));
        return typedArray;
    },
    getBytesSize(str:String, charset:Charset=Charset.utf8){
        var total = 0, code, i, len;

        if (charset === Charset.utf16){
            for (i = 0, len = str.length; i < len; i++) {
                code = str.charCodeAt(i);
                total += code <= 0xffff ? 2 : 4;
            }
            return total;
        }

        for (i = 0, len = str.length; i < len; i++) {
            code = str.charCodeAt(i);
            if (0x00 <= code && code <= 0x7f) {
                total += 1;
            } else if (0x80 <= code && code <= 0x7ff) {
                total += 2;
            } else if ((0x800 <= code && code <= 0xd7ff) || (0xe000 <= code && code <= 0xffff)) {
                total += 3;
            } else {
                total += 4;
            }
        }
        return total;
    },
    utf8ToBytes (str = '') {
        const back = [];
        for (var i = 0; i < str.length; i++) {
            var code = str.charCodeAt(i);
            if (0x00 <= code && code <= 0x7f) {
                back.push(code);
            } else if (0x80 <= code && code <= 0x7ff) {
                back.push((192 | (31 & (code >> 6))));
                back.push((128 | (63 & code)));
            } else if ((0x800 <= code && code <= 0xd7ff) 
                        || (0xe000 <= code && code <= 0xffff)) {
                back.push((224 | (15 & (code >> 12))));
                back.push((128 | (63 & (code >> 6))));
                back.push((128 | (63 & code)));
            }
        }
    
        for (i = 0; i < back.length; i++) {
            back[i] &= 0xff;
        }
    
        return new Uint8Array(back);
    },
    blake2b: blake.blake2b,
        strToUtf8Bytes (str:string) {
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
