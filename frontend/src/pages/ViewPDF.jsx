import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSharedPDF, addComment, getComments } from "../api/api";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";

// Make sure to set the worker source - replace with your actual path
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const ViewPDF = () => {
  const { pdfId } = useParams();
  const [pdf, setPdf] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isCommenting, setIsCommenting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [pdfRes, commentsRes] = await Promise.all([
          getSharedPDF(pdfId),
          getComments(pdfId),
        ]);

        setPdf(pdfRes.data.pdf);
        setComments(commentsRes.data);
      } catch (error) {
        console.error("Error fetching data", error);
        setError("Failed to load PDF or comments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [pdfId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsCommenting(true);
    try {
      const res = await addComment({ pdfId, text: newComment });
      // Assuming the response includes the created comment with its id and timestamp
      setComments([
        ...comments,
        res.data || { text: newComment, createdAt: new Date().toISOString() },
      ]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment", error);
      setError("Failed to add comment");
    } finally {
      setIsCommenting(false);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  const changePage = (offset) => {
    setPageNumber((prevPageNumber) => {
      const newPageNumber = prevPageNumber + offset;
      return Math.min(Math.max(1, newPageNumber), numPages || 1);
    });
  };

  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  return (
    <div className="container mx-auto min-h-screen px-4 py-8 lg:px-8">
      <div className="flex flex-col space-y-6 lg:flex-row lg:space-y-0 lg:space-x-6">
        {/* PDF Viewer */}
        <div className="w-full rounded-lg bg-white p-4 shadow-lg lg:w-2/3">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">
              {pdf ? pdf.fileName : "Loading PDF..."}
            </h1>
            {pdf && (
              <a
                href={pdf.fileUrl}
                download
                className="flex items-center rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100"
              >
                <svg
                  className="mr-1.5 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download
              </a>
            )}
          </div>

          <div className="flex min-h-[60vh] flex-col items-center justify-center border border-gray-200 bg-gray-50">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-500"></div>
                <p className="mt-4 text-sm text-gray-600">Loading PDF...</p>
              </div>
            ) : error ? (
              <div className="py-12 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <p className="mt-2 text-lg font-medium text-gray-900">
                  Failed to load PDF
                </p>
                <p className="mt-1 text-sm text-gray-500">{error}</p>
              </div>
            ) : pdf ? (
              <>
                <Document
                  file={pdf.fileUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading={
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-500"></div>
                      <p className="mt-4 text-sm text-gray-600">
                        Loading PDF content...
                      </p>
                    </div>
                  }
                  error={
                    <div className="py-12 text-center">
                      <p className="text-red-500">
                        Failed to load PDF document
                      </p>
                    </div>
                  }
                >
                  <Page
                    pageNumber={pageNumber}
                    renderTextLayer={false}
                    width={Math.min(600, window.innerWidth - 80)}
                  />
                </Document>
              </>
            ) : null}
          </div>

          {pdf && numPages && (
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={previousPage}
                disabled={pageNumber <= 1}
                className={`rounded-md border px-4 py-2 text-sm font-medium transition ${
                  pageNumber <= 1
                    ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>

              <p className="text-sm text-gray-700">
                Page <span className="font-medium">{pageNumber}</span> of{" "}
                <span className="font-medium">{numPages}</span>
              </p>

              <button
                onClick={nextPage}
                disabled={pageNumber >= numPages}
                className={`rounded-md border px-4 py-2 text-sm font-medium transition ${
                  pageNumber >= numPages
                    ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="w-full lg:w-1/3">
          <div className="sticky top-20 rounded-lg bg-white shadow-lg">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">Comments</h2>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-6">
              {comments.length === 0 ? (
                <div className="py-6 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  <p className="mt-2 text-sm font-medium text-gray-900">
                    No comments yet
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Be the first to comment on this document
                  </p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {comments.map((comment, index) => (
                    <li
                      key={comment._id || index}
                      className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white">
                            {comment.userName
                              ? comment.userName.charAt(0).toUpperCase()
                              : "U"}
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {comment.userName || "User"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(comment.createdAt)}
                          </p>
                          <p className="mt-2 text-sm whitespace-pre-wrap text-gray-700">
                            {comment.text}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-gray-200 p-6">
              <form onSubmit={handleCommentSubmit}>
                <div className="mb-3">
                  <label
                    htmlFor="comment"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Add a comment
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="comment"
                      rows={3}
                      placeholder="What are your thoughts on this document?"
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isCommenting || !newComment.trim()}
                    className={`inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${
                      isCommenting || !newComment.trim()
                        ? "cursor-not-allowed bg-blue-300"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {isCommenting ? (
                      <>
                        <svg
                          className="mr-2 h-4 w-4 animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Posting...
                      </>
                    ) : (
                      "Post Comment"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPDF;
