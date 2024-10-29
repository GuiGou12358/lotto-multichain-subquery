import {
    ConfigUpdatedLog,
    ParticipationRegisteredLog,
    RegistrationsOpenLog,
    ResultsReceivedLog,
    StartedLog
} from "../types/abi-interfaces/RaffleRegistration";

import {
    handleConfigUpdated,
    handleParticipationRegistered,
    handleRegistrationsClosed,
    handleRegistrationsOpen,
    handleResultsReceived,
    handleStarted
} from "./raffleRegistration";


// Handle the event ConfigUpdated(uint8 nbNumbers, uint minNumber, uint maxNumber)
export async function handleConfigUpdatedEVM(log: ConfigUpdatedLog): Promise<void> {

    await logger.info(`---------- Config updated at block ${log.blockNumber}`);

    if (!log.args) {
        await logger.error("No args for handleConfigUpdatedEVM !");
        return;
    }
    const nbNumbers = BigInt(log.args.nbNumbers);
    const minNumber = log.args.minNumber.toBigInt();
    const maxNumber = log.args.maxNumber.toBigInt();

    return handleConfigUpdated(nbNumbers, minNumber, maxNumber);
}

// Handle the event Started(uint indexed registrationContractId)
export async function handleStartedEVM(log: StartedLog): Promise<void> {

    await logger.info(" ---------------------------- handleStartedEVM --- ");

    if (!log.args) {
        await logger.error("No args for handleStartedEVM !");
        return;
    }
    const registrationContractId = log.args.registrationContractId.toBigInt();

    return handleStarted(registrationContractId);
}

// Handle the event RegistrationsOpen(uint indexed registrationContractId, uint indexed drawNumber)
export async function handleRegistrationsOpenEVM(log: RegistrationsOpenLog): Promise<void> {

    await logger.info(" ---------------------------- handleRegistrationsOpenEVM --- ");

    if (!log.args) {
        await logger.error("No args for handleRegistrationsOpenEVM !");
        return;
    }

    const registrationContractId = log.args.registrationContractId.toBigInt();
    const drawNumber = log.args.drawNumber.toBigInt();
    const openingOn = BigInt(log.blockNumber.valueOf());
    const openingHash = log.blockHash;

    return handleRegistrationsOpen(registrationContractId, drawNumber, openingOn, openingHash);
}

// Handle the event RegistrationsClosed(uint indexed registrationContractId, uint indexed drawNumber)
export async function handleRegistrationsClosedEVM(log: RegistrationsOpenLog): Promise<void> {

    await logger.info(" ---------------------------- handleRegistrationsClosedEVM --- ");


    if (!log.args) {
        await logger.error("No args for handleRegistrationsClosedEVM !");
        return;
    }

    const registrationContractId = log.args.registrationContractId.toBigInt();
    const drawNumber = log.args.drawNumber.toBigInt();
    const closedOn = BigInt(log.blockNumber.valueOf());
    const closingHash = log.blockHash;

    return handleRegistrationsClosed(registrationContractId, drawNumber, closedOn, closingHash);
}


// Handle the event ResultsReceived(uint indexed registrationContractId, uint indexed drawNumber, uint[] numbers, address[] winners)
export async function handleResultsReceivedEVM(log: ResultsReceivedLog): Promise<void> {

    await logger.info(" ---------------------------- handleResultsReceivedEVM --- ");

    if (!log.args) {
        await logger.error("No args for handleResultsReceivedEVM !");
        return;
    }

    const registrationContractId = log.args.registrationContractId.toBigInt();
    const drawNumber = log.args.drawNumber.toBigInt();
    const resultsReceivedOn = BigInt(log.blockNumber.valueOf());
    const resultsReceivedHash = log.blockHash;

    return handleResultsReceived(registrationContractId, drawNumber, resultsReceivedOn, resultsReceivedHash);

}


// Handle the event ParticipationRegistered(uint indexed registrationContractId, uint indexed drawNumber, address indexed participant, uint[] numbers)
export async function handleParticipationRegisteredEVM(log: ParticipationRegisteredLog): Promise<void> {

    await logger.info(" ---------------------------- handleParticipationRegisteredEVM --- ");

    if (!log.args) {
        await logger.error("No args for handleParticipantRegisteredEVM !");
        return;
    }

    const id = `${log.blockNumber.valueOf()}-${log.logIndex.valueOf()}`;
    const registrationContractId = log.args.registrationContractId.toBigInt();
    const drawNumber = log.args.drawNumber.toBigInt();
    const accountId = log.args.participant.toString();
    const numbers = log.args.numbers.map(value => value.toBigInt());

    return handleParticipationRegistered(id, registrationContractId, drawNumber, accountId, numbers);
}