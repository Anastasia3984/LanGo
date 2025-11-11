import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styles from "./RichTextEditor.module.css";

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const modules = {
    toolbar: [["bold", "italic", "underline"], ["link"], ["clean"]],
  };

  const formats = ["bold", "italic", "underline", "link"];

  return (
    <div className={styles.editorWrapper}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className={styles.editor}
      />
    </div>
  );
};

export default RichTextEditor;
