import { zodResolver } from "@hookform/resolvers/zod";
import { differenceInSeconds } from "date-fns";
import { HandPalm, Play } from "phosphor-react";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import zod from "zod";
import { CyclesContext } from "../../contexts/CyclesContext.tsx";
import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  StopCountdownButton,
  TaskInput,
} from "./styles.ts";

const newCycleSchema = zod.object({
  task: zod.string().min(1, "A tarefa não pode ser vazia"),
  minutesAmount: zod
    .number()
    .min(5, "O ciclo deve ser de no mínimo 5 minutos")
    .max(60, "O ciclo deve ser de no máximo 60 minutos"),
});

type NewCycleData = zod.infer<typeof newCycleSchema>;

function Home() {
  const {
    activeCycle,
    createNewCycle,
    interruptCurrentCycle,
    setSecondsPassed,
    markCurrentCycleAsFinished,
  } = useContext(CyclesContext);

  const [timeLeft, setTimeLeft] = useState(0);

  const { register, handleSubmit, watch, reset } = useForm<NewCycleData>({
    resolver: zodResolver(newCycleSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });

  function handleCreateNewCycle(data: NewCycleData) {
    createNewCycle(data);
    reset();
  }

  function handleInterruptCycle() {
    interruptCurrentCycle();
  }

  useEffect(() => {
    let interval: number;

    const updateCountdown = () => {
      if (activeCycle) {
        const secondsDifference = differenceInSeconds(
          new Date(),
          new Date(activeCycle.startDate),
        );
        if (secondsDifference >= activeCycle.minutesAmount * 60) {
          markCurrentCycleAsFinished();
          setSecondsPassed(activeCycle.minutesAmount * 60);
          clearInterval(interval);
        } else {
          setTimeLeft(secondsDifference);
        }
      }
    };

    if (activeCycle) {
      updateCountdown(); // Atualiza imediatamente após a montagem
      interval = setInterval(updateCountdown, 1000);
    }

    return () => {
      clearInterval(interval);
      setTimeLeft(0);
    };
  }, [activeCycle, setSecondsPassed, markCurrentCycleAsFinished]);

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;
  const currentSeconds = totalSeconds - timeLeft;
  const minutes = String(Math.floor(currentSeconds / 60)).padStart(2, "0");
  const seconds = String(currentSeconds % 60).padStart(2, "0");

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds} - ${activeCycle.task}`;
    }
  }, [minutes, seconds, activeCycle]);

  const task = watch("task");
  const isSubmitDisabled = !task;

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            id="task"
            list="task-suggestions"
            placeholder="Dê um nome para o seu projeto"
            {...register("task")}
            disabled={!!activeCycle}
          />
          <datalist id="task-suggestions">
            <option value="Projeto 1" />
            <option value="Projeto 2" />
            <option value="Projeto 3" />
          </datalist>
          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput
            type="number"
            id="minutesAmount"
            placeholder="00"
            step={5}
            min={5}
            max={60}
            {...register("minutesAmount", { valueAsNumber: true })}
            disabled={!!activeCycle}
          />
          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

        {activeCycle ? (
          <StopCountdownButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  );
}

export default Home;
