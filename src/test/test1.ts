import { expect } from 'chai';
import { it, describe } from '../test-framework'
import { waitNextFrame } from '../utils/wait-frame';

export function run() {
  describe('Basic tests for testing chai', () => {
    it('should be equal', () => {
      const valor = 42;
      expect(valor).to.equal(42);
    });

    it('should be not equal', () => {
      const valor = 42;
      expect(valor).to.not.equal(100);
    });

    it('should be a basic async test', async () => {
      await waitNextFrame()
      await waitNextFrame()
      await waitNextFrame()
      expect(42).to.not.equal(100);
    });
  });
}