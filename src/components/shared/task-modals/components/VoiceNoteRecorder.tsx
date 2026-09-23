import { useEffect, useRef, useState } from "react";
import { LuMic, LuSquare, LuTrash2 } from "react-icons/lu";

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

export function VoiceNoteRecorder({ value, onChange }: VoiceNoteRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  async function startRecording() {
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
        onChange({ url: URL.createObjectURL(blob), durationLabel: formatDuration(elapsed), blob });
        stream.getTracks().forEach((track) => track.stop());
      };
      recorder.start();
      recorderRef.current = recorder;
      setElapsed(0);
      setIsRecording(true);
      timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    } catch {
      setError("Mikrofonga ruxsat berilmadi");
    }
  }

  function stopRecording() {
    recorderRef.current?.stop();
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }

  if (value && !isRecording) {
    return (
      <div className="flex items-center gap-3 rounded-input border border-default bg-surface p-3">
        <span className="flex size-9 flex-none items-center justify-center rounded-avatar bg-brand text-on-brand">
          <LuMic size={16} />
        </span>
        <span className="flex-1 text-sm text-secondary">Ovozli izoh yozildi</span>
        <span className="text-sm font-medium text-primary">{value.durationLabel}</span>
        <button
          type="button"
          onClick={() => onChange(null)}
          aria-label="Ovozli izohni o'chirish"
          className="flex-none"
          style={{ color: "var(--status-error-text)" }}
        >
          <LuTrash2 size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-input border border-default bg-surface p-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          aria-label={isRecording ? "To'xtatish" : "Yozib olish"}
          className="flex size-9 flex-none items-center justify-center rounded-avatar"
          style={{ background: "var(--brand-default)", color: "var(--text-on-brand)" }}
        >
          {isRecording ? <LuSquare size={14} /> : <LuMic size={16} />}
        </button>
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface-secondary">
          {isRecording && <div className="h-full w-full animate-pulse bg-brand" />}
        </div>
        <span className="flex-none text-sm font-medium text-secondary">
          {formatDuration(elapsed)}
        </span>
      </div>
      <p className="text-xs text-secondary">
        {error ?? "Ovozli eslatma yozish uchun mikrofonni bosing"}
      </p>
    </div>
  );
}
