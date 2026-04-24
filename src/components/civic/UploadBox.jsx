import { useEffect, useRef, useState } from 'react';
import { Upload, X, ScanSearch } from 'lucide-react';

export default function UploadBox({ onFileSelect, onAiAnalysis, resetKey = 0 }) {
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [scanning, setScanning] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [resetKey]);

  const handleFile = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    onFileSelect?.(url);

    if (onAiAnalysis) {
      setScanning(true);
      setTimeout(() => {
        setScanning(false);
        // Simulate AI analysis result based on random chance or just a fixed wow-factor default
        onAiAnalysis({
          title: "Severe Road Surface Damage Detected",
          description: "Civic AI Analysis: Detected a severe pothole spanning approximately 1.5 meters in diameter with a depth of 4 inches. Immediate risk to two-wheelers and potential for vehicle damage.",
          category: "Roads",
          priority: "High"
        });
      }, 2500); // 2.5 seconds of "scanning"
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const clear = () => {
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onFileSelect?.(null);
  };

  return (
    <div>
      {preview ? (
        <div className="relative rounded-lg overflow-hidden border border-border group">
          <img src={preview} alt="Preview" className={`w-full h-48 object-cover transition-all ${scanning ? 'brightness-50' : 'brightness-100'}`} />
          
          {/* AI Scanning Overlay */}
          {scanning && (
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-10">
              <div className="absolute top-0 left-0 right-0 h-1 bg-primary shadow-[0_0_20px_rgba(var(--primary),1)] animate-[scan_2s_ease-in-out_infinite]" />
              <div className="absolute inset-0 bg-primary/10 animate-pulse" />
              <ScanSearch className="w-12 h-12 text-primary animate-bounce shadow-black drop-shadow-2xl mb-2" />
              <span className="bg-background/80 text-foreground font-mono text-xs px-3 py-1 rounded-full border border-primary/50 shadow-[0_0_15px_rgba(var(--primary),0.5)]">
                AI Vision Model Analyzing...
              </span>
            </div>
          )}

          {!scanning && (
            <button onClick={clear} className="absolute top-2 right-2 bg-card rounded-full p-1 card-shadow hover:bg-destructive hover:text-destructive-foreground transition-colors z-20">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          }`}
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Upload className="w-8 h-8" />
            <p className="text-sm font-medium">Drag & drop an image or click to upload</p>
            <p className="text-xs">Supports JPG, PNG up to 5MB</p>
          </div>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
    </div>
  );
}
