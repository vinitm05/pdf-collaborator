import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSharedPDF } from "../api/api";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const ViewPDF = () => {
  const { pdfId } = useParams();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState(null);

  const cleanPdfId = pdfId.split("-")[0];

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        console.log("🔹 Fetching PDF with ID:", cleanPdfId);
        const res = await getSharedPDF(cleanPdfId);

        if (!res.data || !res.data.pdf) {
          throw new Error("Invalid PDF data received");
        }

        setPdfUrl(res.data.pdf.fileUrl);
        console.log("✅ PDF URL:", res.data.pdf.fileUrl);
      } catch (error) {
        console.error("❌ Error fetching PDF:", error);
        setError("Failed to load PDF.");
      }
    };

    fetchPDF();
  }, [cleanPdfId]);

  return (
    <div className="container mx-auto p-6">
      <h2 className="mb-4 text-xl font-bold">PDF Viewer</h2>

      {error && <p className="text-red-500">{error}</p>}

      {pdfUrl ? (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@4.8.69/build/pdf.worker.min.js">
          <div className="border p-4">
            <Viewer fileUrl={pdfUrl} />
          </div>
        </Worker>
      ) : (
        <p className="text-gray-600">Loading PDF...</p>
      )}
    </div>
  );
};

export default ViewPDF;
