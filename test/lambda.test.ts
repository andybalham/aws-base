import { handle } from '../src/lambda';
import { expect } from 'chai';

describe('Test lambda', () => {

    it('handles something', async () => {

        const event = 'Hello Lambda!';

        const result = await handle(event);

        expect(result).to.equal(event);
    });
});