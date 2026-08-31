import {useState} from "react";
import {TraversalResult, TraversalEvent} from "./types";

export function useReplay(traversalResult: TraversalResult | null){
  // -1 represents the initial, pre-traversal state
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  const events = traversalResult?.events || [];
  const totalEvents = events.length;

  const currentEvent: TraversalEvent | null =
    currentIndex >= 0 && currentIndex < totalEvents
      ? events[currentIndex]
      : null;

  const step = ()=>{
    if(currentIndex < totalEvents - 1){
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const runToEnd = () =>{
    if(totalEvents > 0){
      setCurrentIndex(totalEvents - 1);
    }
  };

  const reset = () =>{
    setCurrentIndex(-1);
  };

  const isFinished = totalEvents > 0 && currentIndex === totalEvents - 1;

  return{
    currentIndex,
    totalEvents,
    currentEvent,
    step,
    runToEnd,
    reset,
    isFinished,
  };
}