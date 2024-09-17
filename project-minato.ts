import {
    EthereumProject,
    EthereumDatasourceKind,
    EthereumHandlerKind,
} from "@subql/types-ethereum";

/*
import * as dotenv from 'dotenv';
import path from 'path';

const mode = process.env.NODE_ENV || 'production';

// Load the appropriate .env file
const dotenvPath = path.resolve(__dirname, `.env${mode !== 'production' ? `.${mode}` : ''}`);
dotenv.config({ path: dotenvPath });

 */

// Can expand the Datasource processor types via the generic param
const projectMinato: EthereumProject = {
    specVersion: "1.0.0",
    version: "3.0.0",
    name: "lotto-subql-minato",
    description:
        "This SubQuery project indexes data used by the Lotto dApp on Minato",
    runner: {
        node: {
            name: "@subql/node-ethereum",
            version: ">=3.0.0",
        },
        query: {
            name: "@subql/query",
            version: "*",
        },
    },
    schema: {
        file: "./schema.graphql",
    },
    network: {
        chainId: '1946',
        endpoint: ["https://rpc.minato.soneium.org"],
    },
    dataSources: [
        {
            kind: EthereumDatasourceKind.Runtime,
            startBlock: 1562340,

            options: {
                // Must be a key of assets
                abi: "LottoClient",
                // This is the contract address for Wrapped ETH token https://basescan.org/address/0x4200000000000000000000000000000000000006
                address: "0x177b0b863b80Add7cC9824e9232a9a2dcbc7986a",
            },
            assets: new Map([["LottoClient", { file: "./abi_minato/LottoClient.json" }]]),
            mapping: {
                file: "./dist/index.js",
                handlers: [
                    {
                        kind: EthereumHandlerKind.Event,
                        handler: "handleParticipationRegisteredMinato",
                        filter: {
                            topics: [
                                "ParticipantRegistered(uint256 indexed _raffleId, address indexed _participant, uint256[] _numbers)",
                            ],
                        },
                    },
                ],
            },
        },
    ],
};

// Must set default to the project instance
export default projectMinato;
