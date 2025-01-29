import {
    EthereumProject,
    EthereumDatasourceKind,
    EthereumHandlerKind,
} from "@subql/types-ethereum";

// Can expand the Datasource processor types via the generic param
const projectSoneium: EthereumProject = {
    specVersion: "1.0.0",
    version: "1.0.0",
    name: "lotto-multichain-subql-soneium",
    description:
        "This SubQuery project indexes data used by the Lotto dApp on Soneium",
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
        chainId: '1868',
        endpoint: ["https://rpc.soneium.org"],
    },
    dataSources: [
        {
            kind: EthereumDatasourceKind.Runtime,
            startBlock: 2511760,
            options: {
                abi: "RaffleRegistration",
                address: "0xB2196C9B95BD3cdC799eb89f856895aEDbd649bB",
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
    ],
};

// Must set default to the project instance
export default projectSoneium;
