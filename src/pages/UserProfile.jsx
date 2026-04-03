import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProfileById } from "../api/search.api";
import { sendInterest } from "../api/interest.api";
import { useAuth } from "../context/AuthContext";
import {
  HiOutlineCake, HiOutlineUser, HiOutlineLocationMarker,
  HiOutlineBriefcase, HiOutlineEye, HiOutlinePhone,
  HiOutlineArrowLeft, HiOutlineHeart, HiOutlineAcademicCap,
  HiOutlineHome, HiOutlineUsers, HiOutlinePhotograph, HiOutlineX,
  HiOutlineCurrencyDollar, HiOutlineSparkles,
} from "react-icons/hi";

const NA = <span className="text-gray-300 italic text-sm">Not provided</span>;

// InfoRow – used inside 2‑column grids, takes full width of its parent cell
const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 py-2">
    <div className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
      <Icon className="w-3.5 h-3.5 text-orange-500" />
    </div>
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm text-gray-700 font-medium break-words">{value || NA}</p>
    </div>
  </div>
);

export default function UserProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [interestError, setInterestError] = useState("");
  const [showPhotos, setShowPhotos] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    getProfileById(id)
      .then((res) => setProfile(res.data.user))
      .catch(() => navigate("/matches"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSendInterest = async () => {
    setSending(true);
    setInterestError("");
    try {
      await sendInterest(id, note || undefined);
      setSent(true);
    } catch (err) {
      setInterestError(err.response?.data?.message || "Failed to send interest");
    } finally {
      setSending(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-orange-500" />
      </div>
    );
  if (!profile) return null;

  return (
    <div className="py-8 mt-16 w-11/12  mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-orange-500 transition mb-6"
      >
        <HiOutlineArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* 3‑column layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ========== COLUMN 1: Photos + Send Interest ========== */}
        <div className="flex flex-col gap-4">

 {/* Modern Profile Image Card */}
<div className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300 p-4">
  <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100">
    {profile.profilePhoto?.url ? (
      <img
        src={profile.profilePhoto.url}
        alt={profile.name}
        className="w-full h-72 object-cover"
      />
    ) : (
      <div className="w-full h-72 flex items-center justify-center">
        <span className="text-7xl font-bold text-orange-200">
          {profile.name?.charAt(0)}
        </span>
      </div>
    )}
    {profile.profileStatus === "verified" && (
      <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
        ✓ Verified
      </span>
    )}
  </div>
  <div className="text-center mt-4">
    <h1 className="text-xl font-bold text-gray-800">{profile.name}</h1>
    {profile.age && <p className="text-gray-500 text-sm mt-1">{profile.age} years old</p>}
  </div>
</div>

          {/* More Photos card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <HiOutlinePhotograph className="w-4 h-4 text-orange-500" /> More Photos
              </h3>
              <button
                onClick={() => setShowPhotos(true)}
                className="text-xs text-orange-500 hover:underline"
              >
                View All
              </button>
            </div>
            {profile.photos?.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {profile.photos.slice(0, 3).map((p, i) => (
                  <img
                    key={i}
                    src={p.url}
                    alt=""
                    className="w-full h-20 object-cover rounded-xl cursor-pointer hover:opacity-90 transition"
                    onClick={() => setSelectedPhoto(p.url)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-300 italic text-sm text-center py-4">
                Not available
              </p>
            )}
          </div>

          {/* Send Interest card */}
          {user && user._id?.toString() !== id && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <HiOutlineHeart className="w-4 h-4 text-orange-500" /> Send Interest
              </h3>
              {!sent ? (
                <>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    maxLength={300}
                    rows={3}
                    placeholder="Add a note (optional)..."
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none mb-2"
                  />
                  <p className="text-xs text-gray-400 text-right mb-2">
                    {note.length}/300
                  </p>
                  {interestError && (
                    <p className="text-red-500 text-xs mb-2">{interestError}</p>
                  )}
                  <button
                    onClick={handleSendInterest}
                    disabled={sending}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-xl transition flex items-center justify-center"
                  >
                    {sending ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : (
                      "Send Interest"
                    )}
                  </button>
                </>
              ) : (
                <p className="text-green-600 text-sm font-semibold text-center py-2">
                  ✓ Interest sent!
                </p>
              )}
            </div>
          )}
        </div>

        {/* ========== COLUMN 2: Basic Info + About + Career & Spiritual ========== */}
        <div className="flex flex-col gap-4">
          {/* Basic Information card – 2 columns inside */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-base font-bold text-gray-800 mb-1">
              Basic Information
            </h2>
            <p className="text-xs text-gray-400 mb-4">Personal details</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0">
              <InfoRow
                icon={HiOutlineUser}
                label="Gender"
                value={
                  profile.gender && <span className="capitalize">{profile.gender}</span>
                }
              />
              <InfoRow
                icon={HiOutlineUser}
                label="Religion"
                value={
                  profile.religion && (
                    <span className="capitalize">{profile.religion}</span>
                  )
                }
              />
              <InfoRow icon={HiOutlineBriefcase} label="Profession" value={profile.profession} />
              <InfoRow
                icon={HiOutlineAcademicCap}
                label="Education"
                value={
                  profile.education && (
                    <span className="capitalize">{profile.education.replace(/_/g, " ")}</span>
                  )
                }
              />
              <InfoRow
                icon={HiOutlineLocationMarker}
                label="Location"
                value={
                  profile.location?.city &&
                  `${profile.location.city}, ${profile.location.country}`
                }
              />
              <InfoRow
                icon={HiOutlineUser}
                label="Marital Status"
                value={
                  profile.maritalStatus && (
                    <span className="capitalize">{profile.maritalStatus.replace(/_/g, " ")}</span>
                  )
                }
              />
              <InfoRow icon={HiOutlineUser} label="Height" value={profile.height} />
              <InfoRow icon={HiOutlineUser} label="Weight" value={profile.weight} />
              <InfoRow icon={HiOutlineUser} label="Blood Group" value={profile.bloodGroup} />
              {profile.phone && (
                <InfoRow icon={HiOutlinePhone} label="Phone" value={profile.phone} />
              )}
            </div>
          </div>

          {/* About card (full width, single column) */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-base font-bold text-gray-800 mb-4">About</h2>
            {profile.bio ? (
              <p className="text-gray-600 text-sm leading-relaxed">{profile.bio}</p>
            ) : (
              <p className="text-gray-300 italic text-sm">Not provided</p>
            )}
          </div>

          {/* Career & Spiritual card – 2 columns inside */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-base font-bold text-gray-800 mb-1">
              Career & Spiritual
            </h2>
            <p className="text-xs text-gray-400 mb-4">Professional & religious practice</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0">
              <InfoRow icon={HiOutlineBriefcase} label="Company" value={profile.career?.company} />
              <InfoRow
                icon={HiOutlineCurrencyDollar}
                label="Annual Income"
                value={
                  profile.career?.annualIncome &&
                  profile.career.annualIncome.replace(/_/g, " ")
                }
              />
              <InfoRow
                icon={HiOutlineSparkles}
                label="Practice Level"
                value={
                  profile.spiritual?.practiceLevel && (
                    <span className="capitalize">
                      {profile.spiritual.practiceLevel.replace(/_/g, " ")}
                    </span>
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* ========== COLUMN 3: Family + Partner Preference + Hobbies ========== */}
        <div className="flex flex-col gap-4">
          {/* Family Background card – 2 columns inside */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-base font-bold text-gray-800 mb-1">
              Family Background
            </h2>
            <p className="text-xs text-gray-400 mb-4">Family details</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0">
              <InfoRow
                icon={HiOutlineHome}
                label="Family Type"
                value={
                  profile.family?.familyType && (
                    <span className="capitalize">{profile.family.familyType}</span>
                  )
                }
              />
              <InfoRow
                icon={HiOutlineHome}
                label="Family Status"
                value={
                  profile.family?.familyStatus && (
                    <span className="capitalize">
                      {profile.family.familyStatus.replace(/_/g, " ")}
                    </span>
                  )
                }
              />
              <InfoRow
                icon={HiOutlineBriefcase}
                label="Father's Occupation"
                value={profile.family?.fatherOccupation}
              />
              <InfoRow
                icon={HiOutlineBriefcase}
                label="Mother's Occupation"
                value={profile.family?.motherOccupation}
              />
              <InfoRow
                icon={HiOutlineUsers}
                label="Siblings"
                value={
                  profile.family?.siblings !== undefined && profile.family?.siblings !== ""
                    ? String(profile.family.siblings)
                    : null
                }
              />
            </div>
          </div>

          {/* Partner Preference card – 2 columns inside */}
          {profile.partnerPreference && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="text-base font-bold text-gray-800 mb-1">
                Partner Preference
              </h2>
              <p className="text-xs text-gray-400 mb-4">Looking for</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0">
                <InfoRow
                  icon={HiOutlineCake}
                  label="Age Range"
                  value={
                    profile.partnerPreference.minAge || profile.partnerPreference.maxAge
                      ? `${profile.partnerPreference.minAge || "—"} - ${
                          profile.partnerPreference.maxAge || "—"
                        } yrs`
                      : null
                  }
                />
                <InfoRow
                  icon={HiOutlineUser}
                  label="Religion"
                  value={
                    profile.partnerPreference.religion && (
                      <span className="capitalize">{profile.partnerPreference.religion}</span>
                    )
                  }
                />
                <InfoRow
                  icon={HiOutlineAcademicCap}
                  label="Education"
                  value={profile.partnerPreference.education}
                />
                <InfoRow
                  icon={HiOutlineLocationMarker}
                  label="Location"
                  value={profile.partnerPreference.location}
                />
                <InfoRow
                  icon={HiOutlineBriefcase}
                  label="Profession"
                  value={profile.partnerPreference.profession}
                />
              </div>
            </div>
          )}

          {/* Hobbies & Interests card (flex wrap, but still inside a card) */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-base font-bold text-gray-800 mb-3">
              Hobbies & Interests
            </h2>
            {profile.hobbies?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.hobbies.map((h, i) => (
                  <span
                    key={i}
                    className="bg-orange-50 text-orange-600 text-xs font-medium px-3 py-1 rounded-full border border-orange-100"
                  >
                    {h}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-300 italic text-sm">Not provided</p>
            )}
          </div>
        </div>
      </div>

      {/* Single Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <HiOutlineX className="w-6 h-6" />
            </button>
            <img
              src={selectedPhoto}
              alt=""
              className="w-full rounded-2xl object-contain max-h-[80vh]"
            />
          </div>
        </div>
      )}

      {/* All Photos Modal */}
      {showPhotos && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setShowPhotos(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">{profile.name}'s Photos</h3>
              <button
                onClick={() => setShowPhotos(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>
            {profile.photos?.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {profile.photos.map((p, i) => (
                  <img
                    key={i}
                    src={p.url}
                    alt=""
                    className="w-full h-48 object-cover rounded-xl cursor-pointer hover:opacity-90 transition"
                    onClick={() => {
                      setShowPhotos(false);
                      setSelectedPhoto(p.url);
                    }}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400 py-8 italic">Not available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}