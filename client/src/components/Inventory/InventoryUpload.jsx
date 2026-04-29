import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const InventoryUpload = () => {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);

  const handleUpload = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    try {
      // Logic: Send raw text to Gemini-powered backend
      const response = await api.post('/inventory/extract', { text: inputText });
      setExtractedData(response.data);
    } catch (error) {
      console.error("Extraction failed", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Digitize Inventory</h2>
      
      {/* Input Section */}
      <div className="space-y-4">
        <textarea
          className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          placeholder="Paste messy notes here... e.g., 500pcs LED 9W @ 75 birr Shema Tera"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        
        <div className="flex gap-3">
          <button
            onClick={handleUpload}
            disabled={isProcessing}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:bg-blue-400"
          >
            {isProcessing ? (
              <span className="animate-pulse">Processing with Gemini...</span>
            ) : (
              <><FileText size={18} /> Process Text</>
            )}
          </button>
          
          <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors">
            <Upload size={18} />
          </button>
        </div>
      </div>

      {/* Preview Section (Appears after AI processes) */}
      {extractedData && (
        <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
          <div className="flex items-center gap-2 text-emerald-700 font-medium mb-3">
            <CheckCircle size={16} /> AI Extracted Records
          </div>
          <div className="space-y-2">
            {extractedData.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm py-2 border-b border-emerald-100 last:border-0">
                <span className="font-semibold text-slate-700">{item.item_name}</span>
                <span className="text-slate-600">{item.quantity} units @ {item.unit_price} ETB</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition-colors">
            Confirm & Save to Supabase
          </button>
        </div>
      )}
    </div>
  );
};

export default InventoryUpload;