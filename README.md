# CS3219-AY22-23-Project-G44

This is a quick guide to starting the project.

PeepPrep is built by a team of students from the National University of Singapore (NUS), as part of CS3219 — Software Engineering Principles and Patterns.

## Prerequisites

- Node 19

## User Service

1. cd into `/user-service`.
2. Create a `.env` file under `/user-service`.
3. Create a Cloud DB URL using Mongo Atlas.
4. Enter the DB URL created as `DB_CLOUD_URI` in `.env` file.
5. Enter a jwt secret as `JWT_SECRET` in `.env` file.
6. Enter `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` from your Redis Cloud.
7. Install npm packages using `npm i`.
8. If you wish to start the service, run `npm start`.

## Matching Service

1. cd into `/matching-service`.
2. Create a `.env` file under `/matching-service`.
3. Create a Cloud DB URL using Mongo Atlas.
4. Enter the DB URL created as `DB_CLOUD_URI` in `.env` file.
5. Enter `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` from your Redis Cloud.
6. Install npm packages using `npm i`.
7. If you wish to start the service, run `npm start`.

## Question Service

1. cd into `/question-service`.
2. Create a `.env` file under `/matching-service`.
3. Create a Cloud DB URL using Mongo Atlas.
4. Enter the DB URL created as `DB_CLOUD_URI` in `.env` file.
5. Install npm packages using `npm i`.
6. If you wish to start the service, run `npm start`.

## Collaboration Service

1. cd into `/collaboration-service`.
2. Install npm packages using `npm i`.
3. If you wish to start the service, run `npm start`.

## Frontend

1. cd into `/frontend`.
2. Install npm packages using `npm i`.
3. Run Frontend using `npm start`.

## To start all services

1. at the root directory, install npm packages using `npm i`.
2. Run all services using `npm start`.
