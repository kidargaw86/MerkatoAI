import React, { useState } from "react";
import { FileText, Upload } from "lucide-react";
import { inventoryService } from "../../services/api.js";

const wholesalerId =
  process.env.REACT_APP_WHOLESALER_ID ||
  process.env.VITE_WHOLESALER_ID;

export default function InventoryUpload({ onSaved }) {
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleExtract = async () => {
    if (!inputText.trim()) return;
    setErrorMessage("");
    setIsProcessing(true);
    try {
      const data = await inventoryService.extractInventory(inputText);
      setExtractedData(data);
    } catch (error) {
      console.error("Extraction failed", error);
      const apiMessage = error?.response?.data?.error || "";
      if (apiMessage.toLowerCase().includes("gemini")) {
        setErrorMessage("Gemini is currently unavailable. Please try again shortly.");
      } else {
        setErrorMessage(apiMessage || "Could not process inventory right now.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmSave = async () => {
    if (!extractedData?.items?.length) return;
    if (!wholesalerId) {
      console.error("Set VITE_WHOLESALER_ID in client/.env");
      return;
    }
    setIsSaving(true);
    try {
      await inventoryService.saveInventory({
        items: extractedData.items,
        wholesalerId
      });
      setExtractedData(null);
      setInputText("");
      onSaved?.();
    } catch (error) {
      console.error("Save failed", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-800">Digitize inventory</h2>

      <div className="space-y-4">
        <textarea
          className="h-32 w-full rounded-lg border border-slate-200 bg-slate-50 p-4 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
          placeholder="Paste notes… e.g. 500pcs LED 9W @ 75 birr Shema Tera"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleExtract}
            disabled={isProcessing}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 py-2 px-4 font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isProcessing ? (
              <span className="animate-pulse">Processing…</span>
            ) : (
              <>
                <FileText size={18} /> Process with Gemini
              </>
            )}
          </button>
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-4 py-2 text-slate-600 hover:bg-slate-50"
            title="Image upload can be added later"
          >
            <Upload size={18} />
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {errorMessage}
        </div>
      )}

      {extractedData?.items && (
        <div className="mt-6 rounded-lg border border-emerald-100 bg-emerald-50 p-4">
          <div className="mb-3 font-medium text-emerald-700">Extracted rows (preview)</div>
          <div className="space-y-2">
            {extractedData.items.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between border-b border-emerald-100 py-2 text-sm last:border-0"
              >
                <span className="font-semibold text-slate-700">{item.item_name}</span>
                <span className="text-slate-600">
                  {item.quantity} @ {item.unit_price} ETB
                </span>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleConfirmSave}
            disabled={isSaving || !wholesalerId}
            className="mt-4 w-full rounded-md bg-emerald-600 py-2 text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
          >
            {isSaving ? "Saving…" : "Confirm & save to Supabase"}
          </button>
          {!wholesalerId && (
            <p className="mt-2 text-sm text-amber-600">
              Add <code className="rounded bg-white px-1">REACT_APP_WHOLESALER_ID</code> (or{" "}
              <code className="rounded bg-white px-1">VITE_WHOLESALER_ID</code>) to{" "}
              <code className="rounded bg-white px-1">client/.env</code> (wholesaler UUID).
            </p>
          )}
        </div>
      )}
    </div>
  );
}
