import {Participation, Raffle, RaffleRegistration} from "../types";


export async function handleConfigUpdated(
  nbNumbers: bigint,
  minNumber: bigint,
  maxNumber: bigint
): Promise<void> {

    await logger.info(`Config updated: ${nbNumbers} numbers between ${minNumber} and ${maxNumber}`);

    // nothing save in db
}

export async function handleStarted(
  registrationContractId: bigint,
): Promise<void> {

    await logger.info(`Workflow starts for registration contract ${registrationContractId}`);

    // save the raffle registration
    await saveRaffleRegistration(registrationContractId, BigInt(0), "Started");
}

export async function handleRegistrationsOpen(
  registrationContractId: bigint,
  drawNumber: bigint,
  openOn: bigint,
  openingHash: string,
): Promise<void> {

    await logger.info(`Participation for raffle ${drawNumber} is opened for the registration contract ${registrationContractId}`);

    // save the raffle registration
    await saveRaffleRegistration(registrationContractId, drawNumber, "RegistrationsOpen");

    // save the raffle
    let raffle = await getOrCreateRaffle(registrationContractId, drawNumber);
    raffle.openOn = openOn;
    raffle.openingHash = openingHash;
    return raffle.save();
}


export async function handleRegistrationsClosed(
  registrationContractId: bigint,
  drawNumber: bigint,
  closedOn: bigint,
  closingHash: string,
): Promise<void> {

    await logger.info(`Raffle ${drawNumber} is closed for the registration contract ${registrationContractId}`);

    // save the raffle registration
    await saveRaffleRegistration(registrationContractId, drawNumber, "RegistrationsClosed");

    // save the raffle
    let raffle = await getOrCreateRaffle(registrationContractId, drawNumber);
    raffle.closedOn = closedOn;
    raffle.closingHash = closingHash;
    return raffle.save();
}

export async function handleResultsReceived(
  registrationContractId: bigint,
  drawNumber: bigint,
  resultsReceivedOn: bigint,
  resultsReceivedHash: string,
): Promise<void> {

    await logger.info(`Results received for raffle ${drawNumber} and registration contract ${registrationContractId}`);

    // save the raffle registration
    await saveRaffleRegistration(registrationContractId, drawNumber, "ResultsReceived");

    // save the raffle
    let raffle = await getOrCreateRaffle(registrationContractId, drawNumber);
    raffle.resultsReceivedOn = resultsReceivedOn;
    raffle.resultsReceivedHash = resultsReceivedHash;
    return raffle.save();
}

export async function handleParticipationRegistered(
  id: string,
  registrationContractId: bigint,
  drawNumber: bigint,
  accountId: string,
  numbers: bigint[]
): Promise<void> {

    await logger.info(`Participant ${accountId} picked the numbers ${numbers} for raffle ${drawNumber} via the registration contract ${registrationContractId}`);

    // save in db
    let participation = Participation.create({
        id: id,
        registrationContractId:  registrationContractId,
        drawNumber: drawNumber,
        accountId: accountId,
        numbers: numbers
    });
    return participation.save();
}


async function saveRaffleRegistration(
  registrationContractId: bigint,
  drawNumber: bigint,
  status: string,
): Promise<void> {

    // save the raffle registration
    let raffleRegistration = await RaffleRegistration.get(registrationContractId.toString());
    if (raffleRegistration) {
        raffleRegistration.currentDrawNumber = drawNumber;
        raffleRegistration.currentStatus = status;
    } else {
        await logger.info("No raffle Registration found!");
        raffleRegistration = RaffleRegistration.create({
            id: registrationContractId.toString(),
            currentDrawNumber: drawNumber,
            currentStatus: status,
        });
    }
    return raffleRegistration.save();
}


async function getOrCreateRaffle(
  registrationContractId: bigint,
  drawNumber: bigint,
): Promise<Raffle> {

    const id = `${registrationContractId.toString()}-${drawNumber.toString()}`;
    let raffle = await Raffle.get(id);
    if (!raffle) {
        raffle = Raffle.create({
            id: id,
            registrationContractId: registrationContractId,
            drawNumber: drawNumber,
        });
    }
    return raffle;
}
