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
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-2xl font-bold">Your PDFs</h1>
      <div className="grid gap-4">
        {pdfs.map((pdf) => (
          <div
            key={pdf._id}
            className="flex items-center justify-between rounded-lg bg-white p-4 shadow"
          >
            <div>
              <h2 className="font-semibold">{pdf.fileName}</h2>
              <p className="text-sm text-gray-500">
                Shared with: {pdf.sharedWith.length} people
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/view/${pdf._id}`)}
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                View
              </button>
              <button
                onClick={() => handleShare(pdf._id, pdf.fileName)}
                className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
              >
                Share
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
