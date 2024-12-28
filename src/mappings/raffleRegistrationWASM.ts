import {WasmEvent} from "@subql/substrate-wasm-processor";
import {AccountId} from "@polkadot/types/interfaces/runtime";
import type {UInt} from "@polkadot/types-codec";

import {
    handleConfigUpdated,
    handleParticipationRegistered,
    handleRegistrationsClosed,
    handleRegistrationsOpen,
    handleResultsReceived, handleSaltGenerated,
    handleStarted
} from "./raffleRegistration";

type Config = [UInt, UInt, UInt] & {
    nb_numbers: UInt,
    min_number: UInt,
    max_number: UInt,
}

type ConfigUpdatedEvent = [Config] & {
    config: Config,
}

export async function handleConfigUpdatedWASM(event: WasmEvent<ConfigUpdatedEvent>): Promise<void> {

    await logger.info(" ---------------------------- handleConfigUpdatedWASM ------- ");

    if (!event.args) {
        await logger.error("No args for handleConfigUpdatedWASM !");
        return;
    }
    const [[nbNumbers, minNumber, maxNumber]] = event.args;
/*
    return handleConfigUpdated(
      nbNumbers.toBigInt(),
      minNumber.toBigInt(),
      maxNumber.toBigInt()
    );

 */
}


type StartedEvent = [UInt, UInt] & {
    registration_contract_id: UInt,
}

export async function handleStartedWASM(event: WasmEvent<StartedEvent>): Promise<void> {

    await logger.info(" ---------------------------- handleStartedWASM --- ");

    if (!event.args) {
        await logger.error("No args for handleStartedWASM !");
        return;
    }
    const [registrationContractId] = event.args;

    return handleStarted(
      registrationContractId.toBigInt(),
    );
}

type RegistrationsOpenEvent = [UInt, UInt] & {
    registration_contract_id: UInt,
    draw_number: UInt,
}

export async function handleRegistrationsOpenWASM(event: WasmEvent<RegistrationsOpenEvent>): Promise<void> {

    await logger.info(" ---------------------------- handleRegistrationsOpenWASM --- ");

    if (!event.args) {
        await logger.error("No args for handleRegistrationsOpenWASM !");
        return;
    }
    const [registrationContractId, drawNumber] = event.args;
    const openingOn = BigInt(event.blockNumber.valueOf());
    const openingHash = event.blockHash;

    return handleRegistrationsOpen(
      registrationContractId.toBigInt(),
      drawNumber.toBigInt(),
      openingOn,
      openingHash
    );
}

type RegistrationsClosedEvent = [UInt, UInt] & {
    registration_contract_id: UInt,
    draw_number: UInt,
}

export async function handleRegistrationsClosedWASM(event: WasmEvent<RegistrationsClosedEvent>): Promise<void> {

    await logger.info(" ---------------------------- handleRegistrationsClosedWASM --- ");

    if (!event.args) {
        await logger.error("No args for handleRegistrationsClosedWASM !");
        return;
    }
    const [registrationContractId, drawNumber] = event.args;
    const closingOn = BigInt(event.blockNumber.valueOf());
    const closingHash = event.blockHash;

    return handleRegistrationsClosed(
      registrationContractId.toBigInt(),
      drawNumber.toBigInt(),
      closingOn,
      closingHash
    );
}

type SaltGeneratedEvent = [UInt, UInt] & {
    registration_contract_id: UInt,
    draw_number: UInt,
}

export async function handleSaltGeneratedWASM(event: WasmEvent<SaltGeneratedEvent>): Promise<void> {

    await logger.info(" ---------------------------- handleSaltGeneratedWASM --- ");

    if (!event.args) {
        await logger.error("No args for handleSaltGeneratedWASM !");
        return;
    }
    const [registrationContractId, drawNumber] = event.args;
    const generatedOn = BigInt(event.blockNumber.valueOf());
    const hash = event.blockHash;

    return handleSaltGenerated(
      registrationContractId.toBigInt(),
      drawNumber.toBigInt(),
      hash,
      generatedOn,
      hash
    );
}

type ResultsReceivedOld = [UInt, UInt, [UInt], [string]] & {
    registration_contract_id: UInt,
    draw_number: UInt,
    numbers: [UInt],
    winners: [string],
}

export async function handleResultsReceivedOldWASM(event: WasmEvent<ResultsReceivedOld>): Promise<void> {

    await logger.info(" ---------------------------- handleResultsReceivedOldWASM --- ");

    if (!event.args) {
        await logger.error("No args for handleResultsReceivedOldWASM !");
        return;
    }
    const [registrationContractId, drawNumber, numbers, winners] = event.args;
    const resultsReceivedOn = BigInt(event.blockNumber.valueOf());
    const resultsReceivedHash = event.blockHash;

    return handleResultsReceived(
      registrationContractId.toBigInt(),
      drawNumber.toBigInt(),
      resultsReceivedOn,
      resultsReceivedHash
    );
}

type ResultsReceived = [UInt, UInt, [UInt], boolean] & {
    registration_contract_id: UInt,
    draw_number: UInt,
    numbers: [UInt],
    has_winner: boolean,
}

export async function handleResultsReceivedWASM(event: WasmEvent<ResultsReceived>): Promise<void> {

    await logger.info(" ---------------------------- handleResultsReceivedWASM --- ");

    if (!event.args) {
        await logger.error("No args for handleResultsReceivedWASM !");
        return;
    }
    const [registrationContractId, drawNumber, numbers, hasWinner] = event.args;
    const resultsReceivedOn = BigInt(event.blockNumber.valueOf());
    const resultsReceivedHash = event.blockHash;

    return handleResultsReceived(
      registrationContractId.toBigInt(),
      drawNumber.toBigInt(),
      resultsReceivedOn,
      resultsReceivedHash
    );
}


type ParticipationRegisteredEvent = [UInt, UInt, AccountId, [UInt]] & {
    registration_contract_id: UInt,
    draw_number: UInt,
    participant: AccountId,
    numbers: [UInt],
}

export async function handleParticipationRegisteredWASM(event: WasmEvent<ParticipationRegisteredEvent>): Promise<void> {

    await logger.info(" ---------------------------- handleParticipationRegisteredWASM --- ");

    if (!event.args) {
        await logger.error("No args for handleParticipationRegisteredWASM !");
        return;
    }
    const id = `${event.blockNumber.valueOf()}-${event.blockEventIdx.valueOf()}`;
    const [registrationContractId, drawNumber, participant, numbers] = event.args;
    const timestamp = event.timestamp;

    return handleParticipationRegistered(
      id,
      registrationContractId.toBigInt(),
      drawNumber.toBigInt(),
      participant.toString(),
      numbers.map(value => value.toBigInt()),
      timestamp
    );
}