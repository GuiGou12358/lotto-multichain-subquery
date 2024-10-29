import {EthereumDatasourceKind, EthereumHandlerKind, EthereumProject,} from "@subql/types-ethereum";

// Can expand the Datasource processor types via the generic param
const projectMoonbase: EthereumProject = {
    specVersion: "1.0.0",
    version: "1.0.0",
    name: "lotto-multichain-subql-moonbase",
    description:
        "This SubQuery project indexes data used by the Lotto dApp on Moonbase",
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
        chainId: '1287',
        endpoint: ["https://rpc.api.moonbase.moonbeam.network"],
    },
    dataSources: [
        {
            kind: EthereumDatasourceKind.Runtime,
            startBlock: 9239800,

            options: {
                abi: "RaffleRegistration",
                address: "0x29621E6F2b7DBf256Ff0028dc04986C5E14Db50c",
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
                        handler: "handleResultsReceivedEVM",
                        kind: EthereumHandlerKind.Event,
                        filter: {
                            topics: [
                                "ResultsReceived(uint indexed registrationContractId, uint indexed draw_number, uint[] numbers, address[] winners)",
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
    ],
};

// Must set default to the project instance
export default projectMoonbase;
