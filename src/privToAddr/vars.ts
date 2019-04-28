export const ADDR_PRE = 'vite_';
export const ADDR_SIZE = 20;
export const ADDR_CHECK_SUM_SIZE = 5;
export const ADDR_LEN = ADDR_PRE.length + ADDR_SIZE * 2 + ADDR_CHECK_SUM_SIZE * 2;
export enum ADDR_TYPE {
    'Illegal' = 0,
    'Account',
    'Contract'
}
