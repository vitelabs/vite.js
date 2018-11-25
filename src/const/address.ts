export const defaultHash = [...new Array(64)].map(t=>'0').join('')
export const Pledge_Addr = 'vite_000000000000000000000000000000000000000309508ba646';
export const Vote_Addr = 'vite_000000000000000000000000000000000000000270a48cc491';
export const Register_Addr = 'vite_0000000000000000000000000000000000000001c9e9f25417';
export const ADDR_PRE = 'vite_';
export const ADDR_SIZE = 20;
export const ADDR_CHECK_SUM_SIZE = 5;
export const ADDR_LEN = ADDR_PRE.length + ADDR_SIZE*2 + ADDR_CHECK_SUM_SIZE*2;
