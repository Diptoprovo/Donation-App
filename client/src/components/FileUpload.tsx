
import { useState, useRef, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, X } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

const FileUpload = ({ 
  onFileSelect, 
  accept = "image/*", 
  maxSize = 5, 
  className = ""
}: FileUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };
  
  const validateAndProcessFile = (file: File) => {
    // Clear previous error
    setError(null);
    
    // Check file type
    if (!file.type.match(accept.replace(/\*/g, '.*'))) {
      setError(`Invalid file type. Please upload ${accept.replace('*', 'a supported file')}.`);
      return;
    }
    
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB limit.`);
      return;
    }
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
    
    // Pass file to parent component
    onFileSelect(file);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };
  
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  const removeImage = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className={className}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
      />
      
      {!preview ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
            isDragging
              ? 'border-primary bg-primary/5'
              : error
              ? 'border-destructive bg-destructive/5'
              : 'border-muted-foreground/20 hover:border-muted-foreground/30 hover:bg-secondary/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <div className="flex flex-col items-center justify-center space-y-3 text-center cursor-pointer">
            <div className="rounded-full bg-secondary p-3">
              <Upload size={18} className="text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">
                Drag & drop your file here or click to browse
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {accept.includes('image')
                  ? 'Supports JPG, PNG, GIF up to 5MB'
                  : `Supports ${accept.replace(/\./g, '').replace(/,/g, ', ')} files up to ${maxSize}MB`}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-lg aspect-video bg-secondary/30">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-full object-cover" 
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={removeImage}
          >
            <X size={16} />
          </Button>
        </div>
      )}
      
      {error && (
        <p className="text-destructive text-sm mt-2">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;
