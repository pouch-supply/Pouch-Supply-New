import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cleanMediaUrl } from '../utils/mediaUtils';

interface ImageUploadInputProps {
  label: string;
  value: string;
  onChange: (base64OrLink: string) => void;
  placeholder?: string;
  className?: string;
  hideUrlInput?: boolean;
}

export default function ImageUploadInput({
  label,
  value,
  onChange,
  placeholder = 'Or enter image URL link...',
  className = '',
  hideUrlInput = false
}: ImageUploadInputProps) {
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Only image files are permitted (png, jpg, jpeg, webp, svg)!');
      return;
    }
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === 'string') {
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: reader.result })
          });
          if (!res.ok) {
            throw new Error(`Server returned ${res.status}`);
          }
          const info = await res.json();
          if (info.url) {
            onChange(info.url);
            window.dispatchEvent(new CustomEvent('app-image-uploaded', {
              detail: { url: info.url, fileName: file.name }
            }));
          } else {
            onChange(reader.result);
            window.dispatchEvent(new CustomEvent('app-image-uploaded', {
              detail: { url: reader.result, fileName: file.name }
            }));
          }
        } catch (err) {
          console.warn('[ImageUpload] API upload failed, falling back to local base64:', err);
          onChange(reader.result);
          window.dispatchEvent(new CustomEvent('app-image-uploaded', {
            detail: { url: reader.result, fileName: file.name }
          }));
        } finally {
          setIsUploading(false);
        }
      }
    };
    reader.onerror = () => {
      alert('Failure reading attachment file.');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-1.5 text-left font-sans ${className}`}>
      <label className="block text-slate-600 font-bold uppercase tracking-wider text-[9px]">
        {label}
      </label>
      
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`border border-dashed rounded-xl p-3 text-center transition-all relative flex flex-col items-center justify-center min-h-[96px] cursor-pointer group ${
          dragActive 
            ? 'border-indigo-600 bg-indigo-50/45' 
            : value 
              ? 'border-slate-200 bg-slate-50/30' 
              : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-400'
        } ${isUploading ? 'opacity-70 pointer-events-none' : ''}`}
      >
        {isUploading ? (
          <div className="space-y-2 py-2 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-600 border-t-transparent"></div>
            <div className="text-[9px] font-bold text-indigo-650 animate-pulse">Uploading media asset...</div>
          </div>
        ) : value ? (
          <div className="space-y-2 w-full flex flex-col items-center relative py-1">
            <div className="relative h-16 w-16 rounded-md border border-slate-150 overflow-hidden bg-white flex items-center justify-center shadow-xs">
              <img 
                src={cleanMediaUrl(value)} 
                className="h-full w-full object-cover" 
                alt="Upload thumbnail" 
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  if (typeof value === 'string' && value.startsWith('data:')) {
                    target.src = value;
                  } else {
                    target.src = 'https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=150&q=80';
                  }
                }}
              />
              <button
                type="button"
                onClick={handleClear}
                className="absolute -top-1.5 -right-1.5 bg-rose-650 hover:bg-rose-700 text-white rounded-full p-1 shadow-sm transition-all z-10 cursor-pointer"
                title="Remove image"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            
            {!hideUrlInput && (
              <p className="text-[9px] text-slate-450 font-mono truncate max-w-full text-center px-4">
                {value.startsWith('data:') ? 'Custom Uploaded Base64 Data' : value}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-1.5 py-1">
            <div className="mx-auto w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-650 transition-colors">
              <Upload className="h-4 w-4" />
            </div>
            <div className="text-[10px] font-semibold text-slate-700">
              Drag file here or <span className="text-indigo-650 font-bold group-hover:underline">browse</span>
            </div>
            <p className="text-[8px] text-slate-400">PNG, JPG, WEBP, SVG under 5MB</p>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {!hideUrlInput && (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
            <ImageIcon className="h-3 w-3" />
          </div>
          <input
            type="text"
            placeholder={placeholder}
            value={value.startsWith('data:') ? '' : value}
            onChange={(e) => {
              const val = e.target.value;
              onChange(val);
              if (val && (val.startsWith('http://') || val.startsWith('https://') || val.startsWith('data:'))) {
                let name = 'External Asset';
                try {
                  const u = new URL(val);
                  const last = u.pathname.substring(u.pathname.lastIndexOf('/') + 1);
                  if (last && last.includes('.')) {
                    name = last;
                  }
                } catch (_) {}
                window.dispatchEvent(new CustomEvent('app-image-uploaded', {
                  detail: { url: val, fileName: name }
                }));
              }
            }}
            className="w-full text-[10px] pl-7 pr-2 py-1.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium"
          />
        </div>
      )}
    </div>
  );
}
