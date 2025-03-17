import * as XLSX from "xlsx";

const jsonToXlsx = (json) => {
  const newSheet = XLSX.utils.json_to_sheet(json);

  const newWorkbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(newWorkbook, newSheet, "Invalid Entries");

  const outputBuffer = XLSX.write(newWorkbook, {
    type: "buffer",
    bookType: "xlsx",
    cellStyles: true,
  });

  return outputBuffer;
};

export default jsonToXlsx;
