# Santex Back-end Challenge

## Introduction

The goal of this challenge is to build a simple API using Node and GraphQL that fetches data from a third-party API and returns it to the client.

## Requirements

- Depending on how you choose to run the project, you need to have either Docker or Node installed on your machine

- You need to have a free API key from [Football-Data.org](https://www.football-data.org/)

- If you choose to run the project using Node, you need to have a MongoDB instance running on your machine

- If you choose to run the application using Docker, on the root folder, inside the `docker-compose.yml` file, you need to set the `FOOTBALL_API_KEY` environment variable to your API key

- If you choose to run the application using Node, on the `backend` folder, create a `.env` file and set the following:

1. `FOOTBALL_API_KEY` to your API key
2. `MONGO_URL` to the URL of your MongoDB instance

## Running the project

There are two ways to run the project:

### Using Docker

- Run `docker-compose up` on the root folder of the project
- The API will be available on `http://localhost:4000/graphql`

### Using Node

- Navigate to the `backend` folder where the `package.json` file is located
- Run `yarn install` on the root folder of the project
- Run `yarn start` to start the server
- The API will be available on `http://localhost:4000/graphql`

## Testing the project

- Once the project is running, you can access the GraphQL Playground on `https://studio.apollographql.com/sandbox/explorer`
- Make sure that on the top left corner of the Playground, the endpoint is set to `http://localhost:4000/graphql`
- You can use postman to test the API

1. First you need to fetch a League. You can use the following mutation:

```graphql
mutation ImportLeageMutation($code: String!) {
  league: importLeague(leagueCode: $code) {
    areaName
    code
    id
    name
  }
}
```

- You can use the following variables with a free API key:

```json
{
  "code": "PL" | "PD" | "WC" | "CL" | "BL1" | "DED" | "BSA" | "FL1" | "ELC" | "PPL" | "EC" | "SA" | "CLI"
}
```

2. Once you have a League, you can fetch the players that belong to all the teams in that league. If no players are found, you will receive the coaches instead. You can also provide a team name (or part of it if you don't know the exact name) to fetch the players that belong to that team. (If the team has no players, you will receive the coaches instead)
   You can use the following query:

```graphql
query PlayersQuery($code: String!, $team: String) {
  players(leagueCode: $code, teamName: $team) {
    players {
      id
      name
      nationality
      dateOfBirth
      position
      teamName
    }
    coaches {
      id
      name
      nationality
      dateOfBirth
      teamName
    }
  }
}
```

You need to send the following variables:

```json
{
  "code": "PL" | "PD" | "WC" | "CL" | "BL1" | "DED" | "BSA" | "FL1" | "ELC" | "PPL" | "EC" | "SA" | "CLI",
  "team": "Manchester United"
}
```

3. You can also fetch a specific team by providing the team name (or part of it if you don't know the exact name). And optionally, by providing a flag you will be able to fetch the players that belong to that team. (If the team has no players, you will receive the coaches instead)
   You can use the following query:

```graphql
query TeamQueryInput($name: String!, $displayMembers: Boolean) {
  team(name: $name, displayMembers: $displayMembers) {
    team {
      id
      address
      areaName
      name
      shortName
    }
    players {
      id
      name
      nationality
      dateOfBirth
      position
      teamName
    }
    coaches {
      id
      name
      dateOfBirth
      nationality
      teamName
    }
  }
}
```

### Notes

Before making a query for a league or team, you need to make sure that the league is imported. You can do this by using the `importLeague` mutation. If you try to fetch a league or team for a league that is not imported, you will receive an error.

### Insigths

I carefully considered the requirements for this project and made informed decisions about the technologies and project structure. After weighing the options, I chose MongoDB as the database because of its flexibility and my expertise in using it. While GraphQL was new to me, I decided to invest time and effort in learning it, which I believe will broaden my skill set and align me better with the project's requirements.

To go beyond the challenge requirements, I created a folder structure that reflects a real-world application. This included separating the backend and frontend code into separate folders and providing the potential for future Docker configuration.
