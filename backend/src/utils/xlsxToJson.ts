import * as XLSX from "xlsx";

const xlsxToJson = (file) => {
  const fileBuffer = Buffer.from(file, "base64");
  const workbook = XLSX.read(fileBuffer, {
    type: "buffer",
    cellStyles: true,
  });

  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(sheet, { raw: true });

  return jsonData;
};

export default xlsxToJson;
