# CS3219-AY22-23-Project-G44

This is a quick guide to starting the project.

PeepPrep is built by a team of students from the National University of Singapore (NUS), as part of CS3219 — Software Engineering Principles and Patterns.

## Prerequisites

- Node v18.8.0 and above

## User Service

1. `cd` into `/user-service`.
2. Either:
    - Rename the `.env.local` to `.env`, or
    - Create a new `.env` with custom key-values. <br>
	(1) Create a database cluster using Mongo Atlas and enter the DB URL created as `DB_CLOUD_URI`. <br>
	(2) Enter a JWT secret as `JWT_SECRET`. <br>
	(3) Create a Redis Cloud cache and enter the `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`.
3. Install npm packages using `npm i`.
4. To start the service, run `npm start`.

## Matching Service

1. `cd` into `/matching-service`.
2. Either:
    - Rename the `.env.local` to `.env`, or
    - Create a new `.env` with custom key-values. <br>
	(1) Create a database cluster using Mongo Atlas and enter the DB URL created as `DB_CLOUD_URI`. <br>
	(2) Create a Redis Cloud cache and enter the `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`.
3. Install npm packages using `npm i`.
4. To start the service, run `npm start`.

## Question Service

1. `cd` into `/question-service`.
2. Either:
    - Rename the `.env.local` to `.env`, or
    - Create a new `.env` with custom key-values. <br>
	(1) Create a database cluster using Mongo Atlas and enter the DB URL created as `DB_CLOUD_URI`.
3. Install npm packages using `npm i`.
4. To start the service, run `npm start`.

## Collaboration Service

1. `cd` into `/collaboration-service`.
2. Install npm packages using `npm i`.
3. To start the service, run `npm start`.

## Frontend

1. `cd` into `/frontend`.
2. Install npm packages using `npm i`.
3. To start the frontend client, run `npm start`.

## To start all services
At the root directory,

1. Install npm packages for all services and frontend using `npm i`.
2. Start all services and frontend with `npm start`.
