import { useEffect, useRef, useState } from "react";
import { LuPlay, LuPause, LuLoaderCircle } from "react-icons/lu";
import { ImArrowDown2 } from "react-icons/im";

export interface TaskCardAudio {
  url: string;
  /** Audio metadata hali yuklanmagan holatda ko'rsatiladigan boshlang'ich davomiylik, masalan "0:24". */
  durationLabel: string;
}

interface TaskAudioMessageProps {
  audio: TaskCardAudio;
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

type Status = "idle" | "loading" | "ready";

const SLIDER_STYLE = `
.task-audio-range {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 9999px;
  outline: none;
}
.task-audio-range::-webkit-slider-runnable-track {
  height: 4px;
  border-radius: 9999px;
  background: transparent;
}
.task-audio-range::-moz-range-track {
  height: 4px;
  border-radius: 9999px;
  background: transparent;
}
.task-audio-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  margin-top: -4px;
  border-radius: 50%;
  background: var(--brand-default);
  box-shadow: 0 0 0 2px var(--bg-surface-secondary);
  cursor: pointer;
}
.task-audio-range::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border: none;
  border-radius: 50%;
  background: var(--brand-default);
  box-shadow: 0 0 0 2px var(--bg-surface-secondary);
  cursor: pointer;
}
.task-audio-range:disabled::-webkit-slider-thumb {
  background: var(--border-default);
  cursor: default;
}
.task-audio-range:disabled::-moz-range-thumb {
  background: var(--border-default);
  cursor: default;
}
`;

// Telegramdagi ovozli xabarga o'xshash pleer: avval yuklab olish tugmasi
// (dumaloq progress bilan), yuklangandan keyin play/pause'ga almashadi.
// Progress-line'ni sudrab (drag) istalgan nuqtadan davom ettirish mumkin.
function TaskAudioMessage({ audio }: TaskAudioMessageProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [elapsedLabel, setElapsedLabel] = useState("0:00");

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const onReady = () => {
      setStatus((prev) => {
        // Yuklash tugmasi bosilgandan keyin (idle emas, ya'ni "loading"dan) tayyor
        // bo'lganda avtomatik pleyni boshlaydi.
        if (prev === "loading") el.play();
        return "ready";
      });
    };
    const onTimeUpdate = () => {
      if (el.duration) setProgress(el.currentTime / el.duration);
      setElapsedLabel(formatTime(el.currentTime));
    };
    const onEnded = () => {
      setPlaying(false);
      setProgress(0);
      setElapsedLabel("0:00");
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    el.addEventListener("canplaythrough", onReady);
    el.addEventListener("loadeddata", onReady);
    el.addEventListener("timeupdate", onTimeUpdate);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("canplaythrough", onReady);
      el.removeEventListener("loadeddata", onReady);
      el.removeEventListener("timeupdate", onTimeUpdate);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
    };
  }, []);

  const handleButtonClick = () => {
    const el = audioRef.current;
    if (!el) return;
    if (status === "idle") {
      setStatus("loading");
      el.load();
      return;
    }
    if (status !== "ready") return;
    if (playing) el.pause();
    else el.play();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = audioRef.current;
    const next = Number(e.target.value);
    setProgress(next);
    if (el && el.duration) {
      el.currentTime = next * el.duration;
      setElapsedLabel(formatTime(el.currentTime));
    }
  };

  return (
    <div
      className="flex items-center gap-2.5 rounded-input"
      style={{ background: "var(--bg-surface-secondary)", padding: "8px 10px" }}
    >
      <style>{SLIDER_STYLE}</style>
      <audio ref={audioRef} src={audio.url} preload="none" style={{ display: "none" }} />

      <button
        type="button"
        onClick={handleButtonClick}
        disabled={status === "loading"}
        className="flex flex-none items-center justify-center transition-transform duration-150 hover:scale-105 active:scale-95"
        style={{
          width: 34,
          height: 34,
          borderRadius: "var(--radius-avatar, 9999px)",
          background: "var(--brand-default)",
        }}
      >
        {status === "loading" ? (
          <LuLoaderCircle size={14} color="var(--text-on-brand)" className="animate-spin" />
        ) : status === "idle" ? (
          <ImArrowDown2 size={13} color="var(--text-on-brand)" />
        ) : playing ? (
          <LuPause size={14} color="var(--text-on-brand)" />
        ) : (
          <LuPlay size={14} color="var(--text-on-brand)" style={{ marginLeft: 1 }} />
        )}
      </button>

      <input
        type="range"
        className="task-audio-range"
        min={0}
        max={1}
        step={0.001}
        value={progress}
        disabled={status !== "ready"}
        onChange={handleSeek}
        style={{
          flex: 1,
          background: `linear-gradient(to right, var(--brand-default) ${progress * 100}%, var(--border-default) ${progress * 100}%)`,
        }}
      />

      <span
        className="flex-none whitespace-nowrap"
        style={{ fontSize: "var(--text-caption, 12px)", color: "var(--text-secondary)" }}
      >
        {playing || progress > 0 ? elapsedLabel : audio.durationLabel}
      </span>
    </div>
  );
}

export default TaskAudioMessage;
