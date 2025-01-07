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
    version: "1.0.0",
    name: "lotto-multichain-subql-minato",
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
            startBlock: 6538480,
            options: {
                abi: "RaffleRegistration",
                address: "0x04d884675E5790721cb5F24D41D460E921C08f17",
            },
            assets: new Map([["RaffleRegistration", { file: "./abi/RaffleRegistration.json" }]]),
            mapping: {
                file: "./dist/index.js",
                handlers: [
                    {
                        handler: "handleConfigUpdatedEVM",
                        kind: EthereumHandlerKind.Event,
                        filter: {
                            topics: [
                                "ConfigUpdated(uint8 nbNumbers, uint minNumber, uint maxNumber)",
                            ],
                        },
                    },
                    {
                        handler: "handleStartedEVM",
                        kind: EthereumHandlerKind.Event,
                        filter: {
                            topics: [
                                "Started(uint indexed registrationContractId)",
                            ],
                        }
                    },
                    {
                        handler: "handleRegistrationsOpenEVM",
                        kind: EthereumHandlerKind.Event,
                        filter: {
                            topics: [
                                "RegistrationsOpen(uint indexed registrationContractId, uint indexed draw_number)",
                            ],
                        }
                    },
                    {
                        handler: "handleRegistrationsClosedEVM",
                        kind: EthereumHandlerKind.Event,
                        filter: {
                            topics: [
                                "RegistrationsClosed(uint indexed registrationContractId, uint indexed draw_number)",
                            ],
                        }
                    },
                    {
                        handler: "handleSaltGeneratedEVM",
                        kind: EthereumHandlerKind.Event,
                        filter: {
                            topics: [
                                "SaltGenerated(uint indexed registrationContractId, uint indexed draw_number)",
                            ],
                        }
                    },
                    {
                        handler: "handleResultsReceivedEVM",
                        kind: EthereumHandlerKind.Event,
                        filter: {
                            topics: [
                                "ResultsReceived(uint indexed registrationContractId, uint indexed draw_number, uint[] numbers, bool hasWinner)",
                            ],
                        }
                    },
                    {
                        handler: "handleParticipationRegisteredEVM",
                        kind: EthereumHandlerKind.Event,
                        filter: {
                            topics: [
                                "ParticipationRegistered(uint indexed registrationContractId, uint indexed draw_number, address indexed participant, uint[] numbers)",
                            ],
                        }
                    },
                ],
            },
        },
        {
            kind: EthereumDatasourceKind.Runtime,
            startBlock: 4364780,
            options: {
                abi: "RaffleRegistration",
                address: "0xA8AE9c3F7bc784Ccd1E6013c59A233600C6dE90A",
            },
            assets: new Map([["RaffleRegistration", { file: "./abi/RaffleRegistrationOld.json" }]]),
            mapping: {
                file: "./dist/index.js",
                handlers: [
                    {
                        handler: "handleParticipationRegisteredEVM",
                        kind: EthereumHandlerKind.Event,
                        filter: {
                            topics: [
                                "ParticipationRegistered(uint indexed registrationContractId, uint indexed draw_number, address indexed participant, uint[] numbers)",
                            ],
                        }
                    },
                ],
            },
        },
    ],
};

// Must set default to the project instance
export default projectMinato;
