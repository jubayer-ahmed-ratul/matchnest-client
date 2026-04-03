import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadToImgBB } from "../../api/imgbb";
import { requestVerification } from "../../api/profile.api";

const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400";

export default function VerificationUpload() {
  const navigate = useNavigate();
  const [docType, setDocType] = useState("nid");
  const [frontImg, setFrontImg] = useState(null);
  const [backImg, setBackImg] = useState(null);
  const [frontPreview, setFrontPreview] = useState(null);
  const [backPreview, setBackPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleFile = (side, file) => {
    if (!file) return;
    if (side === "front") { setFrontImg(file); setFrontPreview(URL.createObjectURL(file)); }
    else { setBackImg(file); setBackPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setMessage("");
    if (!frontImg) { setError("Please upload the front image."); return; }
    if (docType === "nid" && !backImg) { setError("NID requires both front and back images."); return; }
    setLoading(true);
    try {
      const frontUrl = await uploadToImgBB(frontImg);
      const backUrl = backImg ? await uploadToImgBB(backImg) : null;
      await requestVerification({
        verificationDocs: {
          docType,
          docImage: { url: frontUrl },
          ...(backUrl && { docImageBack: { url: backUrl } }),
        },
      });
      setMessage("Verification request submitted successfully!");
      setTimeout(() => navigate("/profile"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed. Try again.");
    } finally { setLoading(false); }
  };

  const UploadBox = ({ side, preview, label }) => (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 block">{label}</label>
      <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-orange-400 transition">
        {preview
          ? <img src={preview} alt={side} className="mx-auto max-h-40 rounded-lg object-contain" />
          : <p className="text-gray-400 text-sm py-4">Click below to upload</p>
        }
        <input type="file" accept="image/*" className="hidden" id={side}
          onChange={(e) => handleFile(side, e.target.files[0])} />
      </div>
      <label htmlFor={side} className="mt-2 block text-center text-sm text-orange-500 cursor-pointer hover:underline">
        {preview ? "Change Image" : "Select Image"}
      </label>
    </div>
  );

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Identity Verification</h2>
        <p className="text-gray-500 text-sm mb-6">Upload your document to verify your identity.</p>

        {message && <div className="bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-xl mb-4 text-sm">{message}</div>}
        {error && <div className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-xl mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Document Type</label>
            <select className={inputClass} value={docType}
              onChange={(e) => { setDocType(e.target.value); setBackImg(null); setBackPreview(null); }}>
              <option value="nid">National ID (NID)</option>
              <option value="passport">Passport</option>
              <option value="birth_certificate">Birth Certificate</option>
            </select>
          </div>

          <UploadBox side="front" preview={frontPreview} label={docType === "nid" ? "Front Side" : "Document Image"} />
          {docType === "nid" && <UploadBox side="back" preview={backPreview} label="Back Side" />}

          <button type="submit" disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl transition flex items-center justify-center">
            {loading ? <span className="loading loading-spinner" /> : "Submit for Verification"}
          </button>
          <button type="button" className="text-sm text-gray-400 hover:text-gray-600 text-center" onClick={() => navigate("/profile")}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
