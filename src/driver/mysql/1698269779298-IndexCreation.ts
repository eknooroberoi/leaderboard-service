import { MigrationInterface, QueryRunner } from 'typeorm';

// Note :- typeorm does not support setting up an index while specifying the sort order(DESC/ASC)
//         explicitly. Hence, need to manually implement using `MigrationInterface`
export default class IndexCreation1698269779298 implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE INDEX idx_game_score_updated_at ON leaderboard (game_id, score DESC, updated_at ASC)`
        );
    }

    async down(_: QueryRunner): Promise<void> {
        // Since we need the index for perpetuity, we don't need to implement `down` method
        return;
    }
}
