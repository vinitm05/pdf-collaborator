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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Your PDFs</h1>
        <button
          onClick={() => navigate("/upload")}
          className="rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 text-white transition-all hover:from-blue-600 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
        >
          Upload New PDF
        </button>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="rounded-lg bg-red-50 p-4 text-red-600">{error}</div>
      ) : pdfs.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mb-4 text-gray-400">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">No PDFs yet</h3>
          <p className="mt-1 text-gray-500">
            Get started by uploading your first PDF
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pdfs.map((pdf) => (
            <div
              key={pdf._id}
              className="rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-lg bg-blue-50 p-2">
                      <svg
                        className="h-6 w-6 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="max-w-[200px] truncate text-lg font-medium text-gray-900">
                      {pdf.fileName}
                    </h3>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Shared with {pdf.sharedWith.length} people
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/view/${pdf._id}`)}
                      className="rounded-lg px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleShare(pdf._id, pdf.fileName)}
                      className="rounded-lg px-3 py-2 text-sm font-medium text-green-600 transition-colors hover:bg-green-50"
                    >
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
