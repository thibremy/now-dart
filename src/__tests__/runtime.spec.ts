import * as runtime from '../runtime'

test('runtime.serve', async () => {
  await expect(runtime.serve()).resolves.toEqual({})
});
