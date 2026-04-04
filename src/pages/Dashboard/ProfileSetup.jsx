import { useState, useEffect } from "react";
import { updateProfile, updateProfilePhoto, getProfile, addPhoto, removePhoto } from "../../api/profile.api";
import { uploadToImgBB } from "../../api/imgbb";
import { useNavigate } from "react-router-dom";
import { HiOutlinePlus, HiOutlineTrash } from "react-icons/hi";

const statusStyle = {
  incomplete: "bg-yellow-100 text-yellow-600",
  pending_verification: "bg-blue-100 text-blue-600",
  verified: "bg-green-100 text-green-600",
  rejected: "bg-red-100 text-red-500",
};

const inp = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-gray-800";
const SectionTitle = ({ title }) => (
  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mt-5 mb-3 border-b border-gray-100 pb-2">{title}</h3>
);

const REQUIRED_FIELDS = [
  { label: "Name", fn: (f) => f.name },
  { label: "Gender", fn: (f) => f.gender },
  { label: "Age", fn: (f) => f.age },
  { label: "Religion", fn: (f) => f.religion },
  { label: "Profession", fn: (f) => f.profession },
  { label: "City", fn: (f) => f.location?.city },
  { label: "Marital Status", fn: (f) => f.maritalStatus },
  { label: "Education", fn: (f) => f.education },
  { label: "Annual Income", fn: (f) => f.career?.annualIncome !== undefined && f.career?.annualIncome !== "" },
];

const getCompletion = (form) => {
  const filled = REQUIRED_FIELDS.filter(({ fn }) => fn(form)).length;
  return Math.round((filled / REQUIRED_FIELDS.length) * 100);
};

export default function ProfileSetup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    age: "", gender: "", religion: "", profession: "", bio: "", phone: "",
    location: { city: "", country: "Bangladesh" },
    education: "",
    height: "", weight: "", maritalStatus: "", bloodGroup: "",
    hobbies: "",
    career: { company: "", annualIncome: "" },
    spiritual: { practiceLevel: "" },
    family: { fatherOccupation: "", motherOccupation: "", siblings: "", familyType: "", familyStatus: "" },
    partnerPreference: { minAge: "", maxAge: "", religion: "", education: "", location: "", profession: "" },
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [profileStatus, setProfileStatus] = useState("");
  const [photos, setPhotos] = useState([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    getProfile().then((res) => {
      const u = res.data.user;
      setForm({
        age: u.age || "", gender: u.gender || "", religion: u.religion || "",
        profession: u.profession || "", bio: u.bio || "", phone: u.phone || "",
        location: { city: u.location?.city || "", country: u.location?.country || "Bangladesh" },
        education: u.education || "",
        height: u.height || "", weight: u.weight || "",
        maritalStatus: u.maritalStatus || "", bloodGroup: u.bloodGroup || "",
        hobbies: u.hobbies?.join(", ") || "",
        career: { company: u.career?.company || "", annualIncome: u.career?.annualIncome || "" },
        spiritual: { practiceLevel: u.spiritual?.practiceLevel || "" },
        family: {
          fatherOccupation: u.family?.fatherOccupation || "",
          motherOccupation: u.family?.motherOccupation || "",
          siblings: u.family?.siblings || "",
          familyType: u.family?.familyType || "",
          familyStatus: u.family?.familyStatus || "",
        },
        partnerPreference: {
          minAge: u.partnerPreference?.minAge || "",
          maxAge: u.partnerPreference?.maxAge || "",
          religion: u.partnerPreference?.religion || "",
          education: u.partnerPreference?.education || "",
          location: u.partnerPreference?.location || "",
          profession: u.partnerPreference?.profession || "",
        },
      });
      if (u.profilePhoto?.url) setPhotoPreview(u.profilePhoto.url);
      setProfileStatus(u.profileStatus || "");
      setPhotos(u.photos || []);
    }).catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "city") setForm({ ...form, location: { ...form.location, city: value } });
    else if (name.startsWith("family.")) setForm({ ...form, family: { ...form.family, [name.slice(7)]: value } });
    else if (name.startsWith("pref.")) setForm({ ...form, partnerPreference: { ...form.partnerPreference, [name.slice(5)]: value } });
    else if (name.startsWith("career.")) setForm({ ...form, career: { ...form.career, [name.slice(7)]: value } });
    else if (name.startsWith("spiritual.")) setForm({ ...form, spiritual: { ...form.spiritual, [name.slice(10)]: value } });
    else setForm({ ...form, [name]: value });
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
    setPhotoUploading(true);
    setError("");
    try {
      const url = await uploadToImgBB(file);
      await updateProfilePhoto(url);
      setMessage("Profile photo updated.");
    } catch { setError("Photo upload failed."); }
    finally { setPhotoUploading(false); }
  };

  const handleAddPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const url = await uploadToImgBB(file);
      const res = await addPhoto(url);
      setPhotos(res.data.photos);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed.");
    } finally { setUploadingPhoto(false); }
  };

  const handleRemovePhoto = async (index) => {
    try {
      const res = await removePhoto(index);
      setPhotos(res.data.photos);
    } catch { setError("Remove failed."); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setMessage("");
    setLoading(true);
    try {
      const submitData = {
        ...form,
        hobbies: form.hobbies ? form.hobbies.split(",").map((h) => h.trim()).filter(Boolean) : [],
      };
      await updateProfile(submitData);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally { setLoading(false); }
  };

  const completionPercent = getCompletion({ ...form, name: form.name || "filled" }); // name always exists

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
        {profileStatus && (
          <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusStyle[profileStatus] || "bg-gray-100 text-gray-500"}`}>
            {profileStatus.replace("_", " ")}
          </span>
        )}
      </div>

      {/* Completion bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">Profile Completion</span>
          <span className={`text-sm font-bold ${completionPercent >= 70 ? "text-green-500" : "text-orange-500"}`}>
            {completionPercent}%
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full transition-all duration-500 ${completionPercent >= 70 ? "bg-green-500" : "bg-orange-500"}`}
            style={{ width: `${completionPercent}%` }}
          />
        </div>
        {completionPercent < 70 && (
          <p className="text-xs text-gray-400 mt-2">Complete at least <span className="text-orange-500 font-semibold">70%</span> to unlock Matches Await. Missing: {REQUIRED_FIELDS.filter(({ fn }) => !fn({ ...form, name: form.name || "filled" })).map(f => f.label).join(", ")}</p>
        )}
        {completionPercent >= 70 && (
          <p className="text-xs text-green-500 mt-2">✓ You have access to Matches Await</p>
        )}
      </div>

      {message && <div className="bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-xl mb-4 text-sm">{message}</div>}
      {error && <div className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-xl mb-4 text-sm">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── LEFT COLUMN ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-2">

            {/* Photo */}
            <div className="flex flex-col items-center gap-2 mb-2">
              <div className="w-28 h-28 rounded-full overflow-hidden bg-orange-50 border-2 border-orange-300">
                {photoPreview
                  ? <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Photo</div>
                }
              </div>
              <label className="cursor-pointer text-sm text-orange-500 hover:underline">
                {photoUploading ? "Uploading..." : "Change Main Photo"}
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} disabled={photoUploading} />
              </label>
            </div>

            {/* Additional Photos */}
            <SectionTitle title="Additional Photos (max 5)" />
            <div className="flex flex-wrap gap-3">
              {photos.map((p, i) => (
                <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200">
                  <img src={p.url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => handleRemovePhoto(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5">
                    <HiOutlineTrash className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {photos.length < 5 && (
                <label className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-orange-400 transition">
                  {uploadingPhoto ? <span className="loading loading-spinner loading-xs" /> : <HiOutlinePlus className="w-5 h-5 text-gray-400" />}
                  <input type="file" accept="image/*" className="hidden" onChange={handleAddPhoto} disabled={uploadingPhoto} />
                </label>
              )}
            </div>

            {/* Basic Info */}
            <SectionTitle title="Basic Information" />
            <div className="grid grid-cols-2 gap-3">
              <input name="age" type="number" placeholder="Age" className={inp} value={form.age} onChange={handleChange} />
              <input name="phone" type="text" placeholder="Phone" className={inp} value={form.phone} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <select name="gender" className={inp} value={form.gender} onChange={handleChange} required>
                <option value="">Select Gender *</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <select name="religion" className={inp} value={form.religion} onChange={handleChange}>
                <option value="">Select Religion</option>
                <option value="islam">Islam</option>
                <option value="hinduism">Hinduism</option>
                <option value="christianity">Christianity</option>
                <option value="buddhism">Buddhism</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input name="profession" type="text" placeholder="Profession" className={inp} value={form.profession} onChange={handleChange} />
              <input name="city" type="text" placeholder="City" className={inp} value={form.location.city} onChange={handleChange} />
            </div>
            <select name="maritalStatus" className={inp} value={form.maritalStatus} onChange={handleChange}>
              <option value="">Marital Status</option>
              <option value="never_married">Never Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
              <option value="other">Other</option>
            </select>

            {/* Physical */}
            <SectionTitle title="Physical Information" />
            <div className="grid grid-cols-3 gap-3">
              <input name="height" placeholder="Height" className={inp} value={form.height} onChange={handleChange} />
              <input name="weight" placeholder="Weight" className={inp} value={form.weight} onChange={handleChange} />
              <select name="bloodGroup" className={inp} value={form.bloodGroup} onChange={handleChange}>
                <option value="">Blood</option>
                {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            {/* Education */}
            <SectionTitle title="Education" />
            <select name="education" className={inp} value={form.education} onChange={handleChange}>
              <option value="">Select Education Level</option>
              <option value="below_ssc">Below SSC</option>
              <option value="ssc">SSC</option>
              <option value="hsc">HSC</option>
              <option value="diploma">Diploma</option>
              <option value="bachelor">Bachelor's</option>
              <option value="master">Master's</option>
              <option value="phd">PhD</option>
              <option value="other">Other</option>
            </select>

            {/* About Me */}
            <SectionTitle title="About Me" />
            <textarea name="bio" placeholder="Bio (max 500 chars)" className={`${inp} resize-none`} rows={4} value={form.bio} onChange={handleChange} maxLength={500} />
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-2">

            {/* Career */}
            <SectionTitle title="Career" />
            <div className="grid grid-cols-2 gap-3">
              <input name="career.company" placeholder="Company / Organization" className={inp} value={form.career.company} onChange={handleChange} />
              <select name="career.annualIncome" className={inp} value={form.career.annualIncome} onChange={handleChange}>
                <option value="">Annual Income</option>
                <option value="0">No Income (Student / Housewife)</option>
                <option value="below_3L">Below 3 Lakh</option>
                <option value="3L_5L">3 - 5 Lakh</option>
                <option value="5L_10L">5 - 10 Lakh</option>
                <option value="10L_20L">10 - 20 Lakh</option>
                <option value="above_20L">Above 20 Lakh</option>
              </select>
            </div>

            {/* Spiritual */}
            <SectionTitle title="Spiritual / Religious Practice" />
            <select name="spiritual.practiceLevel" className={inp} value={form.spiritual.practiceLevel} onChange={handleChange}>
              <option value="">Select Practice Level</option>
              <option value="practising">Practising</option>
              <option value="moderate">Moderate</option>
              <option value="not_practising">Not Practising</option>
              <option value="other">Other</option>
            </select>

            {/* Hobbies */}
            <SectionTitle title="Hobbies & Interests" />
            <input name="hobbies" placeholder="e.g. Reading, Cooking, Travel (comma separated)" className={inp} value={form.hobbies} onChange={handleChange} />

            {/* Family Background */}
            <SectionTitle title="Family Background" />
            <div className="grid grid-cols-2 gap-3">
              <input name="family.fatherOccupation" placeholder="Father's Occupation" className={inp} value={form.family.fatherOccupation} onChange={handleChange} />
              <input name="family.motherOccupation" placeholder="Mother's Occupation" className={inp} value={form.family.motherOccupation} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <input name="family.siblings" type="number" placeholder="Siblings" className={inp} value={form.family.siblings} onChange={handleChange} />
              <select name="family.familyType" className={inp} value={form.family.familyType} onChange={handleChange}>
                <option value="">Family Type</option>
                <option value="nuclear">Nuclear</option>
                <option value="joint">Joint</option>
                <option value="other">Other</option>
              </select>
              <select name="family.familyStatus" className={inp} value={form.family.familyStatus} onChange={handleChange}>
                <option value="">Status</option>
                <option value="middle_class">Middle Class</option>
                <option value="upper_middle_class">Upper Middle</option>
                <option value="rich">Rich</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Partner Preference */}
            <SectionTitle title="Partner Preference" />
            <div className="grid grid-cols-2 gap-3">
              <input name="pref.minAge" type="number" placeholder="Min Age" className={inp} value={form.partnerPreference.minAge} onChange={handleChange} />
              <input name="pref.maxAge" type="number" placeholder="Max Age" className={inp} value={form.partnerPreference.maxAge} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <select name="pref.religion" className={inp} value={form.partnerPreference.religion} onChange={handleChange}>
                <option value="">Any Religion</option>
                <option value="islam">Islam</option>
                <option value="hinduism">Hinduism</option>
                <option value="christianity">Christianity</option>
                <option value="buddhism">Buddhism</option>
                <option value="other">Other</option>
              </select>
              <select name="pref.education" className={inp} value={form.partnerPreference.education} onChange={handleChange}>
                <option value="">Any Education</option>
                <option value="bachelor">Bachelor's+</option>
                <option value="master">Master's+</option>
                <option value="any">Any</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input name="pref.location" placeholder="Preferred Location" className={inp} value={form.partnerPreference.location} onChange={handleChange} />
              <input name="pref.profession" placeholder="Preferred Profession" className={inp} value={form.partnerPreference.profession} onChange={handleChange} />
            </div>

            {/* Save button */}
            <div className="mt-auto pt-4">
              <button type="submit" disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl transition flex items-center justify-center">
                {loading ? <span className="loading loading-spinner" /> : "Save Profile"}
              </button>

              {profileStatus !== "verified" && profileStatus !== "pending_verification" && (
                <button type="button" onClick={() => navigate("/verify-identity")}
                  className="mt-3 w-full border border-green-400 text-green-600 hover:bg-green-50 font-semibold py-2.5 rounded-xl transition">
                  Request Verification
                </button>
              )}
              {profileStatus === "pending_verification" && (
                <p className="mt-3 text-center text-sm text-blue-500">Verification is under review.</p>
              )}
              {profileStatus === "verified" && (
                <p className="mt-3 text-center text-sm text-green-600">✓ Your profile is verified.</p>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
