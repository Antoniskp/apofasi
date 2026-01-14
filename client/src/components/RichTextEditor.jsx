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
        }

        .rich-text-editor .quill {
          background: white;
          border-radius: 4px;
        }

        .rich-text-editor .ql-toolbar {
          border: 1px solid #ddd;
          border-radius: 4px 4px 0 0;
          background: #f8f9fa;
        }

        .rich-text-editor .ql-container {
          border: 1px solid #ddd;
          border-top: none;
          border-radius: 0 0 4px 4px;
          font-size: 1rem;
          font-family: inherit;
          min-height: 300px;
        }

        .rich-text-editor .ql-editor {
          min-height: 300px;
        }

        .rich-text-editor .ql-editor.ql-blank::before {
          color: #999;
          font-style: normal;
        }

        .rich-text-editor .ql-editor img {
          max-width: 100%;
          height: auto;
        }

        .rich-text-editor .ql-editor iframe {
          max-width: 100%;
        }
      `}</style>
    </div>
  );
}
