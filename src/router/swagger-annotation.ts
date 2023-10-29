/**
 * @swagger
 * /leaderboard-service/v1/public/top-scores:
 *   get:
 *     summary: Get the top scores for a game.
 *     description: Retrieve the top scores for a specific game.
 *     parameters:
 *       - name: gameId
 *         in: query
 *         description: The ID of the game.
 *         required: true
 *         schema:
 *           type: string
 *       - name: limit
 *         in: query
 *         description: The maximum number of top scores to retrieve.
 *         required: true
 *         schema:
 *           type: integer
 *       - name: CONSISTENT-READ
 *         in: header
 *         description: Indicates whether to use consistent read (true/false).
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response with top scores.
 *         content:
 *           application/json:
 *             example:
 *               gameId: "6ba7b810-9dad-11d1-80b4-00c04fd430c8"
 *               gameName: "car-racing"
 *               topScorers:
 *                 - score: 200
 *                   userId: "14192"
 *                   userName: "user14192"
 *                 - score: 200
 *                   userId: "14195"
 *                   userName: "user14195"
 *                 - score: 120
 *                   userId: "14191"
 *                   userName: "user14191"
 *                 - score: 100
 *                   userId: "14193"
 *                   userName: "user14193"
 *                 - score: 100
 *                   userId: "14194"
 *                   userName: "user14194"
 *               lastUpdatedAt: 1698390071726
 *       4xx:
 *         description: Client error response.
 *         content:
 *           application/json:
 *             example:
 *               errorMsg: "errString"
 *       5xx:
 *         description: Server error response.
 *         content:
 *           application/json:
 *             example:
 *               errorMsg: "errString"
 */
