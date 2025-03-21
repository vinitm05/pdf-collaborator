import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSharedPDF } from "../api/api";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

// ✅ Fix PDF.js worker issue (removes fake worker warning)
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ViewPDF = () => {
  const { pdfId } = useParams();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [error, setError] = useState(null);

  // ✅ Extract only the valid pdfId (before "-")
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
        console.log("✅ PDF URL:", res.data.pdf.fileUrl); // Debugging
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
        <Document
          file={pdfUrl}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1} />
          ))}
        </Document>
      ) : (
        <p className="text-gray-600">Loading PDF...</p>
      )}
    </div>
  );
};

export default ViewPDF;
