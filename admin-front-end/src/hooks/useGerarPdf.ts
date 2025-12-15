import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export async function gerarPdf(ref: HTMLDivElement, nomeArquivo: string = "relatorio.pdf") {
  if (!ref) return;

  // html2canvas captura o conteúdo do elemento
  const canvas = await html2canvas(ref, {
    scale: 2,           // melhora qualidade
    useCORS: true,      // caso tenha imagens externas
    backgroundColor: "#fff",
  });

  const imgData = canvas.toDataURL("image/png");

  // Cria o PDF
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: [canvas.width, canvas.height],
  });

  pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
  pdf.save(nomeArquivo);
}
