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
            startBlock: 10088284,

            options: {
                abi: "RaffleRegistration",
                address: "0xA50d6F87E90A28c5b594d262469c1B93c0C2f874",
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
            startBlock: 9514270,

            options: {
                abi: "RaffleRegistration",
                address: "0x991926D5ca21EF2938B5BAffbf4EC24fB55e205e",
            },
            assets: new Map([["RaffleRegistration", { file: "./abi/RaffleRegistrationOld.json" }]]),
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
                        handler: "handleResultsReceivedOldEVM",
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
