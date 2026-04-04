export function createSimplePdf(lines: string[]) {
  const pageWidth = 612;
  const pageHeight = 792;
  const left = 72;
  let y = 740;

  const content: string[] = ["BT"];

  const pushLine = (text: string, fontSize: number, nextGap: number) => {
    content.push(`/F1 ${fontSize} Tf`);
    content.push(`1 0 0 1 ${left} ${y} Tm`);
    content.push(`(${escapePdfText(text)}) Tj`);
    y -= nextGap;
  };

  for (const line of lines) {
    if (y < 72) {
      break;
    }

    if (line.startsWith("# ")) {
      pushLine(line.slice(2), 24, 32);
      continue;
    }

    if (line.startsWith("## ")) {
      pushLine(line.slice(3), 16, 24);
      continue;
    }

    pushLine(line, 12, 20);
  }

  content.push("ET");

  return buildPdfDocument({
    width: pageWidth,
    height: pageHeight,
    content: content.join("\n")
  });
}

function escapePdfText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function buildPdfDocument({
  width,
  height,
  content
}: {
  width: number;
  height: number;
  content: string;
}) {
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width} ${height}] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(content, "utf8")} >>\nstream\n${content}\nendstream`
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];

  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";

  for (let index = 1; index < offsets.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return Buffer.from(pdf, "utf8");
}
