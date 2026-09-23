import { api } from "@/api-config/axiosInstance";
import type { TaskFileKind, UploadedTaskFile } from "@/api/task-files/task-files.types";

interface ApiEnvelope<T> {
  statusCode: number;
  data: T;
}

export const taskFilesApi = {
  /**
   * multipart/form-data. Swagger'da so'rov tanasi hujjatlashtirilmagan (faqat
   * javob) — maydon nomi "file" deb qabul qilingan, standart konvensiya bo'yicha;
   * real backend bilan sinovdan o'tkazilganda tasdiqlash/tuzatish kerak.
   */
  upload: (
    organizationID: string,
    projectId: string,
    file: File,
    kind: TaskFileKind = "attachment",
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    return api
      .post<
        ApiEnvelope<{ files: UploadedTaskFile[] }>
      >(`/api/v1/organizations/${organizationID}/projects/${projectId}/files`, formData, {
        params: { kind },
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data.data.files);
  },

  remove: (organizationID: string, projectId: string, taskId: string, fileId: string) =>
    api
      .delete<
        ApiEnvelope<{ deleted: true }>
      >(
        `/api/v1/organizations/${organizationID}/projects/${projectId}/tasks/${taskId}/files/${fileId}`,
      )
      .then((r) => r.data.data.deleted),
};
