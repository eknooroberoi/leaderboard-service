import { Request, Response } from 'express';
import { ILeaderboardService } from '../../../src/services';
import GetTopScoresControllerPublic from '../../../src/controllers/public/getTopScoresControllerPublic';
import { TopScorerDTO, TopScoresDTO } from '../../../src/models';

// Create mock objects for Request and Response
const mockRequest: Partial<Request> = {
    get: jest.fn(),
};
const mockResponse: Response = {
    status: jest.fn(() => mockResponse),
    send: jest.fn(),
} as any;

// Create a mock leaderboardService
const mockLeaderboardService: ILeaderboardService = {
    getTopScores: jest.fn(),
    shutdown: jest.fn(),
};

describe('GetTopScoresControllerPublic', () => {
    let controller: GetTopScoresControllerPublic;

    beforeEach(() => {
        controller = new GetTopScoresControllerPublic(mockLeaderboardService);
    });

    it('should return 400 for invalid query parameters', async () => {
        mockRequest.query = { gameId: 'gameId' }; // Missing 'limit' parameter

        await controller.handleRequest(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.send).toHaveBeenCalledWith({
            errMsg: 'Invalid query parameters',
        });
    });

    it('should return 404 when no entry is found', async () => {
        mockRequest.query = { gameId: 'gameId', limit: '10' };
        mockLeaderboardService.getTopScores = jest.fn().mockResolvedValue(null);

        await controller.handleRequest(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.send).toHaveBeenCalledWith({
            errMsg: 'No entry found for game: gameId',
        });
    });

    it('should return top scores when a valid request is made', async () => {
        mockRequest.query = { gameId: 'gameId', limit: '2' };
        const topScores = new TopScoresDTO(
            'game1',
            'Game 1',
            [
                new TopScorerDTO('Id1', 'Player 1', 100),
                new TopScorerDTO('Id2', 'Player 2', 95),
            ],
            1631234567
        );
        mockLeaderboardService.getTopScores = jest
            .fn()
            .mockResolvedValue(topScores);

        await controller.handleRequest(
            mockRequest as Request,
            mockResponse as Response
        );

        // Ensure the response structure is correct
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.send).toHaveBeenCalledWith(topScores.toJSON());
    });

    it('should handle errors and return 500 status', async () => {
        mockRequest.query = { gameId: 'gameId', limit: '10' };
        mockLeaderboardService.getTopScores = jest
            .fn()
            .mockRejectedValue(new Error('Some error'));

        await controller.handleRequest(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.send).toHaveBeenCalledWith({
            errMsg: 'Internal Server Error',
        });
    });
});
