'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'

interface FileUploadProps {
  onFileUpload: (file: File, esPrincipal: boolean) => Promise<void>
  disabled?: boolean
  maxFiles?: number
}

interface UploadedFile {
  id: string
  nombre_original: string
  tipo_mime: string
  tamaño_bytes: number
  es_principal: boolean
}

export default function FileUpload({ onFileUpload, disabled = false, maxFiles = 5 }: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (disabled) return

    setUploading(true)
    
    try {
      for (const file of acceptedFiles) {
        const esPrincipal = uploadedFiles.length === 0 // First file is principal by default
        await onFileUpload(file, esPrincipal)
        
        setUploadedFiles(prev => [...prev, {
          id: Date.now().toString(),
          nombre_original: file.name,
          tipo_mime: file.type,
          tamaño_bytes: file.size,
          es_principal: esPrincipal
        }])
      }
      
      toast.success(`${acceptedFiles.length} archivo(s) subido(s) correctamente`)
    } catch (error) {
      console.error('Error uploading files:', error)
      toast.error('Error subiendo archivos')
    } finally {
      setUploading(false)
    }
  }, [onFileUpload, uploadedFiles.length, disabled])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled,
    maxFiles,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'application/zip': ['.zip']
    },
    maxSize: 50 * 1024 * 1024 // 50MB
  })

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const togglePrincipal = (index: number) => {
    setUploadedFiles(prev => prev.map((file, i) => ({
      ...file,
      es_principal: i === index
    })))
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary-400'}
        `}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="text-sm text-gray-600">
            {isDragActive ? 'Suelta los archivos aquí' : 'Arrastra archivos aquí o haz clic para seleccionar'}
          </p>
          <p className="text-xs text-gray-500">
            PDF, JPG, PNG, ZIP (máximo 50MB cada uno)
          </p>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Archivos subidos:</h4>
          {uploadedFiles.map((file, index) => (
            <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="principal"
                  checked={file.es_principal}
                  onChange={() => togglePrincipal(index)}
                  className="text-primary-600"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.nombre_original}</p>
                  <p className="text-xs text-gray-500">
                    {(file.tamaño_bytes / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="text-red-600 hover:text-red-800"
                disabled={uploading}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {uploading && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
            <span className="text-sm text-gray-600">Subiendo archivos...</span>
          </div>
        </div>
      )}
    </div>
  )
}
