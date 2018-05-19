import boardGenerator from './index';

describe('Hookt: boardGenerator', () => {
  it('should run boardGenerator without error', (done) => {
    boardGenerator({}, {})
      .then((boardSpaces) => {
        expect(boardSpaces).toBeDefined();
        done();
      });
  });
});
