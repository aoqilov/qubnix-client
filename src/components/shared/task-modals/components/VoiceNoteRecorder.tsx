import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { LuCheck, LuMic, LuPause, LuPlay, LuTrash2, LuX } from "react-icons/lu";

export interface VoiceNoteValue {
  url: string;
  durationLabel: string;
  /** Backend'ga yuklash uchun — yozib olingan audio, `taskFilesApi.upload`ga beriladi. */
  blob: Blob;
}

interface VoiceNoteRecorderProps {
  value: VoiceNoteValue | null;
  onChange: (value: VoiceNoteValue | null) => void;
}

function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

type Phase = "idle" | "recording" | "review";

interface ReviewRecording {
  url: string;
  blob: Blob;
}

// Telegram uslubidagi "bosib turib yozish": mikrofonni bosib turgancha
// yozadi, qo'yib yuborganda to'xtaydi va Qabul qilish/Bekor qilish
// tugmalari chiqadi — faqat Qabul qilinganda `onChange` chaqiriladi.
export function VoiceNoteRecorder({ value, onChange }: VoiceNoteRecorderProps) {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<Phase>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [review, setReview] = useState<ReviewRecording | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  function togglePlay() {
    const el = audioRef.current;
    if (!el) return;
    if (isPlaying) el.pause();
    else el.play();
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (review) URL.revokeObjectURL(review.url);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function startRecording() {
    if (phase !== "idle") return;
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setReview({ url: URL.createObjectURL(blob), blob });
        setPhase("review");
        stream.getTracks().forEach((track) => track.stop());
      };
      recorder.start();
      recorderRef.current = recorder;
      setElapsed(0);
      setPhase("recording");
      timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    } catch {
      setError(t("tasks.voice.micDenied"));
    }
  }

  function stopRecording() {
    if (phase !== "recording") return;
    recorderRef.current?.stop();
    if (timerRef.current) clearInterval(timerRef.current);
  }

  function handleAccept() {
    if (!review) return;
    audioRef.current?.pause();
    setIsPlaying(false);
    onChange({ url: review.url, durationLabel: formatDuration(elapsed), blob: review.blob });
    setReview(null);
    setPhase("idle");
  }

  function handleDiscard() {
    audioRef.current?.pause();
    setIsPlaying(false);
    if (review) URL.revokeObjectURL(review.url);
    setReview(null);
    setPhase("idle");
    setElapsed(0);
  }

  if (value && phase === "idle") {
    return (
      <div className="flex items-center gap-3 rounded-input border border-default bg-surface p-3">
        <audio
          ref={audioRef}
          src={value.url}
          style={{ display: "none" }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? t("tasks.voice.stop") : t("tasks.voice.play")}
          className="flex size-9 flex-none items-center justify-center rounded-avatar bg-brand text-on-brand"
        >
          {isPlaying ? <LuPause size={16} /> : <LuPlay size={16} style={{ marginLeft: 1 }} />}
        </button>
        <span className="flex-1 text-sm text-secondary">{t("tasks.voice.recorded")}</span>
        <span className="text-sm font-medium text-primary">{value.durationLabel}</span>
        <button
          type="button"
          onClick={() => onChange(null)}
          aria-label={t("tasks.voice.deleteVoice")}
          className="flex-none"
          style={{ color: "var(--status-error-text)" }}
        >
          <LuTrash2 size={16} />
        </button>
      </div>
    );
  }

  if (phase === "review" && review) {
    return (
      <div className="flex flex-col gap-2 rounded-input border border-default bg-surface p-3">
        <div className="flex items-center gap-3">
          <audio
            ref={audioRef}
            src={review.url}
            style={{ display: "none" }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          />
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? t("tasks.voice.stop") : t("tasks.voice.play")}
            className="flex size-9 flex-none items-center justify-center rounded-avatar"
            style={{ background: "var(--brand-default)", color: "var(--text-on-brand)" }}
          >
            {isPlaying ? <LuPause size={16} /> : <LuPlay size={16} style={{ marginLeft: 1 }} />}
          </button>
          <span className="flex-1 text-sm text-secondary">{t("tasks.voice.ready")}</span>
          <span className="flex-none text-sm font-medium text-primary">
            {formatDuration(elapsed)}
          </span>
          <button
            type="button"
            onClick={handleDiscard}
            aria-label={t("common.actions.cancel")}
            className="flex size-9 flex-none items-center justify-center rounded-avatar"
            style={{ color: "var(--status-error-text)" }}
          >
            <LuX size={18} />
          </button>
          <button
            type="button"
            onClick={handleAccept}
            aria-label={t("tasks.voice.accept")}
            className="flex size-9 flex-none items-center justify-center rounded-avatar"
            style={{ background: "var(--brand-default)", color: "var(--text-on-brand)" }}
          >
            <LuCheck size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-input border border-default bg-surface p-3">
      <div className="flex items-center gap-3">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface-secondary">
          {phase === "recording" && <div className="h-full w-full animate-pulse bg-brand" />}
        </div>
        <span className="flex-none text-sm font-medium text-secondary">
          {formatDuration(elapsed)}
        </span>
        <button
          type="button"
          aria-label={phase === "recording" ? t("tasks.voice.recordingRelease") : t("tasks.voice.holdToRecord")}
          onPointerDown={(e) => {
            e.preventDefault();
            startRecording();
          }}
          onPointerUp={stopRecording}
          onPointerLeave={stopRecording}
          onPointerCancel={stopRecording}
          className="flex size-9 flex-none items-center justify-center rounded-avatar select-none"
          style={{
            background:
              phase === "recording" ? "var(--status-error-solid)" : "var(--brand-default)",
            color: "var(--text-on-brand)",
            touchAction: "none",
          }}
        >
          <LuMic size={16} />
        </button>
      </div>
      <p className="text-xs text-secondary">
        {error ??
          (phase === "recording"
            ? t("tasks.voice.recordingHint")
            : t("tasks.voice.holdHint"))}
      </p>
    </div>
  );
}
