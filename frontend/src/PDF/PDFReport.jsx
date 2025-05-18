import React, { useEffect, useRef, useState } from "react";
import generatePDF from 'react-to-pdf';
import { getReportById } from "../api/testReportApi";
import html2pdf from "html2pdf.js";
import PDFContent from "./PDFContent";

import '../styles/pdf.css'

const ReportPDF = ({ reportId }) => {
    const targetRef = useRef();
    const [loadingStep, setLoadingStep] = useState(""); // "", "generating", "uploading", "sharing"
    const [fileIoLink, setFileIoLink] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState("917498573735");
    const [initialData, setInitialData] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);


    // Basic phone validation: only digits, length 8-15 (typical international)
    const isValidPhoneNumber = (num) => {
        const digitsOnly = num.replace(/\D/g, "");
        return digitsOnly.length >= 8 && digitsOnly.length <= 15;
    };

    const generatePdfBlob = async (element) => {
        return new Promise((resolve, reject) => {
            const opt = {
                // margin: 0.5,
                filename: "document.pdf",
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
            };

            html2pdf()
                .set(opt)
                .from(element)
                .outputPdf("blob")
                .then(blob => resolve(blob))
                .catch(err => reject(err));
        });
    };

    const handleFullProcess = async () => {
        if (!isValidPhoneNumber(phoneNumber)) {
            alert("Please enter a valid phone number (digits only, 8-15 digits). Include country code, e.g. 919876543210");
            return;
        }

        setLoadingStep("generating");

        try {
            // Step 1: Generate PDF Blob
            const pdfBlob = await generatePdfBlob(targetRef.current);

            setLoadingStep("uploading");

            // Step 2: Upload to file.io
            const formData = new FormData();
            formData.append("file", pdfBlob, `${initialData.testCertNo}.pdf`);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!(data.status === "ok" && data.data && data.data.downloadPage)) {
                throw new Error(data.status || "File upload failed.");
            }

            const downloadLink = data.data.downloadPage;
            setFileIoLink(downloadLink);
            setLoadingStep("sharing");

            // Step 3: Share on WhatsApp to specific phone number
            const digitsOnlyPhone = phoneNumber.replace(/\D/g, "");
            const message = encodeURIComponent(`Download it now: ${downloadLink}`);
            const waLink = `https://wa.me/${digitsOnlyPhone}?text=${message}`;
            window.open(waLink, "_blank");

        } catch (err) {
            console.error("Error during process:", err);
            alert(err.message || "Failed to complete the process.");
        } finally {
            setLoadingStep("");
        }
    };

    // Button label depending on step
    const buttonLabel = {
        "": "Generate PDF & Share on WhatsApp",
        generating: "Generating PDF...",
        uploading: "Creating temporary link for PDF to share on WhatsApp...",
        sharing: "Opening WhatsApp...",
    }[loadingStep];

    useEffect(() => {
        getReportById(reportId).then(res => {
            setInitialData(res.report)
        });
    }, [reportId]);

    if (initialData === null) return <div>Loading...</div>;

    else if (initialData === undefined) return <div>Report is Undefined</div>

    else return (

        <div className="pdf-actions-container">
            <div className="action-left">
                <button
                    className="primary-button"
                    onClick={async () => {
                        setIsGenerating(true);
                        try {
                            await generatePDF(targetRef, { filename: `${initialData.testCertNo}.pdf` });
                        } catch (err) {
                            console.error("PDF generation error:", err);
                        } finally {
                            setIsGenerating(false);
                        }
                    }}
                    disabled={isGenerating}
                >
                    {isGenerating ? "Generating PDF..." : "Generate & Download PDF"}
                </button>

            </div>

            <div className="action-right">
                <input
                    type="tel"
                    placeholder="Enter phone number with country code (e.g. 919876543210)"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={loadingStep !== ""}
                    className="input-field"
                />
                <button
                    onClick={handleFullProcess}
                    disabled={loadingStep !== ""}
                    className="primary-button"
                >
                    {buttonLabel}
                </button>
            </div>

            <div className="pdf-preview">
                <PDFContent ref={targetRef} report={initialData} />
            </div>
        </div>


    );
};

export default ReportPDF;
