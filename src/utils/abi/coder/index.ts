import addressCoder from './address';
import gidCoder from './gid';
import tokenIdCoder from './tokenId';
import stringCoder from './string';
import bytesCoder from './bytes';
import intCoder from './int';
import boolCoder from './bool';

export const encode = {
    address: addressCoder.encode,
    gid: gidCoder.encode,
    tokenId: tokenIdCoder.encode,
    string: stringCoder.encode,
    bytes: bytesCoder.encode,
    int: intCoder.encode,
    bool: boolCoder.encode
}

export const decode = {
    address: addressCoder.decode,
    gid: gidCoder.decode,
    tokenId: tokenIdCoder.decode,
    string: stringCoder.decode,
    bytes: bytesCoder.decode,
    int: intCoder.decode,
    bool: boolCoder.decode
}