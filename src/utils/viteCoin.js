import BigNumber from 'bignumber.js';

const VITE_MIN_UNIT = new BigNumber('1000000000000000000');
const DP = 8;

module.exports = {
    getViteMinUnit() {
        return VITE_MIN_UNIT;
    },
    toBasic(num, decimalPlaces = DP, minUnit = VITE_MIN_UNIT) {
        num = new BigNumber(num);
        if (num.c == null) {
            return '';
        }
        try {
            return num.dividedBy(minUnit).decimalPlaces(decimalPlaces).toFormat();
        } catch(err) {
            return '';
        }
    },
    toMin(num, minUnit = VITE_MIN_UNIT) {
        num = new BigNumber(num);
        if (num.c == null) {
            return '';
        }
        try {
            return num.multipliedBy(minUnit).toFormat();
        } catch(err) {
            return '';
        }
    }
};