import { OwnUserAccessGuard } from './own-user-access.guard';

describe('OwnUserAccessGuard', () => {
  it('should be defined', () => {
    expect(new OwnUserAccessGuard()).toBeDefined();
  });
});
