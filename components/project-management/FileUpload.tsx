"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, Paperclip, X, FileText, Image, File, Loader2 } from "lucide-react"
import { formatFileSize, ALLOWED_FILE_TYPES } from "@/lib/project-management"
import type { AttachmentData } from "@/lib/project-management"
import { useState } from "react"

interface FileUploadProps {
  taskId: string
  attachments: AttachmentData[]
  onAttachmentAdded: (attachment: AttachmentData) => void
}

export function FileUpload({ taskId, attachments, onAttachmentAdded }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0 || isUploading) return

    setIsUploading(true)
    try {
      for (const file of acceptedFiles) {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("taskId", taskId)

        const res = await fetch("/api/project-attachments", {
          method: "POST",
          body: formData,
        })
        const data = await res.json()
        if (data.attachment) {
          onAttachmentAdded(data.attachment)
        }
      }
    } catch (error) {
      console.error("Error uploading file:", error)
    } finally {
      setIsUploading(false)
    }
  }, [taskId, onAttachmentAdded, isUploading])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ALLOWED_FILE_TYPES.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize: 50 * 1024 * 1024,
    disabled: isUploading,
  })

  function getFileIcon(fileType: string) {
    if (fileType.startsWith("image/")) return Image
    if (fileType === "application/pdf") return FileText
    return File
  }

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
        <Paperclip className="w-4 h-4 text-purple-500" />
        Attachments ({attachments.length})
      </h4>

      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          isDragActive
            ? "border-purple-400 bg-purple-50"
            : "border-slate-200 hover:border-purple-300 hover:bg-purple-50/50"
        }`}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            <p className="text-sm text-purple-600">Uploading...</p>
          </div>
        ) : isDragActive ? (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-purple-500" />
            <p className="text-sm text-purple-600 font-medium">Drop files here</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-slate-400" />
            <p className="text-sm text-slate-500">
              <span className="text-purple-600 font-medium">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-slate-400">Images, PDF, Word, Excel, ZIP — up to 50MB</p>
          </div>
        )}
      </div>

      {/* File List */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {attachments.map((attachment) => {
          const Icon = getFileIcon(attachment.fileType)
          return (
            <motion.div
              key={attachment.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg group"
            >
              <div className="p-2 rounded-lg bg-white border border-slate-200">
                <Icon className="w-4 h-4 text-slate-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{attachment.fileName}</p>
                <p className="text-xs text-slate-400">{formatFileSize(attachment.fileSize)}</p>
              </div>
              <a
                href={`/api/project-attachments/${attachment.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                title="Download"
              >
                <X className="w-4 h-4 rotate-45" />
              </a>
            </motion.div>
          )
        })}
        {attachments.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-4">No attachments yet</p>
        )}
      </div>
    </div>
  )
}
