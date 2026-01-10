'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Download, ExternalLink } from 'lucide-react';

interface QRCodeDisplayProps {
    value: string; // The QR code value (e.g., "ITEM-xxx")
    baseUrl?: string; // Optional base URL for the QR link
}

export default function QRCodeDisplay({ value, baseUrl }: QRCodeDisplayProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const modalCanvasRef = useRef<HTMLCanvasElement>(null);
    const [showModal, setShowModal] = useState(false);

    // Build the full URL if baseUrl is provided
    const qrUrl = baseUrl ? `${baseUrl}/items/${value}` : value;

    useEffect(() => {
        if (canvasRef.current) {
            QRCode.toCanvas(canvasRef.current, qrUrl, { width: 80, margin: 1 });
        }
    }, [qrUrl]);

    useEffect(() => {
        if (showModal && modalCanvasRef.current) {
            QRCode.toCanvas(modalCanvasRef.current, qrUrl, { width: 200, margin: 2 });
        }
    }, [showModal, qrUrl]);

    const downloadQR = async () => {
        // Create a new canvas for download with larger size
        const canvas = document.createElement('canvas');
        await QRCode.toCanvas(canvas, qrUrl, { width: 400, margin: 2 });
        const url = canvas.toDataURL();
        const link = document.createElement('a');
        link.download = `qr-${value}.png`;
        link.href = url;
        link.click();
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="hover:opacity-75 transition-opacity"
            >
                <canvas ref={canvasRef} className="border border-gray-200 rounded" />
            </button>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
                    <div className="bg-white p-8 rounded-xl shadow-xl max-w-sm" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold mb-4">QR Code</h3>
                        <div className="flex justify-center mb-4">
                            <canvas ref={modalCanvasRef} className="border-2 border-gray-200 rounded-lg" />
                        </div>
                        <p className="text-sm text-gray-600 text-center mb-2 font-mono break-all">{value}</p>
                        {baseUrl && (
                            <a
                                href={qrUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-1 text-xs text-[#0F4C81] hover:underline mb-4"
                            >
                                <ExternalLink className="w-3 h-3" />
                                Buka halaman
                            </a>
                        )}
                        <div className="flex gap-2">
                            <button
                                onClick={downloadQR}
                                className="flex-1 bg-[#0F4C81] text-white px-4 py-2 rounded-lg hover:bg-[#0F4C81]/90 transition-colors flex items-center justify-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Download
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
