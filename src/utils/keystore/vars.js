export const additionData = Buffer.from('vite');
export const algorithm = 'aes-256-gcm';
export const scryptName = 'scrypt';
export const defaultScryptParams = {
    // LightScryptN is the N parameter of Scrypt encryption algorithm, using 4MB
    // memory and taking approximately 100ms CPU time on a modern processor.
    n: 4096,
    // LightScryptP is the P parameter of Scrypt encryption algorithm, using 4MB
    // memory and taking approximately 100ms CPU time on a modern processor.
    p: 6,
    r: 8,
    keyLen: 32
};
export const currentVersion = 3;
