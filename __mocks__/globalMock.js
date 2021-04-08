
import 'jest-date-mock';
jest.mock('global', () => ({
    ...global,
    WebSocket: function WebSocket() {},
}));