import fs from 'fs'
import csv from 'csv-parser'

export const parseCSV = async (filePath) => {
  return new Promise((resolve, reject) => {
    const results = []
    fs.createReadStream(filePath)
      .pipe(csv({ separator: ';', mapHeaders: ({ header }) => header.trim() }))
      .on('data', (data) => {
        // Buang field kosong akibat ";" terakhir
        const cleaned = {}
        for (const key in data) {
          if (key && key.trim() !== '') {
            cleaned[key.trim()] = data[key].trim()
          }
        }
        results.push(cleaned)
      })
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err))
  })
}
