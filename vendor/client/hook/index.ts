type Effect = {};
type HookProps<State> = {
  initialState: State;
  render(
    state: State,
    updateState: (state: State) => void,
    children: React.ReactNode,
  ): any;
};
export default function Hook<State>({}: HookProps<State>) {
  return {};
}
