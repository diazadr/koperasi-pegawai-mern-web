export const toNumberSafe = (value) => {
  if (!value) return 0

  let clean = String(value).trim()

  // Bersihkan karakter selain angka dan minus
  clean = clean.replace(/[^0-9\-]/g, '')

  const num = Number(clean)
  return isNaN(num) ? 0 : num
}
