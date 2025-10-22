import XLSX from 'xlsx'

export const parseXLSX = (filePath) => {
  const workbook = XLSX.readFile(filePath)
  const sheets = workbook.SheetNames
  const data = []

  sheets.forEach((sheetName) => {
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])
    data.push({
      sheet: sheetName,
      rows: sheetData,
    })
  })

  return data
}
