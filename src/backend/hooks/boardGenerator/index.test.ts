import boardGenerator from './index';

it('should run boardGenerator without error', (done) => {
  boardGenerator({}, {})
    .then((boardSpaces) => {
      expect(boardSpaces).toBeDefined();
      done();
    });
});
