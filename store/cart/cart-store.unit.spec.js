const { renderHook, act } = require('@testing-library/react-hooks');
import { useCartStore } from './index';

describe('Cart Store', () => {
  it('should return open equals false on initial state', async () => {
    const { result } = renderHook(() => useCartStore());

    expect(result.current.state.open).toBe(false);
  });

  it('should toggle open state', async () => {
    const { result } = renderHook(() => useCartStore());
    const {
      actions: { toogle },
    } = result.current;

    expect(result.current.state.open).toBe(false);

    act(() => toogle());
    expect(result.current.state.open).toBe(true);

    act(() => result.current.actions.toogle());
    expect(result.current.state.open).toBe(false);
  });
});
