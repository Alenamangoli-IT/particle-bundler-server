import { IS_DEVELOPMENT } from '../common/common-types';
import { cloneDeep } from 'lodash';
import * as Fs from 'fs';

export const PARTICLE_PAYMASTER_URL = 'https://paymaster.particle.network';

export const RPC_CONFIG: any = {};
export let MINIMUM_GAS_FEE: any = {};
export let BUNDLER_CONFIG: any = {};
export let CHAIN_BALANCE_RANGE: any = {};
export let CHAIN_SIGNER_MIN_BALANCE: any = {};

export async function initializeBundlerConfig() {
    let bc: any;
    const exists = Fs.existsSync(`${__dirname}/bundler-config-particle.js`);
    if (exists) {
        bc = await import('./bundler-config-particle' as any);
    } else {
        bc = await import('./bundler-config');
    }

    MINIMUM_GAS_FEE = bc.MINIMUM_GAS_FEE;
    BUNDLER_CONFIG = bc.BUNDLER_CONFIG;
    CHAIN_BALANCE_RANGE = bc.CHAIN_BALANCE_RANGE;
    CHAIN_SIGNER_MIN_BALANCE = bc.CHAIN_SIGNER_MIN_BALANCE;

    for (const item of bc.RPC_CONFIG) {
        RPC_CONFIG[String(item.chainId)] = item;
    }

    if (!IS_DEVELOPMENT) {
        delete RPC_CONFIG['1337'];
    }
}

export function getBundlerConfig(chainId: number) {
    const config = cloneDeep(BUNDLER_CONFIG.default);
    if (BUNDLER_CONFIG[chainId]) {
        Object.assign(config, BUNDLER_CONFIG[chainId]);
    }

    return config;
}

export enum AA_METHODS {
    SEND_USER_OPERATION = 'eth_sendUserOperation',
    GET_USER_OPERATION_BY_HASH = 'eth_getUserOperationByHash',
    ESTIMATE_USER_OPERATION_GAS = 'eth_estimateUserOperationGas',
    GET_USER_OPERATION_RECEIPT = 'eth_getUserOperationReceipt',
    SUPPORTED_ENTRYPOINTS = 'eth_supportedEntryPoints',
    DEBUG_BUNDLER_CLEAR_STATE = 'debug_bundler_clearState',
    DEBUG_BUNDLER_DUMP_MEMPOOL = 'debug_bundler_dumpMempool',
    DEBUG_BUNDLER_SEND_BUNDLE_NOW = 'debug_bundler_sendBundleNow',
    DEBUG_BUNDLER_SET_BUNDLING_MODE = 'debug_bundler_setBundlingMode',
}

export enum EVM_CHAIN_ID {
    ETHEREUM_MAINNET = 1,
    ETHEREUM_GOERLI_TESTNET = 5,
    ETHEREUM_SEPOLIA_TESTNET = 11155111,
    POLYGON_MAINNET = 137,
    POLYGON_TESTNET = 80001,
    BNB_MAINNET = 56,
    BNB_TESTNET = 97,
    OPBNB_MAINNET = 204,
    OPBNB_TESTNET = 5611,
    SCROLL_MAINNET = 534352,
    SCROLL_SEPOLIA = 534351,
    LINEA_MAINNET = 59144,
    LINEA_TESTNET = 59140,
    OPTIMISM_MAINNET = 10,
    OPTIMISM_TESTNET = 420,
    BASE_MAINNET = 8453,
    BASE_TESTNET = 84531,
    MANTA_MAINNET = 169,
    MANTA_TESTNET = 3441005,
    MANTLE_MAINNET = 5000,
    MANTLE_TESTNET = 5001,
    ARBITRUM_ONE_MAINNET = 42161,
    ARBITRUM_NOVA_TESTNET = 42170,
    ARBITRUM_GOERLI_TESTNET = 421613,
    AVALANCHE_MAINNET = 43114,
    AVALANCHE_TESTNET = 43113,
    GNOSIS_MAINNET = 100,
    GNOSIS_TESTNET = 10200,
    PGN_MAINNET = 424,
    PGN_TESTNET = 58008,
    VICTION_MAINNET = 88,
    VICTION_TESTNET = 89,
    MOONBEAM_MAINNET = 1284,
    MOONRIVER_MAINNET = 1285,
    MOONBASE_ALPHA_TESTNET = 1287,
    POLYGON_ZKEVM_MAINNET = 1101,
    POLYGON_ZKEVM_TESTNET = 1442,
    FANTOM_MAINNET = 250,
    FANTOM_TESTNET = 4002,
    // Only testnets
    COMBO_TESTNET = 91715,
    TAIKO_TESTNET = 167007,
    OKBC_TESTNET = 195,
    ASTAR_ZKEVM_TESTNET = 1261120,
    LUMOZ_ZKEVM_TESTNET = 12008,
    READON_TESTNET = 12015,
    ZETA_TESTNET = 7001,
}

export const SUPPORT_EIP_1559 = [
    EVM_CHAIN_ID.ETHEREUM_MAINNET,
    EVM_CHAIN_ID.ETHEREUM_GOERLI_TESTNET,
    EVM_CHAIN_ID.ETHEREUM_SEPOLIA_TESTNET,
    EVM_CHAIN_ID.OPTIMISM_MAINNET,
    EVM_CHAIN_ID.OPTIMISM_TESTNET,
    EVM_CHAIN_ID.AVALANCHE_MAINNET,
    EVM_CHAIN_ID.AVALANCHE_TESTNET,
    EVM_CHAIN_ID.POLYGON_MAINNET,
    EVM_CHAIN_ID.POLYGON_TESTNET,
    EVM_CHAIN_ID.ARBITRUM_ONE_MAINNET,
    EVM_CHAIN_ID.ARBITRUM_NOVA_TESTNET,
    EVM_CHAIN_ID.ARBITRUM_GOERLI_TESTNET,
    EVM_CHAIN_ID.LINEA_MAINNET,
    EVM_CHAIN_ID.LINEA_TESTNET,
    EVM_CHAIN_ID.OPBNB_MAINNET,
    EVM_CHAIN_ID.OPBNB_TESTNET,
    EVM_CHAIN_ID.TAIKO_TESTNET,
    EVM_CHAIN_ID.BASE_MAINNET,
    EVM_CHAIN_ID.BASE_TESTNET,
    EVM_CHAIN_ID.MANTA_MAINNET,
    EVM_CHAIN_ID.MANTA_TESTNET,
    EVM_CHAIN_ID.PGN_MAINNET,
    EVM_CHAIN_ID.PGN_TESTNET,
    EVM_CHAIN_ID.MOONBEAM_MAINNET,
    EVM_CHAIN_ID.MOONRIVER_MAINNET,
    EVM_CHAIN_ID.MOONBASE_ALPHA_TESTNET,
    EVM_CHAIN_ID.ZETA_TESTNET,
];

export const L2_GAS_ORACLE = {
    [EVM_CHAIN_ID.SCROLL_MAINNET]: '0x5300000000000000000000000000000000000002',
    [EVM_CHAIN_ID.SCROLL_SEPOLIA]: '0x5300000000000000000000000000000000000002',
    [EVM_CHAIN_ID.OPTIMISM_MAINNET]: '0x420000000000000000000000000000000000000F',
    [EVM_CHAIN_ID.OPTIMISM_TESTNET]: '0x420000000000000000000000000000000000000F',
    [EVM_CHAIN_ID.OPBNB_MAINNET]: '0x420000000000000000000000000000000000000F',
    [EVM_CHAIN_ID.OPBNB_TESTNET]: '0x420000000000000000000000000000000000000F',
    [EVM_CHAIN_ID.COMBO_TESTNET]: '0x420000000000000000000000000000000000000F',
    [EVM_CHAIN_ID.BASE_MAINNET]: '0x420000000000000000000000000000000000000F',
    [EVM_CHAIN_ID.BASE_TESTNET]: '0x420000000000000000000000000000000000000F',
    [EVM_CHAIN_ID.MANTLE_MAINNET]: '0x420000000000000000000000000000000000000F',
    [EVM_CHAIN_ID.MANTLE_TESTNET]: '0x420000000000000000000000000000000000000F',
    [EVM_CHAIN_ID.PGN_MAINNET]: '0x420000000000000000000000000000000000000F',
    [EVM_CHAIN_ID.PGN_TESTNET]: '0x420000000000000000000000000000000000000F',
    [EVM_CHAIN_ID.MANTA_MAINNET]: '0x420000000000000000000000000000000000000F',
    [EVM_CHAIN_ID.MANTA_TESTNET]: '0x420000000000000000000000000000000000000F',
};

export const USE_PROXY_CONTRACT_TO_ESTIMATE_GAS = [
    EVM_CHAIN_ID.ARBITRUM_ONE_MAINNET,
    EVM_CHAIN_ID.ARBITRUM_NOVA_TESTNET,
    EVM_CHAIN_ID.ARBITRUM_GOERLI_TESTNET,
];
