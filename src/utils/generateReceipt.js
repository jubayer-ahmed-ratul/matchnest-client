import jsPDF from "jspdf";

const LOGO_URL = "https://i.ibb.co.com/MDd996gn/logo-1-removebg-preview.png";

const planDetails = {
  premium: { name: "Premium Plan", price: "$19.00", features: "Unlimited interests, Advanced filters, Who viewed profile" },
  elite: { name: "Elite Plan", price: "$49.00", features: "All Premium features + Direct contact access, Priority listing" },
};

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

export const generateReceipt = async ({ plan, amount, currency, email, date, id }) => {
  const doc = new jsPDF();
  const details = planDetails[plan] || { name: plan, price: `$${amount}`, features: "—" };
  const receiptNo = `RCP-${(id || Date.now().toString()).slice(-8).toUpperCase()}`;
  const receiptDate = date || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  // White background (default)
  // Logo — maintain aspect ratio, max height 18
  try {
    const { base64, w, h } = await toBase64(LOGO_URL);
    const maxH = 18;
    const ratio = w / h;
    const logoW = maxH * ratio;
    doc.addImage(base64, "PNG", 15, 12, logoW, maxH);
  } catch {
    doc.setTextColor(249, 115, 22);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("MatchNest", 15, 25);
  }

  // Receipt info top right
  doc.setTextColor(120, 120, 120);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Receipt No: ${receiptNo}`, 195, 15, { align: "right" });
  doc.text(`Date: ${receiptDate}`, 195, 22, { align: "right" });

  // Orange divider line
  doc.setDrawColor(249, 115, 22);
  doc.setLineWidth(1);
  doc.line(15, 36, 195, 36);

  // "PAYMENT RECEIPT" title
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("PAYMENT RECEIPT", 15, 50);

  // Billed to
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 100, 100);
  doc.text("BILLED TO", 15, 65);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 30, 30);
  doc.text(email || "Customer", 15, 73);

  // Light gray box for payment details
  doc.setFillColor(248, 248, 248);
  doc.roundedRect(15, 85, 180, 70, 3, 3, "F");

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 100, 100);
  doc.text("PAYMENT DETAILS", 25, 97);

  const rows = [
    ["Plan", details.name],
    ["Amount", `$${amount} ${currency || "USD"}`],
    ["Status", "Paid"],
    ["Method", "Card (Stripe)"],
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  rows.forEach(([label, value], i) => {
    const y = 108 + i * 11;
    doc.setTextColor(120, 120, 120);
    doc.text(label, 25, y);
    doc.setTextColor(30, 30, 30);
    if (label === "Status") {
      doc.setTextColor(34, 150, 80);
    }
    doc.text(value, 100, y);
    doc.setTextColor(30, 30, 30);
  });

  // Features
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text("Includes:", 25, 165);
  doc.setTextColor(80, 80, 80);
  doc.text(details.features, 25, 172, { maxWidth: 165 });

  // Bottom divider
  doc.setDrawColor(249, 115, 22);
  doc.setLineWidth(0.5);
  doc.line(15, 185, 195, 185);

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text("Thank you for choosing MatchNest!", 105, 195, { align: "center" });
  doc.text("support@matchnest.com  |  matchnest.com", 105, 202, { align: "center" });

  doc.save(`MatchNest_Receipt_${receiptNo}.pdf`);
};
