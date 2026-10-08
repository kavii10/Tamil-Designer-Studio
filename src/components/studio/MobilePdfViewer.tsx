import React, { useEffect, useRef, useState } from 'react';
import {
  GlobalWorkerOptions,
  getDocument,
  type PDFDocumentProxy,
  type RenderTask,
} from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { Lang } from '../../i18n/translations';

GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

interface MobilePdfViewerProps {
  url: string;
  title: string;
  lang: Lang;
}

export const MobilePdfViewer: React.FC<MobilePdfViewerProps> = ({ url, title, lang }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const renderTasks = useRef<RenderTask[]>([]);
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [width, setWidth] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const isTa = lang === 'ta';

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadingTask = getDocument(url);
    setPdf(null);
    setError(null);

    loadingTask.promise
      .then((loadedPdf) => {
        if (cancelled) {
          void loadedPdf.destroy();
          return;
        }
        setPdf(loadedPdf);
      })
      .catch((loadError: unknown) => {
        if (!cancelled) {
          console.error('Failed to load syllabus PDF in mobile viewer:', loadError);
          setError(
            isTa
              ? 'இந்த PDF-ஐ காட்ட முடியவில்லை. புதிய தாவலில் திறக்கவும் அல்லது பதிவிறக்கவும்.'
              : 'This PDF could not be displayed. Try opening or downloading it.'
          );
        }
      });

    return () => {
      cancelled = true;
      void loadingTask.destroy();
    };
  }, [url]);

  useEffect(() => {
    if (!pdf || width <= 0) return;

    let cancelled = false;
    renderTasks.current.forEach((task) => task.cancel());
    renderTasks.current = [];

    const renderPages = async () => {
      try {
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          const page = await pdf.getPage(pageNumber);
          if (cancelled) return;

          const canvas = canvasRefs.current[pageNumber - 1];
          const context = canvas?.getContext('2d');
          if (!canvas || !context) continue;

          const unscaledViewport = page.getViewport({ scale: 1 });
          const viewport = page.getViewport({
            scale: Math.min((width - 20) / unscaledViewport.width, 1.5),
          });
          canvas.width = Math.floor(viewport.width * pixelRatio);
          canvas.height = Math.floor(viewport.height * pixelRatio);
          canvas.style.width = `${viewport.width}px`;
          canvas.style.height = `${viewport.height}px`;

          const task = page.render({
            canvasContext: context,
            viewport,
            transform: pixelRatio === 1 ? undefined : [pixelRatio, 0, 0, pixelRatio, 0, 0],
          });
          renderTasks.current.push(task);
          await task.promise;
        }
      } catch (renderError) {
        if (!cancelled) {
          console.error('Failed to render syllabus PDF page:', renderError);
          setError(
            isTa
              ? 'சில PDF பக்கங்களைக் காட்ட முடியவில்லை. புதிய தாவலில் திறக்கவும் அல்லது பதிவிறக்கவும்.'
              : 'Some PDF pages could not be displayed. Try opening or downloading the PDF.'
          );
        }
      }
    };

    void renderPages();
    return () => {
      cancelled = true;
      renderTasks.current.forEach((task) => task.cancel());
      renderTasks.current = [];
    };
  }, [pdf, width, isTa]);

  return (
    <div
      ref={containerRef}
      className="flex-1 min-h-0 w-full overflow-y-auto overscroll-contain bg-[#393744] px-2 py-3"
      aria-label={`${title} PDF`}
    >
      {error ? (
        <p role="alert" className="mx-auto max-w-sm rounded-xl bg-white p-4 text-center text-sm text-red-700">
          {error}
        </p>
      ) : !pdf ? (
        <p className="pt-10 text-center text-sm text-white">
          {isTa ? 'PDF ஏற்றப்படுகிறது…' : 'Loading PDF…'}
        </p>
      ) : (
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-3">
          {Array.from({ length: pdf.numPages }, (_, index) => (
            <canvas
              key={`${url}-${index + 1}`}
              ref={(canvas) => {
                canvasRefs.current[index] = canvas;
              }}
              className="max-w-full bg-white shadow-lg"
            />
          ))}
        </div>
      )}
    </div>
  );
};
