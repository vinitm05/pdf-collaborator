import { useEffect, useState } from "react";
import { getUserPDFs, sharePDF } from "../api/api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [pdfs, setPdfs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return navigate("/");

    const fetchPDFs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await getUserPDFs(token);
        setPdfs(res.data);
      } catch (error) {
        console.error("Error fetching PDFs:", error);
        setError("Failed to load PDFs. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPDFs();
  }, [navigate, token]);

  const handleShare = async (pdfId, fileName) => {
    const emails = prompt("Enter emails (comma-separated) to share:");
    if (!emails) return;

    try {
      const res = await sharePDF({ pdfId, emails: emails.split(",") }, token);
      alert(`PDF Shared! Link: ${res.data.link}`);
    } catch (error) {
      console.error("Error sharing PDF", error);
    }
  };

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (isLoading) {
    return <div className="p-4">Loading your PDFs...</div>;
  }

  return (
    <div className="container mx-auto min-h-screen max-w-4xl px-4 py-8">
      <div className="mb-8 flex flex-col items-start justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Your PDFs
        </h2>
        <button
          onClick={() => navigate("/upload")}
          className="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white shadow-lg transition hover:from-blue-600 hover:to-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Upload PDF</span>
        </button>
      </div>

      {pdfs.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
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
              d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No PDFs yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by uploading your first PDF document
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate("/upload")}
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
            >
              Upload PDF
            </button>
          </div>
        </div>
      ) : (
        <ul className="space-y-4">
          {pdfs.map((pdf) => (
            <li
              key={pdf._id}
              className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-col justify-between p-4 sm:flex-row sm:items-center">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <a
                      href={pdf.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-gray-900 hover:text-blue-600"
                    >
                      {pdf.fileName}
                    </a>
                    <p className="text-sm text-gray-500">
                      {new Date(
                        pdf.createdAt || Date.now(),
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex sm:mt-0">
                  <a
                    href={pdf.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mr-2 inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
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
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    View
                  </a>
                  <button
                    onClick={() => handleShare(pdf._id, pdf.fileName)}
                    className="inline-flex items-center rounded-md bg-green-100 px-3 py-2 text-sm font-medium text-green-700 transition hover:bg-green-200"
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
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                    Share
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
