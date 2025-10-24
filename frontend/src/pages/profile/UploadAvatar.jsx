import { useState } from "react";
import axios from "axios";

export default function UploadAvatar() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Khi chọn file
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Kiểm tra định dạng
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"];
    if (!validTypes.includes(selectedFile.type)) {
      setMessage("❌ Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WEBP)");
      return;
    }

    // Kiểm tra kích thước (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setMessage("❌ File quá lớn! Tối đa 5MB");
      return;
    }

    setFile(selectedFile);
    setMessage("");

    // Tạo preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  // Upload lên backend
  const handleUpload = async () => {
    if (!file) {
      setMessage("❌ Vui lòng chọn file trước");
      return;
    }

    try {
      setLoading(true);
      setMessage("⏳ Đang upload...");

      const formData = new FormData();
      formData.append("avatar", file);

      const response = await axios.post("http://localhost:5000/api/upload-avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setAvatarUrl(response.data.url);
      setMessage(`✅ ${response.data.message}`);
      console.log("📸 Avatar URL:", response.data.url);
    } catch (error) {
      setMessage(`❌ Upload thất bại: ${error.response?.data?.message || error.message}`);
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 30, border: "2px solid #2196F3", borderRadius: 12, background: "#f9f9f9" }}>
      <h2 style={{ color: "#2196F3", marginBottom: 20 }}>📸 Upload Avatar</h2>

      {/* Input file */}
      <div style={{ marginBottom: 20 }}>
        <label
          htmlFor="avatar-input"
          style={{
            display: "inline-block",
            padding: "12px 24px",
            background: "#2196F3",
            color: "white",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600,
            transition: "background 0.3s",
          }}
        >
          📁 Chọn ảnh
        </label>
        <input
          id="avatar-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        {file && (
          <span style={{ marginLeft: 15, color: "#555", fontSize: 14 }}>
            {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </span>
        )}
      </div>

      {/* Preview */}
      {preview && (
        <div style={{ marginBottom: 20, textAlign: "center" }}>
          <p style={{ fontWeight: 600, marginBottom: 10, color: "#555" }}>Preview:</p>
          <img
            src={preview}
            alt="Preview"
            style={{
              maxWidth: "100%",
              maxHeight: 300,
              border: "3px solid #ddd",
              borderRadius: 12,
              objectFit: "cover",
            }}
          />
        </div>
      )}

      {/* Button Upload */}
      <button
        onClick={handleUpload}
        disabled={!file || loading}
        style={{
          width: "100%",
          padding: "14px",
          background: loading ? "#ccc" : "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: 8,
          fontSize: 16,
          fontWeight: 600,
          cursor: loading || !file ? "not-allowed" : "pointer",
          marginBottom: 20,
          transition: "background 0.3s",
        }}
      >
        {loading ? "⏳ Đang upload..." : "🚀 Upload Avatar"}
      </button>

      {/* Message */}
      {message && (
        <div
          style={{
            padding: 15,
            borderRadius: 8,
            background: message.includes("✅") ? "#E8F5E9" : message.includes("⏳") ? "#FFF3E0" : "#FFEBEE",
            color: message.includes("✅") ? "#4CAF50" : message.includes("⏳") ? "#F57C00" : "#f44336",
            fontWeight: 500,
            marginBottom: 20,
          }}
        >
          {message}
        </div>
      )}

      {/* Hiển thị avatar sau khi upload */}
      {avatarUrl && (
        <div style={{ textAlign: "center", padding: 20, background: "white", borderRadius: 12, border: "2px dashed #4CAF50" }}>
          <h3 style={{ color: "#4CAF50", marginBottom: 15 }}>🎉 Upload thành công!</h3>
          <img
            src={avatarUrl}
            alt="Avatar"
            style={{
              width: 150,
              height: 150,
              borderRadius: "50%",
              objectFit: "cover",
              border: "4px solid #4CAF50",
              marginBottom: 15,
            }}
          />
          <p style={{ fontSize: 14, color: "#666", wordBreak: "break-all" }}>
            <strong>URL:</strong> {avatarUrl}
          </p>
        </div>
      )}
    </div>
  );
}
