// Standard PDF-1.4 Generator and Download Helper for Tamil Designer Studio Course Syllabuses

import { CourseStageSyllabus } from '../types';

/**
 * Escapes characters for PDF literal strings in parentheses: ( ... )
 */
function escapePdfText(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/[^\x20-\x7E]/g, ' '); // Keep printable ASCII
}

/**
 * Generates a valid, beautifully formatted PDF 1.4 document Blob for any syllabus stage.
 */
export function generateStageSyllabusPdf(stage: CourseStageSyllabus): Blob {
  const title = escapePdfText(stage.title || 'Course Syllabus');
  const level = escapePdfText(stage.level || 'Academic Course');
  const badge = escapePdfText(stage.badge || 'Official Curriculum');
  const description = escapePdfText(stage.description || '');

  const topics = (stage.highlights || []).map((t, i) => `${i + 1}. ${escapePdfText(t)}`);

  // Build PDF content streams
  // A4 size: 595.28 x 841.89 points
  const streamCommands: string[] = [];

  // 1. Header Banner Background (Deep Navy/Burgundy Studio Theme)
  streamCommands.push('0.09 0.08 0.13 rg'); // #171421
  streamCommands.push('30 730 535 80 re f');

  // Gold accent border under banner
  streamCommands.push('0.85 0.65 0.23 rg'); // Gold #D9A73A
  streamCommands.push('30 726 535 4 re f');

  // Studio Header Text
  streamCommands.push('BT');
  streamCommands.push('/F2 20 Tf');
  streamCommands.push('1 1 1 rg'); // White
  streamCommands.push('48 775 Td');
  streamCommands.push('(TAMIL DESIGNER STUDIO) Tj');
  streamCommands.push('ET');

  streamCommands.push('BT');
  streamCommands.push('/F1 10 Tf');
  streamCommands.push('0.91 0.75 0.34 rg'); // Light Gold
  streamCommands.push('48 757 Td');
  streamCommands.push('(SCHOOL OF FASHION DESIGN & TAILORING - COIMBATORE) Tj');
  streamCommands.push('ET');

  streamCommands.push('BT');
  streamCommands.push('/F1 8 Tf');
  streamCommands.push('0.8 0.8 0.8 rg');
  streamCommands.push('48 743 Td');
  streamCommands.push('(Govt. Regd. & ISO Certified - ISEIT India Federation Affiliated) Tj');
  streamCommands.push('ET');

  // 2. Syllabus Title & Level Badge
  streamCommands.push('BT');
  streamCommands.push('/F2 16 Tf');
  streamCommands.push('0.15 0.10 0.05 rg'); // Dark Brown #27190D
  streamCommands.push('40 685 Td');
  streamCommands.push(`(${title}) Tj`);
  streamCommands.push('ET');

  streamCommands.push('BT');
  streamCommands.push('/F2 9 Tf');
  streamCommands.push('0.72 0.52 0.12 rg'); // Amber
  streamCommands.push('40 668 Td');
  streamCommands.push(`(LEVEL: ${level.toUpperCase()}  |  ${badge.toUpperCase()}) Tj`);
  streamCommands.push('ET');

  // Divider line
  streamCommands.push('0.85 0.82 0.78 RG');
  streamCommands.push('1 w');
  streamCommands.push('40 658 m 555 658 l S');

  // Description box background
  streamCommands.push('0.98 0.96 0.93 rg'); // Warm cream
  streamCommands.push('40 600 515 48 re f');
  streamCommands.push('0.88 0.84 0.77 RG');
  streamCommands.push('0.5 w');
  streamCommands.push('40 600 515 48 re S');

  // Description text
  streamCommands.push('BT');
  streamCommands.push('/F1 9 Tf');
  streamCommands.push('0.25 0.2 0.15 rg');
  streamCommands.push('50 632 Td');
  streamCommands.push(`(${description.slice(0, 95)}) Tj`);
  if (description.length > 95) {
    streamCommands.push('0 -13 Td');
    streamCommands.push(`(${description.slice(95, 190)}) Tj`);
  }
  streamCommands.push('ET');

  // 3. Curriculum Syllabus Modules Header
  streamCommands.push('BT');
  streamCommands.push('/F2 12 Tf');
  streamCommands.push('0.15 0.10 0.05 rg');
  streamCommands.push('40 570 Td');
  streamCommands.push('(DETAILED CURRICULUM & PRACTICAL TOPICS:) Tj');
  streamCommands.push('ET');

  // Curriculum topics list
  let currentY = 545;
  topics.forEach((topic) => {
    // Bullet / item card
    streamCommands.push('0.96 0.95 0.98 rg');
    streamCommands.push(`40 ${currentY - 4} 515 22 re f`);
    streamCommands.push('0.85 0.78 0.90 RG');
    streamCommands.push('0.5 w');
    streamCommands.push(`40 ${currentY - 4} 515 22 re S`);

    // Gold tick indicator
    streamCommands.push('0.80 0.58 0.10 rg');
    streamCommands.push(`48 ${currentY + 2} 7 7 re f`);

    // Topic text
    streamCommands.push('BT');
    streamCommands.push('/F2 9 Tf');
    streamCommands.push('0.15 0.12 0.20 rg');
    streamCommands.push(`63 ${currentY + 2} Td`);
    streamCommands.push(`(${topic.slice(0, 85)}) Tj`);
    streamCommands.push('ET');

    currentY -= 28;
  });

  // 4. Practical Training Highlights Box
  currentY -= 10;
  streamCommands.push('0.93 0.96 0.93 rg'); // Mint
  streamCommands.push(`40 ${currentY - 50} 515 50 re f`);
  streamCommands.push('0.60 0.80 0.60 RG');
  streamCommands.push('0.8 w');
  streamCommands.push(`40 ${currentY - 50} 515 50 re S`);

  streamCommands.push('BT');
  streamCommands.push('/F2 10 Tf');
  streamCommands.push('0.08 0.35 0.15 rg');
  streamCommands.push(`50 ${currentY - 16} Td`);
  streamCommands.push('(SPECIAL STUDIO BENEFITS INCLUDED:) Tj');
  streamCommands.push('/F1 8.5 Tf');
  streamCommands.push('0 -14 Td');
  streamCommands.push('(100% Practical Training on Industrial Power Machines  *  Individual Machine Access) Tj');
  streamCommands.push('0 -12 Td');
  streamCommands.push('(Govt. Regd. Certificate Provided  *  Boutique Business Setup & Fabric Sourcing Guidance) Tj');
  streamCommands.push('ET');

  // 5. Contact & Studio Address Footer
  streamCommands.push('0.09 0.08 0.13 rg');
  streamCommands.push('30 35 535 55 re f');
  streamCommands.push('0.85 0.65 0.23 rg');
  streamCommands.push('30 88 535 2 re f');

  streamCommands.push('BT');
  streamCommands.push('/F2 9.5 Tf');
  streamCommands.push('0.91 0.75 0.34 rg');
  streamCommands.push('45 70 Td');
  streamCommands.push('(ADMISSION & ENROLLMENT ENQUIRIES: Call / WhatsApp: +91 78452 64168) Tj');
  streamCommands.push('ET');

  streamCommands.push('BT');
  streamCommands.push('/F1 8 Tf');
  streamCommands.push('0.85 0.85 0.85 rg');
  streamCommands.push('45 54 Td');
  streamCommands.push('(Studio Address: 1/208 C, Jeeva Street, Chinniyampalayam, Coimbatore - 641062) Tj');
  streamCommands.push('0 -11 Td');
  streamCommands.push('(Timings: Mon - Sat 9:00 AM - 1:00 PM & 3:00 PM - 8:00 PM  |  Instagram: @tamil_designer_studio) Tj');
  streamCommands.push('ET');

  const contentStream = streamCommands.join('\n');
  const streamLength = contentStream.length;

  const pdfParts = [
    '%PDF-1.4\n',
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj\n',
    `4 0 obj\n<< /Length ${streamLength} >>\nstream\n${contentStream}\nendstream\nendobj\n`,
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
    '6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n',
    'xref\n0 7\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000266 00000 n \n',
    'trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n500\n%%EOF',
  ];

  return new Blob(pdfParts, { type: 'application/pdf' });
}

/**
 * Initiates an immediate download of the given PDF url or blob.
 */
export function downloadPdf(urlOrBlob: string | Blob, filename: string): void {
  const cleanFilename = filename.toLowerCase().endsWith('.pdf') ? filename : `${filename}.pdf`;

  if (typeof urlOrBlob === 'string') {
    // If it's a data URL or blob URL or direct URL
    const a = document.createElement('a');
    a.href = urlOrBlob;
    a.download = cleanFilename;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
    }, 100);
  } else {
    // Blob
    const url = URL.createObjectURL(urlOrBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = cleanFilename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1000);
  }
}
