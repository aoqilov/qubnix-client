import { useCallback, useEffect, useRef, useState } from "react";

/** Sekundlik teskari hisob: OTP amal qilish muddati uchun. */
export function useCountdown() {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(
    (seconds: number) => {
      clear();
      setSecondsLeft(seconds);
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clear();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
    [clear],
  );

  const stop = useCallback(() => {
    clear();
    setSecondsLeft(0);
  }, [clear]);

  useEffect(() => clear, [clear]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return {
    secondsLeft,
    isRunning: secondsLeft > 0,
    formatted: `${mm}:${ss}`,
    start,
    stop,
  };
}
