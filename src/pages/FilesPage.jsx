import React, { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'
import { Upload, Trash2, Download, FileText } from 'lucide-react'
import './FilesPage.css'

export default function FilesPage() {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    const { data, error } = await supabase.storage.from('files').list('', {
      sortBy: { column: 'created_at', order: 'desc' }
    })
    if (!error) setFiles(data || [])
    setLoading(false)
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const fileName = `${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('files').upload(fileName, file)
    if (!error) fetchFiles()
    setUploading(false)
  }

  const handleDelete = async (fileName) => {
    const { error } = await supabase.storage.from('files').remove([fileName])
    if (!error) setFiles(prev => prev.filter(f => f.name !== fileName))
  }

  const getUrl = (fileName) => {
    const { data } = supabase.storage.from('files').getPublicUrl(fileName)
    return data.publicUrl
  }

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="files-page">
      <header className="files-header">
        <div>
          <h1 className="files-title">Files</h1>
          <p className="files-sub">{files.length} saved files</p>
        </div>
        <label className="upload-btn">
          {uploading ? 'Uploading...' : <><Upload size={15} /> Upload file</>}
          <input type="file" onChange={handleUpload} disabled={uploading} style={{ display: 'none' }} />
        </label>
      </header>

      {loading && <div className="files-loading">Loading...</div>}

      {!loading && files.length === 0 && (
        <div className="files-empty">
          <FileText size={32} color="var(--ink-faint)" />
          <p>No files yet — upload your first one!</p>
        </div>
      )}

      <div className="files-list">
        {files.map(file => (
          <div key={file.name} className="file-card">
            <div className="file-icon">
              <FileText size={20} />
            </div>
            <div className="file-info">
              <span className="file-name">{file.name.replace(/^\d+-/, '')}</span>
              <span className="file-size">{formatSize(file.metadata?.size || 0)}</span>
            </div>
            <div className="file-actions">
              <a href={getUrl(file.name)} target="_blank" rel="noreferrer" className="file-btn">
                <Download size={15} />
              </a>
              <button className="file-btn delete" onClick={() => handleDelete(file.name)}>
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}