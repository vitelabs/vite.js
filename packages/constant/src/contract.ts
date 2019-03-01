export const Vite_TokenId = 'tti_5649544520544f4b454e6e40';
export const Default_Hash = '0000000000000000000000000000000000000000000000000000000000000000'; // A total of 64 0

export const Snapshot_Gid = '00000000000000000001';
export const Delegate_Gid = "00000000000000000002";

export const Quota_Addr = 'vite_000000000000000000000000000000000000000309508ba646';
export const Vote_Addr = 'vite_000000000000000000000000000000000000000270a48cc491';
export const Register_Addr = 'vite_0000000000000000000000000000000000000001c9e9f25417';
export const Mintage_Addr = 'vite_00000000000000000000000000000000000000056ad6d26692'

// SBP
export const Register_Abi = {"type":"function","name":"Register", "inputs":[{"name":"gid","type":"gid"},{"name":"name","type":"string"},{"name":"nodeAddr","type":"address"}]};
export const UpdateRegistration_Abi = {"type":"function","name":"UpdateRegistration", "inputs":[{"name":"gid","type":"gid"},{"Name":"name","type":"string"},{"name":"nodeAddr","type":"address"}]};
export const CancelRegister_Abi = {"type":"function","name":"CancelRegister","inputs":[{"name":"gid","type":"gid"}, {"name":"name","type":"string"}]};
export const Reward_Abi = {"type":"function","name":"Reward","inputs":[{"name":"gid","type":"gid"},{"name":"name","type":"string"},{"name":"beneficialAddr","type":"address"}]};

// Vote
export const Vote_Abi = {"type":"function","name":"Vote", "inputs":[{"name":"gid","type":"gid"},{"name":"nodeName","type":"string"}]};
export const CancelVote_Abi = {"type":"function","name":"CancelVote","inputs":[{"name":"gid","type":"gid"}]};

// Pledge
export const Pledge_Abi = {"type":"function","name":"Pledge", "inputs":[{"name":"beneficial","type":"address"}]};
export const CancelPledge_Abi = {"type":"function","name":"CancelPledge","inputs":[{"name":"beneficial","type":"address"},{"name":"amount","type":"uint256"}]};

// Mintage
export const Mint_Abi = {"type":"function","name":"Mint","inputs":[{"name":"isReIssuable","type":"bool"},{"name":"tokenId","type":"tokenId"},{"name":"tokenName","type":"string"},{"name":"tokenSymbol","type":"string"},{"name":"totalSupply","type":"uint256"},{"name":"decimals","type":"uint8"},{"name":"maxSupply","type":"uint256"},{"name":"ownerBurnOnly","type":"bool"}]};
export const Issue_Abi = {"type":"function","name":"Issue","inputs":[{"name":"tokenId","type":"tokenId"},{"name":"amount","type":"uint256"},{"name":"beneficial","type":"address"}]};
export const Burn_Abi = {"type":"function","name":"Burn","inputs":[]};
export const TransferOwner_Abi = {"type":"function","name":"TransferOwner","inputs":[{"name":"tokenId","type":"tokenId"},{"name":"newOwner","type":"address"}]};
export const ChangeTokenType_Abi = {"type":"function","name":"ChangeTokenType","inputs":[{"name":"tokenId","type":"tokenId"}]};
