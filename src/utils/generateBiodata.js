import jsPDF from "jspdf";

const LOGO_URL = "https://i.ibb.co.com/MDd996gn/logo-1-removebg-preview.png";

const toBase64 = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d").drawImage(img, 0, 0);
      resolve({ base64: canvas.toDataURL("image/png"), w: img.naturalWidth, h: img.naturalHeight });
    };
    img.onerror = reject;
    img.src = url;
  });

const val = (v) => v || "—";
const cap = (v) => v ? v.charAt(0).toUpperCase() + v.slice(1).replace(/_/g, " ") : "—";

export const generateBiodata = async (profile, aiBio = null) => {
  const doc = new jsPDF();
  const orange = [249, 115, 22];
  const dark = [30, 30, 30];
  const gray = [120, 120, 120];
  const lightGray = [248, 248, 248];

  // ── LOGO ──
  try {
    const { base64, w, h } = await toBase64(LOGO_URL);
    const maxH = 16;
    const logoW = maxH * (w / h);
    doc.addImage(base64, "PNG", 15, 10, logoW, maxH);
  } catch {
    doc.setTextColor(...orange);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("MatchNest", 15, 22);
  }

  // ── Header right ──
  doc.setTextColor(...gray);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Matrimony Biodata", 195, 14, { align: "right" });
  doc.text(`Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, 195, 21, { align: "right" });

  // ── Divider ──
  doc.setDrawColor(...orange);
  doc.setLineWidth(1);
  doc.line(15, 32, 195, 32);

  // ── Profile Image (top right) ──
  const imgSize = 38;
  const imgX = 157;
  const imgY = 36;

  if (profile.profilePhoto?.url) {
    try {
      const { base64 } = await toBase64(profile.profilePhoto.url);
      // orange border around image
      doc.setDrawColor(...orange);
      doc.setLineWidth(1);
      doc.rect(imgX - 1, imgY - 1, imgSize + 2, imgSize + 2);
      doc.addImage(base64, "JPEG", imgX, imgY, imgSize, imgSize);
    } catch {
      // image failed silently
    }
  }

  // ── Name & Status ──
  doc.setTextColor(...dark);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(val(profile.name), 15, 48);

  if (profile.profileStatus === "verified") {
    doc.setFillColor(34, 197, 94);
    doc.roundedRect(15, 52, 28, 7, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("✓ Verified", 29, 57.5, { align: "center" });
  }

  // quick info under name
  doc.setTextColor(...gray);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const quickInfo = [
    profile.age ? `${profile.age} yrs` : null,
    cap(profile.gender),
    cap(profile.religion),
    profile.location?.city,
  ].filter(Boolean).join("  |  ");
  doc.text(quickInfo, 15, 65);

  let y = 78;

  // ── AI Bio Section ──
  if (aiBio) {
    doc.setFillColor(255, 247, 237);
    doc.roundedRect(15, y, 180, 28, 3, 3, "F");
    doc.setDrawColor(...orange);
    doc.setLineWidth(0.3);
    doc.roundedRect(15, y, 180, 28, 3, 3, "S");

    doc.setTextColor(...orange);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("✨ AI-Generated Bio", 20, y + 7);

    doc.setTextColor(80, 80, 80);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const bioLines = doc.splitTextToSize(aiBio, 168);
    doc.text(bioLines.slice(0, 2), 20, y + 14);
    y += 34;
  }

  // ── Section helper ──
  const section = (title, startY) => {
    doc.setFillColor(...lightGray);
    doc.rect(15, startY, 180, 7, "F");
    doc.setTextColor(...orange);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(title.toUpperCase(), 18, startY + 5);
    return startY + 12;
  };

  const row = (label, value, x, rowY) => {
    doc.setTextColor(...gray);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(label, x, rowY);
    doc.setTextColor(...dark);
    doc.setFont("helvetica", "bold");
    doc.text(val(value), x + 35, rowY);
  };

  // ── Personal Info ──
  y = section("Personal Information", y);
  row("Age", profile.age ? `${profile.age} years` : null, 18, y);
  row("Gender", cap(profile.gender), 105, y); y += 9;
  row("Religion", cap(profile.religion), 18, y);
  row("Marital Status", cap(profile.maritalStatus), 105, y); y += 9;
  row("Height", profile.height, 18, y);
  row("Blood Group", profile.bloodGroup, 105, y); y += 9;
  row("Location", profile.location?.city ? `${profile.location.city}, ${profile.location.country}` : null, 18, y); y += 14;

  // ── Education & Career ──
  y = section("Education & Career", y);
  row("Education", cap(profile.education), 18, y);
  row("Profession", profile.profession, 105, y); y += 9;
  row("Company", profile.career?.company, 18, y);
  row("Annual Income", profile.career?.annualIncome?.replace(/_/g, " "), 105, y); y += 14;

  // ── Family ──
  y = section("Family Background", y);
  row("Family Type", cap(profile.family?.familyType), 18, y);
  row("Family Status", cap(profile.family?.familyStatus), 105, y); y += 9;
  row("Father's Occ.", profile.family?.fatherOccupation, 18, y);
  row("Mother's Occ.", profile.family?.motherOccupation, 105, y); y += 9;
  row("Siblings", profile.family?.siblings !== undefined ? String(profile.family.siblings) : null, 18, y); y += 14;

  // ── Partner Preference ──
  if (profile.partnerPreference) {
    y = section("Partner Preference", y);
    const pref = profile.partnerPreference;
    row("Age Range", pref.minAge && pref.maxAge ? `${pref.minAge} - ${pref.maxAge} yrs` : null, 18, y);
    row("Religion", cap(pref.religion), 105, y); y += 9;
    row("Location", pref.location, 18, y);
    row("Profession", pref.profession, 105, y); y += 14;
  }

  // ── Hobbies ──
  if (profile.hobbies?.length > 0) {
    y = section("Hobbies & Interests", y);
    doc.setTextColor(...dark);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(profile.hobbies.join("  •  "), 18, y); y += 14;
  }

  // ── Footer ──
  doc.setDrawColor(...orange);
  doc.setLineWidth(0.5);
  doc.line(15, 280, 195, 280);
  doc.setFontSize(8);
  doc.setTextColor(...gray);
  doc.text("Generated by MatchNest  |  matchnest.com", 105, 287, { align: "center" });

  doc.save(`MatchNest_Biodata_${profile.name?.replace(/\s+/g, "_") || "Profile"}.pdf`);
};
