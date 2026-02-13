/**
 * Document Verifier
 * Validates uploaded documents (surat izin / surat permohonan) for auto-approve.
 * 
 * Level 1: File validation (PDF only, min size, magic bytes, page count)
 * Level 2: OCR keyword matching (extract text, check required keywords)
 */

import { readFile, access } from 'fs/promises';
import path from 'path';

// pdf-parse doesn't ship types, so require it
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse');

// ─── Types ───────────────────────────────────────────────────

export type DocumentType = 'suratIzin' | 'suratPermohonan';

export interface FileValidationResult {
    valid: boolean;
    reason?: string;
}

export interface VerificationResult {
    valid: boolean;
    score: number; // 0-100 percentage
    matchedKeywords: string[];
    missingKeywords: string[];
}

// ─── Keyword Configuration ──────────────────────────────────

/** Shared keywords for all document types */
const SHARED_KEYWORDS = [
    'UNIVERSITAS AL-AZHAR INDONESIA',
    'FAKULTAS SAINS DAN TEKNOLOGI',
    'Informatika',
    'Nomor',
    'Perihal',
    'Lampiran',
    'Menyetujui',
];

/** Keywords specific to each document type */
const TYPE_KEYWORDS: Record<DocumentType, string[][]> = {
    suratIzin: [
        ['peminjaman'],
        ['permohonan'],
        ['kegiatan'],
        ['Dekan', 'Wakil Dekan', 'Rektor'],          // any one matches
        ['Ketua Pelaksana', 'Ketua Himpunan'],        // any one matches
        ['ttd', 'tanda tangan', 'Tanda Tangan'],
    ],
    suratPermohonan: [
        ['peminjaman', 'penggunaan ruangan'],
        ['permohonan'],
        ['kegiatan'],
        ['Ketua Program Studi', 'Dekan', 'Wakil Dekan'],
        ['Ketua Pelaksana', 'Ketua Himpunan'],
        ['ttd', 'tanda tangan', 'Tanda Tangan'],
    ],
};

const MIN_FILE_SIZE = 5 * 1024; // 5KB minimum
const PDF_MAGIC_BYTES = Buffer.from('%PDF-');
const VALIDITY_THRESHOLD = 0.5; // 50% of keywords must match

// ─── Document Verifier ──────────────────────────────────────

export class DocumentVerifier {
    /**
     * Level 1: Validate file basics (exists, size, is valid PDF)
     */
    static async validateFile(filePath: string): Promise<FileValidationResult> {
        const absolutePath = path.join(process.cwd(), 'public', filePath);

        // Check file exists
        try {
            await access(absolutePath);
        } catch {
            return { valid: false, reason: 'File tidak ditemukan' };
        }

        // Read file
        const buffer = await readFile(absolutePath);

        // Check minimum size
        if (buffer.length < MIN_FILE_SIZE) {
            return { valid: false, reason: 'File terlalu kecil (minimal 5KB)' };
        }

        // Check PDF magic bytes
        const header = buffer.subarray(0, 5);
        if (!header.equals(PDF_MAGIC_BYTES)) {
            return { valid: false, reason: 'File bukan PDF yang valid' };
        }

        // Try parsing PDF to check page count
        try {
            const pdf = await pdfParse(buffer);
            if (!pdf.numpages || pdf.numpages < 1) {
                return { valid: false, reason: 'PDF tidak memiliki halaman' };
            }
        } catch {
            return { valid: false, reason: 'PDF tidak dapat dibaca / rusak' };
        }

        return { valid: true };
    }

    /**
     * Level 2: Extract text from PDF and check for required keywords
     */
    static async verifyDocument(
        filePath: string,
        type: DocumentType
    ): Promise<VerificationResult> {
        const absolutePath = path.join(process.cwd(), 'public', filePath);
        const buffer = await readFile(absolutePath);

        // Extract text
        let text = '';
        try {
            const pdf = await pdfParse(buffer);
            text = pdf.text || '';
        } catch {
            return {
                valid: false,
                score: 0,
                matchedKeywords: [],
                missingKeywords: ['(gagal membaca PDF)'],
            };
        }

        // Normalize text for matching (keep original case for case-sensitive keywords)
        const textLower = text.toLowerCase();

        const matched: string[] = [];
        const missing: string[] = [];

        // Check shared keywords
        for (const keyword of SHARED_KEYWORDS) {
            if (textLower.includes(keyword.toLowerCase())) {
                matched.push(keyword);
            } else {
                missing.push(keyword);
            }
        }

        // Check type-specific keywords (each group = any one matches)
        const typeKeywordGroups = TYPE_KEYWORDS[type];
        for (const group of typeKeywordGroups) {
            const groupLabel = group.join('/');
            const found = group.some(kw => textLower.includes(kw.toLowerCase()));
            if (found) {
                matched.push(groupLabel);
            } else {
                missing.push(groupLabel);
            }
        }

        const total = matched.length + missing.length;
        const score = total > 0 ? Math.round((matched.length / total) * 100) : 0;
        const valid = score >= VALIDITY_THRESHOLD * 100;

        return { valid, score, matchedKeywords: matched, missingKeywords: missing };
    }

    /**
     * Full verification pipeline: file validation + keyword matching
     */
    static async verify(
        filePath: string,
        type: DocumentType
    ): Promise<{ fileValid: boolean; verification: VerificationResult | null; reason?: string }> {
        // Level 1: File validation
        const fileResult = await this.validateFile(filePath);
        if (!fileResult.valid) {
            return {
                fileValid: false,
                verification: null,
                reason: fileResult.reason,
            };
        }

        // Level 2: Keyword matching
        const verification = await this.verifyDocument(filePath, type);

        return {
            fileValid: true,
            verification,
        };
    }
}
