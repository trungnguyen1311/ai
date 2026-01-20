import { useState, useEffect, useRef } from "react";
import { type CV, cvService } from "../services/cvService";

export default function CVManagement() {
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadCVs();
  }, []);

  const loadCVs = async () => {
    try {
      const data = await cvService.getMyCVs();
      setCvs(data);
    } catch (err) {
      setError("Không thể tải danh sách hồ sơ.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.type)) {
      setError("Định dạng file không hợp lệ. Chỉ chấp nhận PDF, DOC, DOCX.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File quá lớn. Tối đa 10MB.");
      return;
    }

    setUploading(true);
    setError(null);
    try {
      await cvService.uploadCV(file);
      await loadCVs();
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError("Upload thất bại. Vui lòng thử lại.");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (cv: CV) => {
    try {
      await cvService.downloadCV(cv.id, cv.fileName);
    } catch (err) {
      setError("Không thể tải xuống file.");
    }
  };

  if (loading)
    return (
      <div className="text-center py-4 text-slate-500">Đang tải hồ sơ...</div>
    );

  return (
    <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden animate-in fade-in duration-500 mt-8">
      <div className="px-10 py-6 border-b border-gray-50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
            <svg
              className="w-5 h-5 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Hồ sơ chuyên môn (CV)
          </h2>
        </div>

        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.doc,.docx"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className={`flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 ${uploading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {uploading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
            )}
            <span>{uploading ? "Đang tải lên..." : "Tải lên CV mới"}</span>
          </button>
        </div>
      </div>

      <div className="p-10">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center space-x-3">
            <svg
              className="w-5 h-5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {cvs.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
            <p className="text-slate-500 font-medium">
              Chưa có hồ sơ nào được tải lên.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {cvs.map((cv) => (
              <div
                key={cv.id}
                className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${cv.isLatest ? "bg-indigo-50/50 border-indigo-100 ring-4 ring-indigo-50" : "bg-white border-gray-100 hover:border-gray-200"}`}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${cv.isLatest ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500"}`}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-slate-900">
                        {cv.fileName}
                      </h3>
                      {cv.isLatest && (
                        <span className="px-2 py-0.5 bg-indigo-600 text-white text-[10px] uppercase font-black tracking-wider rounded-md">
                          Mới nhất
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 mt-1 text-xs font-medium text-slate-500">
                      <span>Phiên bản {cv.version}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                      <span>{(cv.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                      <span>
                        {new Date(cv.uploadedAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(cv)}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                  title="Tải xuống"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
