import { AbiCoder, keccak256 } from "ethers";
import { packUint } from "../utils";


export function packUserOp(op: any): any {
    return {
        sender: op.sender,
        nonce: op.nonce,
        initCode: op.initCode,
        callData: op.callData,
        accountGasLimits: packUint(op.verificationGasLimit, op.callGasLimit),
        preVerificationGas: op.preVerificationGas,
        gasFees: packUint(op.maxPriorityFeePerGas, op.maxFeePerGas),
        paymasterAndData: op.paymasterAndData,
        signature: op.signature
    }
}

export function getUserOpHashV7(chainId: number, packedUserOp: any, entryPoint: string) {
    const abiCoder = new AbiCoder();

    const userOpHash = keccak256(encodePackedUserOp(packedUserOp));
    const enc = abiCoder.encode(['bytes32', 'address', 'uint256'], [userOpHash, entryPoint, chainId]);
    return keccak256(enc);
}

function encodePackedUserOp(userOp: any): string {
    const abiCoder = new AbiCoder();
    return abiCoder.encode(
        ['address', 'uint256', 'bytes32', 'bytes32', 'bytes32', 'uint256', 'bytes32', 'bytes32'],
        [
            userOp.sender,
            userOp.nonce,
            keccak256(userOp.initCode),
            keccak256(userOp.callData),
            userOp.accountGasLimits,
            userOp.preVerificationGas,
            userOp.gasFees,
            keccak256(userOp.paymasterAndData),
        ],
    );
}