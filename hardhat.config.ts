require('dotenv').config();

import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-ganache';
import '@nomiclabs/hardhat-etherscan';
import '@openzeppelin/hardhat-upgrades';

import 'hardhat-typechain';
import 'solidity-coverage';
import 'hardhat-deploy';
import 'hardhat-tracer';
import 'hardhat-log-remover';

import 'hardhat-gas-reporter';

import { task } from 'hardhat/config';
import { HardhatUserConfig } from 'hardhat/types';

import { privateKeys, kovanPrivateKeys } from './utils/wallet';

import { etherscanKey } from './utils/keys';

function getHardhatPrivateKeys() {
    return privateKeys.map((key) => {
        const ONE_MILLION_ETH = '1000000000000000000000000';
        return {
            privateKey: key,
            balance: ONE_MILLION_ETH,
        };
    });
}

task('accounts', 'Prints the list of accounts', async (args, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(await account.address);
    }
});

const config: HardhatUserConfig = {
    defaultNetwork: 'hardhat',
    networks: {
        hardhat: {
            // hardfork: "istanbul",
            forking: {
                url: 'https://polygon-mainnet.g.alchemy.com/v2/wTqp4kHjjE9rF3nwAJQTVYiyMt2IkzMq',
                blockNumber: 21384641,
            },
            blockGasLimit: 12500000,
            gasPrice: 'auto',
            accounts: getHardhatPrivateKeys(),
            live: true,
            saveDeployments: process.env.SAVE_DEPLOYMENT && process.env.SAVE_DEPLOYMENT.toLowerCase() === 'true' ? true : false,
            loggingEnabled: process.env.LOGGING && process.env.LOGGING.toLowerCase() === 'true' ? true : false,
            tags: ['hardhat'],
        },
        matic_mumbai: {
            chainId: 80001,
            // url: 'https://polygon-mumbai.infura.io/v3/' + INFURA_TOKEN,
            url: `${process.env.MATIC_RPC}`,
            accounts: [`${process.env.MATIC_MUMAI_PRIVATE_KEY}`, `${process.env.MATIC_MUMAI_PRIVATE_KEY_2}`],
            saveDeployments: process.env.SAVE_DEPLOYMENT && process.env.SAVE_DEPLOYMENT.toLowerCase() === 'true' ? true : false,
            loggingEnabled: process.env.LOGGING && process.env.LOGGING.toLowerCase() === 'true' ? true : false,
            tags: ['matic_mumbai'],
            gasPrice: 1000000000,
        },
    },
    typechain: {
        outDir: 'typechain',
        target: 'ethers-v5',
    },
    solidity: {
        version: '0.7.0',
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    mocha: {
        timeout: 20000000,
    },
    etherscan: {
        apiKey: etherscanKey,
    },
    gasReporter: {
        gasPrice: 30,
        enabled: true,
        currency: 'USD',
        coinmarketcap: 'c40041ca-81fa-4564-8f95-175e388534c1',
        outputFile: 'gasReport.md',
        noColors: true,
    },
};

export default config;
