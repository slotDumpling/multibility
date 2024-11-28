import { Modal, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";
import "svg2pdf.js";

const delay = (time: number) =>
  new Promise((res) => {
    setTimeout(res, time);
  });

export const exportPDF = async (
  pageOrder: string[],
  getPageRef: (pageID: string) => HTMLElement | undefined,
  name: string
) => {
  const modal = Modal.info({
    title: "Exporting the note to PDF...",
    icon: <LoadingOutlined />,
  });
  const pdf = new jsPDF();
  pdf.deletePage(1);
  try {
    for (const pageID of pageOrder) {
      const sectionEl = getPageRef(pageID);
      if (!sectionEl) return;
      sectionEl.scrollIntoView();
      await delay(1000);
      const cvs = sectionEl.querySelector("canvas");
      if (!cvs) continue;
      const r = cvs.height / cvs.width;
      pdf.addPage([200, 200 * r]);
      pdf.addImage(cvs, "WEBP", 0, 0, 200, 200 * r, "", "FAST");
    }
    pdf.save(name + ".pdf");
  } catch (e) {
    console.error(e);
    message.error("Failed to export PDF.");
  } finally {
    modal.destroy();
  }
};
