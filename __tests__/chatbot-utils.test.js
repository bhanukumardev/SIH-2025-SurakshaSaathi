const { copyToClipboard, sendToHandleMessage } = require('../components/chatbot-utils');

describe('chatbot-utils', () => {
  describe('copyToClipboard', () => {
    beforeEach(() => {
      global.navigator = {};
    });
    it('throws if clipboard not supported', async () => {
      await expect(copyToClipboard('x')).rejects.toThrow('clipboard-not-supported');
    });
    it('writes to clipboard when available', async () => {
      const writeText = jest.fn().mockResolvedValue(undefined);
      global.navigator = { clipboard: { writeText } };
      await expect(copyToClipboard('hello')).resolves.toBeUndefined();
      expect(writeText).toHaveBeenCalledWith('hello');
    });
  });

  describe('sendToHandleMessage', () => {
    beforeEach(() => {
      global.fetch = jest.fn();
    });
    it('throws on non-ok response', async () => {
      global.fetch.mockResolvedValue({ ok: false });
      await expect(sendToHandleMessage('hi')).rejects.toThrow('network-error');
    });
    it('returns json on ok', async () => {
      global.fetch.mockResolvedValue({ ok: true, json: async () => ({ response: 'ok' }) });
      const r = await sendToHandleMessage('hi');
      expect(r).toEqual({ response: 'ok' });
    });
  });
});
