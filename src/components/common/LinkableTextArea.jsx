import React, { useState, useRef } from "react";
import styles from "./LinkableTextArea.module.css";

const LinkableTextArea = ({ value, onChange, placeholder }) => {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const textareaRef = useRef(null);
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);

  const handleAddLink = () => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    if (selectedText) {
      setLinkText(selectedText);
      setSelectionStart(start);
      setSelectionEnd(end);
      setShowLinkDialog(true);
    } else {
      console.warn("Please select text first to add a link!");
    }
  };

  const handleConfirmLink = () => {
    let finalUrl = linkUrl.trim();
    if (finalUrl) {
      if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
        finalUrl = "https://" + finalUrl;
      }

      const before = value.substring(0, selectionStart);
      const after = value.substring(selectionEnd);
      const newValue = `${before}[${linkText}](${finalUrl})${after}`;
      onChange({ target: { value: newValue } });

      setShowLinkDialog(false);
      setLinkUrl("");
      setLinkText("");
    }
  };

  const handleCancelLink = () => {
    setShowLinkDialog(false);
    setLinkUrl("");
    setLinkText("");
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <button
          type="button"
          onClick={handleAddLink}
          className={styles.linkButton}
        >
          🔗 Add Link
        </button>
      </div>

      <textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={styles.textarea}
        rows={4}
      />

      {showLinkDialog && (
        <div className={styles.linkDialog}>
          <div className={styles.dialogContent}>
            <h3>Add Link</h3>
            <p>
              Text: <strong>{linkText}</strong>
            </p>
            <input
              type="url"
              placeholder="Enter URL (e.g., https://example.com)"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className={styles.urlInput}
              autoFocus
            />
            <div className={styles.dialogButtons}>
              <button
                type="button"
                onClick={handleConfirmLink}
                className={styles.confirmBtn}
              >
                Add
              </button>
              <button
                type="button"
                onClick={handleCancelLink}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkableTextArea;
