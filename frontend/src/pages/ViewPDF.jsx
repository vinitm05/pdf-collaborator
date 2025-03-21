import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSharedPDF, getComments, addComment } from "../api/api";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

// Import worker directly
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.js?url";
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const ViewPDF = () => {
  const { pdfId } = useParams();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);

  const cleanPdfId = pdfId.split("-")[0];
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        console.log("🔹 Fetching PDF with ID:", cleanPdfId);
        const res = await getSharedPDF(cleanPdfId);
        if (!res.data || !res.data.pdf)
          throw new Error("Invalid PDF data received");
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

    setIsCommenting(true);
    try {
      const token = localStorage.getItem("token");
      const userEmail = localStorage.getItem("userEmail");

      console.log("Current user email:", userEmail); // Debug log

      const commentData = {
        pdfId: cleanPdfId,
        text: newComment,
        email: userEmail,
      };

      console.log("Sending comment data:", commentData); // Debug log

      const res = await addComment(commentData);
      console.log("Comment response:", res.data); // Debug log

      setComments((prevComments) => [res.data.comment, ...prevComments]);
      setNewComment("");
    } catch (error) {
      console.error("❌ Error adding comment:", error);
      alert("Failed to add comment. Please try again.");
    } finally {
      setIsCommenting(false);
    }
  };

  // Add this to format the comment date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container mx-auto flex space-x-6 p-6">
      {/* PDF Viewer */}
      <div className="w-2/3 border bg-white p-4 shadow-md">
        {error ? (
          <div className="p-4 text-red-500">
            <p>Error: {error}</p>
            <p className="mt-2 text-sm">
              Please check if the link is valid or try again later.
            </p>
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
            {numPages &&
              Array.from(new Array(numPages), (el, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  className="mb-4 shadow-sm"
                  onLoadError={(error) =>
                    console.error(`Error loading page ${index + 1}:`, error)
                  }
                />
              ))}
          </Document>
        ) : (
          <p className="text-gray-500">Loading PDF...</p>
        )}
      </div>

      {/* Updated Comments Section */}
      <div className="flex w-1/3 flex-col border bg-gray-100 p-4 shadow-md">
        <h2 className="mb-4 text-lg font-semibold">
          Comments ({comments.length})
        </h2>

        {/* Comment Input Form - Moved to top */}
        <form onSubmit={handleCommentSubmit} className="mb-4">
          <textarea
            placeholder="Write a comment..."
            className="min-h-[100px] w-full rounded-md border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            type="submit"
            className="mt-2 w-full rounded-md bg-blue-500 p-2 text-white transition-colors hover:bg-blue-600 disabled:bg-gray-400"
            disabled={!newComment.trim() || isCommenting}
          >
            {isCommenting ? "Adding..." : "Add Comment"}
          </button>
        </form>

        {/* Comments List */}
        <div className="max-h-[60vh] flex-1 overflow-y-auto rounded-md border bg-white p-3 shadow-inner">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div
                key={comment._id || index}
                className="border-b p-3 last:border-0 hover:bg-gray-50"
              >
                <div className="mb-1 flex items-center justify-between">
                  <strong
                    className={`${comment.user === userEmail ? "text-green-600" : "text-blue-600"}`}
                  >
                    {comment.user === userEmail
                      ? "You"
                      : comment.user || "Anonymous"}
                  </strong>
                  <span className="text-xs text-gray-500">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-gray-800">
                  {comment.text}
                </p>
              </div>
            ))
          ) : (
            <p className="py-4 text-center text-gray-600">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewPDF;
