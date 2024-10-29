import {RaffleManager, RaffleRegistration, Result, Winner} from "../types";
import {WasmEvent} from "@subql/substrate-wasm-processor";
import {AccountId} from "@polkadot/types/interfaces/runtime";
import type {UInt} from "@polkadot/types-codec";


type Config = [UInt, UInt, UInt] & {
    nb_numbers: UInt,
    min_number: UInt,
    max_number: UInt,
}

type LottoStartedEvent = [Config] & {
    config: Config,
}

export async function handleLottoStartedInManager(event: WasmEvent<LottoStartedEvent>): Promise<void> {

    if (!event.args) {
        await logger.error("No args for handleStartedInManager !");
        return;
    }
    const [[nbNumbers, minNumber, maxNumber]] = event.args;

    await logger.info(`Lotto started with the following config : ${nbNumbers} numbers between ${minNumber} and ${maxNumber}`);

    // save the raffle manager
    await saveRaffleManager(BigInt(0), "Started");
}


type RegistrationsOpenEvent = [UInt] & {
    draw_number: UInt,
}

export async function handleRegistrationsOpenInManager(event: WasmEvent<RegistrationsOpenEvent>): Promise<void> {

    if (!event.args) {
        await logger.error("No args for handleRegistrationsOpenInManager !");
        return;
    }
    const [drawNumber] = event.args;
    const openingOn = BigInt(event.blockNumber.valueOf());
    const openingHash = event.blockHash;

    await logger.info(`Participation for raffle ${drawNumber} is opened`);

    // save the raffle manager
    await saveRaffleManager(drawNumber.toBigInt(), "RegistrationsOpen");
}

type RegistrationClosedEvent = [UInt] & {
    draw_number: UInt,
}

export async function handleRegistrationsClosedInManager(event: WasmEvent<RegistrationClosedEvent>): Promise<void> {

    if (!event.args) {
        await logger.error("No args for handleRegistrationsClosedInManager !");
        return;
    }
    const [drawNumber] = event.args;
    const closingOn = BigInt(event.blockNumber.valueOf());
    const closingHash = event.blockHash;

    await logger.info(`Participation for raffle ${drawNumber} is closed`);

    // save the raffle manager
    await saveRaffleManager(drawNumber.toBigInt(), "RegistrationsClosed");
}


type NumbersDrawnEvent = [UInt, [UInt]] & {
    draw_number: UInt,
    numbers: [UInt],
}

export async function handleNumbersDrawnInManager(event: WasmEvent<NumbersDrawnEvent>): Promise<void> {

    if (!event.args) {
        await logger.warn("No Event");
        return;
    }

    const [drawNumber, numbers] = event.args;

    await logger.info(`Winning numbers for draw ${drawNumber} : ${numbers}`);

    // save the raffle manager
    await saveRaffleManager(drawNumber.toBigInt(), "NumbersDrawn");

    let result = Result.create({
        id: `${event.blockNumber.valueOf()}-${event.blockEventIdx.valueOf()}`,
        drawNumber: drawNumber.toBigInt(),
        numbers: numbers.map(value => value.toBigInt()),
    });
    return result.save();
}

type WinnersRevealedEvent = [UInt, [AccountId]] & {
    draw_number: UInt,
    winners: [AccountId],
}

export async function handleWinnersRevealedInManager(event: WasmEvent<WinnersRevealedEvent>): Promise<void> {

    if (!event.args) {
        await logger.warn("No Event");
        return;
    }

    const [drawNumber, winners] = event.args;

    await logger.info(`Winners for draw ${drawNumber} : ${winners}`);

    // save the raffle manager
    await saveRaffleManager(drawNumber.toBigInt(), "WinnersRevealed");

    for (let i=0; i<winners.length; i++){
        let result = Winner.create({
            id: `${event.blockNumber.valueOf()}-${event.blockEventIdx.valueOf()}`,
            drawNumber: drawNumber.toBigInt(),
            accountId: winners[i].toString(),
        });
        await result.save();
    }
}


type LottoClosedEvent = [] & {
}


export async function handleLottoClosedInManager(event: WasmEvent<LottoClosedEvent>): Promise<void> {

    await logger.info("Lotto Closed");

    const status = "Closed"

    // save the raffle manager
    let raffleManager = await RaffleManager.get(raffleManagerId);
    if (raffleManager) {
        raffleManager.currentStatus = status;
    } else {
        await logger.info("No raffle manager found!");
        raffleManager = RaffleManager.create({
            id: raffleManagerId,
            currentStatus: status,
        });
    }
    return raffleManager.save();

}

const raffleManagerId = "0";

async function saveRaffleManager(
  drawNumber: bigint,
  status: string,
): Promise<void> {

    let raffleManager = await RaffleManager.get(raffleManagerId);
    if (raffleManager) {
        raffleManager.currentDrawNumber = drawNumber;
        raffleManager.currentStatus = status;
    } else {
        await logger.info("No raffle manager found!");
        raffleManager = RaffleManager.create({
            id: raffleManagerId,
            currentDrawNumber: drawNumber,
            currentStatus: status,
        });
    }
    return raffleManager.save();
}
