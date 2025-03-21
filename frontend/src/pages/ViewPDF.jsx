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
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* PDF Viewer */}
        <div className="lg:w-2/3">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            {error ? (
              <div className="rounded-lg bg-red-50 p-4 text-red-600">
                <p className="font-medium">Error: {error}</p>
                <p className="mt-2 text-sm">
                  Please check if the link is valid or try again later.
                </p>
              </div>
            ) : pdfUrl ? (
              <Document
                file={pdfUrl}
                onLoadSuccess={({ numPages }) => {
                  console.log(
                    "PDF loaded successfully with",
                    numPages,
                    "pages",
                  );
                  setNumPages(numPages);
                }}
                onLoadError={(error) => {
                  console.error("Detailed PDF Load Error:", error);
                  setError(`Failed to load PDF: ${error.message}`);
                }}
                loading={
                  <div className="flex h-64 items-center justify-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
                  </div>
                }
              >
                {numPages &&
                  Array.from(new Array(numPages), (el, index) => (
                    <Page
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      className="mb-4 shadow-sm"
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  ))}
              </Document>
            ) : (
              <div className="flex h-64 items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="lg:w-1/3">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              Comments ({comments.length})
            </h2>

            {/* Comment Input */}
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <textarea
                placeholder="Write a comment..."
                className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                rows="4"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                type="submit"
                disabled={!newComment.trim() || isCommenting}
                className="mt-2 w-full rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-white transition-all hover:from-blue-600 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCommenting ? "Adding..." : "Add Comment"}
              </button>
            </form>

            {/* Comments List */}
            <div className="max-h-[600px] space-y-4 overflow-y-auto">
              {comments.map((comment, index) => (
                <div
                  key={comment._id || index}
                  className="rounded-lg bg-gray-50 p-4 transition-colors hover:bg-gray-100"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span
                      className={`font-medium ${
                        comment.user === localStorage.getItem("userEmail")
                          ? "text-blue-600"
                          : "text-gray-900"
                      }`}
                    >
                      {comment.user === localStorage.getItem("userEmail")
                        ? "You"
                        : comment.user}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap text-gray-700">
                    {comment.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPDF;
