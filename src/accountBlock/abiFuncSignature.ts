import { encodeFunctionSignature } from '~@vite/vitejs-abi';
import {
    Register_Abi, UpdateRegistration_Abi, CancelRegister_Abi, Reward_Abi, Vote_Abi,
    CancelVote_Abi, Pledge_Abi, CancelPledge_Abi, Mint_Abi, Issue_Abi, Burn_Abi,
    TransferOwner_Abi, ChangeTokenType_Abi, CancelMintPledge_Abi, DexFundUserDeposit_Abi,
    DexFundUserWithdraw_Abi, DexFundNewOrder_Abi, DexTradeCancelOrder_Abi, DexFundNewMarket_Abi
} from '~@vite/vitejs-constant';

export const abiFuncSignature = {
    Register: encodeFunctionSignature(Register_Abi),
    UpdateRegistration: encodeFunctionSignature(UpdateRegistration_Abi),
    CancelRegister: encodeFunctionSignature(CancelRegister_Abi),
    Reward: encodeFunctionSignature(Reward_Abi),
    Vote: encodeFunctionSignature(Vote_Abi),
    CancelVote: encodeFunctionSignature(CancelVote_Abi),
    Pledge: encodeFunctionSignature(Pledge_Abi),
    CancelPledge: encodeFunctionSignature(CancelPledge_Abi),
    Mint: encodeFunctionSignature(Mint_Abi),
    Issue: encodeFunctionSignature(Issue_Abi),
    Burn: encodeFunctionSignature(Burn_Abi),
    TransferOwner: encodeFunctionSignature(TransferOwner_Abi),
    ChangeTokenType: encodeFunctionSignature(ChangeTokenType_Abi),
    CancelMintPledge: encodeFunctionSignature(CancelMintPledge_Abi),
    DexFundUserDeposit: encodeFunctionSignature(DexFundUserDeposit_Abi),
    DexFundUserWithdraw: encodeFunctionSignature(DexFundUserWithdraw_Abi),
    DexFundNewOrder: encodeFunctionSignature(DexFundNewOrder_Abi),
    DexTradeCancelOrder: encodeFunctionSignature(DexTradeCancelOrder_Abi),
    DexFundNewMarket: encodeFunctionSignature(DexFundNewMarket_Abi)
};
