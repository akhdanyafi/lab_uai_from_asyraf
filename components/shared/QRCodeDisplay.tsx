'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Download } from 'lucide-react';

export default function QRCodeDisplay({ value }: { value: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (canvasRef.current) {
            QRCode.toCanvas(canvasRef.current, value, { width: 80, margin: 1 });
        }
    }, [value]);

    const downloadQR = () => {
        if (canvasRef.current) {
            const url = canvasRef.current.toDataURL();
            const link = document.createElement('a');
            link.download = `qr-${value}.png`;
            link.href = url;
            link.click();
        }
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
                            <canvas ref={canvasRef} className="border-2 border-gray-200 rounded-lg" />
                        </div>
                        <p className="text-sm text-gray-600 text-center mb-4 font-mono">{value}</p>
                        <div className="flex gap-2">
                            <button
                                onClick={downloadQR}
                                className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
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
