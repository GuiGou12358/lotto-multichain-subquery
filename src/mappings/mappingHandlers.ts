import {
    Participation, Raffle, Result, Winner, EndRaffle
} from "../types";
import {WasmEvent} from "@subql/substrate-wasm-processor";
import {AccountId} from "@polkadot/types/interfaces/runtime";
import type {UInt} from '@polkadot/types-codec';

import {
    ParticipantRegisteredLog, RaffleEndedLog
} from "../types/abi-interfaces/LottoClient";
import assert from "assert";


type RaffleStartedEvent = [UInt] & {
    num_raffle: UInt,
}

export async function handleRaffleStarted(event: WasmEvent<RaffleStartedEvent>): Promise<void> {

    await logger.info("---------- Raffle Started --------- ");

    if (!event.args) {
        await logger.warn("No Event");
        return;
    }

    const [num_raffle] = event.args;

    await logger.info("num_raffle : " + num_raffle );

    let raffle = Raffle.create({
        id: num_raffle.toString(),
        startedOn: BigInt(event.blockNumber),
        endedOn: undefined,
    });
    await raffle.save();
}


type RaffleEndedEvent = [UInt] & {
    num_raffle: UInt,
}

export async function handleRaffleEnded(event: WasmEvent<RaffleEndedEvent>): Promise<void> {

    await logger.info("---------- Raffle Ended --------- ");

    if (!event.args) {
        await logger.warn("No Event");
        return;
    }

    const [num_raffle] = event.args;

    await logger.info("num_raffle : " + num_raffle );

    let raffle = await Raffle.get(num_raffle.toString());
    if (!raffle){
        raffle = Raffle.create({
            id: num_raffle.toString(),
            startedOn: undefined,
            endedOn: BigInt(event.blockNumber),
        });
    } else {
        raffle.endedOn = BigInt(event.blockNumber);
    }
    await raffle.save();

}

export async function handleRaffleEndedShibuya(event: WasmEvent<RaffleEndedEvent>): Promise<void> {
    // shibuya and Astar are the master
    await handleRaffleEnded(event);
    // save the hash when the raffle is ended
    await handleRaffleEndedSubstrate(event, "Shibuya");
}

export async function handleRaffleEndedAstar(event: WasmEvent<RaffleEndedEvent>): Promise<void> {
    // shibuya and Astar are the master
    await handleRaffleEnded(event);
    // save the hash when the raffle is ended
    await handleRaffleEndedSubstrate(event, "Astar");
}

export async function handleRaffleEndedSubstrate(event: WasmEvent<RaffleEndedEvent>, chain: string): Promise<void> {

    await logger.info(`---------- Raffle Ended on ${chain} at block ${event.blockNumber}`);

    if (!event.args) {
        await logger.error("No args for RaffleEndedEvent !!!");
        return;
    }

    const [num_raffle] = event.args;

    await logger.info("num_raffle : " + num_raffle );
    await logger.info("chain : " + chain );

    let endRaffle = EndRaffle.create({
        id: `${event.blockNumber.valueOf()}-${event.blockEventIdx.valueOf()}`,
        num_raffle: num_raffle.toBigInt(),
        chain: chain,
        hash: event.blockHash,
    });
    await endRaffle.save();
}


type ParticipationRegisteredEvent = [UInt, AccountId, [UInt]] & {
    num_raffle: UInt,
    participant: AccountId,
    numbers: [UInt],
}


export async function handleParticipationRegisteredShibuya(event: WasmEvent<ParticipationRegisteredEvent>): Promise<void> {
    await handleParticipationSubstrate(event, "Shibuya");
}

export async function handleParticipationRegisteredAstar(event: WasmEvent<ParticipationRegisteredEvent>): Promise<void> {
    await handleParticipationSubstrate(event, "Astar");
}

export async function handleParticipationSubstrate(event: WasmEvent<ParticipationRegisteredEvent>, chain: string): Promise<void> {

    await logger.info(`---------- Participation Registered on ${chain} at block ${event.blockNumber}`);

    if (!event.args) {
        await logger.error("No args for handleParticipationRegistered !!!");
        return;
    }

    const [num_raffle, participant, numbers] = event.args;

    await logger.info("num_raffle : " + num_raffle );
    await logger.info("participant : " + participant );
    await logger.info("numbers : " + numbers );

    let participation = Participation.create({
        id: `${event.blockNumber.valueOf()}-${event.blockEventIdx.valueOf()}`,
        num_raffle: num_raffle.toBigInt(),
        accountId: participant.toString(),
        numbers: numbers.map(value => value.toBigInt()),
        chain: chain,
    });
    await participation.save();
}

export async function handleParticipationRegisteredMinato(log: ParticipantRegisteredLog): Promise<void> {
    return handleParticipationRegisteredEvm(log, "Minato");
}

export async function handleParticipationRegisteredSoneium(log: ParticipantRegisteredLog): Promise<void> {
    return handleParticipationRegisteredEvm(log, "Soneium");
}

export async function handleParticipationRegisteredEvm(log: ParticipantRegisteredLog, chain: string): Promise<void> {

    await logger.info(`---------- Participation Registered on ${chain} at block ${log.blockNumber}`);

    if (!log.args) {
        await logger.error("No args for handleParticipationRegistered !!!");
        return;
    }
    await logger.info(`RaffleId: ${log.args._raffleId}`);
    await logger.info(`AccountId: ${log.args._participant}`);
    await logger.info(`Numbers: ${log.args._numbers}`);

    let participation = Participation.create({
        id: `${log.blockNumber.valueOf()}-${log.logIndex.valueOf()}`,
        num_raffle: log.args._raffleId.toBigInt(),
        accountId: log.args._participant.toString(),
        numbers: log.args._numbers.map(value => value.toBigInt()),
        chain: chain,
    });
    await participation.save();

}


export async function handleRaffleEndedMinato(log: RaffleEndedLog): Promise<void> {
    return handleRaffleEndedEvm(log, "Minato");
}

export async function handleRaffleEndedSoneium(log: RaffleEndedLog): Promise<void> {
    return handleRaffleEndedEvm(log, "Soneium");
}

export async function handleRaffleEndedEvm(log: RaffleEndedLog, chain: string): Promise<void> {

    await logger.info(`---------- Raffle Ended on ${chain} at block ${log.blockNumber}`);

    if (!log.args) {
        await logger.error("No args for RaffleEndedEvent !!!");
        return;
    }

    await logger.info("num_raffle : " + log.args._raffleId );
    await logger.info("chain : " + chain );

    let endRaffle = EndRaffle.create({
        id: `${log.blockNumber.valueOf()}-${log.logIndex.valueOf()}`,
        num_raffle: log.args._raffleId.toBigInt(),
        chain: chain,
        hash: log.blockHash,
    });
    await endRaffle.save();
}


type ResultReceivedEvent = [UInt, [UInt]] & {
    num_raffle: UInt,
    numbers: [UInt],
}

export async function handleResultReceived(event: WasmEvent<ResultReceivedEvent>): Promise<void> {

    await logger.info("---------- Result Received --------- ");

    if (!event.args) {
        await logger.warn("No Event");
        return;
    }

    const [num_raffle, numbers] = event.args;

    await logger.info("num_raffle : " + num_raffle );
    await logger.info("numbers : " + numbers );

    let result = Result.create({
        id: `${event.blockNumber.valueOf()}-${event.blockEventIdx.valueOf()}`,
        num_raffle: num_raffle.toBigInt(),
        numbers: numbers.map(value => value.toBigInt()),
    });
    await result.save();
}


type WinnersRevealedEvent = [UInt, [AccountId]] & {
    num_raffle: UInt,
    winners: [AccountId],
}

export async function handleWinnersRevealed(event: WasmEvent<WinnersRevealedEvent>): Promise<void> {

    await logger.info("---------- Winners Revealed --------- ");

    if (!event.args) {
        await logger.warn("No Event");
        return;
    }

    const [num_raffle, winners] = event.args;

    await logger.info("num_raffle : " + num_raffle);
    await logger.info("winners : " + winners);

    for (let i=0; i<winners.length; i++){
        let result = Winner.create({
            id: `${event.blockNumber.valueOf()}-${event.blockEventIdx.valueOf()}`,
            num_raffle: num_raffle.toBigInt(),
            accountId: winners[i].toString(),
        });
        await result.save();
    }
}
