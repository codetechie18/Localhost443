import { useEffect, useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';

export default function UploadBox({ onFileSelect, resetKey = 0 }) {
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
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
        <div className="relative rounded-lg overflow-hidden border border-border">
          <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
          <button onClick={clear} className="absolute top-2 right-2 bg-card rounded-full p-1 card-shadow">
            <X className="w-4 h-4" />
          </button>
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
