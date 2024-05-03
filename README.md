# SubQuery for the Lotto Dapp

**This SubQuery project indexes all events from the [Lotto dApp](https://github.com/LuckyDapp/lotto-contracts) **

## Start

First, install SubQuery CLI globally on your terminal by using NPM `npm install -g @subql/cli`

You can either clone this GitHub repo, or use the `subql` CLI to bootstrap a clean project in the network of your choosing by running `subql init` and following the prompts.

Don't forget to install dependencies with `npm install` or `yarn install`!

## Run your project

The simplest way to run your project is by running `yarn dev` or `npm run-script dev`. This does all of the following:

1.  `yarn codegen` - Generates types from the GraphQL schema definition and contract ABIs and saves them in the `/src/types` directory. This must be done after each change to the `schema.graphql` file or the contract ABIs
2.  `yarn build` - Builds and packages the SubQuery project into the `/dist` directory
3.  `docker-compose pull && docker-compose up` - Runs a Docker container with an indexer, PostgeSQL DB, and a query service. This requires [Docker to be installed](https://docs.docker.com/engine/install) and running locally. The configuration for this container is set from your `docker-compose.yml`

You can observe the three services start, and once all are running (it may take a few minutes on your first start), please open your browser and head to [http://localhost:3000](http://localhost:3000) - you should see a GraphQL playground showing with the schemas ready to query. [Read the docs for more information](https://academy.subquery.network/run_publish/run.html) or [explore the possible service configuration for running SubQuery](https://academy.subquery.network/run_publish/references.html).

## Query your project

For this project, you can use the following GraphQL code to query the data.

### Query all participations

```graphql
    query {
      participations {
        nodes { id, accountId, numRaffle, numbers }
      }
    }
```

### Query a participation for a given raffle and given account

```graphql
    query GetParticipations($numRaffle: BigFloat, $accountId: String){      
      participations(filter: {and: [{numRaffle: {equalTo: $numRaffle}}, {accountId: {equalTo: $accountId}}]}){
        nodes{ accountId, numRaffle, numbers }
      }  
    }
```

### Query all results

```graphql
    query {      
      results(orderBy: NUM_RAFFLE_DESC){
        nodes{ numRaffle, numbers }
      }  
    }
```

### Query all winners

```graphql
    query{      
      winners(orderBy: NUM_RAFFLE_DESC){
        nodes{numRaffle, accountId}
      }
  }
```
