import {SubstrateProject} from "@subql/types";
import {WasmDatasource} from "@subql/substrate-wasm-processor";

// Can expand the Datasource processor types via the generic param
const projectAstar: SubstrateProject<WasmDatasource> = {
    specVersion: "1.0.0",
    version: "1.0.0",
    name: "lotto-multichain-subql-astar",
    description:
        "This SubQuery project indexes data used by the Lotto dApp on Astar network",
    runner: {
        node: {
            name: "@subql/node",
            version: ">=3.0.1",
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
        chainId:
            "0x9eb76c5184c4ab8679d2d5d819fdf90b9c001403e9e17da2e14b6d8aec4029c6",
        endpoint: ["wss://rpc.astar.network", "wss://astar-rpc.dwellir.com"],
        bypassBlocks: []
    },
    dataSources: [
        {
            kind: "substrate/Wasm",
            startBlock: 7990150,
            //endBlock: 1,
            processor: {
                file: "./node_modules/@subql/substrate-wasm-processor/dist/bundle.js",
                options: {
                    abi: "lotto-registration",
                    contract: "YYRwKYXyfyyf4cVBPCQCtccqtxpM6eyFzYh5sLuiWBWKQNA",
                },
            },
            assets: new Map([["lotto-registration", {file: "./metadata/lotto_registration_contract.json"}]]),
            mapping: {
                file: "./dist/index.js",
                handlers: [
                    {
                        handler: "handleConfigUpdatedWASM",
                        kind: "substrate/WasmEvent",
                        filter: {
                            identifier: "ConfigUpdated"
                        }
                    },
                    {
                        handler: "handleStartedWASM",
                        kind: "substrate/WasmEvent",
                        filter: {
                            identifier: "Started"
                        }
                    },
                    {
                        handler: "handleRegistrationsOpenWASM",
                        kind: "substrate/WasmEvent",
                        filter: {
                            identifier: "RegistrationsOpen"
                        }
                    },
                    {
                        handler: "handleRegistrationsClosedWASM",
                        kind: "substrate/WasmEvent",
                        filter: {
                            identifier: "RegistrationsClosed"
                        }
                    },
                    {
                        handler: "handleSaltGeneratedWASM",
                        kind: "substrate/WasmEvent",
                        filter: {
                            identifier: "SaltGenerated"
                        }
                    },
                    {
                        handler: "handleResultsReceivedWASM",
                        kind: "substrate/WasmEvent",
                        filter: {
                            identifier: "ResultsReceived"
                        }
                    },
                    {
                        handler: "handleParticipationRegisteredWASM",
                        kind: "substrate/WasmEvent",
                        filter: {
                            identifier: "ParticipationRegistered"
                        }
                    },
                ],
            },
        },
        {
            kind: "substrate/Wasm",
            startBlock: 7990150,
            //endBlock: 1,
            processor: {
                file: "./node_modules/@subql/substrate-wasm-processor/dist/bundle.js",
                options: {
                    abi: "lotto-registration-manager",
                    contract: "XMrm9AqcEtj8GssWV1Zb4MKituXbJkoS8zX3kVdTkj4h1VX",
                },
            },
            assets: new Map([["lotto-registration-manager", {file: "./metadata/lotto_registration_manager_contract.json"}]]),
            mapping: {
                file: "./dist/index.js",
                handlers: [
                    {
                        handler: "handleLottoStartedInManager",
                        kind: "substrate/WasmEvent",
                        filter: {
                            identifier: "LottoStarted"
                        }
                    },
                    {
                        handler: "handleRegistrationsOpenInManager",
                        kind: "substrate/WasmEvent",
                        filter: {
                            identifier: "RegistrationsOpen"
                        }
                    },
                    {
                        handler: "handleRegistrationsClosedInManager",
                        kind: "substrate/WasmEvent",
                        filter: {
                            identifier: "RegistrationsClosed"
                        }
                    },
                    {
                        handler: "handleNumbersDrawnInManager",
                        kind: "substrate/WasmEvent",
                        filter: {
                            identifier: "NumbersDrawn"
                        }
                    },
                    {
                        handler: "handleWinnersRevealedInManager",
                        kind: "substrate/WasmEvent",
                        filter: {
                            identifier: "WinnersRevealed"
                        }
                    },
                    {
                        handler: "handleLottoClosedInManager",
                        kind: "substrate/WasmEvent",
                        filter: {
                            identifier: "LottoClosed"
                        }
                    },
                ],
            },
        },
    ],
};

// Must set default to the project instance
export default projectAstar;
