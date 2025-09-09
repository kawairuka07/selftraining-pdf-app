import { storage } from "./config.js";

const BUCKET_ID = "68b2bd400005330f03f7"; //バケットID

// PDFファイルを保存
export async function uploadPdf(pdfFile) {
  const file = await storage.createFile(
    BUCKET_ID,
    "unique()",   // 自動ID
    pdfFile
  );
  return file.$id;
}