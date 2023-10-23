-- Create Database for service
CREATE DATABASE leaderboard_service;
USE leaderboard_service;

-- Create Tables
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