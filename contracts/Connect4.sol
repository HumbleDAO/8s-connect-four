pragma solidity ^0.8.17;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Connect4 is Ownable {
    enum GameStatus {
        Created,
        InProgress,
        Complete
    }

    enum GameResult {
        Undefined,
        CreatorWon,
        CreatorLost,
        Draw
    }

    struct GameRoom {
        address creator;
        GameStatus gameStatus;
        GameResult gameResult;
        uint256 wagerAmount;
    }

    mapping(address => uint256) public userPoints;

    GameRoom[] private gameRooms;

    event GameCreated();

    function createGame(uint256 wagerAmount) external {
        emit GameCreated();
    }

    function joinGame(uint256 gameId) external {}

    function settleGame(
        uint256 gameId,
        GameResult gameResult,
        uint8[] calldata movesHistory
    ) external onlyOwner {}
}
