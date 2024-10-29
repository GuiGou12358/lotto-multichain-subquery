import {SubstrateProject} from "@subql/types";
import {WasmDatasource} from "@subql/substrate-wasm-processor";
import {handleNumbersDrawnInManager} from "./src";

// Can expand the Datasource processor types via the generic param
const projectShibuya: SubstrateProject<WasmDatasource> = {
    specVersion: "1.0.0",
    version: "1.0.0",
    name: "lotto-multichain-subql-shibuya",
    description:
        "This SubQuery project indexes data used by the Lotto dApp on Shibuya network",
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
            "0xddb89973361a170839f80f152d2e9e38a376a5a7eccefcade763f46a8e567019",
        /**
         * These endpoint(s) should be public non-pruned archive node
         * We recommend providing more than one endpoint for improved reliability, performance, and uptime
         * Public nodes may be rate limited, which can affect indexing speed
         * When developing your project we suggest getting a private API key
         * If you use a rate limited endpoint, adjust the --batch-size and --workers parameters
         * These settings can be found in your docker-compose.yaml, they will slow indexing but prevent your project being rate limited
         *
         *         endpoint: ["wss://rpc.shibuya.astar.network", "wss://shibuya-rpc.dwellir.com"],
         */
        endpoint: ["wss://rpc.shibuya.astar.network"],
        bypassBlocks: []
    },
    dataSources: [
        {
            kind: "substrate/Wasm",
            startBlock: 7717400,
            //endBlock: 1,
            processor: {
                file: "./node_modules/@subql/substrate-wasm-processor/dist/bundle.js",
                options: {
                    abi: "lotto-registration",
                    contract: "ZvzNqBdnQmg2nmDnPNF9dirosinGsX53hG1Exc5xqHzJHVX",
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
            startBlock: 7717400,
            //endBlock: 1,
            processor: {
                file: "./node_modules/@subql/substrate-wasm-processor/dist/bundle.js",
                options: {
                    abi: "lotto-registration-manager",
                    contract: "Wb418H1VdYF2fnfQgfhShiu8fK1nbEr9hVE2yHMo6r7p7aF",
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
export default projectShibuya;
