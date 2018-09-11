import Addr from './address.js';
import viteCoin from './viteCoin';

export default {
    newHexAddr: Addr.newHexAddr,
    isValidHexAddr: Addr.isValidHexAddr,
    viteToBasic: viteCoin.toBasic,
    viteToMin: viteCoin.toMin
};