import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  ChevronRight,
  ChevronLeft,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Download,
  Loader2,
} from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

interface PDFViewerProps {
  url: string;
  allowDownload?: boolean;
  onFirstView?: () => void;
}

export function PDFViewer({ url, allowDownload = true, onFirstView }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.1);
  const [fullscreen, setFullscreen] = useState(false);
  const [hasTrackedView, setHasTrackedView] = useState(false);

  function handleLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    if (!hasTrackedView) {
      setHasTrackedView(true);
      onFirstView?.();
    }
  }

  return (
    <div className={`rounded-2xl border border-gray-light/60 bg-white shadow-soft ${fullscreen ? "fixed inset-0 z-50 rounded-none" : ""}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-light/60 p-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            disabled={pageNumber <= 1}
            className="rounded-lg p-1.5 hover:bg-gray-light/50 disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <span className="text-sm text-dark-light">
            صفحة {pageNumber} من {numPages || "-"}
          </span>
          <button
            onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
            disabled={pageNumber >= numPages}
            className="rounded-lg p-1.5 hover:bg-gray-light/50 disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button onClick={() => setScale((s) => Math.max(0.5, s - 0.15))} className="rounded-lg p-1.5 hover:bg-gray-light/50">
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="w-10 text-center text-xs text-dark-light">{Math.round(scale * 100)}%</span>
          <button onClick={() => setScale((s) => Math.min(2.5, s + 0.15))} className="rounded-lg p-1.5 hover:bg-gray-light/50">
            <ZoomIn className="h-4 w-4" />
          </button>
          <button onClick={() => setFullscreen((f) => !f)} className="rounded-lg p-1.5 hover:bg-gray-light/50">
            {fullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </button>
          {allowDownload && (
            <a href={url} download target="_blank" rel="noreferrer" className="rounded-lg p-1.5 hover:bg-gray-light/50">
              <Download className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      {/* PDF Content */}
      <div className={`flex justify-center overflow-auto bg-gray-light/20 p-4 ${fullscreen ? "h-[calc(100vh-64px)]" : "max-h-[70vh]"}`}>
        <Document
          file={url}
          onLoadSuccess={handleLoadSuccess}
          loading={
            <div className="flex items-center gap-2 py-20 text-dark-light">
              <Loader2 className="h-5 w-5 animate-spin" /> جاري تحميل الملف...
            </div>
          }
          error={<p className="py-20 text-primary">تعذر تحميل الملف، برجاء المحاولة مرة أخرى</p>}
        >
          <Page pageNumber={pageNumber} scale={scale} renderAnnotationLayer renderTextLayer />
        </Document>
      </div>
    </div>
  );
}
