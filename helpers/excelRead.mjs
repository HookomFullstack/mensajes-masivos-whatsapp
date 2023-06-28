import xlsx from 'xlsx'

export const excelRead = ({filename}) => {
   const dataExcel       = xlsx.readFile(filename)

   const names           = Object.entries(dataExcel.Sheets.DATOS).filter((e, i) => e[0].includes('A')).map((e, i) => i > 0 ? e[1].w : []).flat()
   const lastNames       = Object.entries(dataExcel.Sheets.DATOS).filter((e, i) => e[0].includes('B')).map((e, i) => i > 0 ? e[1].w : []).flat()
   const numberPhone     = Object.entries(dataExcel.Sheets.DATOS).filter((e, i) => e[0].includes('C')).map((e, i) => i > 0 ? e[1].w : []).flat()
   
   const messageTemplate = Object.entries(dataExcel.Sheets.DATOS).filter((e, i) => e[0].includes('D')).map((e, i) => {
      if(i > 0) {
         e[1].w = decodeURI(e[1].w)
         if(e[1].w.includes('{nombre}')) e[1].w = e[1].w.replace('{nombre}', names[--i])
         if(e[1].w.includes('{apellido}')) e[1].w = e[1].w.replace('{apellido}', lastNames[i])
         e[1].w = encodeURI(e[1].w)
         return e[1].w
      }
      return []
   }).flat()
   
   return { numberPhone, messageTemplate }
}

excelRead({filename: './template.xls'})