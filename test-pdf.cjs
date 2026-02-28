const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

const f = path.join(process.cwd(), 'public', 'uploads', 'surat-izin-peminjaman', '1767844246242-Analisis_Metode_Pengembangan_Sistem_Info.pdf');
console.log('exists:', fs.existsSync(f));

const buf = fs.readFileSync(f);
console.log('size:', buf.length, 'magic:', buf.subarray(0, 5).toString());

pdfParse(buf).then(d => {
    console.log('pages:', d.numpages, 'textLen:', d.text.length);
    console.log('text300:', d.text.substring(0, 300));
}).catch(e => {
    console.error('ERR:', e.message);
    console.error('STACK:', e.stack);
});
