import { differenceInSeconds } from "date-fns";
import {
  createContext,
  ReactNode,
  useEffect,
  useReducer,
  useState,
} from "react";
import {
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction,
} from "../reducers/cycles/actions";
import { Cycle, cyclesReducer } from "../reducers/cycles/reducer";

const CYCLES_STATE_STORAGE_KEY = "@ignite-timer:cycles-state-1.0.0";

interface CreateCycleData {
  task: string;
  minutesAmount: number;
}

interface CyclesContextType {
  cycles: Cycle[];
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  amountSecondsPassed: number;
  markCurrentCycleAsFinished: () => void;
  setSecondsPassed: (seconds: number) => void;
  createNewCycle: (data: CreateCycleData) => void;
  interruptCurrentCycle: () => void;
}

export const CyclesContext = createContext({} as CyclesContextType);

interface CyclesContextProviderProps {
  children: ReactNode;
}

function initializeCyclesState() {
  const storedStateAsJSON = localStorage.getItem(CYCLES_STATE_STORAGE_KEY);
  return storedStateAsJSON
    ? JSON.parse(storedStateAsJSON)
    : { cycles: [], activeCycleId: null };
}

function usePersistedState(state: any) {
  useEffect(() => {
    const stateJSON = JSON.stringify(state);
    localStorage.setItem(CYCLES_STATE_STORAGE_KEY, stateJSON);
  }, [state]);
}

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,
    undefined,
    initializeCyclesState,
  );
  const { cycles, activeCycleId } = cyclesState;
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    return activeCycle
      ? differenceInSeconds(new Date(), new Date(activeCycle.startDate))
      : 0;
  });

  usePersistedState(cyclesState);

  const setSecondsPassed = (seconds: number) => setAmountSecondsPassed(seconds);

  const markCurrentCycleAsFinished = () =>
    dispatch(markCurrentCycleAsFinishedAction());

  const createNewCycle = (data: CreateCycleData) => {
    const id = String(new Date().getTime());
    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };
    dispatch(addNewCycleAction(newCycle));
    setAmountSecondsPassed(0);
  };

  const interruptCurrentCycle = () => dispatch(interruptCurrentCycleAction());

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  );
}
