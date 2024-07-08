import { Contract, ZeroAddress, getAddress, isAddress, toBeHex } from 'ethers';
import { JsonRPCRequestDto } from '../../dtos/json-rpc-request.dto';
import { RpcService } from '../../services/rpc.service';
import { Helper } from '../../../../common/helper';
import { IS_PRODUCTION, MULTI_CALL_3_ADDRESS } from '../../../../common/common-types';
import { AppException } from '../../../../common/app-exception';
import {
    calcUserOpGasPrice,
    calcUserOpTotalGasLimit,
    isUserOpValid,
    parsePaymasterAndDataAndGetExpiredAt,
    splitOriginNonce,
} from '../utils';
import { FORBIDDEN_PAYMASTER, PAYMASTER_CHECK, getBundlerChainConfig } from '../../../../configs/bundler-common';
import EntryPointAbi from '../abis/entry-point-abi';
import { calcPreVerificationGas } from '@account-abstraction/sdk';
import l1GasPriceOracleAbi from '../abis/l1-gas-price-oracle-abi';
import { cloneDeep } from 'lodash';
import MultiCall3Abi from '../abis/multi-call-3-abi';
import { EVM_CHAIN_ID, L2_GAS_ORACLE, NEED_TO_ESTIMATE_GAS_BEFORE_SEND, SUPPORT_EIP_1559, SUPPORT_MULTCALL3 } from '../../../../common/chains';
import { UserOperationDocument } from '../../schemas/user-operation.schema';
import { UserOperationService } from '../../services/user-operation.service';
import { packUserOp, getUserOpHashV7 } from './packed-user-operation'

export async function sendUserOperation(rpcService: RpcService, chainId: number, body: JsonRPCRequestDto) {
    Helper.assertTrue(typeof body.params[0] === 'object', -32602, 'Invalid params: userop must be an object');
    const userOp = body.params[0];
    const entryPoint = getAddress(body.params[1]);
    Helper.assertTrue(isUserOpValid(userOp), -32602, 'Invalid userOp');

    const { userOperationDocument } = await beforeSendUserOperation(
        rpcService,
        chainId,
        userOp,
        entryPoint,
        body.isAuth,
        body.skipCheck,
    );

    const packedUserOp = packUserOp(userOp)
    const userOpHash = getUserOpHashV7(chainId, packedUserOp, entryPoint)

    return await createOrUpdateUserOperation(rpcService.userOperationService, chainId, packedUserOp, userOpHash, entryPoint, userOperationDocument);
}

export async function beforeSendUserOperation(
    rpcService: RpcService,
    chainId: number,
    userOp: any,
    entryPoint: string,
    isAuth: boolean,
    skipCheck: boolean,
) {
    const userOpSender = getAddress(userOp.sender);
    const { nonceKey, nonceValue } = splitOriginNonce(userOp.nonce);
    const userOpDoc = await rpcService.userOperationService.getUserOperationByAddressNonce(chainId, userOpSender, nonceKey, BigInt(nonceValue).toString());



    return {
        userOperationDocument: userOpDoc,
    };
}

async function createOrUpdateUserOperation(
    userOperationService: UserOperationService,
    chainId: number,
    userOp: any,
    userOpHash: string,
    entryPoint: string,
    userOperationDocument?: UserOperationDocument,
): Promise<string> {
    await userOperationService.createOrUpdateUserOperation(chainId, userOp, userOpHash, entryPoint, userOperationDocument);

    return userOpHash;
}
