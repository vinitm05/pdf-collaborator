import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSharedPDF, addComment, getComments } from "../api/api";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

const ViewPDF = () => {
  const { pdfId } = useParams();
  const [pdf, setPdf] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [numPages, setNumPages] = useState(null);

  // Extract the correct pdfId (first part before "-")
  const cleanPdfId = pdfId.split("-")[0];

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        const res = await getSharedPDF(cleanPdfId);
        setPdf(res.data.pdf);
      } catch (error) {
        console.error("Error fetching PDF", error);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await getComments(cleanPdfId);
        setComments(res.data);
      } catch (error) {
        console.error("Error fetching comments", error);
      }
    };

    fetchPDF();
    fetchComments();
  }, [cleanPdfId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await addComment({ pdfId: cleanPdfId, text: newComment });
      setComments([...comments, { text: newComment, createdAt: new Date() }]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment", error);
    }
  };

  return (
    <div className="container mx-auto flex p-6">
      {/* PDF Viewer */}
      <div className="w-2/3 border p-4">
        {pdf ? (
          <Document
            file={pdf.fileUrl}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} />
            ))}
          </Document>
        ) : (
          <p className="text-red-500">Loading PDF...</p>
        )}
      </div>

      {/* Comments Section */}
      <div className="w-1/3 bg-gray-100 p-4">
        <h2 className="mb-2 text-lg">Comments</h2>
        <ul className="max-h-64 overflow-y-auto border p-2">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <li key={index} className="border-b p-2">
                {comment.text}
              </li>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </ul>
        <form onSubmit={handleCommentSubmit} className="mt-4">
          <input
            type="text"
            placeholder="Add a comment..."
            className="w-full border p-2"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            type="submit"
            className="mt-2 w-full bg-blue-500 p-2 text-white"
          >
            Comment
          </button>
        </form>
      </div>
    </div>
  );
};

export default ViewPDF;
