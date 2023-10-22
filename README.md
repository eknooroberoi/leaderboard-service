# leaderboard-service

## Overview

Typescript microservice to act as a key component of our gaming platform. This service is responsible for tracking and displaying the all-time top scores achieved by players in our games. 

As players complete games, the game service publishes their scores to a designated topic. The Leaderboard Service provides an API to retrieve the top n scores and the names of the players who attained those scores.

### Table of contents:

- [Detailed Approach](#detailed-approach)
- [Alternate Approaches](#alternate-approaches)
  - [Redis Sorted Set](#alternate-approach-1-redis-sorted-set)
  - [DB Read Replica](#alternate-approach-2-db-read-replica)
  - [Pod Local Cache](#alternate-approach-3-pod-local-cache)
- [API Contracts](#api-contracts)
- [DB Schema](#db-schema)
- [Local Development](#local-development)
  - [Testing](#testing)
  - [PR Guidelines](#pr-guidelines)


## Detailed Approach

![Primary-High-level-design]( ./assets/image/primary_approach_memcache.png)

## Alternate Approaches

### Alternate Approach 1 (Redis Sorted Set)

![Alternate-Approach-Redis-Sorted-Set](./assets/image/alternate_approach_redis_sorted_set.png)

### Alternate Approach 2 (DB Read Replica)

![Alternate-Approach-DB-Read-Replica](./assets/image/alternate_approach_db_read_replica.png)

### Alternate Approach 3 (Pod Local Cache)

![Alternate-Approach-Pod-Local-Cache](./assets/image/alternate_approach_pod_local_cache.png)

## API Contracts

### leaderboard-service/v1/public/top-scores

#### Request
```shell
curl --location 'localhost:3000/leaderboard-service/v1/public/top-scores?gameId=<GAME_ID_HERE>8&limit=<LIMIT_HERE>' \
--header 'CONSISTENT-READ: false'
```
#### Response

_**Sample Response**_

Status Code :- 200 (OK)
```json
{
    "gameId": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    "topScorers": [
        {
            "userId": "14191",
            "score": 100

        },
        {
            "userId": "14613",
            "score": 100
        },
        {
            "userId": "49609",
            "score": 80
        },
        {
            "userId": "14847",
            "score": 30
        },
        {
            "userId": "13307",
            "score": 10
        }
    ],
    "lastUpdatedAt": 1697986710000
}
```

Status Code - 4xx/5xx

```json
{
  "errorMsg": "errString"
}
```

## DB Schema

![db-schema](./assets/image/db_schema.png)


### Data Definition
```sql
# Create Database for service
CREATE DATABASE leaderboard_service;
USE leaderboard_service;

# Create Tables
CREATE TABLE game (
    id VARCHAR(50) NOT NULL,
    name VARCHAR(255) DEFAULT 'game',
    PRIMARY KEY (id)
);
CREATE TABLE user (
    id VARCHAR(50) NOT NULL,
    name VARCHAR(255) DEFAULT 'gameUser',
    PRIMARY KEY (id)
);
CREATE TABLE leaderboard (
    user_id VARCHAR(50) NOT NULL,
    game_id VARCHAR(50) NOT NULL,
    score INT DEFAULT NULL,
    updated_at BIGINT DEFAULT NULL,
    PRIMARY KEY (game_id, user_id),
    
    -- Add a composite secondary index for querying top n scores within a game
    INDEX idx_game_score_updated_at (game_id, score DESC, updated_at ASC),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (game_id) REFERENCES game(id)
);
```

### Queries

Get Top **_n_**  scores for given _**gameId**_ 
```sql
SELECT user_id, score
FROM leaderboard
WHERE game_id = :gameId
ORDER BY score DESC, updated_at ASC
LIMIT :n;
```

## Local Development

1. Clone the repo and change directory to leaderboard-service
3. Run `npm ci` in terminal
4. Run `npx tsc` in terminal
5. javascript file is `build/src/index.js`
6. Compile Typescript with `leaderboard-service/tsconfig.json` config file before launch
7. This will start the Node.js server at `localhost:3000`

Swagger : http://localhost:3000/api-docs

### Testing
Clone the repo and change directory to leaderboard-service
Run `npm test`

### PR Guidelines
1. Create feature branch from main using template.
2. Create PR for main
3. In case of conflicts do <b> not </b> resolve on GitHub, but do following <br>
   a. `git branch -D main` <br>
   b. `git pull origin main` <br>
   c. `git checkout main` <br>
   d. `git merge feature_branch_name` <br>
   e. resolve conflicts <br>
   f. `git push origin main` <br>
4. Merge branch into main.