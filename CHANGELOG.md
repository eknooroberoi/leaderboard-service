# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.6.9] - 2023-11-02

- Update README to add comparison of approaches + detailed info on each approach

## [0.6.8] - 2023-11-01

- Update consume message from kafka flow diagram image in readme

## [0.6.7] - 2023-11-01

- Implement shutdown hook for graceful shutdown of the service
- Add proper shutdown hook for Cache

## [0.6.6] - 2023-11-01

- Add proper error handling while consuming from Kafka

## [0.6.5] - 2023-11-01

- Replace console logs with required loggers
- Fix test cases

## [0.6.4] - 2023-10-31

- Remove GitHub Action for linting, testing and coverage report generation on PRs

## [0.6.3] - 2023-10-31

- Add GitHub Action for linting, testing and coverage report generation on PRs

## [0.6.2] - 2023-10-31

- Add linter + fix lint warnings

## [0.6.1] - 2023-10-31

- Update README to include instructions for local devEnv setup and testing

## [0.6.0] - 2023-10-31

- Added test cases and increased coverage to 91%
- Added prettier library
- Refactor code to enable proper mocking for testing

## [0.5.4] - 2023-10-29

- Better request validation for get top scores api

## [0.5.4] - 2023-10-29

- Swagger Setup

## [0.5.3] - 2023-10-29

- Update images of approaches + add flow diagram

## [0.5.2] - 2023-10-29

- Setup GitHub action to run tests + generate coverage report on PRs

## [0.5.1] - 2023-10-29

- Add `jest` for testing + add dummy test
- Generate test coverage report

## [0.5.0] - 2023-10-29

- Implement caching with `Memcached`
- Implement logic for `consistentReads`

## [0.4.2] - 2023-10-28

- Move Queue interactions inside `QueueRepo`

## [0.4.1] - 2023-10-28

- Move DB interactions inside `DatabaseRepo`
- Initialise new `Persistable` interface to be used as base class for all data objects that need to persist to storage
- Initialise generic `Serializable` interface

## [0.4.0] - 2023-10-27

- Implement logic for fetching top scores from DB


## [0.3.2] - 2023-10-26

- Use Controller Interface
- Update to support upsert operation for `leaderboard` table

## [0.3.1] - 2023-10-25

- Updated .gitignore to ignore build files
- Added package-lock and tsconfig

## [0.3.0] - 2023-10-25

- Implement persistence to DB for scores data

## [0.2.0] - 2023-10-24

- Implemented Initial version of `leaderboard-service` returning a dummy response
- Implemented the overall structure of the service defining core classes and data objects
- Implemented Kafka consumer
- Added setup for local devEnv

## [0.1.1] - 2023-10-23

- Updated README
- Added ddl for leaderboard_service

## [0.1.0] - 2023-10-22

- Updated README
- Added Pull Request Template
- Added .gitignore