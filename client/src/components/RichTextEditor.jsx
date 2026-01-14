import { useCallback, useMemo, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { uploadArticleImage } from "../lib/api.js";

export default function RichTextEditor({ value, onChange, placeholder, onError }) {
  const quillRef = useRef(null);

  // Custom image handler
  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        if (onError) {
          onError("Το μέγεθος της εικόνας δεν πρέπει να υπερβαίνει τα 5MB.");
        }
        return;
      }

      try {
        const data = await uploadArticleImage(file);
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        
        // Insert the image at the cursor position
        const imageUrl = data.url.startsWith("http") ? data.url : `${window.location.origin}${data.url}`;
        quill.insertEmbed(range.index, "image", imageUrl);
        quill.setSelection(range.index + 1);
      } catch (error) {
        console.error("Image upload failed:", error);
        if (onError) {
          onError("Αποτυχία μεταφόρτωσης εικόνας: " + error.message);
        }
      }
    };
  }, [onError]);

  // Quill modules configuration
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          ["blockquote", "code-block"],
          [{ align: [] }],
          ["link", "image", "video"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    [imageHandler]
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "blockquote",
    "code-block",
    "align",
    "link",
    "image",
    "video",
  ];

  return (
    <div className="rich-text-editor">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || "Γράψτε το περιεχόμενο του άρθρου σας..."}
      />
      <style>{`
        .rich-text-editor {
          margin-bottom: 1rem;
          width: 100%;
          max-width: 100%;
          overflow: hidden;
        }

        .rich-text-editor .quill {
          background: white;
          border-radius: 4px;
          display: flex;
          flex-direction: column;
        }

        .rich-text-editor .ql-toolbar {
          border: 1px solid #ddd;
          border-radius: 4px 4px 0 0;
          background: #f8f9fa;
          padding: 8px;
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          position: relative;
          z-index: 1;
        }

        .rich-text-editor .ql-toolbar .ql-formats {
          margin-right: 0 !important;
          display: inline-flex;
          gap: 2px;
          flex-wrap: wrap;
        }

        .rich-text-editor .ql-container {
          border: 1px solid #ddd;
          border-top: none;
          border-radius: 0 0 4px 4px;
          font-size: 1rem;
          font-family: inherit;
          min-height: 300px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .rich-text-editor .ql-editor {
          min-height: 300px;
          padding: 12px 15px;
          overflow-y: auto;
          flex: 1;
        }

        .rich-text-editor .ql-editor.ql-blank::before {
          color: #999;
          font-style: normal;
          left: 15px;
          right: 15px;
        }

        .rich-text-editor .ql-editor img {
          max-width: 100%;
          height: auto;
          display: block;
        }

        .rich-text-editor .ql-editor iframe {
          max-width: 100%;
        }

        /* Ensure toolbar buttons are properly sized */
        .rich-text-editor .ql-toolbar button {
          width: 28px;
          height: 28px;
          padding: 3px 5px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .rich-text-editor .ql-toolbar .ql-picker {
          height: 28px;
          font-size: 14px;
        }

        .rich-text-editor .ql-toolbar .ql-picker-label {
          padding: 2px 8px;
          display: flex;
          align-items: center;
        }

        /* Mobile responsive styles */
        @media (max-width: 768px) {
          .rich-text-editor {
            margin-bottom: 1rem;
            width: 100%;
          }

          .rich-text-editor .ql-toolbar {
            padding: 6px;
            border-radius: 4px 4px 0 0;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: thin;
          }

          .rich-text-editor .ql-toolbar::-webkit-scrollbar {
            height: 4px;
          }

          .rich-text-editor .ql-toolbar::-webkit-scrollbar-track {
            background: #f1f1f1;
          }

          .rich-text-editor .ql-toolbar::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 2px;
          }

          .rich-text-editor .ql-toolbar .ql-formats {
            margin-right: 4px !important;
            flex-wrap: nowrap;
          }

          .rich-text-editor .ql-toolbar button {
            width: 32px;
            height: 32px;
            padding: 4px;
            flex-shrink: 0;
          }

          .rich-text-editor .ql-toolbar .ql-picker {
            height: 32px;
            font-size: 13px;
            flex-shrink: 0;
          }

          .rich-text-editor .ql-container {
            min-height: 250px;
            font-size: 16px; /* Prevents zoom on iOS */
          }

          .rich-text-editor .ql-editor {
            min-height: 250px;
            padding: 10px 12px;
            font-size: 16px; /* Prevents zoom on iOS */
          }

          .rich-text-editor .ql-editor.ql-blank::before {
            left: 12px;
            right: 12px;
            font-size: 16px; /* Prevents zoom on iOS */
          }
        }

        /* Extra small mobile devices */
        @media (max-width: 480px) {
          .rich-text-editor .ql-toolbar {
            padding: 4px;
          }

          .rich-text-editor .ql-toolbar button {
            width: 30px;
            height: 30px;
            padding: 3px;
          }

          .rich-text-editor .ql-toolbar .ql-picker {
            height: 30px;
            font-size: 12px;
          }

          .rich-text-editor .ql-toolbar .ql-picker-label {
            padding: 2px 6px;
          }

          .rich-text-editor .ql-container {
            min-height: 200px;
          }

          .rich-text-editor .ql-editor {
            min-height: 200px;
            padding: 8px 10px;
          }

          .rich-text-editor .ql-editor.ql-blank::before {
            left: 10px;
            right: 10px;
          }
        }

        /* Tablet landscape and small desktop */
        @media (min-width: 769px) and (max-width: 1024px) {
          .rich-text-editor .ql-toolbar {
            padding: 8px;
          }

          .rich-text-editor .ql-toolbar button {
            width: 30px;
            height: 30px;
          }

          .rich-text-editor .ql-toolbar .ql-picker {
            height: 30px;
          }
        }

        /* Ensure dropdown menus are properly positioned on mobile */
        @media (max-width: 768px) {
          .rich-text-editor .ql-toolbar .ql-picker-options {
            max-height: 200px;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
          }
        }

        /* Fix for touch devices - prevent double-tap zoom */
        @media (hover: none) and (pointer: coarse) {
          .rich-text-editor .ql-editor {
            touch-action: manipulation;
          }
        }
      `}</style>
    </div>
  );
}
