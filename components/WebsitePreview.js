import { useState } from 'react';
import styles from '@/styles/Home.module.css';

/**
 * WebsitePreview Component
 * Displays generated website HTML with preview and download options
 */
export default function WebsitePreview({ html, businessName, source, onClose }) {
  const [viewMode, setViewMode] = useState('preview'); // 'preview' or 'code'

  const handleDownload = () => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${businessName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_website.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOpenInNewTab = () => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className={styles.previewOverlay}>
      <div className={styles.previewModal}>
        <div className={styles.previewHeader}>
          <div className={styles.previewTitle}>
            <h2>Generated Website for {businessName}</h2>
            {source && (
              <span className={styles.sourceTag}>
                Generated using: {source}
              </span>
            )}
          </div>
          <button onClick={onClose} className={styles.closeButton}>
            ✕
          </button>
        </div>
        
        <div className={styles.previewTabs}>
          <button
            className={`${styles.tabButton} ${viewMode === 'preview' ? styles.activeTab : ''}`}
            onClick={() => setViewMode('preview')}
          >
            Preview
          </button>
          <button
            className={`${styles.tabButton} ${viewMode === 'code' ? styles.activeTab : ''}`}
            onClick={() => setViewMode('code')}
          >
            HTML Code
          </button>
        </div>
        
        <div className={styles.previewContent}>
          {viewMode === 'preview' ? (
            <iframe
              srcDoc={html}
              title="Website Preview"
              className={styles.previewIframe}
              sandbox=""
            />
          ) : (
            <pre className={styles.codeBlock}>
              <code>{html}</code>
            </pre>
          )}
        </div>
        
        <div className={styles.previewActions}>
          <button onClick={handleOpenInNewTab} className={styles.actionButton}>
            🔗 Open in New Tab
          </button>
          <button onClick={handleDownload} className={styles.actionButton}>
            📥 Download HTML
          </button>
        </div>
      </div>
    </div>
  );
}
