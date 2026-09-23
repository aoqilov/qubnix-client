export type TaskFileKind = "attachment" | "description_audio";

export interface UploadedTaskFile {
  id: number;
  kind: TaskFileKind;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  url: string;
  created_at: string;
}
