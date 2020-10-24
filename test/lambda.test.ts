import * as BasicFunction from '../src/functions/basicFunction';
import { expect } from 'chai';

describe('Test lambda', () => {

    it('handles something', async () => {

        const event = { input: 'Hello' };

        const result = await BasicFunction.handle(event);

        expect(result).to.deep.equal({ output: 'Hello' });
    });
});