import api from "../api/client";

export interface CV {
  id: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  version: number;
  isLatest: boolean;
}

export const cvService = {
  getMyCVs: async (): Promise<CV[]> => {
    const response = await api.get("/me/cv");
    return response.data;
  },

  uploadCV: async (file: File): Promise<CV> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/me/cv", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  downloadCV: async (id: string, fileName: string) => {
    const response = await api.get(`/me/cv/${id}/download`, {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  },
};
