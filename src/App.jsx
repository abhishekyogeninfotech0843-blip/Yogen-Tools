import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import "./App.css";

function App() {
  const [activeTool, setActiveTool] = useState("dashboard");
  const [activeSection, setActiveSection] = useState("home");
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);

  // =========================================================
  // TEXT TO PDF
  // =========================================================

  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [fontSize, setFontSize] = useState(14);
  const [alignment, setAlignment] = useState("left");
  const [margin, setMargin] = useState(20);

  // =========================================================
  // IMAGE TO PDF
  // =========================================================

  const [images, setImages] = useState([]);
  const [imageMargin, setImageMargin] = useState(15);

  // =========================================================
  // IMAGE RESIZER
  // =========================================================

  const [resizeFile, setResizeFile] = useState(null);
  const [resizePreview, setResizePreview] = useState("");
  const [resizeOriginalDimensions, setResizeOriginalDimensions] =
    useState(null);
  const [resizeWidth, setResizeWidth] = useState("");
  const [resizeHeight, setResizeHeight] = useState("");
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [resizeFormat, setResizeFormat] = useState("image/jpeg");
  const [resizeQuality, setResizeQuality] = useState(0.85);
  const [resizeResult, setResizeResult] = useState(null);
  const [resizeError, setResizeError] = useState("");

  // =========================================================
  // PDF TO TEXT
  // =========================================================

  const [pdfTextFile, setPdfTextFile] = useState(null);
  const [extractedPdfText, setExtractedPdfText] = useState("");
  const [pdfTextStatus, setPdfTextStatus] = useState("idle");
  const [pdfTextError, setPdfTextError] = useState("");

  // =========================================================
  // OCR SCANNERS
  // =========================================================

  const [ocrLanguage, setOcrLanguage] = useState("eng");
  const [imageScanFiles, setImageScanFiles] = useState([]);
  const [imageScanText, setImageScanText] = useState("");
  const [imageScanStatus, setImageScanStatus] = useState("idle");
  const [imageScanProgress, setImageScanProgress] = useState(0);
  const [imageScanError, setImageScanError] = useState("");
  const [scannedPdfFile, setScannedPdfFile] = useState(null);
  const [scannedPdfText, setScannedPdfText] = useState("");
  const [scannedPdfStatus, setScannedPdfStatus] = useState("idle");
  const [scannedPdfProgress, setScannedPdfProgress] = useState(0);
  const [scannedPdfError, setScannedPdfError] = useState("");

  // =========================================================
  // CUSTOM FORM BUILDER
  // =========================================================

  const formTemplates = {
    school: {
      title: "School Admission Form",
      description: "Please complete the student admission details.",
      fields: [
        { label: "Student full name", type: "text", required: true },
        { label: "Date of birth", type: "date", required: true },
        { label: "Applying for class", type: "text", required: true },
        { label: "Parent / guardian name", type: "text", required: true },
        { label: "Parent email", type: "email", required: true },
        { label: "Contact phone", type: "tel", required: true },
        { label: "Home address", type: "textarea", required: true },
        { label: "Previous school", type: "text", required: false },
      ],
    },
    event: {
      title: "Event Registration Form",
      description: "Register your details for this event.",
      fields: [
        { label: "Full name", type: "text", required: true },
        { label: "Email address", type: "email", required: true },
        { label: "Phone number", type: "tel", required: false },
        { label: "Number of attendees", type: "number", required: true },
        { label: "Dietary or accessibility needs", type: "textarea", required: false },
      ],
    },
    contact: {
      title: "Contact Form",
      description: "Send us a message and we will get back to you.",
      fields: [
        { label: "Your name", type: "text", required: true },
        { label: "Email address", type: "email", required: true },
        { label: "Subject", type: "text", required: true },
        { label: "Message", type: "textarea", required: true },
      ],
    },
    feedback: {
      title: "Feedback Form",
      description: "We appreciate your feedback.",
      fields: [
        { label: "Your name", type: "text", required: false },
        { label: "Email address", type: "email", required: false },
        { label: "Rating (1-5)", type: "number", required: true },
        { label: "Your feedback", type: "textarea", required: true },
        { label: "May we contact you?", type: "checkbox", required: false },
      ],
    },
  };

  const [selectedFormTemplate, setSelectedFormTemplate] =
    useState("school");
  const [formTitle, setFormTitle] = useState(
    formTemplates.school.title,
  );
  const [formDescription, setFormDescription] = useState(
    formTemplates.school.description,
  );
  const [customFormFields, setCustomFormFields] = useState(() =>
    formTemplates.school.fields.map((field, index) => ({
      ...field,
      id: `school-${index}`,
      options: "",
      value: "",
    })),
  );

  // =========================================================
  // QR CODE
  // =========================================================

  const [qrText, setQrText] = useState("");
  const [qrPreview, setQrPreview] = useState("");
  const [qrSize, setQrSize] = useState(400);

  // =========================================================
  // INVOICE
  // =========================================================

  const getToday = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(
      now.getMonth() + 1,
    ).padStart(2, "0");
    const day = String(
      now.getDate(),
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const getInvoiceNumber = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(
      now.getMonth() + 1,
    ).padStart(2, "0");
    const day = String(
      now.getDate(),
    ).padStart(2, "0");

    return `YOGEN-${year}${month}${day}-001`;
  };

  const [invoiceNumber, setInvoiceNumber] =
    useState(getInvoiceNumber());

  const [invoiceDate, setInvoiceDate] =
    useState(getToday());

  const [dueDate, setDueDate] =
    useState(getToday());

  const [clientName, setClientName] =
    useState("");

  const [clientEmail, setClientEmail] =
    useState("");

  const [clientPhone, setClientPhone] =
    useState("");

  const [clientAddress, setClientAddress] =
    useState("");

  const [paymentStatus, setPaymentStatus] =
    useState("Unpaid");

  const [invoiceDiscount, setInvoiceDiscount] =
    useState(0);

  const [invoiceTax, setInvoiceTax] =
    useState(18);

  const [invoiceNotes, setInvoiceNotes] =
    useState("");

  const [invoiceItems, setInvoiceItems] =
    useState(() => [
      {
        id: Date.now(),
        description: "",
        quantity: 1,
        rate: 0,
      },
    ]);

  // =========================================================
  // RESUME BUILDER
  // =========================================================

  const [resumeData, setResumeData] = useState({
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    experience: "",
    education: "",
    skills: "",
  });

  // =========================================================
  // TEXT TO SPEECH
  // =========================================================

  const [speechText, setSpeechText] = useState("");
  const [speechVoices, setSpeechVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [speechRate, setSpeechRate] = useState(1);
  const [speechPitch, setSpeechPitch] = useState(1);
  const [speechStatus, setSpeechStatus] = useState("idle");
  const [speechMessage, setSpeechMessage] = useState("");
  const speechSupported =
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    "SpeechSynthesisUtterance" in window;

  useEffect(() => {
    if (!speechSupported) {
      return undefined;
    }

    const loadVoices = () => {
      const availableVoices =
        window.speechSynthesis.getVoices();

      setSpeechVoices(availableVoices);
      setSelectedVoice((currentVoice) =>
        currentVoice ||
        availableVoices[0]?.voiceURI ||
        "",
      );
    };

    loadVoices();
    window.speechSynthesis.addEventListener(
      "voiceschanged",
      loadVoices,
    );
    const voiceLoadTimer = window.setTimeout(loadVoices, 0);

    return () => {
      window.clearTimeout(voiceLoadTimer);
      window.speechSynthesis.removeEventListener(
        "voiceschanged",
        loadVoices,
      );
      window.speechSynthesis.cancel();
    };
  }, [speechSupported]);

  useEffect(
    () => () => {
      if (resizePreview) {
        URL.revokeObjectURL(resizePreview);
      }
    },
    [resizePreview],
  );

  useEffect(
    () => () => {
      if (resizeResult?.url) {
        URL.revokeObjectURL(resizeResult.url);
      }
    },
    [resizeResult?.url],
  );

  // =========================================================
  // TOOLS
  // =========================================================

  const tools = [
    {
      id: "text-pdf",
      name: "Text to PDF",
      description:
        "Convert normal text into a clean PDF document.",
      icon: "📄",
      color: "blue",
      available: true,
    },
    {
      id: "image-pdf",
      name: "Image to PDF",
      description:
        "Combine images and create a PDF instantly.",
      icon: "🖼️",
      color: "purple",
      available: true,
    },
    {
      id: "invoice",
      name: "Invoice Generator",
      description:
        "Create professional invoices for your business.",
      icon: "🧾",
      color: "green",
      available: true,
    },
    {
      id: "resume",
      name: "Resume Builder",
      description:
        "Build a professional resume and export it to PDF.",
      icon: "📑",
      color: "orange",
      available: true,
    },
    {
      id: "qr",
      name: "QR Code Generator",
      description:
        "Generate QR codes for websites, text and links.",
      icon: "🔲",
      color: "pink",
      available: true,
    },
    {
      id: "speech",
      name: "Text to Speech",
      description:
        "Convert written text into natural speech.",
      icon: "🔊",
      color: "cyan",
      available: true,
    },
    {
      id: "image-resize",
      name: "Image Resizer",
      description:
        "Resize image dimensions and compress JPG, PNG, or WebP files.",
      icon: "📐",
      color: "orange",
      available: true,
    },
    {
      id: "pdf-text",
      name: "PDF to Text",
      description:
        "Extract selectable text from PDF documents in your browser.",
      icon: "📝",
      color: "blue",
      available: true,
    },
    {
      id: "image-ocr-pdf",
      name: "Scan Image to PDF",
      description:
        "Recognize text in a photo or scan and save it as a PDF.",
      icon: "🔎",
      color: "purple",
      available: true,
    },
    {
      id: "scanned-pdf-text",
      name: "Scanned PDF to Text",
      description:
        "Use OCR to extract text from scanned PDF pages.",
      icon: "📑",
      color: "cyan",
      available: true,
    },
    {
      id: "form-builder",
      name: "Form Builder",
      description:
        "Customize school, event, contact, and other forms.",
      icon: "📋",
      color: "green",
      available: true,
    },
    {
      id: "ai-pdf",
      name: "AI PDF Generator",
      description:
        "Create documents and PDFs using AI.",
      icon: "🤖",
      color: "dark",
      available: false,
    },
  ];

  // =========================================================
  // TOOL NAVIGATION
  // =========================================================

  const openTool = (toolId) => {
    const tool = tools.find(
      (item) => item.id === toolId,
    );

    if (!tool || !tool.available) {
      setActiveSection("tools");
      setActiveTool("coming-soon");
      setToolsMenuOpen(false);
      return;
    }

    setActiveSection("tools");
    setActiveTool(toolId);
    setToolsMenuOpen(false);
  };

  const goHome = () => {
    setActiveSection("home");
    setActiveTool("dashboard");
    setToolsMenuOpen(false);
  };

  const showTools = () => {
    setActiveSection("tools");
    setActiveTool("tools");
    setToolsMenuOpen(false);
  };

  // =========================================================
  // TEXT TO PDF
  // =========================================================

  const handleDownloadTextPDF = () => {
    if (!text.trim()) {
      alert(
        "Please enter some text first.",
      );
      return;
    }

    try {
      const doc = new jsPDF();

      const pageWidth =
        doc.internal.pageSize.getWidth();

      const pageHeight =
        doc.internal.pageSize.getHeight();

      const usableWidth =
        pageWidth - margin * 2;

      let y = margin;

      if (title.trim()) {
        doc.setFont(
          "helvetica",
          "bold",
        );

        doc.setFontSize(
          Number(fontSize) + 5,
        );

        let titleX = margin;

        if (alignment === "center") {
          titleX = pageWidth / 2;
        }

        if (alignment === "right") {
          titleX =
            pageWidth - margin;
        }

        doc.text(
          title,
          titleX,
          y,
          {
            align: alignment,
          },
        );

        y += 12;
      }

      doc.setFont(
        "helvetica",
        "normal",
      );

      doc.setFontSize(
        Number(fontSize),
      );

      const lines =
        doc.splitTextToSize(
          text,
          usableWidth,
        );

      for (
        let i = 0;
        i < lines.length;
        i++
      ) {
        if (
          y >
          pageHeight - margin
        ) {
          doc.addPage();
          y = margin;
        }

        let textX = margin;

        if (alignment === "center") {
          textX = pageWidth / 2;
        }

        if (alignment === "right") {
          textX =
            pageWidth - margin;
        }

        doc.text(
          lines[i],
          textX,
          y,
          {
            align: alignment,
          },
        );

        y +=
          Number(fontSize) *
          0.55;
      }

      doc.save(
        "yogen-document.pdf",
      );
    } catch (error) {
      console.error(
        "TEXT PDF ERROR:",
        error,
      );

      alert(
        "Unable to create PDF.",
      );
    }
  };

  const clearTextDocument = () => {
    setTitle("");
    setText("");
  };

  // =========================================================
  // IMAGE SELECT
  // =========================================================

  const handleResizeImageSelect = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setResizeError("Choose a JPG, PNG, or WebP image.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const imageElement = new Image();

    imageElement.onload = () => {
      if (
        imageElement.naturalWidth * imageElement.naturalHeight >
        60000000
      ) {
        URL.revokeObjectURL(previewUrl);
        setResizeError(
          "This image is too large to safely process in the browser.",
        );
        return;
      }

      setResizeFile(file);
      setResizePreview(previewUrl);
      setResizeOriginalDimensions({
        width: imageElement.naturalWidth,
        height: imageElement.naturalHeight,
      });
      setResizeWidth(String(imageElement.naturalWidth));
      setResizeHeight(String(imageElement.naturalHeight));
      setResizeFormat(
        file.type === "image/png" ? "image/png" : "image/jpeg",
      );
      setResizeResult(null);
      setResizeError("");
    };

    imageElement.onerror = () => {
      URL.revokeObjectURL(previewUrl);
      setResizeError("The selected image could not be opened.");
    };

    imageElement.src = previewUrl;
  };

  const handleResizeWidthChange = (value) => {
    setResizeWidth(value);
    setResizeResult(null);
    if (lockAspectRatio && resizeFile && Number(value) > 0) {
      const image = new Image();
      image.onload = () => {
        setResizeHeight(
          String(
            Math.max(
              1,
              Math.round(
                (Number(value) * image.naturalHeight) /
                  image.naturalWidth,
              ),
            ),
          ),
        );
      };
      image.src = resizePreview;
    }
  };

  const handleResizeHeightChange = (value) => {
    setResizeHeight(value);
    setResizeResult(null);
    if (lockAspectRatio && resizeFile && Number(value) > 0) {
      const image = new Image();
      image.onload = () => {
        setResizeWidth(
          String(
            Math.max(
              1,
              Math.round(
                (Number(value) * image.naturalWidth) /
                  image.naturalHeight,
              ),
            ),
          ),
        );
      };
      image.src = resizePreview;
    }
  };

  const handleResizeImage = async () => {
    const width = Number(resizeWidth);
    const height = Number(resizeHeight);

    if (!resizeFile || !resizePreview) {
      setResizeError("Select an image before resizing.");
      return;
    }

    if (
      !Number.isInteger(width) ||
      !Number.isInteger(height) ||
      width < 1 ||
      height < 1 ||
      width > 12000 ||
      height > 12000 ||
      width * height > 60000000
    ) {
      setResizeError(
        "Enter valid dimensions. Each side must be at most 12,000 px and the image must be at most 60 megapixels.",
      );
      return;
    }

    setResizeError("");

    try {
      const imageElement = new Image();
      imageElement.src = resizePreview;
      await new Promise((resolve, reject) => {
        imageElement.onload = resolve;
        imageElement.onerror = reject;
      });

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Canvas is not available in this browser.");
      }

      if (resizeFormat !== "image/png") {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, width, height);
      }
      context.drawImage(imageElement, 0, 0, width, height);

      const blob = await new Promise((resolve) => {
        canvas.toBlob(
          resolve,
          resizeFormat,
          Number(resizeQuality),
        );
      });

      if (!blob) {
        throw new Error("The browser could not create the resized image.");
      }
      if (blob.type !== resizeFormat) {
        throw new Error(
          `This browser cannot export ${resizeFormat.replace("image/", "").toUpperCase()} images.`,
        );
      }

      setResizeResult({
        url: URL.createObjectURL(blob),
        size: blob.size,
        width,
        height,
        type: blob.type,
      });
    } catch (error) {
      console.error("IMAGE RESIZE ERROR:", error);
      setResizeError(
        error.message ||
          "Unable to resize this image. Please try another file.",
      );
    }
  };

  const handleDownloadResizedImage = () => {
    if (!resizeResult) {
      return;
    }

    const extension =
      resizeResult.type === "image/png"
        ? "png"
        : resizeResult.type === "image/webp"
          ? "webp"
          : "jpg";
    const link = document.createElement("a");
    link.href = resizeResult.url;
    link.download = `resized-image.${extension}`;
    link.click();
  };

  // =========================================================
  // PDF TO TEXT
  // =========================================================

  const handleExtractPdfText = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setPdfTextError("Choose a PDF file.");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setPdfTextError("PDF files must be smaller than 50 MB.");
      return;
    }

    setPdfTextFile(file);
    setExtractedPdfText("");
    setPdfTextError("");
    setPdfTextStatus("loading");

    let pdfDocument;
    let pdfLoadingTask;

    try {
      const [pdfjsLib, pdfWorker] = await Promise.all([
        import("pdfjs-dist"),
        import("pdfjs-dist/build/pdf.worker.min.mjs?url"),
      ]);
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker.default;
      const pdfData = new Uint8Array(await file.arrayBuffer());
      pdfLoadingTask = pdfjsLib.getDocument({
        data: pdfData,
      });
      pdfDocument = await pdfLoadingTask.promise;
      const pages = [];

      for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber += 1) {
        const page = await pdfDocument.getPage(pageNumber);
        const textContent = await page.getTextContent();
        const lines = [];
        let currentLine = "";
        let previousY = null;

        textContent.items.forEach((item) => {
          if (!("str" in item)) {
            return;
          }

          const itemY = item.transform?.[5];
          const startsNewLine =
            previousY !== null &&
            typeof itemY === "number" &&
            Math.abs(previousY - itemY) > 2;

          if (startsNewLine && currentLine.trim()) {
            lines.push(currentLine.trim());
            currentLine = "";
          }

          if (item.str) {
            currentLine += `${currentLine ? " " : ""}${item.str}`;
          }
          if (item.hasEOL && currentLine.trim()) {
            lines.push(currentLine.trim());
            currentLine = "";
          }

          if (typeof itemY === "number") {
            previousY = itemY;
          }
        });

        if (currentLine.trim()) {
          lines.push(currentLine.trim());
        }
        pages.push(
          `--- Page ${pageNumber} ---\n${lines.join("\n")}`.trim(),
        );
      }

      const result = pages.join("\n\n");
      if (!result.replace(/--- Page \d+ ---/g, "").trim()) {
        throw new Error(
          "No selectable text was found. This PDF may contain scanned images and needs OCR.",
        );
      }

      await pdfLoadingTask.destroy();
      pdfLoadingTask = null;
      pdfDocument = null;
      setExtractedPdfText(result);
      setPdfTextStatus("done");
    } catch (error) {
      console.error("PDF TEXT EXTRACTION ERROR:", error);
      setPdfTextStatus("error");
      setPdfTextError(
        error.message ||
          "Unable to read this PDF. It may be damaged or password-protected.",
      );
      if (pdfLoadingTask) {
        try {
          await pdfLoadingTask.destroy();
        } catch (cleanupError) {
          console.error("PDF WORKER CLEANUP ERROR:", cleanupError);
        }
      }
    }
  };

  const handleDownloadExtractedText = () => {
    if (!extractedPdfText) {
      return;
    }

    const blob = new Blob([extractedPdfText], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${pdfTextFile?.name.replace(/\.pdf$/i, "") || "extracted-text"}.txt`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleImageScanSelection = (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";

    if (!files.length) {
      return;
    }

    const validFiles = [];
    let totalSize = 0;
    files.forEach((file) => {
      if (
        !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
        file.size > 15 * 1024 * 1024 ||
        validFiles.length >= 10 ||
        totalSize + file.size > 40 * 1024 * 1024
      ) {
        return;
      }
      validFiles.push(file);
      totalSize += file.size;
    });

    if (validFiles.length !== files.length) {
      setImageScanError(
        "Choose up to 10 JPG, PNG, or WebP images (15 MB each, 40 MB total).",
      );
    } else {
      setImageScanError("");
    }

    setImageScanFiles(validFiles);
    setImageScanText("");
    setImageScanStatus("idle");
    setImageScanProgress(0);
  };

  const downloadOcrPdf = (content, filename) => {
    const pageWidth = 1240;
    const pageHeight = 1754;
    const margin = 96;
    const lineHeight = 39;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Canvas is not available in this browser.");
    }

    canvas.width = pageWidth;
    canvas.height = pageHeight;
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });
    let y = margin;
    let pageStarted = false;
    let isFirstPage = true;

    const startPage = () => {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, pageWidth, pageHeight);
      context.fillStyle = "#0f172a";
      context.font = '28px Arial, "Noto Sans Devanagari", sans-serif';
      y = margin;
      pageStarted = true;
    };

    const savePage = () => {
      if (!pageStarted) {
        return;
      }
      const pageImage = canvas.toDataURL("image/jpeg", 0.92);
      if (!isFirstPage) {
        doc.addPage();
      }
      isFirstPage = false;
      doc.addImage(pageImage, "JPEG", 0, 0, 210, 297, undefined, "FAST");
      pageStarted = false;
    };

    const drawLine = (line) => {
      if (y > pageHeight - margin) {
        savePage();
        startPage();
      }
      context.fillText(line, margin, y);
      y += lineHeight;
    };

    startPage();
    content.split(/\r?\n/).forEach((paragraph) => {
      if (!paragraph.trim()) {
        y += lineHeight * 0.45;
        return;
      }

      const words = paragraph.split(/\s+/);
      let line = "";
      words.forEach((word) => {
        const candidate = line ? `${line} ${word}` : word;
        if (
          line &&
          context.measureText(candidate).width > pageWidth - margin * 2
        ) {
          drawLine(line);
          line = word;
        } else {
          line = candidate;
        }
      });
      if (line) {
        drawLine(line);
      }
    });
    savePage();
    doc.save(filename);
    canvas.width = 0;
    canvas.height = 0;
  };

  const handleScanImagesToPdf = async () => {
    if (!imageScanFiles.length) {
      setImageScanError("Select at least one image to scan.");
      return;
    }

    let worker;
    let currentFileIndex = 0;
    setImageScanStatus("loading");
    setImageScanProgress(0);
    setImageScanError("");

    try {
      const { createWorker } = await import("tesseract.js");
      worker = await createWorker(ocrLanguage, 1, {
        logger: (message) => {
          if (message.status === "recognizing text") {
            setImageScanStatus("scanning");
            const fileProgress =
              (currentFileIndex + Math.max(0, message.progress)) /
              imageScanFiles.length;
            setImageScanProgress(
              Math.min(100, Math.round(fileProgress * 100)),
            );
          }
        },
      });

      const results = [];
      for (let index = 0; index < imageScanFiles.length; index += 1) {
        const result = await worker.recognize(imageScanFiles[index]);
        results.push({
          name: imageScanFiles[index].name,
          text: result.data.text.trim(),
        });
        currentFileIndex = index + 1;
        setImageScanProgress(
          Math.round(((index + 1) / imageScanFiles.length) * 100),
        );
      }

      const nonEmptyResults = results.filter((item) => item.text);
      if (!nonEmptyResults.length) {
        throw new Error(
          "No text was recognized. Try a clearer, well-lit image.",
        );
      }

      setImageScanText(
        nonEmptyResults
          .map((item) => `${item.name}\n${item.text}`)
          .join("\n\n"),
      );
      setImageScanStatus("done");
      setImageScanProgress(100);
    } catch (error) {
      console.error("IMAGE OCR ERROR:", error);
      setImageScanStatus("error");
      setImageScanError(
        error.message ||
          "Unable to scan these images. Check your connection and try again.",
      );
    } finally {
      if (worker) {
        try {
          await worker.terminate();
        } catch (error) {
          console.error("OCR WORKER CLEANUP ERROR:", error);
        }
      }
    }
  };

  const handleDownloadImageScanPdf = () => {
    if (!imageScanText) {
      return;
    }
    try {
      downloadOcrPdf(imageScanText, "scanned-text.pdf");
    } catch (error) {
      console.error("OCR PDF EXPORT ERROR:", error);
      setImageScanError(
        error.message || "Unable to create the scanned text PDF.",
      );
    }
  };

  const handleDownloadImageScanText = () => {
    if (!imageScanText) {
      return;
    }
    const blob = new Blob([imageScanText], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "scanned-text.txt";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleScannedPdfSelection = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setScannedPdfError("Choose a PDF file.");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setScannedPdfError("PDF files must be smaller than 50 MB.");
      return;
    }

    setScannedPdfFile(file);
    setScannedPdfText("");
    setScannedPdfStatus("idle");
    setScannedPdfProgress(0);
    setScannedPdfError("");
  };

  const handleScanPdfToText = async () => {
    if (!scannedPdfFile) {
      setScannedPdfError("Select a scanned PDF to process.");
      return;
    }

    let worker;
    let pdfDocument;
    let pdfLoadingTask;
    setScannedPdfStatus("loading");
    setScannedPdfProgress(0);
    setScannedPdfError("");

    try {
      const [pdfjsLib, pdfWorker, tesseract] = await Promise.all([
        import("pdfjs-dist"),
        import("pdfjs-dist/build/pdf.worker.min.mjs?url"),
        import("tesseract.js"),
      ]);
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker.default;
      pdfLoadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(await scannedPdfFile.arrayBuffer()),
      });
      pdfDocument = await pdfLoadingTask.promise;

      if (pdfDocument.numPages > 25) {
        throw new Error(
          "This tool supports up to 25 pages per PDF. Split the document and scan each part.",
        );
      }

      let currentPageNumber = 1;
      worker = await tesseract.createWorker(ocrLanguage, 1, {
        logger: (message) => {
          if (message.status === "recognizing text") {
            const pageProgress =
              (currentPageNumber - 1 + (message.progress || 0)) /
              pdfDocument.numPages;
            setScannedPdfStatus("scanning");
            setScannedPdfProgress(
              Math.min(100, Math.round(pageProgress * 100)),
            );
          }
        },
      });

      const pages = [];
      for (
        let pageNumber = 1;
        pageNumber <= pdfDocument.numPages;
        pageNumber += 1
      ) {
        const page = await pdfDocument.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 1.5 });
        if (viewport.width * viewport.height > 12000000) {
          throw new Error(
            `Page ${pageNumber} is too large to safely process. Reduce the PDF page size and try again.`,
          );
        }

        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const context = canvas.getContext("2d");
        if (!context) {
          throw new Error("Canvas is not available in this browser.");
        }

        await page.render({ canvas, canvasContext: context, viewport }).promise;
        const result = await worker.recognize(canvas);
        pages.push(
          `--- Page ${pageNumber} ---\n${result.data.text.trim()}`.trim(),
        );
        currentPageNumber = pageNumber + 1;
        canvas.width = 0;
        canvas.height = 0;
        page.cleanup();
        setScannedPdfProgress(
          Math.round((pageNumber / pdfDocument.numPages) * 100),
        );
      }

      const resultText = pages.join("\n\n");
      if (!resultText.replace(/--- Page \d+ ---/g, "").trim()) {
        throw new Error(
          "No text was recognized. Try a clearer scan or another OCR language.",
        );
      }

      await pdfLoadingTask.destroy();
      pdfLoadingTask = null;
      pdfDocument = null;
      setScannedPdfText(resultText);
      setScannedPdfStatus("done");
      setScannedPdfProgress(100);
    } catch (error) {
      console.error("SCANNED PDF OCR ERROR:", error);
      setScannedPdfStatus("error");
      setScannedPdfError(
        error.message ||
          "Unable to scan this PDF. It may be damaged or password-protected.",
      );
      if (pdfLoadingTask) {
        try {
          await pdfLoadingTask.destroy();
        } catch (cleanupError) {
          console.error("PDF WORKER CLEANUP ERROR:", cleanupError);
        }
      }
    } finally {
      if (worker) {
        try {
          await worker.terminate();
        } catch (error) {
          console.error("OCR WORKER CLEANUP ERROR:", error);
        }
      }
    }
  };

  const handleDownloadScannedPdfText = () => {
    if (!scannedPdfText) {
      return;
    }
    const blob = new Blob([scannedPdfText], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${scannedPdfFile?.name.replace(/\.pdf$/i, "") || "scanned-pdf"}-text.txt`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleImageSelect = (
    event,
  ) => {
    const selectedFiles =
      Array.from(
        event.target.files || [],
      );

    if (
      selectedFiles.length ===
      0
    ) {
      return;
    }

    const validFiles =
      selectedFiles.filter(
        (file) =>
          file.type ===
            "image/jpeg" ||
          file.type ===
            "image/png",
      );

    if (
      validFiles.length !==
      selectedFiles.length
    ) {
      alert(
        "Only JPG and PNG images are supported.",
      );
    }

    const newImages =
      validFiles.map((file) => ({
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        file,
        preview:
          URL.createObjectURL(
            file,
          ),
      }));

    setImages(
      (previousImages) => [
        ...previousImages,
        ...newImages,
      ],
    );

    event.target.value = "";
  };

  // =========================================================
  // REMOVE IMAGE
  // =========================================================

  const removeImage = (id) => {
    setImages(
      (previousImages) => {
        const imageToRemove =
          previousImages.find(
            (image) =>
              image.id === id,
          );

        if (imageToRemove) {
          URL.revokeObjectURL(
            imageToRemove.preview,
          );
        }

        return previousImages.filter(
          (image) =>
            image.id !== id,
        );
      },
    );
  };

  // =========================================================
  // MOVE IMAGE UP
  // =========================================================

  const moveImageUp = (
    index,
  ) => {
    if (index === 0) {
      return;
    }

    setImages(
      (previousImages) => {
        const updatedImages = [
          ...previousImages,
        ];

        [
          updatedImages[
            index - 1
          ],
          updatedImages[index],
        ] = [
          updatedImages[index],
          updatedImages[
            index - 1
          ],
        ];

        return updatedImages;
      },
    );
  };

  // =========================================================
  // MOVE IMAGE DOWN
  // =========================================================

  const moveImageDown = (
    index,
  ) => {
    if (
      index >=
      images.length - 1
    ) {
      return;
    }

    setImages(
      (previousImages) => {
        const updatedImages = [
          ...previousImages,
        ];

        [
          updatedImages[index],
          updatedImages[
            index + 1
          ],
        ] = [
          updatedImages[
            index + 1
          ],
          updatedImages[index],
        ];

        return updatedImages;
      },
    );
  };

  // =========================================================
  // CLEAR IMAGES
  // =========================================================

  const clearImages = () => {
    images.forEach((image) => {
      URL.revokeObjectURL(
        image.preview,
      );
    });

    setImages([]);
  };

  // =========================================================
  // IMAGE TO PDF
  // =========================================================

  const handleDownloadImagePDF =
    async () => {
      if (images.length === 0) {
        alert(
          "Please select at least one image.",
        );
        return;
      }

      try {
        const doc = new jsPDF(
          {
            orientation:
              "portrait",
            unit: "mm",
            format: "a4",
          },
        );

        const pageWidth =
          doc.internal.pageSize.getWidth();

        const pageHeight =
          doc.internal.pageSize.getHeight();

        const availableWidth =
          pageWidth -
          imageMargin * 2;

        const availableHeight =
          pageHeight -
          imageMargin * 2;

        for (
          let i = 0;
          i < images.length;
          i++
        ) {
          if (i > 0) {
            doc.addPage();
          }

          const imageItem =
            images[i];

          const imageElement =
            new Image();

          imageElement.src =
            imageItem.preview;

          await new Promise(
            (
              resolve,
              reject,
            ) => {
              imageElement.onload =
                resolve;

              imageElement.onerror =
                reject;
            },
          );

          const imageWidth =
            imageElement.naturalWidth;

          const imageHeight =
            imageElement.naturalHeight;

          if (
            !imageWidth ||
            !imageHeight
          ) {
            throw new Error(
              "Unable to read image dimensions.",
            );
          }

          const widthRatio =
            availableWidth /
            imageWidth;

          const heightRatio =
            availableHeight /
            imageHeight;

          const scale =
            Math.min(
              widthRatio,
              heightRatio,
            );

          const finalWidth =
            imageWidth * scale;

          const finalHeight =
            imageHeight * scale;

          const x =
            (pageWidth -
              finalWidth) /
            2;

          const y =
            (pageHeight -
              finalHeight) /
            2;

          const imageFormat =
            imageItem.file
              .type ===
            "image/png"
              ? "PNG"
              : "JPEG";

          doc.addImage(
            imageElement,
            imageFormat,
            x,
            y,
            finalWidth,
            finalHeight,
          );
        }

        doc.save(
          "yogen-images.pdf",
        );
      } catch (error) {
        console.error(
          "IMAGE PDF ERROR:",
          error,
        );

        alert(
          "Something went wrong while creating the PDF.",
        );
      }
    };

  // =========================================================
  // QR CODE GENERATION
  // =========================================================

  const generateQRCode =
    async () => {
      if (!qrText.trim()) {
        alert(
          "Please enter text or a URL first.",
        );
        return;
      }

      try {
        const dataUrl =
          await QRCode.toDataURL(
            qrText.trim(),
            {
              width: Number(
                qrSize,
              ),
              margin: 2,
              errorCorrectionLevel:
                "M",
            },
          );

        setQrPreview(
          dataUrl,
        );
      } catch (error) {
        console.error(
          "QR CODE ERROR:",
          error,
        );

        alert(
          "Unable to generate QR code.",
        );
      }
    };

  // =========================================================
  // QR PNG
  // =========================================================

  const downloadQRPNG = () => {
    if (!qrPreview) {
      alert(
        "Please generate the QR code first.",
      );
      return;
    }

    const link =
      document.createElement(
        "a",
      );

    link.href = qrPreview;

    link.download =
      "yogen-qr-code.png";

    document.body.appendChild(
      link,
    );

    link.click();

    document.body.removeChild(
      link,
    );
  };

  // =========================================================
  // QR PDF
  // =========================================================

  const downloadQRPDF = () => {
    if (!qrPreview) {
      alert(
        "Please generate the QR code first.",
      );
      return;
    }

    try {
      const doc = new jsPDF(
        {
          orientation:
            "portrait",
          unit: "mm",
          format: "a4",
        },
      );

      const pageWidth =
        doc.internal.pageSize.getWidth();

      const qrPdfSize = 100;

      const qrX =
        (pageWidth -
          qrPdfSize) /
        2;

      const qrY = 60;

      doc.setFont(
        "helvetica",
        "bold",
      );

      doc.setFontSize(20);

      doc.text(
        "Yogen QR Code",
        pageWidth / 2,
        35,
        {
          align: "center",
        },
      );

      doc.addImage(
        qrPreview,
        "PNG",
        qrX,
        qrY,
        qrPdfSize,
        qrPdfSize,
      );

      doc.setFont(
        "helvetica",
        "normal",
      );

      doc.setFontSize(11);

      const wrappedText =
        doc.splitTextToSize(
          qrText,
          160,
        );

      doc.text(
        wrappedText,
        pageWidth / 2,
        qrY +
          qrPdfSize +
          18,
        {
          align: "center",
        },
      );

      doc.save(
        "yogen-qr-code.pdf",
      );
    } catch (error) {
      console.error(
        "QR PDF ERROR:",
        error,
      );

      alert(
        "Unable to create QR PDF.",
      );
    }
  };

  // =========================================================
  // CLEAR QR
  // =========================================================

  const clearQR = () => {
    setQrText("");
    setQrPreview("");
    setQrSize(400);
  };

  // =========================================================
  // INVOICE FUNCTIONS
  // =========================================================

  const addInvoiceItem = () => {
    setInvoiceItems(
      (previousItems) => [
        ...previousItems,
        {
          id:
            Date.now() +
            Math.random(),
          description: "",
          quantity: 1,
          rate: 0,
        },
      ],
    );
  };

  const removeInvoiceItem = (
    id,
  ) => {
    if (
      invoiceItems.length === 1
    ) {
      alert(
        "At least one item is required.",
      );
      return;
    }

    setInvoiceItems(
      (previousItems) =>
        previousItems.filter(
          (item) =>
            item.id !== id,
        ),
    );
  };

  const updateInvoiceItem = (
    id,
    field,
    value,
  ) => {
    setInvoiceItems(
      (previousItems) =>
        previousItems.map(
          (item) => {
            if (
              item.id !== id
            ) {
              return item;
            }

            if (
              field ===
              "description"
            ) {
              return {
                ...item,
                description:
                  value,
              };
            }

            return {
              ...item,
              [field]:
                Number(value),
            };
          },
        ),
    );
  };

  const calculateInvoiceTotals =
    () => {
      const subtotal =
        invoiceItems.reduce(
          (sum, item) =>
            sum +
            Number(
              item.quantity || 0,
            ) *
              Number(
                item.rate || 0,
              ),
          0,
        );

      const discountAmount =
        subtotal *
        (Number(
          invoiceDiscount || 0,
        ) /
          100);

      const taxableAmount =
        subtotal -
        discountAmount;

      const taxAmount =
        taxableAmount *
        (Number(
          invoiceTax || 0,
        ) /
          100);

      const grandTotal =
        taxableAmount +
        taxAmount;

      return {
        subtotal,
        discountAmount,
        taxableAmount,
        taxAmount,
        grandTotal,
      };
    };

  const clearInvoice = () => {
    setInvoiceNumber(
      getInvoiceNumber(),
    );

    setInvoiceDate(
      getToday(),
    );

    setDueDate(
      getToday(),
    );

    setClientName("");
    setClientEmail("");
    setClientPhone("");
    setClientAddress("");

    setPaymentStatus(
      "Unpaid",
    );

    setInvoiceDiscount(0);
    setInvoiceTax(18);
    setInvoiceNotes("");

    setInvoiceItems([
      {
        id: Date.now(),
        description: "",
        quantity: 1,
        rate: 0,
      },
    ]);
  };

  // =========================================================
  // INVOICE PDF
  // =========================================================

  const handleDownloadInvoicePDF =
    () => {
      if (!clientName.trim()) {
        alert(
          "Please enter client name.",
        );
        return;
      }

      const validItems =
        invoiceItems.filter(
          (item) =>
            item.description.trim() &&
            Number(item.quantity) >
              0 &&
            Number(item.rate) >=
              0,
        );

      if (
        validItems.length === 0
      ) {
        alert(
          "Please add at least one valid invoice item.",
        );
        return;
      }

      try {
        const totals =
          calculateInvoiceTotals();

        const doc = new jsPDF(
          {
            orientation:
              "portrait",
            unit: "mm",
            format: "a4",
          },
        );

        const pageWidth =
          doc.internal.pageSize.getWidth();

        const pageHeight =
          doc.internal.pageSize.getHeight();

        const pageMargin = 18;

        let y = 20;

        // HEADER
        doc.setFont(
          "helvetica",
          "bold",
        );

        doc.setFontSize(22);

        doc.setTextColor(
          17,
          24,
          39,
        );

        doc.text(
          "Yogen Infotech",
          pageMargin,
          y,
        );

        doc.setFont(
          "helvetica",
          "normal",
        );

        doc.setFontSize(9);

        doc.setTextColor(
          100,
          116,
          139,
        );

        doc.text(
          "Software & Technology Solutions",
          pageMargin,
          y + 6,
        );

        doc.setFont(
          "helvetica",
          "bold",
        );

        doc.setFontSize(24);

        doc.setTextColor(
          17,
          24,
          39,
        );

        doc.text(
          "INVOICE",
          pageWidth -
            pageMargin,
          y,
          {
            align: "right",
          },
        );

        doc.setFont(
          "helvetica",
          "normal",
        );

        doc.setFontSize(9);

        doc.text(
          `Invoice #: ${invoiceNumber}`,
          pageWidth -
            pageMargin,
          y + 7,
          {
            align: "right",
          },
        );

        doc.setDrawColor(
          226,
          232,
          240,
        );

        doc.line(
          pageMargin,
          y + 13,
          pageWidth -
            pageMargin,
          y + 13,
        );

        y += 26;

        // BILL TO
        doc.setFont(
          "helvetica",
          "bold",
        );

        doc.setFontSize(10);

        doc.setTextColor(
          17,
          24,
          39,
        );

        doc.text(
          "BILL TO",
          pageMargin,
          y,
        );

        doc.text(
          "INVOICE DETAILS",
          pageWidth / 2 +
            5,
          y,
        );

        y += 7;

        doc.setFont(
          "helvetica",
          "normal",
        );

        doc.setFontSize(9.5);

        doc.text(
          clientName,
          pageMargin,
          y,
        );

        doc.text(
          `Invoice Date: ${invoiceDate}`,
          pageWidth / 2 +
            5,
          y,
        );

        if (
          clientEmail.trim()
        ) {
          y += 5;

          doc.setFontSize(8.5);

          doc.text(
            clientEmail,
            pageMargin,
            y,
          );

          doc.setFontSize(9.5);
        }

        y += 5;

        if (
          clientPhone.trim()
        ) {
          doc.text(
            clientPhone,
            pageMargin,
            y,
          );
        }

        doc.text(
          `Due Date: ${dueDate}`,
          pageWidth / 2 +
            5,
          y,
        );

        y += 5;

        doc.text(
          `Status: ${paymentStatus}`,
          pageWidth / 2 +
            5,
          y,
        );

        if (
          clientAddress.trim()
        ) {
          y += 5;

          const addressLines =
            doc.splitTextToSize(
              clientAddress,
              75,
            );

          doc.text(
            addressLines,
            pageMargin,
            y,
          );

          y +=
            addressLines.length *
            4;
        }

        y += 12;

        // TABLE
        const tableX = pageMargin;

        const tableWidth =
          pageWidth -
          pageMargin * 2;

        const colNo = 10;
        const colDescription = 78;
        const colQty = 20;
        const colRate = 32;
        const colAmount =
          tableWidth -
          colNo -
          colDescription -
          colQty -
          colRate;

        const headerHeight = 9;

        doc.setFillColor(
          15,
          23,
          42,
        );

        doc.setTextColor(
          255,
          255,
          255,
        );

        doc.rect(
          tableX,
          y,
          tableWidth,
          headerHeight,
          "F",
        );

        doc.setFont(
          "helvetica",
          "bold",
        );

        doc.setFontSize(8);

        let x =
          tableX + 3;

        doc.text(
          "#",
          x,
          y + 6,
        );

        x += colNo;

        doc.text(
          "DESCRIPTION",
          x,
          y + 6,
        );

        x +=
          colDescription;

        doc.text(
          "QTY",
          x +
            colQty / 2,
          y + 6,
          {
            align:
              "center",
          },
        );

        x += colQty;

        doc.text(
          "RATE",
          x +
            colRate -
            3,
          y + 6,
          {
            align:
              "right",
          },
        );

        x += colRate;

        doc.text(
          "AMOUNT",
          x +
            colAmount -
            3,
          y + 6,
          {
            align:
              "right",
          },
        );

        doc.setTextColor(
          17,
          24,
          39,
        );

        y += headerHeight;

        // TABLE ROWS
        validItems.forEach(
          (item, index) => {
            const amount =
              Number(
                item.quantity ||
                  0,
              ) *
              Number(
                item.rate || 0,
              );

            const descriptionLines =
              doc.splitTextToSize(
                item.description,
                colDescription -
                  6,
              );

            const rowHeight =
              Math.max(
                10,
                descriptionLines.length *
                  4 +
                  5,
              );

            if (
              y + rowHeight >
              pageHeight - 75
            ) {
              doc.addPage();

              y = 20;
            }

            doc.setDrawColor(
              226,
              232,
              240,
            );

            doc.rect(
              tableX,
              y,
              tableWidth,
              rowHeight,
            );

            let rowX =
              tableX + 3;

            doc.setFont(
              "helvetica",
              "normal",
            );

            doc.setFontSize(8);

            doc.text(
              String(index + 1),
              rowX,
              y + 6,
            );

            rowX += colNo;

            doc.text(
              descriptionLines,
              rowX,
              y + 5,
            );

            rowX +=
              colDescription;

            doc.text(
              String(
                item.quantity,
              ),
              rowX +
                colQty / 2,
              y + 6,
              {
                align:
                  "center",
              },
            );

            rowX += colQty;

            doc.text(
              `INR ${Number(
                item.rate,
              ).toFixed(2)}`,
              rowX +
                colRate -
                3,
              y + 6,
              {
                align:
                  "right",
              },
            );

            rowX += colRate;

            doc.text(
              `INR ${amount.toFixed(
                2,
              )}`,
              rowX +
                colAmount -
                3,
              y + 6,
              {
                align:
                  "right",
              },
            );

            y += rowHeight;
          },
        );

        // TOTALS
        y += 8;

        const totalsX =
          pageWidth -
          pageMargin -
          72;

        const valueX =
          pageWidth -
          pageMargin;

        doc.setFont(
          "helvetica",
          "normal",
        );

        doc.setFontSize(9);

        doc.text(
          "Subtotal",
          totalsX,
          y,
        );

        doc.text(
          `INR ${totals.subtotal.toFixed(
            2,
          )}`,
          valueX,
          y,
          {
            align:
              "right",
          },
        );

        y += 6;

        doc.text(
          `Discount (${Number(
            invoiceDiscount,
          ).toFixed(2)}%)`,
          totalsX,
          y,
        );

        doc.text(
          `- INR ${totals.discountAmount.toFixed(
            2,
          )}`,
          valueX,
          y,
          {
            align:
              "right",
          },
        );

        y += 6;

        doc.text(
          `Tax (${Number(
            invoiceTax,
          ).toFixed(2)}%)`,
          totalsX,
          y,
        );

        doc.text(
          `INR ${totals.taxAmount.toFixed(
            2,
          )}`,
          valueX,
          y,
          {
            align:
              "right",
          },
        );

        y += 9;

        doc.setFont(
          "helvetica",
          "bold",
        );

        doc.setFontSize(13);

        doc.text(
          "TOTAL",
          totalsX,
          y,
        );

        doc.text(
          `INR ${totals.grandTotal.toFixed(
            2,
          )}`,
          valueX,
          y,
          {
            align:
              "right",
          },
        );

        // NOTES
        if (
          invoiceNotes.trim()
        ) {
          y += 20;

          doc.setFont(
            "helvetica",
            "bold",
          );

          doc.setFontSize(9);

          doc.text(
            "NOTES",
            pageMargin,
            y,
          );

          y += 5;

          doc.setFont(
            "helvetica",
            "normal",
          );

          doc.setFontSize(8.5);

          const notesLines =
            doc.splitTextToSize(
              invoiceNotes,
              170,
            );

          doc.text(
            notesLines,
            pageMargin,
            y,
          );
        }

        // FOOTER
        doc.setFont(
          "helvetica",
          "normal",
        );

        doc.setFontSize(8);

        doc.setTextColor(
          100,
          116,
          139,
        );

        doc.text(
          "Thank you for doing business with Yogen Infotech.",
          pageWidth / 2,
          pageHeight - 15,
          {
            align:
              "center",
          },
        );

        doc.save(
          `${invoiceNumber}.pdf`,
        );
      } catch (error) {
        console.error(
          "INVOICE PDF ERROR:",
          error,
        );

        alert(
          "Unable to create invoice PDF.",
        );
      }
    };

  // =========================================================
  // DASHBOARD
  // =========================================================

  const renderDashboard = () => {
    return (
      <>
        <div className="page-header">
          <p className="eyebrow">
            YOGEN INFOTECH
          </p>
          <h1>
            Yogen Tools
          </h1>

          <p className="subtitle">
            Simple productivity tools for
            documents, business and everyday
            work.
          </p>
        </div>

        <div className="hero-card">
          <div>
            <span className="hero-badge">
              ALL-IN-ONE TOOLKIT
            </span>

            <h2>
              Create. Convert. Generate.
            </h2>

            <p>
              A collection of useful tools
              built by Yogen Infotech to
              make everyday digital work
              faster and easier.
            </p>

            <button
              className="primary-button"
              onClick={() =>
                openTool("text-pdf")
              }
            >
              Start with Text to PDF →
            </button>
          </div>

          <div className="hero-icon">
            ⚡
          </div>
        </div>

        <div className="home-feature-row">
          <div>
            <p className="eyebrow">MADE FOR EVERYDAY WORK</p>
            <h2>Useful tools, all in one place.</h2>
            <p>
              Convert documents, create business files, and get small tasks
              done without leaving your browser.
            </p>
          </div>
          <button className="neon-outline-button" onClick={showTools}>
            Explore all tools <span aria-hidden="true">→</span>
          </button>
        </div>

        <div className="home-trust-strip">
          <span>⚡ Quick to use</span>
          <span>🔒 Browser-based processing for supported tools</span>
          <span>✨ Simple and practical</span>
        </div>
      </>
    );
  };

  const renderToolsPage = () => (
    <>
      <div className="page-header">
        <p className="eyebrow">YOGEN TOOLS</p>
        <h1>Explore all tools</h1>
        <p className="subtitle">
          Choose a tool to start. Your work stays in your browser for tools
          that process files locally.
        </p>
      </div>

      <div className="tools-grid">
        {tools.map((tool) => (
          <button
            type="button"
            className="tool-card tool-card-button"
            key={tool.id}
            onClick={() => openTool(tool.id)}
          >
            <span className={`tool-icon ${tool.color}`}>
              {tool.icon}
            </span>
            <span className="tool-content">
              <strong>{tool.name}</strong>
              <span>{tool.description}</span>
            </span>
            <span
              className={
                tool.available ? "ready-badge" : "coming-badge"
              }
            >
              {tool.available ? "Available" : "Coming Soon"}
            </span>
          </button>
        ))}
      </div>
    </>
  );

  const renderBlogPage = () => (
    <section className="site-content-page blog-page">
      <div className="blog-breadcrumb">
        <button onClick={goHome}>Home</button>
        <span>/</span>
        <span>Blog</span>
      </div>

      <header className="blog-author-hero">
        <span className="blog-author-kicker">Developer Blog</span>
        <h1>
          Ideas, insights &amp; tools
          <br />
          <span>by Abhishek Chauhan</span>
        </h1>
        <p>
          I build Yogen Tools to make everyday document and productivity work
          simpler. Here I share practical tips, behind-the-scenes notes, and
          ideas for creating useful digital experiences.
        </p>
        <div className="blog-hero-actions">
          <a
            className="blog-connect-button"
            href="https://wa.me/918171915305?text=Hi%20Abhishek%2C%20I%20read%20your%20Yogen%20Tools%20blog."
            target="_blank"
            rel="noreferrer"
          >
            Connect on WhatsApp <span aria-hidden="true">↗</span>
          </a>
          <button className="blog-tools-button" onClick={showTools}>
            Explore Yogen Tools
          </button>
        </div>
      </header>

      <div className="blog-section-heading">
        <div>
          <p className="eyebrow">THE LATEST</p>
          <h2>Notes from the builder</h2>
        </div>
        <span>Written by Abhishek Chauhan</span>
      </div>

      <div className="blog-post-grid">
        <article className="blog-post-card">
          <span className="blog-post-category">PRODUCTIVITY · 4 MIN READ</span>
          <h2>Small tools can make everyday work feel lighter</h2>
          <p>
            Many workdays are filled with little tasks: preparing a document,
            resizing a photo, sharing a QR code, or putting information into a
            form. Each takes only a few minutes, but switching between apps
            adds friction. A focused toolkit helps keep those small jobs
            simple, predictable, and close at hand.
          </p>
          <p>
            That is the idea behind Yogen Tools: bring useful everyday
            utilities together and make each one easy to understand before
            you download the result.
          </p>
          <span className="blog-post-byline">By Abhishek Chauhan</span>
        </article>

        <article className="blog-post-card">
          <span className="blog-post-category">BUILDING YOGEN TOOLS · 3 MIN READ</span>
          <h2>Why I am building an all-in-one browser toolkit</h2>
          <p>
            I wanted common document and productivity features to be easy to
            find without a complicated workflow. Yogen Tools brings together
            PDF creation, image conversion, invoices, resumes, text-to-speech,
            image resizing, PDF text extraction, and custom forms.
          </p>
          <p>
            The project keeps growing step by step, with a focus on useful
            controls, clear previews, and direct downloads.
          </p>
          <span className="blog-post-byline">By Abhishek Chauhan</span>
        </article>

        <article className="blog-post-card">
          <span className="blog-post-category">DESIGNING WITH CARE · 3 MIN READ</span>
          <h2>Useful software should be clear about what it can do</h2>
          <p>
            A good interface is more than a polished screen. It should guide
            you through the task, explain important choices, and be honest
            about limitations. For example, text extraction works on
            selectable PDF text; scanned pages need OCR.
          </p>
          <p>
            I want Yogen Tools to feel welcoming for first-time users while
            still giving enough control to get a useful result.
          </p>
          <span className="blog-post-byline">By Abhishek Chauhan</span>
        </article>
      </div>
    </section>
  );

  const renderAboutPage = () => (
    <section className="site-content-page">
      <div className="page-header">
        <p className="eyebrow">ABOUT THE PROJECT</p>
        <h1>Tools made to keep work moving.</h1>
        <p className="subtitle">
          Yogen Tools is an all-in-one collection of browser-based utilities
          for documents, images, business tasks, and everyday productivity.
        </p>
      </div>

      <div className="about-intro-card">
        <div className="about-mark">Y</div>
        <div>
          <p className="eyebrow">YOGEN INFOTECH</p>
          <h2>Simple, useful, and easy to access.</h2>
          <p>
            The project brings common tasks into one place: creating PDFs,
            combining images, generating QR codes, preparing invoices and
            resumes, resizing images, extracting text from PDFs, and building
            custom forms. The goal is to make these tasks approachable with a
            clear interface and direct downloads.
          </p>
        </div>
      </div>

      <div className="about-values-grid">
        <article>
          <span>01</span>
          <h3>Practical tools</h3>
          <p>
            Each available feature focuses on a clear task and gives you
            settings that are easy to understand.
          </p>
        </article>
        <article>
          <span>02</span>
          <h3>Designed for clarity</h3>
          <p>
            Helpful labels, previews, and status messages make it easier to
            know what a tool will do.
          </p>
        </article>
        <article>
          <span>03</span>
          <h3>Built step by step</h3>
          <p>
            Yogen Tools is an evolving project by Abhishek Chauhan, with
            useful additions shaped around everyday needs.
          </p>
        </article>
      </div>

      <div className="about-contact-card">
        <p>
          This tool was developed by Abhishek Chauhan, CEO of Yogen Infotech,
          on October 7, 2026. For other services or enquiries, contact us at{" "}
          <a href="tel:+918171915305">8171915305</a>.
        </p>
      </div>

      <button className="neon-outline-button" onClick={showTools}>
        Browse the tools <span aria-hidden="true">→</span>
      </button>
    </section>
  );

  // =========================================================
  // TEXT TO PDF PAGE
  // =========================================================

  const renderTextToPDF = () => {
    return (
      <>
        <div className="page-header tool-page-header">
          <button
            className="back-button"
            onClick={showTools}
          >
            ← Back to Dashboard
          </button>

          <p className="eyebrow">
            DOCUMENT TOOL
          </p>

          <h1>
            Text to PDF
          </h1>

          <p className="subtitle">
            Write or paste your text and
            convert it into a professional PDF.
          </p>
        </div>

        <div className="editor-layout">
          <div className="editor-card">
            <div className="card-header">
              <h2>
                Document Content
              </h2>

              <p>
                Enter the content you want
                to convert.
              </p>
            </div>

            <div className="form-group">
              <label>
                Document Title
              </label>

              <input
                type="text"
                placeholder="Example: Project Proposal"
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target.value,
                  )
                }
              />
            </div>

            <div className="form-group">
              <label>
                Your Text
              </label>

              <textarea
                rows="18"
                placeholder="Write or paste your text here..."
                value={text}
                onChange={(e) =>
                  setText(
                    e.target.value,
                  )
                }
              />
            </div>

            <div className="character-count">
              {text.length} characters
            </div>
          </div>

          <div className="settings-card">
            <div className="card-header">
              <h2>
                PDF Settings
              </h2>

              <p>
                Customize your document.
              </p>
            </div>

            <div className="form-group">
              <label>
                Font Size
              </label>

              <select
                value={fontSize}
                onChange={(e) =>
                  setFontSize(
                    Number(
                      e.target.value,
                    ),
                  )
                }
              >
                <option value="10">
                  10 px
                </option>

                <option value="12">
                  12 px
                </option>

                <option value="14">
                  14 px
                </option>

                <option value="16">
                  16 px
                </option>

                <option value="18">
                  18 px
                </option>

                <option value="20">
                  20 px
                </option>
              </select>
            </div>

            <div className="form-group">
              <label>
                Alignment
              </label>

              <div className="alignment-buttons">
                <button
                  className={
                    alignment ===
                    "left"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setAlignment(
                      "left",
                    )
                  }
                >
                  Left
                </button>

                <button
                  className={
                    alignment ===
                    "center"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setAlignment(
                      "center",
                    )
                  }
                >
                  Center
                </button>

                <button
                  className={
                    alignment ===
                    "right"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setAlignment(
                      "right",
                    )
                  }
                >
                  Right
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>
                Page Margin
              </label>

              <select
                value={margin}
                onChange={(e) =>
                  setMargin(
                    Number(
                      e.target.value,
                    ),
                  )
                }
              >
                <option value="10">
                  Small
                </option>

                <option value="20">
                  Normal
                </option>

                <option value="30">
                  Large
                </option>
              </select>
            </div>

            <div className="preview-box">
              <span>
                PDF FORMAT
              </span>

              <strong>
                A4 Document
              </strong>

              <p>
                Your document will
                automatically continue onto
                new pages.
              </p>
            </div>

            <button
              className="download-button"
              onClick={
                handleDownloadTextPDF
              }
            >
              Download PDF
            </button>

            <button
              className="clear-button"
              onClick={
                clearTextDocument
              }
            >
              Clear Document
            </button>
          </div>
        </div>
      </>
    );
  };

  // =========================================================
  // IMAGE TO PDF PAGE
  // =========================================================

  const renderImageToPDF = () => {
    return (
      <>
        <div className="page-header tool-page-header">
          <button
            className="back-button"
            onClick={showTools}
          >
            ← Back to Dashboard
          </button>

          <p className="eyebrow">
            FILE CONVERTER
          </p>

          <h1>
            Image to PDF
          </h1>

          <p className="subtitle">
            Upload multiple JPG or PNG images
            and combine them into one PDF.
          </p>
        </div>

        <div className="image-pdf-layout">
          <div className="editor-card">
            <div className="card-header">
              <h2>
                Select Images
              </h2>

              <p>
                Add as many images as you need.
              </p>
            </div>

            <label className="upload-area">
              <input
                type="file"
                accept="image/jpeg,image/png"
                multiple
                onChange={
                  handleImageSelect
                }
              />

              <div className="upload-icon">
                ⬆
              </div>

              <strong>
                Click to upload images
              </strong>

              <span>
                JPG and PNG • Multiple
                files supported
              </span>
            </label>

            {images.length > 0 && (
              <div className="image-list">
                <div className="image-list-header">
                  <div>
                    <h3>
                      Selected Images
                    </h3>

                    <p>
                      {images.length}{" "}
                      image
                      {images.length >
                      1
                        ? "s"
                        : ""}{" "}
                      selected
                    </p>
                  </div>

                  <button
                    className="clear-images-button"
                    onClick={
                      clearImages
                    }
                  >
                    Clear All
                  </button>
                </div>

                {images.map(
                  (
                    image,
                    index,
                  ) => (
                    <div
                      className="image-item"
                      key={
                        image.id
                      }
                    >
                      <div className="image-number">
                        {index + 1}
                      </div>

                      <img
                        src={
                          image.preview
                        }
                        alt={
                          image.file.name
                        }
                      />

                      <div className="image-info">
                        <strong>
                          {
                            image
                              .file
                              .name
                          }
                        </strong>

                        <span>
                          {(
                            image.file
                              .size /
                            1024 /
                            1024
                          ).toFixed(
                            2,
                          )}{" "}
                          MB
                        </span>
                      </div>

                      <div className="image-actions">
                        <button
                          onClick={() =>
                            moveImageUp(
                              index,
                            )
                          }
                          disabled={
                            index ===
                            0
                          }
                          title="Move up"
                        >
                          ↑
                        </button>

                        <button
                          onClick={() =>
                            moveImageDown(
                              index,
                            )
                          }
                          disabled={
                            index ===
                            images.length -
                              1
                          }
                          title="Move down"
                        >
                          ↓
                        </button>

                        <button
                          className="delete-image"
                          onClick={() =>
                            removeImage(
                              image.id,
                            )
                          }
                          title="Remove image"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>

          <div className="settings-card">
            <div className="card-header">
              <h2>
                PDF Settings
              </h2>

              <p>
                Choose the spacing around your
                images.
              </p>
            </div>

            <div className="form-group">
              <label>
                Image Margin
              </label>

              <select
                value={
                  imageMargin
                }
                onChange={(e) =>
                  setImageMargin(
                    Number(
                      e.target.value,
                    ),
                  )
                }
              >
                <option value="5">
                  Small
                </option>

                <option value="15">
                  Normal
                </option>

                <option value="25">
                  Large
                </option>
              </select>
            </div>

            <div className="image-settings-preview">
              <div className="fake-page">
                <div className="fake-image">
                  IMAGE
                </div>
              </div>

              <strong>
                A4 Portrait
              </strong>

              <p>
                Each image will be fitted
                inside an A4 page without
                stretching.
              </p>
            </div>

            <div className="pdf-summary">
              <div>
                <span>
                  Images
                </span>

                <strong>
                  {images.length}
                </strong>
              </div>

              <div>
                <span>
                  Pages
                </span>

                <strong>
                  {images.length}
                </strong>
              </div>

              <div>
                <span>
                  Format
                </span>

                <strong>
                  A4
                </strong>
              </div>
            </div>

            <button
              className="download-button"
              onClick={
                handleDownloadImagePDF
              }
            >
              Download PDF
            </button>

            <p className="small-note">
              Your images are processed
              directly in the browser for this
              tool.
            </p>
          </div>
        </div>
      </>
    );
  };

  // =========================================================
  // QR PAGE
  // =========================================================

  const renderQRCode = () => {
    return (
      <>
        <div className="page-header tool-page-header">
          <button
            className="back-button"
            onClick={showTools}
          >
            ← Back to Dashboard
          </button>

          <p className="eyebrow">
            QR TOOL
          </p>

          <h1>
            QR Code Generator
          </h1>

          <p className="subtitle">
            Convert a website, text or useful
            information into a QR code.
          </p>
        </div>

        <div className="qr-layout">
          <div className="editor-card">
            <div className="card-header">
              <h2>
                QR Content
              </h2>

              <p>
                Enter the text or URL that you
                want to convert.
              </p>
            </div>

            <div className="form-group">
              <label>
                Website URL or Text
              </label>

              <textarea
                rows="8"
                placeholder="Example: https://yogeninfotech.com"
                value={qrText}
                onChange={(e) =>
                  setQrText(
                    e.target.value,
                  )
                }
              />
            </div>

            <div className="form-group">
              <label>
                QR Image Size
              </label>

              <select
                value={qrSize}
                onChange={(e) =>
                  setQrSize(
                    Number(
                      e.target.value,
                    ),
                  )
                }
              >
                <option value="256">
                  256 × 256
                </option>

                <option value="400">
                  400 × 400
                </option>

                <option value="512">
                  512 × 512
                </option>

                <option value="1024">
                  1024 × 1024
                </option>
              </select>
            </div>

            <button
              className="download-button"
              onClick={
                generateQRCode
              }
            >
              Generate QR Code
            </button>

            <button
              className="clear-button"
              onClick={
                clearQR
              }
            >
              Clear
            </button>
          </div>

          <div className="settings-card qr-preview-card">
            <div className="card-header">
              <h2>
                Preview
              </h2>

              <p>
                Your generated QR code will
                appear here.
              </p>
            </div>

            <div className="qr-preview-box">
              {qrPreview ? (
                <img
                  src={qrPreview}
                  alt="Generated QR Code"
                />
              ) : (
                <div className="qr-placeholder">
                  <span>
                    🔲
                  </span>

                  <strong>
                    No QR code yet
                  </strong>

                  <p>
                    Enter your content and
                    click Generate QR Code.
                  </p>
                </div>
              )}
            </div>

            {qrPreview && (
              <>
                <button
                  className="download-button"
                  onClick={
                    downloadQRPNG
                  }
                >
                  Download PNG
                </button>

                <button
                  className="clear-button"
                  onClick={
                    downloadQRPDF
                  }
                >
                  Download PDF
                </button>
              </>
            )}
          </div>
        </div>
      </>
    );
  };

  // =========================================================
  // INVOICE PAGE
  // =========================================================

  const renderInvoice = () => {
    const totals =
      calculateInvoiceTotals();

    return (
      <>
        <div className="page-header tool-page-header">
          <button
            className="back-button"
            onClick={showTools}
          >
            ← Back to Dashboard
          </button>

          <p className="eyebrow">
            BUSINESS TOOL
          </p>

          <h1>
            Invoice Generator
          </h1>

          <p className="subtitle">
            Create a professional invoice
            and download it as a PDF.
          </p>
        </div>

        <div className="invoice-layout">
          {/* LEFT */}
          <div className="editor-card">
            <div className="card-header">
              <h2>
                Invoice Details
              </h2>

              <p>
                Enter invoice and client
                information.
              </p>
            </div>

            <div className="invoice-form-grid">
              <div className="form-group">
                <label>
                  Invoice Number
                </label>

                <input
                  type="text"
                  value={
                    invoiceNumber
                  }
                  onChange={(e) =>
                    setInvoiceNumber(
                      e.target.value,
                    )
                  }
                />
              </div>

              <div className="form-group">
                <label>
                  Payment Status
                </label>

                <select
                  value={
                    paymentStatus
                  }
                  onChange={(e) =>
                    setPaymentStatus(
                      e.target.value,
                    )
                  }
                >
                  <option>
                    Unpaid
                  </option>

                  <option>
                    Paid
                  </option>

                  <option>
                    Partially Paid
                  </option>

                  <option>
                    Overdue
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  Invoice Date
                </label>

                <input
                  type="date"
                  value={
                    invoiceDate
                  }
                  onChange={(e) =>
                    setInvoiceDate(
                      e.target.value,
                    )
                  }
                />
              </div>

              <div className="form-group">
                <label>
                  Due Date
                </label>

                <input
                  type="date"
                  value={
                    dueDate
                  }
                  onChange={(e) =>
                    setDueDate(
                      e.target.value,
                    )
                  }
                />
              </div>
            </div>

            <div className="invoice-section-title">
              Client Information
            </div>

            <div className="invoice-form-grid">
              <div className="form-group">
                <label>
                  Client Name
                </label>

                <input
                  type="text"
                  placeholder="ABC Technologies"
                  value={
                    clientName
                  }
                  onChange={(e) =>
                    setClientName(
                      e.target.value,
                    )
                  }
                />
              </div>

              <div className="form-group">
                <label>
                  Client Email
                </label>

                <input
                  type="email"
                  placeholder="client@example.com"
                  value={
                    clientEmail
                  }
                  onChange={(e) =>
                    setClientEmail(
                      e.target.value,
                    )
                  }
                />
              </div>

              <div className="form-group">
                <label>
                  Client Phone
                </label>

                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={
                    clientPhone
                  }
                  onChange={(e) =>
                    setClientPhone(
                      e.target.value,
                    )
                  }
                />
              </div>

              <div className="form-group invoice-full-width">
                <label>
                  Client Address
                </label>

                <textarea
                  rows="3"
                  placeholder="Client billing address"
                  value={
                    clientAddress
                  }
                  onChange={(e) =>
                    setClientAddress(
                      e.target.value,
                    )
                  }
                />
              </div>
            </div>

            <div className="invoice-section-heading">
              <div>
                <div className="invoice-section-title">
                  Invoice Items
                </div>

                <p>
                  Add services or products.
                </p>
              </div>

              <button
                className="add-item-button"
                onClick={
                  addInvoiceItem
                }
              >
                + Add Item
              </button>
            </div>

            <div className="invoice-items">
              {invoiceItems.map(
                (
                  item,
                  index,
                ) => (
                  <div
                    className="invoice-item-row"
                    key={
                      item.id
                    }
                  >
                    <div className="item-index">
                      {index + 1}
                    </div>

                    <div className="item-description">
                      <label>
                        Description
                      </label>

                      <input
                        type="text"
                        placeholder="Website Development"
                        value={
                          item.description
                        }
                        onChange={(
                          e,
                        ) =>
                          updateInvoiceItem(
                            item.id,
                            "description",
                            e.target
                              .value,
                          )
                        }
                      />
                    </div>

                    <div className="item-small">
                      <label>
                        Qty
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={
                          item.quantity
                        }
                        onChange={(
                          e,
                        ) =>
                          updateInvoiceItem(
                            item.id,
                            "quantity",
                            e.target
                              .value,
                          )
                        }
                      />
                    </div>

                    <div className="item-small">
                      <label>
                        Rate
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={
                          item.rate
                        }
                        onChange={(
                          e,
                        ) =>
                          updateInvoiceItem(
                            item.id,
                            "rate",
                            e.target
                              .value,
                          )
                        }
                      />
                    </div>

                    <div className="item-total">
                      <span>
                        Amount
                      </span>

                      <strong>
                        ₹
                        {(
                          Number(
                            item.quantity ||
                              0,
                          ) *
                          Number(
                            item.rate ||
                              0,
                          )
                        ).toFixed(
                          2,
                        )}
                      </strong>
                    </div>

                    <button
                      className="remove-item-button"
                      onClick={() =>
                        removeInvoiceItem(
                          item.id,
                        )
                      }
                      title="Remove item"
                    >
                      ✕
                    </button>
                  </div>
                ),
              )}
            </div>

            <div className="invoice-section-title">
              Pricing
            </div>

            <div className="invoice-form-grid">
              <div className="form-group">
                <label>
                  Discount %
                </label>

                <input
                  type="number"
                  min="0"
                  max="100"
                  value={
                    invoiceDiscount
                  }
                  onChange={(e) =>
                    setInvoiceDiscount(
                      Number(
                        e.target
                          .value,
                      ),
                    )
                  }
                />
              </div>

              <div className="form-group">
                <label>
                  GST / Tax %
                </label>

                <input
                  type="number"
                  min="0"
                  max="100"
                  value={invoiceTax}
                  onChange={(e) =>
                    setInvoiceTax(
                      Number(
                        e.target
                          .value,
                      ),
                    )
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                Notes
              </label>

              <textarea
                rows="4"
                placeholder="Thank you for your business..."
                value={
                  invoiceNotes
                }
                onChange={(e) =>
                  setInvoiceNotes(
                    e.target.value,
                  )
                }
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="settings-card invoice-summary-card">
            <div className="card-header">
              <h2>
                Invoice Summary
              </h2>

              <p>
                Live calculation.
              </p>
            </div>

            <div className="invoice-brand-mini">
              <div className="brand-logo">
                Y
              </div>

              <div>
                <strong>
                  Yogen Infotech
                </strong>

                <span>
                  Professional Invoice
                </span>
              </div>
            </div>

            <div className="invoice-summary-list">
              <div>
                <span>
                  Subtotal
                </span>

                <strong>
                  ₹
                  {totals.subtotal.toFixed(
                    2,
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Discount
                </span>

                <strong>
                  - ₹
                  {totals.discountAmount.toFixed(
                    2,
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Tax
                </span>

                <strong>
                  ₹
                  {totals.taxAmount.toFixed(
                    2,
                  )}
                </strong>
              </div>
            </div>

            <div className="invoice-total-box">
              <span>
                TOTAL
              </span>

              <strong>
                ₹
                {totals.grandTotal.toFixed(
                  2,
                )}
              </strong>
            </div>

            <div className="invoice-meta-box">
              <div>
                <span>
                  Invoice
                </span>

                <strong>
                  {invoiceNumber}
                </strong>
              </div>

              <div>
                <span>
                  Status
                </span>

                <strong>
                  {paymentStatus}
                </strong>
              </div>
            </div>

            <button
              className="download-button"
              onClick={
                handleDownloadInvoicePDF
              }
            >
              Download Invoice PDF
            </button>

            <button
              className="clear-button"
              onClick={
                clearInvoice
              }
            >
              Clear Invoice
            </button>

            <p className="small-note">
              PDF is generated directly in
              your browser.
            </p>
          </div>
        </div>
      </>
    );
  };

  // =========================================================
  // RESUME BUILDER
  // =========================================================

  const handleResumeChange = (event) => {
    const { name, value } = event.target;

    setResumeData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleDownloadResumePDF = () => {
    if (!resumeData.fullName.trim()) {
      alert("Please enter your full name before downloading your resume.");
      return;
    }

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 18;
      const contentWidth = pageWidth - margin * 2;
      const bottomMargin = 18;
      let y = 22;

      doc.setProperties({
        title: `${resumeData.fullName.trim()} - Resume`,
        subject: "Resume",
        creator: "Yogen Tools",
      });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(23);
      doc.setTextColor(15, 23, 42);
      const nameLines = doc.splitTextToSize(
        resumeData.fullName.trim(),
        contentWidth,
      );
      doc.text(nameLines, margin, y);
      y += nameLines.length * 10 + 2;

      if (resumeData.jobTitle.trim()) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.setTextColor(37, 99, 235);
        const titleLines = doc.splitTextToSize(
          resumeData.jobTitle.trim(),
          contentWidth,
        );
        doc.text(titleLines, margin, y);
        y += titleLines.length * 6 + 2;
      }

      const contactDetails = [
        resumeData.email.trim(),
        resumeData.phone.trim(),
        resumeData.location.trim(),
      ].filter(Boolean);

      if (contactDetails.length) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        const contactLines = doc.splitTextToSize(
          contactDetails.join(" | "),
          contentWidth,
        );
        doc.text(contactLines, margin, y);
        y += contactLines.length * 5 + 3;
      }

      doc.setDrawColor(203, 213, 225);
      doc.line(margin, y, pageWidth - margin, y);
      y += 9;

      const sections = [
        ["PROFESSIONAL SUMMARY", resumeData.summary],
        ["WORK EXPERIENCE", resumeData.experience],
        ["EDUCATION", resumeData.education],
        [
          "SKILLS",
          resumeData.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean)
            .join("  |  "),
        ],
      ].filter(([, content]) => content.trim());

      const ensureSpace = (requiredHeight) => {
        if (y + requiredHeight > pageHeight - bottomMargin) {
          doc.addPage();
          y = 20;
        }
      };

      sections.forEach(([heading, content]) => {
        const paragraphs = content
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean)
          .flatMap((line) =>
            doc.splitTextToSize(line, contentWidth),
          );

        if (!paragraphs.length) {
          return;
        }

        ensureSpace(18);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(15, 23, 42);
        doc.text(heading, margin, y);
        y += 7;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(51, 65, 85);

        paragraphs.forEach((line) => {
          ensureSpace(6);
          doc.text(line, margin, y);
          y += 5;
        });

        y += 5;
      });

      const fileName =
        resumeData.fullName
          .trim()
          .replace(/[^a-z0-9]+/gi, "-")
          .replace(/^-|-$/g, "") || "resume";

      doc.save(`${fileName}-resume.pdf`);
    } catch (error) {
      console.error("RESUME PDF ERROR:", error);
      alert("Unable to create your resume PDF. Please try again.");
    }
  };

  const handleSpeak = () => {
    if (!speechSupported) {
      return;
    }

    if (!speechText.trim()) {
      setSpeechMessage("Enter some text to hear it spoken.");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(
      speechText.trim(),
    );
    const voice = speechVoices.find(
      (item) => item.voiceURI === selectedVoice,
    );

    if (voice) {
      utterance.voice = voice;
    }

    utterance.rate = Number(speechRate);
    utterance.pitch = Number(speechPitch);
    utterance.onstart = () => {
      setSpeechStatus("speaking");
      setSpeechMessage("");
    };
    utterance.onend = () => {
      setSpeechStatus("idle");
      setSpeechMessage("Finished reading your text.");
    };
    utterance.onerror = (event) => {
      if (
        event.error === "canceled" ||
        event.error === "interrupted"
      ) {
        return;
      }

      console.error("TEXT TO SPEECH ERROR:", event.error);
      setSpeechStatus("idle");
      setSpeechMessage(
        "Speech playback failed. Please try another voice or browser.",
      );
    };

    setSpeechStatus("speaking");
    setSpeechMessage("");
    window.speechSynthesis.speak(utterance);
  };

  const handlePauseResumeSpeech = () => {
    if (speechStatus === "paused") {
      window.speechSynthesis.resume();
      setSpeechStatus("speaking");
      setSpeechMessage("");
      return;
    }

    window.speechSynthesis.pause();
    setSpeechStatus("paused");
  };

  const handleStopSpeech = () => {
    window.speechSynthesis.cancel();
    setSpeechStatus("idle");
    setSpeechMessage("Speech stopped.");
  };

  const handleFormTemplateChange = (templateId) => {
    const template = formTemplates[templateId];
    setSelectedFormTemplate(templateId);
    setFormTitle(template.title);
    setFormDescription(template.description);
    setCustomFormFields(
      template.fields.map((field, index) => ({
        ...field,
        id: `${templateId}-${Date.now()}-${index}`,
        options: "",
        value: "",
      })),
    );
  };

  const updateCustomFormField = (fieldId, key, value) => {
    setCustomFormFields((currentFields) =>
      currentFields.map((field) =>
        field.id === fieldId
          ? { ...field, [key]: value }
          : field,
      ),
    );
  };

  const addCustomFormField = () => {
    setSelectedFormTemplate("custom");
    setCustomFormFields((currentFields) => [
      ...currentFields,
      {
        id: `custom-${Date.now()}`,
        label: "New question",
        type: "text",
        required: false,
        options: "",
        value: "",
      },
    ]);
  };

  const removeCustomFormField = (fieldId) => {
    setSelectedFormTemplate("custom");
    setCustomFormFields((currentFields) =>
      currentFields.filter((field) => field.id !== fieldId),
    );
  };

  const handleDownloadForm = (format) => {
    if (!formTitle.trim()) {
      alert("Please enter a title for your form.");
      return;
    }

    if (!customFormFields.length) {
      alert("Add at least one field to your form.");
      return;
    }

    const safeName =
      formTitle
        .trim()
        .replace(/[^a-z0-9]+/gi, "-")
        .replace(/^-|-$/g, "") || "custom-form";

    if (format === "text") {
      const lines = [
        formTitle.trim(),
        formDescription.trim(),
        "",
        ...customFormFields.flatMap((field) => [
          `${field.label.trim() || "Untitled field"}${field.required ? " *" : ""}: ${
            field.type === "checkbox"
              ? field.value
                ? "Yes"
                : "No"
              : String(field.value || "").trim() || "[Not filled]"
          }`,
          ...(field.type === "select" && field.options.trim()
            ? [`Options: ${field.options.trim()}`]
            : []),
          "",
        ]),
      ];
      const blob = new Blob([lines.join("\n")], {
        type: "text/plain;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${safeName}.txt`;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      return;
    }

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 18;
      const contentWidth = pageWidth - margin * 2;
      let y = 22;

      const ensureSpace = (height) => {
        if (y + height > pageHeight - margin) {
          doc.addPage();
          y = 20;
        }
      };
      const drawWrappedLines = (lines, lineHeight) => {
        lines.forEach((line) => {
          ensureSpace(lineHeight);
          doc.text(line, margin, y);
          y += lineHeight;
        });
      };

      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      const titleLines = doc.splitTextToSize(
        formTitle.trim(),
        contentWidth,
      );
      drawWrappedLines(titleLines, 9);
      y += 3;

      if (formDescription.trim()) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(71, 85, 105);
        const descriptionLines = doc.splitTextToSize(
          formDescription.trim(),
          contentWidth,
        );
        drawWrappedLines(descriptionLines, 5);
        y += 7;
      }

      customFormFields.forEach((field, index) => {
        const label = `${index + 1}. ${field.label.trim() || "Untitled field"}${
          field.required ? " *" : ""
        }`;
        const labelLines = doc.splitTextToSize(label, contentWidth);
        const answer = field.type === "checkbox"
          ? field.value
            ? "[x] Yes"
            : "[ ] Yes    [ ] No"
          : String(field.value || "").trim();
        const answerLines = answer
          ? doc.splitTextToSize(answer, contentWidth)
          : [];
        const optionsLines =
          field.type === "select" && field.options.trim()
            ? doc.splitTextToSize(
                `Options: ${field.options.trim()}`,
                contentWidth,
              )
            : [];
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42);
        drawWrappedLines(labelLines, 6);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(51, 65, 85);
        if (answerLines.length) {
          drawWrappedLines(answerLines, 5);
        } else if (field.type !== "checkbox") {
          const lineCount = field.type === "textarea" ? 3 : 1;
          for (let line = 0; line < lineCount; line += 1) {
            ensureSpace(7);
            doc.setDrawColor(203, 213, 225);
            doc.line(margin, y + 2, pageWidth - margin, y + 2);
            y += 7;
          }
        } else {
          y += 7;
        }
        if (optionsLines.length) {
          doc.setFontSize(8);
          doc.setTextColor(100, 116, 139);
          drawWrappedLines(optionsLines, 4);
        }
        y += 5;
      });

      doc.save(`${safeName}.pdf`);
    } catch (error) {
      console.error("FORM PDF ERROR:", error);
      alert("Unable to create the form PDF. Please try again.");
    }
  };

  const renderResumeBuilder = () => (
    <>
      <div className="page-header tool-page-header">
        <button
          className="back-button"
          onClick={showTools}
        >
          ← Back to Dashboard
        </button>

        <p className="eyebrow">CAREER TOOL</p>
        <h1>Resume Builder</h1>
        <p className="subtitle">
          Add your details and download a clean, professional resume PDF.
        </p>
      </div>

      <div className="resume-layout">
        <section className="editor-card">
          <div className="card-header">
            <h2>Your details</h2>
            <p>Fields can be left blank if they do not apply.</p>
          </div>

          <div className="resume-form-grid">
            <div className="form-group">
              <label htmlFor="resume-full-name">Full name *</label>
              <input
                id="resume-full-name"
                name="fullName"
                value={resumeData.fullName}
                onChange={handleResumeChange}
                placeholder="e.g. Aditi Sharma"
                autoComplete="name"
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label htmlFor="resume-job-title">Professional title</label>
              <input
                id="resume-job-title"
                name="jobTitle"
                value={resumeData.jobTitle}
                onChange={handleResumeChange}
                placeholder="e.g. Frontend Developer"
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label htmlFor="resume-email">Email</label>
              <input
                id="resume-email"
                name="email"
                type="email"
                value={resumeData.email}
                onChange={handleResumeChange}
                placeholder="you@example.com"
                autoComplete="email"
                maxLength={150}
              />
            </div>

            <div className="form-group">
              <label htmlFor="resume-phone">Phone</label>
              <input
                id="resume-phone"
                name="phone"
                type="tel"
                value={resumeData.phone}
                onChange={handleResumeChange}
                placeholder="+91 98765 43210"
                autoComplete="tel"
                maxLength={40}
              />
            </div>

            <div className="form-group resume-full-width">
              <label htmlFor="resume-location">Location</label>
              <input
                id="resume-location"
                name="location"
                value={resumeData.location}
                onChange={handleResumeChange}
                placeholder="City, Country"
                autoComplete="address-level2"
                maxLength={100}
              />
            </div>

            <div className="form-group resume-full-width">
              <label htmlFor="resume-summary">Professional summary</label>
              <textarea
                id="resume-summary"
                name="summary"
                rows="4"
                value={resumeData.summary}
                onChange={handleResumeChange}
                placeholder="Write a short introduction highlighting your experience and strengths."
                maxLength={1500}
              />
            </div>

            <div className="form-group resume-full-width">
              <label htmlFor="resume-experience">Work experience</label>
              <textarea
                id="resume-experience"
                name="experience"
                rows="6"
                value={resumeData.experience}
                onChange={handleResumeChange}
                placeholder={"Job title - Company (Year - Year)\nDescribe your responsibilities and achievements."}
                maxLength={5000}
              />
              <span className="resume-field-hint">
                Put each role or achievement on a new line.
              </span>
            </div>

            <div className="form-group resume-full-width">
              <label htmlFor="resume-education">Education</label>
              <textarea
                id="resume-education"
                name="education"
                rows="4"
                value={resumeData.education}
                onChange={handleResumeChange}
                placeholder={"Degree - School or University (Year)\nAdd relevant qualifications."}
                maxLength={3000}
              />
            </div>

            <div className="form-group resume-full-width">
              <label htmlFor="resume-skills">Skills</label>
              <input
                id="resume-skills"
                name="skills"
                value={resumeData.skills}
                onChange={handleResumeChange}
                placeholder="JavaScript, React, Communication"
                maxLength={500}
              />
              <span className="resume-field-hint">
                Separate skills with commas.
              </span>
            </div>
          </div>

          <button
            className="download-button resume-download-button"
            onClick={handleDownloadResumePDF}
          >
            Download Resume PDF
          </button>
        </section>

        <aside className="settings-card resume-preview-card">
          <div className="card-header">
            <h2>Resume preview</h2>
            <p>Your details update here as you type.</p>
          </div>

          <div className="resume-preview">
            <h3>{resumeData.fullName.trim() || "Your Name"}</h3>
            {resumeData.jobTitle && (
              <p className="resume-preview-title">
                {resumeData.jobTitle}
              </p>
            )}
            <p className="resume-preview-contact">
              {[
                resumeData.email,
                resumeData.phone,
                resumeData.location,
              ]
                .filter(Boolean)
                .join(" | ") || "Email | Phone | Location"}
            </p>

            {[
              ["Summary", resumeData.summary],
              ["Experience", resumeData.experience],
              ["Education", resumeData.education],
              ["Skills", resumeData.skills],
            ].map(
              ([heading, value]) =>
                value.trim() && (
                  <section
                    className="resume-preview-section"
                    key={heading}
                  >
                    <h4>{heading}</h4>
                    <p>{value}</p>
                  </section>
                ),
            )}
          </div>

          <p className="small-note">
            Your resume is created in your browser. Your details are not uploaded.
          </p>
        </aside>
      </div>
    </>
  );

  // =========================================================
  // TEXT TO SPEECH
  // =========================================================

  const renderTextToSpeech = () => (
    <>
      <div className="page-header tool-page-header">
        <button
          className="back-button"
          onClick={showTools}
        >
          ← Back to Dashboard
        </button>

        <p className="eyebrow">ACCESSIBILITY TOOL</p>
        <h1>Text to Speech</h1>
        <p className="subtitle">
          Listen to your text using voices available in your browser.
        </p>
      </div>

      <div className="speech-layout">
        <section className="editor-card">
          <div className="card-header">
            <h2>Text to read aloud</h2>
            <p>Choose a voice and adjust the playback to your preference.</p>
          </div>

          <div className="form-group speech-text-group">
            <label htmlFor="speech-text">Your text</label>
            <textarea
              id="speech-text"
              rows="10"
              value={speechText}
              onChange={(event) => {
                setSpeechText(event.target.value);
                setSpeechMessage("");
              }}
              placeholder="Type or paste the text you want to hear..."
              maxLength={5000}
            />
            <div className="speech-character-count">
              <span>
                {speechText.length} / 5000 characters
              </span>
              <span>
                {speechStatus === "speaking"
                  ? "Speaking"
                  : speechStatus === "paused"
                    ? "Paused"
                    : "Ready"}
              </span>
            </div>
          </div>

          <div className="speech-settings-grid">
            <div className="form-group">
              <label htmlFor="speech-voice">Voice</label>
              <select
                id="speech-voice"
                value={selectedVoice}
                onChange={(event) =>
                  setSelectedVoice(event.target.value)
                }
                disabled={!speechVoices.length}
              >
                {!speechVoices.length && (
                  <option value="">
                    Default browser voice
                  </option>
                )}
                {speechVoices.map((voice) => (
                  <option
                    key={voice.voiceURI}
                    value={voice.voiceURI}
                  >
                    {voice.name} ({voice.lang})
                    {voice.default ? " - Default" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group speech-range-group">
              <label htmlFor="speech-rate">
                Speed: {Number(speechRate).toFixed(1)}x
              </label>
              <input
                id="speech-rate"
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={speechRate}
                onChange={(event) =>
                  setSpeechRate(event.target.value)
                }
              />
            </div>

            <div className="form-group speech-range-group">
              <label htmlFor="speech-pitch">
                Pitch: {Number(speechPitch).toFixed(1)}
              </label>
              <input
                id="speech-pitch"
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={speechPitch}
                onChange={(event) =>
                  setSpeechPitch(event.target.value)
                }
              />
            </div>
          </div>

          <div className="speech-actions">
            <button
              className="download-button"
              onClick={handleSpeak}
              disabled={!speechSupported || !speechText.trim()}
            >
              ▶ {speechStatus === "paused" ? "Restart" : "Speak"}
            </button>
            <button
              className="speech-control-button"
              onClick={handlePauseResumeSpeech}
              disabled={
                !speechSupported ||
                (speechStatus !== "speaking" &&
                  speechStatus !== "paused")
              }
            >
              {speechStatus === "paused" ? "Resume" : "Pause"}
            </button>
            <button
              className="speech-control-button"
              onClick={handleStopSpeech}
              disabled={
                !speechSupported ||
                (speechStatus !== "speaking" &&
                  speechStatus !== "paused")
              }
            >
              Stop
            </button>
          </div>

          <p
            className={
              !speechSupported
                ? "speech-message speech-message-warning"
                : "speech-message"
            }
            role="status"
            aria-live="polite"
          >
            {!speechSupported
              ? "Text to Speech is not supported by this browser. Try a recent version of Chrome, Edge, or Safari."
              : speechMessage ||
                (speechVoices.length
                  ? `${speechVoices.length} browser voices available.`
                  : "Using the browser's default voice.")}
          </p>
        </section>
      </div>
    </>
  );

  const renderImageResizer = () => (
    <>
      <div className="page-header tool-page-header">
        <button
          className="back-button"
          onClick={showTools}
        >
          ← Back to Dashboard
        </button>
        <p className="eyebrow">IMAGE TOOL</p>
        <h1>Image Resizer</h1>
        <p className="subtitle">
          Change image pixel dimensions and compress it in your browser.
        </p>
      </div>

      <div className="image-resizer-layout">
        <section className="editor-card">
          <div className="card-header">
            <h2>Select an image</h2>
            <p>Supported formats: JPG, PNG, and WebP.</p>
          </div>

          <label className="upload-area resize-upload-area">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleResizeImageSelect}
            />
            <div className="upload-icon">↕</div>
            <strong>Click to choose an image</strong>
            <span>Image processing stays on this device.</span>
          </label>

          {resizeError && (
            <p className="tool-error-message" role="alert">
              {resizeError}
            </p>
          )}

          {resizePreview && resizeFile && (
            <div className="resize-image-preview">
              <img src={resizePreview} alt="Selected image preview" />
              <div>
                <strong>{resizeFile.name}</strong>
                <span>
                  Original: {resizeOriginalDimensions?.width} ×{" "}
                  {resizeOriginalDimensions?.height} px ·{" "}
                  {(resizeFile.size / 1024).toFixed(1)} KB
                </span>
              </div>
            </div>
          )}

          {resizeResult && (
            <div className="resize-result-card" role="status">
              <div>
                <strong>Resized image ready</strong>
                <span>
                  {resizeResult.width} × {resizeResult.height} px ·{" "}
                  {(resizeResult.size / 1024).toFixed(1)} KB
                </span>
              </div>
              <button
                className="download-button"
                onClick={handleDownloadResizedImage}
              >
                Download Image
              </button>
            </div>
          )}
        </section>

        <aside className="settings-card">
          <div className="card-header">
            <h2>Resize settings</h2>
            <p>Set the output dimensions in pixels.</p>
          </div>

          <div className="resize-dimensions-grid">
            <div className="form-group">
              <label htmlFor="resize-width">Width (px)</label>
              <input
                id="resize-width"
                type="number"
                min="1"
                max="12000"
                value={resizeWidth}
                onChange={(event) =>
                  handleResizeWidthChange(event.target.value)
                }
                disabled={!resizeFile}
              />
            </div>
            <div className="form-group">
              <label htmlFor="resize-height">Height (px)</label>
              <input
                id="resize-height"
                type="number"
                min="1"
                max="12000"
                value={resizeHeight}
                onChange={(event) =>
                  handleResizeHeightChange(event.target.value)
                }
                disabled={!resizeFile}
              />
            </div>
          </div>

          <label className="resize-aspect-option">
            <input
              type="checkbox"
              checked={lockAspectRatio}
              onChange={(event) =>
                setLockAspectRatio(event.target.checked)
              }
            />
            Keep original aspect ratio
          </label>

          <div className="form-group">
            <label htmlFor="resize-format">Output format</label>
            <select
              id="resize-format"
              value={resizeFormat}
              onChange={(event) => {
                setResizeFormat(event.target.value);
                setResizeResult(null);
              }}
              disabled={!resizeFile}
            >
              <option value="image/jpeg">JPG (smaller file)</option>
              <option value="image/png">PNG (transparent images)</option>
              <option value="image/webp">WebP (compact file)</option>
            </select>
          </div>

          <div className="form-group resize-quality-group">
            <label htmlFor="resize-quality">
              Quality: {Math.round(Number(resizeQuality) * 100)}%
            </label>
            <input
              id="resize-quality"
              type="range"
              min="0.4"
              max="1"
              step="0.05"
              value={resizeQuality}
              onChange={(event) => {
                setResizeQuality(event.target.value);
                setResizeResult(null);
              }}
              disabled={!resizeFile || resizeFormat === "image/png"}
            />
            <span className="resize-quality-hint">
              Quality changes JPG and WebP file size.
            </span>
          </div>

          <button
            className="download-button"
            onClick={handleResizeImage}
            disabled={!resizeFile}
          >
            Resize Image
          </button>
        </aside>
      </div>
    </>
  );

  const renderPdfToText = () => (
    <>
      <div className="page-header tool-page-header">
        <button
          className="back-button"
          onClick={showTools}
        >
          ← Back to Dashboard
        </button>
        <p className="eyebrow">DOCUMENT TOOL</p>
        <h1>PDF to Text</h1>
        <p className="subtitle">
          Extract selectable text from a PDF and save it as a text file.
        </p>
      </div>

      <div className="pdf-text-layout">
        <section className="editor-card">
          <div className="card-header">
            <h2>Choose a PDF</h2>
            <p>
              Your document is processed locally and is not uploaded.
            </p>
          </div>

          <label className="upload-area pdf-text-upload">
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleExtractPdfText}
              disabled={pdfTextStatus === "loading"}
            />
            <div className="upload-icon">📄</div>
            <strong>
              {pdfTextFile?.name || "Click to select a PDF"}
            </strong>
            <span>
              {pdfTextStatus === "loading"
                ? "Extracting text..."
                : pdfTextFile
                  ? `${pdfTextFile.name} · ${(pdfTextFile.size / 1024).toFixed(1)} KB`
                  : "Choose a text-based PDF file"}
            </span>
          </label>

          {pdfTextError && (
            <p className="tool-error-message" role="alert">
              {pdfTextError}
            </p>
          )}

          {pdfTextStatus === "loading" && (
            <p className="pdf-text-progress" role="status">
              Reading PDF pages and extracting text...
            </p>
          )}

          <div className="form-group pdf-text-result-group">
            <label htmlFor="pdf-text-result">Extracted text</label>
            <textarea
              id="pdf-text-result"
              rows="16"
              value={extractedPdfText}
              onChange={(event) =>
                setExtractedPdfText(event.target.value)
              }
              placeholder="Extracted PDF text will appear here. You can edit it before downloading."
              readOnly={pdfTextStatus !== "done"}
            />
          </div>

          <button
            className="download-button"
            onClick={handleDownloadExtractedText}
            disabled={!extractedPdfText}
          >
            Download Text File
          </button>
          <p className="small-note pdf-text-note">
            Scanned/image-only PDFs do not contain selectable text and need OCR;
            OCR is not included in this tool.
          </p>
        </section>
      </div>
    </>
  );

  const renderOcrLanguageSelect = (id) => (
    <div className="form-group">
      <label htmlFor={id}>OCR language</label>
      <select
        id={id}
        value={ocrLanguage}
        onChange={(event) => setOcrLanguage(event.target.value)}
        disabled={
          imageScanStatus === "loading" ||
          imageScanStatus === "scanning" ||
          scannedPdfStatus === "loading" ||
          scannedPdfStatus === "scanning"
        }
      >
        <option value="eng">English</option>
        <option value="hin">Hindi</option>
        <option value="eng+hin">English + Hindi</option>
      </select>
      <span className="ocr-language-hint">
        The OCR engine and selected language model download on first use.
        Your files are processed in this browser.
      </span>
    </div>
  );

  const renderImageOcrToPdf = () => (
    <>
      <div className="page-header tool-page-header">
        <button className="back-button" onClick={showTools}>
          ← Back to Tools
        </button>
        <p className="eyebrow">OCR IMAGE SCANNER</p>
        <h1>Scan Image to PDF</h1>
        <p className="subtitle">
          Recognize printed text in a photo or scan, edit the result, and
          download it as a PDF.
        </p>
      </div>

      <div className="ocr-tool-layout">
        <section className="editor-card">
          <div className="card-header">
            <h2>Choose images to scan</h2>
            <p>
              Use a clear, well-lit photo. JPG, PNG, or WebP; up to 10 images
              and 40 MB total.
            </p>
          </div>

          <label className="upload-area ocr-upload-area">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleImageScanSelection}
              disabled={
                imageScanStatus === "loading" ||
                imageScanStatus === "scanning"
              }
            />
            <div className="upload-icon">🔎</div>
            <strong>
              {imageScanFiles.length
                ? `${imageScanFiles.length} image(s) selected`
                : "Click to select image(s)"}
            </strong>
            <span>Selected files are processed on your device.</span>
          </label>

          {imageScanFiles.length > 0 && (
            <ul className="ocr-file-list">
              {imageScanFiles.map((file) => (
                <li key={`${file.name}-${file.lastModified}`}>
                  <span>{file.name}</span>
                  <small>{(file.size / 1024 / 1024).toFixed(1)} MB</small>
                </li>
              ))}
            </ul>
          )}

          {renderOcrLanguageSelect("image-ocr-language")}

          {(imageScanStatus === "loading" ||
            imageScanStatus === "scanning") && (
            <div className="ocr-progress-wrap" role="status">
              <div className="ocr-progress-label">
                <span>
                  {imageScanStatus === "loading"
                    ? "Preparing OCR engine..."
                    : "Recognizing image text..."}
                </span>
                <strong>{imageScanProgress}%</strong>
              </div>
              <progress
                className="ocr-progress"
                value={imageScanProgress}
                max="100"
              />
            </div>
          )}

          {imageScanError && (
            <p className="tool-error-message" role="alert">
              {imageScanError}
            </p>
          )}

          <button
            className="download-button ocr-primary-action"
            onClick={handleScanImagesToPdf}
            disabled={
              !imageScanFiles.length ||
              imageScanStatus === "loading" ||
              imageScanStatus === "scanning"
            }
          >
            {imageScanStatus === "loading" ||
            imageScanStatus === "scanning"
              ? "Scanning..."
              : "Scan Text"}
          </button>

          {imageScanText && (
            <>
              <div className="form-group ocr-result-group">
                <label htmlFor="image-ocr-result">
                  Recognized text (editable)
                </label>
                <textarea
                  id="image-ocr-result"
                  rows="12"
                  value={imageScanText}
                  onChange={(event) =>
                    setImageScanText(event.target.value)
                  }
                />
              </div>
              <button
                className="download-button"
                onClick={handleDownloadImageScanPdf}
              >
                Download Text as PDF
              </button>
              <button
                className="clear-button"
                onClick={handleDownloadImageScanText}
              >
                Download Text File
              </button>
            </>
          )}
        </section>
      </div>
    </>
  );

  const renderScannedPdfToText = () => (
    <>
      <div className="page-header tool-page-header">
        <button className="back-button" onClick={showTools}>
          ← Back to Tools
        </button>
        <p className="eyebrow">OCR PDF SCANNER</p>
        <h1>Scanned PDF to Text</h1>
        <p className="subtitle">
          Use OCR to recognize text in scanned PDF pages and download the
          editable result.
        </p>
      </div>

      <div className="ocr-tool-layout">
        <section className="editor-card">
          <div className="card-header">
            <h2>Select a scanned PDF</h2>
            <p>
              Supports PDFs up to 50 MB and 25 pages. Scanned pages are
              recognized in your browser.
            </p>
          </div>

          <label className="upload-area ocr-upload-area">
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleScannedPdfSelection}
              disabled={
                scannedPdfStatus === "loading" ||
                scannedPdfStatus === "scanning"
              }
            />
            <div className="upload-icon">📑</div>
            <strong>
              {scannedPdfFile?.name || "Click to choose a scanned PDF"}
            </strong>
            <span>
              {scannedPdfFile
                ? `${(scannedPdfFile.size / 1024 / 1024).toFixed(1)} MB`
                : "PDF pages will be rendered locally for OCR"}
            </span>
          </label>

          {renderOcrLanguageSelect("scanned-pdf-ocr-language")}

          {(scannedPdfStatus === "loading" ||
            scannedPdfStatus === "scanning") && (
            <div className="ocr-progress-wrap" role="status">
              <div className="ocr-progress-label">
                <span>
                  {scannedPdfStatus === "loading"
                    ? "Preparing PDF and OCR engine..."
                    : "Recognizing scanned PDF pages..."}
                </span>
                <strong>{scannedPdfProgress}%</strong>
              </div>
              <progress
                className="ocr-progress"
                value={scannedPdfProgress}
                max="100"
              />
            </div>
          )}

          {scannedPdfError && (
            <p className="tool-error-message" role="alert">
              {scannedPdfError}
            </p>
          )}

          <button
            className="download-button ocr-primary-action"
            onClick={handleScanPdfToText}
            disabled={
              !scannedPdfFile ||
              scannedPdfStatus === "loading" ||
              scannedPdfStatus === "scanning"
            }
          >
            {scannedPdfStatus === "loading" ||
            scannedPdfStatus === "scanning"
              ? "Scanning..."
              : "Scan PDF"}
          </button>

          {scannedPdfText && (
            <>
              <div className="form-group ocr-result-group">
                <label htmlFor="scanned-pdf-result">
                  Recognized text (editable)
                </label>
                <textarea
                  id="scanned-pdf-result"
                  rows="16"
                  value={scannedPdfText}
                  onChange={(event) =>
                    setScannedPdfText(event.target.value)
                  }
                />
              </div>
              <button
                className="download-button"
                onClick={handleDownloadScannedPdfText}
              >
                Download Text File
              </button>
            </>
          )}

          <p className="small-note ocr-privacy-note">
            OCR runs in your browser. The OCR engine and language model
            download on first use; your image and PDF contents are not uploaded.
          </p>
        </section>
      </div>
    </>
  );

  const renderFormBuilder = () => (
    <>
      <div className="page-header tool-page-header">
        <button
          className="back-button"
          onClick={showTools}
        >
          ← Back to Dashboard
        </button>
        <p className="eyebrow">FORM TOOL</p>
        <h1>Custom Form Builder</h1>
        <p className="subtitle">
          Start with a template, customize its questions, and download your
          form as PDF or text.
        </p>
      </div>

      <div className="form-builder-layout">
        <section className="editor-card">
          <div className="card-header">
            <h2>Customize your form</h2>
            <p>Select a template and edit its title, description, and fields.</p>
          </div>

          <div className="form-group">
            <label htmlFor="form-template">Starting template</label>
            <select
              id="form-template"
              value={selectedFormTemplate}
              onChange={(event) =>
                handleFormTemplateChange(event.target.value)
              }
            >
              <option value="school">School admission</option>
              <option value="event">Event registration</option>
              <option value="contact">Contact form</option>
              <option value="feedback">Feedback form</option>
              {selectedFormTemplate === "custom" && (
                <option value="custom">Custom form</option>
              )}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="custom-form-title">Form title</label>
            <input
              id="custom-form-title"
              value={formTitle}
              onChange={(event) => setFormTitle(event.target.value)}
              maxLength={120}
              placeholder="Enter a form title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="custom-form-description">Description</label>
            <textarea
              id="custom-form-description"
              rows="3"
              value={formDescription}
              onChange={(event) => setFormDescription(event.target.value)}
              maxLength={500}
              placeholder="Add instructions for people filling out the form"
            />
          </div>

          <div className="custom-fields-heading">
            <div>
              <h3>Form fields</h3>
              <p>{customFormFields.length} question(s)</p>
            </div>
            <button
              className="add-item-button"
              onClick={addCustomFormField}
            >
              + Add field
            </button>
          </div>

          <div className="custom-form-field-list">
            {customFormFields.map((field, index) => (
              <div className="custom-form-field-card" key={field.id}>
                <div className="custom-form-field-title">
                  <strong>Question {index + 1}</strong>
                  <button
                    className="remove-item-button"
                    onClick={() => removeCustomFormField(field.id)}
                    aria-label={`Remove question ${index + 1}`}
                  >
                    ✕
                  </button>
                </div>
                <div className="form-group">
                  <label htmlFor={`field-label-${field.id}`}>
                    Question label
                  </label>
                  <input
                    id={`field-label-${field.id}`}
                    value={field.label}
                    onChange={(event) =>
                      updateCustomFormField(
                        field.id,
                        "label",
                        event.target.value,
                      )
                    }
                    maxLength={120}
                    placeholder="Enter a question"
                  />
                </div>
                <div className="custom-field-options">
                  <div className="form-group">
                    <label htmlFor={`field-type-${field.id}`}>
                      Answer type
                    </label>
                    <select
                      id={`field-type-${field.id}`}
                      value={field.type}
                      onChange={(event) =>
                        updateCustomFormField(
                          field.id,
                          "type",
                          event.target.value,
                        )
                      }
                    >
                      <option value="text">Short text</option>
                      <option value="textarea">Long text</option>
                      <option value="email">Email</option>
                      <option value="tel">Phone</option>
                      <option value="number">Number</option>
                      <option value="date">Date</option>
                      <option value="select">Dropdown</option>
                      <option value="checkbox">Yes / No</option>
                    </select>
                  </div>
                  <label className="form-required-option">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(event) =>
                        updateCustomFormField(
                          field.id,
                          "required",
                          event.target.checked,
                        )
                      }
                    />
                    Required
                  </label>
                </div>
                {field.type === "select" && (
                  <div className="form-group">
                    <label htmlFor={`field-options-${field.id}`}>
                      Dropdown options
                    </label>
                    <input
                      id={`field-options-${field.id}`}
                      value={field.options}
                      onChange={(event) =>
                        updateCustomFormField(
                          field.id,
                          "options",
                          event.target.value,
                        )
                      }
                      maxLength={300}
                      placeholder="Separate options with commas"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="form-download-actions">
            <button
              className="download-button"
              onClick={() => handleDownloadForm("pdf")}
              disabled={!customFormFields.length}
            >
              Download PDF
            </button>
            <button
              className="speech-control-button"
              onClick={() => handleDownloadForm("text")}
              disabled={!customFormFields.length}
            >
              Download Text
            </button>
          </div>
          <p className="small-note form-download-note">
            PDF and text downloads include your current answers and leave
            unanswered fields blank.
          </p>
        </section>

        <aside className="settings-card form-preview-card">
          <div className="card-header">
            <h2>Form preview</h2>
            <p>Try filling the fields before downloading.</p>
          </div>
          <div className="custom-form-preview">
            <h3>{formTitle.trim() || "Untitled form"}</h3>
            {formDescription.trim() && <p>{formDescription}</p>}
            {customFormFields.length ? (
              customFormFields.map((field, index) => (
                <div className="form-group" key={field.id}>
                  <label htmlFor={`preview-field-${field.id}`}>
                    {field.label.trim() || `Question ${index + 1}`}
                    {field.required && <span> *</span>}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      id={`preview-field-${field.id}`}
                      rows="3"
                      value={field.value}
                      onChange={(event) =>
                        updateCustomFormField(
                          field.id,
                          "value",
                          event.target.value,
                        )
                      }
                      placeholder="Your answer"
                    />
                  ) : field.type === "checkbox" ? (
                    <label className="form-preview-checkbox">
                      <input
                        id={`preview-field-${field.id}`}
                        type="checkbox"
                        checked={Boolean(field.value)}
                        onChange={(event) =>
                          updateCustomFormField(
                            field.id,
                            "value",
                            event.target.checked,
                          )
                        }
                      />
                      Yes
                    </label>
                  ) : field.type === "select" ? (
                    <select
                      id={`preview-field-${field.id}`}
                      value={field.value}
                      onChange={(event) =>
                        updateCustomFormField(
                          field.id,
                          "value",
                          event.target.value,
                        )
                      }
                    >
                      <option value="">Select an option</option>
                      {field.options
                        .split(",")
                        .map((option) => option.trim())
                        .filter(Boolean)
                        .map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                    </select>
                  ) : (
                    <input
                      id={`preview-field-${field.id}`}
                      type={field.type}
                      value={field.value}
                      onChange={(event) =>
                        updateCustomFormField(
                          field.id,
                          "value",
                          event.target.value,
                        )
                      }
                      placeholder="Your answer"
                    />
                  )}
                </div>
              ))
            ) : (
              <p className="form-preview-empty">
                Add a field to start building your form.
              </p>
            )}
          </div>
        </aside>
      </div>
    </>
  );

  // =========================================================
  // COMING SOON
  // =========================================================

  const renderComingSoon =
    () => {
      return (
        <div className="coming-page">
          <div className="coming-icon">
            🚀
          </div>

          <p className="eyebrow">
            YOGEN TOOLS
          </p>

          <h1>
            Coming Soon
          </h1>

          <p>
            This tool is part of the next
            development phase. We are building
            the complete Yogen Tools ecosystem
            step by step.
          </p>

          <button
            className="primary-button"
            onClick={showTools}
          >
            ← Back to Tools
          </button>
        </div>
      );
    };

  // =========================================================
  // MAIN APP
  // =========================================================

  return (
    <div className="app">
      <header className="site-header">
        <button
          className="site-brand"
          onClick={goHome}
          aria-label="Yogen Tools home"
        >
          <span className="site-brand-mark">Y</span>
          <span className="site-brand-copy">
            <strong>Yogen Tools</strong>
            <small>by Abhishek Chauhan</small>
          </span>
        </button>

        <nav className="top-nav" aria-label="Main navigation">
          <button
            className={
              activeSection === "home" ? "top-nav-link active" : "top-nav-link"
            }
            onClick={goHome}
          >
            Home
          </button>

          <div className="top-nav-tools">
            <button
              className={
                activeSection === "tools" ? "top-nav-link active" : "top-nav-link"
              }
              onClick={showTools}
            >
              Tools
            </button>
            <button
              className="top-nav-caret"
              aria-label="Toggle tools menu"
              aria-expanded={toolsMenuOpen}
              onClick={() => setToolsMenuOpen((isOpen) => !isOpen)}
            >
              ▾
            </button>
            {toolsMenuOpen && (
              <div className="tools-dropdown">
                <button
                  className="dropdown-all-tools"
                  onClick={showTools}
                >
                  Browse all tools <span aria-hidden="true">→</span>
                </button>
                {tools.map((tool) => (
                  <button
                    key={tool.id}
                    className="dropdown-tool-link"
                    onClick={() => openTool(tool.id)}
                  >
                    <span>{tool.icon}</span>
                    {tool.name}
                    {!tool.available && (
                      <small>Coming soon</small>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            className={
              activeSection === "blog" ? "top-nav-link active" : "top-nav-link"
            }
            onClick={() => {
              setActiveSection("blog");
              setToolsMenuOpen(false);
            }}
          >
            Blog
          </button>
          <button
            className={
              activeSection === "about" ? "top-nav-link active" : "top-nav-link"
            }
            onClick={() => {
              setActiveSection("about");
              setToolsMenuOpen(false);
            }}
          >
            About
          </button>
          <a
            className="top-nav-contact"
            href="https://wa.me/918171915305?text=Hi%20Abhishek%2C%20I%20visited%20Yogen%20Tools."
            target="_blank"
            rel="noreferrer"
          >
            Contact <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>

      {/* SIDEBAR */}

      {activeSection === "tools" && (
        <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">
            Y
          </div>

          <div>
            <h2>
              Yogen Tools
            </h2>

            <span>
              Yogen Infotech
            </span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={
              activeTool === "tools"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={showTools}
          >
            <span>
              ▦
            </span>

            All Tools
          </button>

          <button
            className={
              activeTool ===
              "text-pdf"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              openTool(
                "text-pdf",
              )
            }
          >
            <span>
              📄
            </span>

            Text to PDF
          </button>

          <button
            className={
              activeTool ===
              "image-pdf"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              openTool(
                "image-pdf",
              )
            }
          >
            <span>
              🖼️
            </span>

            Image to PDF
          </button>

          <button
            className={
              activeTool ===
              "qr"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              openTool("qr")
            }
          >
            <span>
              🔲
            </span>

            QR Code Generator
          </button>

          <button
            className={
              activeTool ===
              "invoice"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              openTool(
                "invoice",
              )
            }
          >
            <span>
              🧾
            </span>

            Invoice Generator
          </button>

          <div className="nav-label">
            MORE TOOLS
          </div>

          {tools
            .filter(
              (tool) =>
                tool.id !==
                  "text-pdf" &&
                tool.id !==
                  "image-pdf" &&
                tool.id !== "qr" &&
                tool.id !==
                  "invoice",
            )
            .map((tool) => (
              <button
                key={tool.id}
                className={
                  activeTool ===
                  tool.id
                    ? "nav-item active"
                    : "nav-item"
                }
                onClick={() =>
                  openTool(
                    tool.id,
                  )
                }
              >
                <span>
                  {tool.icon}
                </span>

                {tool.name}
              </button>
            ))}
        </nav>

        <div className="sidebar-footer">
          <strong>
            Yogen Infotech
          </strong>

          <span>
            Build smart. Work faster.
          </span>
        </div>
        </aside>
      )}

      {/* MAIN CONTENT */}

      <main
        className={
          activeSection === "tools"
            ? "main-content has-sidebar"
            : "main-content"
        }
      >
        {activeSection === "home" && renderDashboard()}

        {activeSection === "tools" &&
          activeTool === "tools" &&
          renderToolsPage()}

        {activeSection === "blog" && renderBlogPage()}

        {activeSection === "about" && renderAboutPage()}

        {activeSection === "tools" &&
          activeTool ===
          "text-pdf" &&
          renderTextToPDF()}

        {activeSection === "tools" &&
          activeTool ===
          "image-pdf" &&
          renderImageToPDF()}

        {activeSection === "tools" &&
          activeTool ===
          "qr" &&
          renderQRCode()}

        {activeSection === "tools" &&
          activeTool ===
          "invoice" &&
          renderInvoice()}

        {activeSection === "tools" &&
          activeTool ===
          "resume" &&
          renderResumeBuilder()}

        {activeSection === "tools" &&
          activeTool ===
          "speech" &&
          renderTextToSpeech()}

        {activeSection === "tools" &&
          activeTool ===
          "image-resize" &&
          renderImageResizer()}

        {activeSection === "tools" &&
          activeTool ===
          "pdf-text" &&
          renderPdfToText()}

        {activeSection === "tools" &&
          activeTool ===
          "image-ocr-pdf" &&
          renderImageOcrToPdf()}

        {activeSection === "tools" &&
          activeTool ===
          "scanned-pdf-text" &&
          renderScannedPdfToText()}

        {activeSection === "tools" &&
          activeTool ===
          "form-builder" &&
          renderFormBuilder()}

        {activeSection === "tools" &&
          activeTool ===
          "coming-soon" &&
          renderComingSoon()}
      </main>
    </div>
  );
}

export default App;
