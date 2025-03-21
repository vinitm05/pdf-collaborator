import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSharedPDF, getComments, addComment } from "../api/api";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

// Set worker source with specific version
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ViewPDF = () => {
  const { pdfId } = useParams();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const cleanPdfId = pdfId.split("-")[0];

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        console.log("🔹 Fetching PDF with ID:", cleanPdfId);
        const res = await getSharedPDF(cleanPdfId);
        if (!res.data || !res.data.pdf) throw new Error("Invalid PDF data received");
        if (!res.data.pdf.fileUrl) throw new Error("PDF URL is missing");

        console.log("✅ PDF URL:", res.data.pdf.fileUrl);
        setPdfUrl(res.data.pdf.fileUrl);
      } catch (error) {
        console.error("❌ Error fetching PDF:", error);
        setError(error.message || "Failed to load PDF.");
      }
    };

    const fetchComments = async () => {
      try {
        console.log("🔹 Fetching Comments for ID:", cleanPdfId);
        const res = await getComments(cleanPdfId);
        setComments(res.data.comments); // Ensure correct data structure
      } catch (error) {
        console.error("❌ Error fetching comments:", error);
      }
    };

    fetchPDF();
    fetchComments();
  }, [cleanPdfId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await addComment({ pdfId: cleanPdfId, text: newComment });
      setComments([res.data.comment, ...comments]); // ✅ Update comments list instantly
      setNewComment("");
    } catch (error) {
      console.error("❌ Error adding comment:", error);
    }
  };

  return (
    <div className="container mx-auto p-6 flex space-x-6">
      {/* PDF Viewer */}
      <div className="w-2/3 border p-4 bg-white shadow-md">
        {error ? (
          <div className="text-red-500 p-4">
            <p>Error: {error}</p>
            <p className="text-sm mt-2">Please check if the link is valid or try again later.</p>
          </div>
        ) : pdfUrl ? (
          <Document 
            file={pdfUrl} 
            onLoadSuccess={({ numPages }) => {
              console.log("PDF loaded successfully with", numPages, "pages");
              setNumPages(numPages);
            }}
            onLoadError={(error) => {
              console.error("Detailed PDF Load Error:", error);
              setError(`Failed to load PDF: ${error.message}`);
            }}
            onSourceError={(error) => {
              console.error("Source Error:", error);
              setError(`Source Error: ${error.message}`);
            }}
            loading={<p>Loading PDF...</p>}
          >
            {numPages && Array.from(new Array(numPages), (el, index) => (
              <Page 
                key={`page_${index + 1}`} 
                pageNumber={index + 1} 
                className="mb-4 shadow-sm"
                onLoadError={(error) => console.error(`Error loading page ${index + 1}:`, error)}
              />
            ))}
          </Document>
        ) : (
          <p className="text-gray-500">Loading PDF...</p>
        )}
      </div>

      {/* Comments Section */}
      <div className="w-1/3 p-4 bg-gray-100 border shadow-md flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Comments</h2>
        <div className="flex-1 overflow-y-auto max-h-[60vh] border bg-white p-3 rounded-md shadow-inner">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className="p-2 border-b">
                <strong className="text-blue-600">{comment.user || "Anonymous"}:</strong>
                <p className="text-gray-800">{comment.text}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No comments yet.</p>
          )}
        </div>

        {/* Comment Input */}
        <form onSubmit={handleCommentSubmit} className="mt-4">
          <input
            type="text"
            placeholder="Write a comment..."
            className="p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button type="submit" className="mt-2 p-2 bg-blue-500 text-white w-full rounded-md">
            Add Comment
          </button>
        </form>
      </div>
    </div>
  );
};

export default ViewPDF;
