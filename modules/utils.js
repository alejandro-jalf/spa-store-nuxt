import moment from 'moment'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

const _arrayMonths = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

const completeDateHour = (number) => {
  if (!number) return number
  const numberString = number.toString()
  if (numberString.length < 2) return '0' + number
  return number
}

const refactorHora = (hour) => {
  if (!hour) return hour
  const arrayHour = hour.split(':')
  const amPm = parseInt(arrayHour[0]) < 12 ? 'am' : 'pm'
  if (parseInt(arrayHour[0]) === 0)
    return `12:${completeDateHour(arrayHour[1])} ${amPm}`
  if (parseInt(arrayHour[0]) > 12)
    return (
      completeDateHour(parseInt(arrayHour[0]) - 12) +
      ':' +
      arrayHour[1] +
      ' ' +
      amPm
    )
  return arrayHour[0] + ':' + arrayHour[1] + ' ' + amPm
}

const sucursalesByName = {
  ZARAGOZA: 'ZR',
  VICTORIA: 'VC',
  OLUTA: 'OU',
  JALTIPAN: 'JL',
  BODEGA: 'BO',
}

const createPdfAsistenciasSpa = () => {
  // eslint-disable-next-line new-cap
  const doc = new jsPDF()

  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('SUPER PROMOCIONES DE ACAYUCAN SA DE CV', 105, 20, 'center')

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text('ZARAGOZA No 109 COL. CENTRO CP 96000', 200, 29, 'right')
  doc.text('ACAYUCAN, VERACRUZ.', 200, 36, 'right')

  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('REPORTE DE ASISTENCIA DEL 18/10/2021 AL 22/10/2021', 10, 43)
  doc.text('SUCURSAL SPAZARAGOZA', 200, 43, 'right')

  doc.autoTable({
    theme: 'plain',
    startY: 47,
    tableWidth: 190,
    margin: {
      left: 10,
    },
    styles: { fontSize: 8 },
    headStyles: {
      fontStyle: 'bold',
      halign: 'center',
    },
    head: [
      [
        'Nombre',
        'Fecha ',
        'Asist.',
        'Entrada',
        'S. Comida',
        'E. Comida',
        'Salida',
        'Trabajo',
        'Comida',
      ],
    ],
    body: [
      [
        {
          content: 'BRIGIDA MOGO NUÑES',
          rowSpan: 4,
          styles: {
            lineWidth: 1,
            borders: 't',
          },
        },
        {
          content: 'Dias Asists.',
          styles: { halign: 'center', fontStyle: 'bold' },
        },
        {
          content: '5',
          styles: {
            halign: 'center',
            fontStyle: 'bold',
            fillColor: [210, 210, 210],
          },
        },
        { content: '' },
        { content: '' },
        {
          content: 'Hrs Total',
          styles: { halign: 'center', fontStyle: 'bold' },
        },
        {
          content: '24 Hrs 21 Min',
          colSpan: 2,
          styles: {
            halign: 'center',
            fontStyle: 'bold',
            fillColor: [210, 210, 210],
          },
        },
        { content: '' },
      ],
      ['18/10/2021', 'SI', '07:23:49', '', '', '16:03:36 8', '8 Hrs 40 Min'],
      ['18/10/2021', 'SI', '07:23:49', '', '', '16:03:36 8', '8 Hrs 40 Min'],
      ['18/10/2021', 'SI', '07:23:49', '', '', '16:03:36 8', '8 Hrs 40 Min'],
      [
        { content: 'EDUARDO PACHECO REYES', rowSpan: 4 },
        { content: 'Dias Asists.' },
        { content: '5' },
        { content: '' },
        { content: '' },
        { content: 'Hrs Total' },
        { content: '24 Hrs 21 Min', colSpan: 2 },
        { content: '' },
      ],
      ['18/10/2021', 'SI', '07:23:49', '', '', '16:03:36 8', '8 Hrs 40 Min'],
      ['18/10/2021', 'SI', '07:23:49', '', '', '16:03:36 8', '8 Hrs 40 Min'],
      ['18/10/2021', 'SI', '07:23:49', '', '', '16:03:36 8', '8 Hrs 40 Min'],
    ],
  })

  // doc.save('Asistencias ejemplo.pdf')
  doc.output('dataurlnewwindow')
}

const utils = {
  getSucursalByName: (sucursal = 'zaragoza') => {
    const sucursalFinded = sucursalesByName[`${sucursal.toUpperCase()}`]
    if (sucursalFinded) return sucursalFinded
    return 'ZR'
  },

  toDate: (stringDate = '2021-08-24T00:00:00') => {
    const splitDate = stringDate.split('-')
    return `${splitDate[2].slice(0, 2)}/${splitDate[1]}/${splitDate[0]}`
  },

  toHour: (stringDate = '1900-01-01T09:15:45') => {
    const splitDate = stringDate.split('T')
    return refactorHora(splitDate[1])
  },

  parseFecha: (stringFecha, withHour = false) => {
    if (typeof stringFecha === 'undefined') return '00/00/0000'
    const fecha = new Date(stringFecha)
    let newFormat = `${stringFecha.slice(8, 10)} de ${
      _arrayMonths[fecha.getMonth()]
    } del ${fecha.getFullYear()}`
    if (withHour) {
      newFormat += ` a las ${fecha.getHours()}:${fecha.getMinutes()}`
    }
    return newFormat
  },

  aplyFormatNumeric: (numberString) => {
    if (numberString === null || typeof numberString === 'undefined') {
      return true
    }
    numberString = numberString.toString()
    if (numberString.trim().length <= 2) return numberString
    const arrayDivision = numberString.split('.')
    let numberFormated = '00,000.000'
    const lengthPartInt = arrayDivision[0].length
    const sobrantes = lengthPartInt % 3
    let contadorSecundario = 1
    numberFormated = arrayDivision[0]
      .split('')
      .reduce((acumulador, numero, indice) => {
        acumulador.push(numero)
        if (indice === sobrantes - 1 && indice < lengthPartInt - 1) {
          acumulador.push(',')
        }
        if (indice >= sobrantes && indice < lengthPartInt - 1) {
          if (contadorSecundario % 3 === 0) {
            acumulador.push(',')
          }
          contadorSecundario++
        }
        return acumulador
      }, [])
    numberFormated = numberFormated.join('')
    if (arrayDivision.length === 2) {
      numberFormated += `.${arrayDivision[1]}`
    }
    return numberFormated
  },

  roundTo: (number, digits = 2, autoComplete = true) => {
    const stringNumber =
      number === null || number === undefined ? '0' : number.toString()
    const arrayDivision = stringNumber.split('.')
    const lengthDivision = arrayDivision.length
    let rounded = '0.00'
    let digitsString = ''
    if (lengthDivision === 1) {
      if (!autoComplete) return arrayDivision[0]
      for (let index = 0; index < digits; index++) {
        digitsString += '0'
      }
      rounded = arrayDivision[0] + '.' + digitsString
      return rounded
    }
    if (digits === 0) {
      rounded = Math.round(number)
      return rounded
    }
    digitsString = arrayDivision[1].slice(0, digits - 1)
    let digitToRound = parseInt(arrayDivision[1].slice(digits, digits + 1))
    digitsString = arrayDivision[1].slice(0, digits - 1)
    if (isNaN(digitToRound)) digitToRound = 0
    let digitRounded = -1
    const endDigit = arrayDivision[1].slice(digits - 1, digits)
    if (digitToRound < 5) {
      digitRounded = endDigit
    }
    if (digitToRound >= 5 && digitToRound < 9) {
      if (parseInt(endDigit) < 9) {
        digitRounded = parseInt(endDigit) + 1
      } else {
        digitRounded = parseInt(endDigit)
      }
    }
    if (digitToRound === 9) {
      if (parseInt(endDigit) < 9) {
        digitRounded = parseInt(endDigit) + 1
      } else {
        digitRounded = parseInt(endDigit)
      }
    }
    rounded = arrayDivision[0] + '.' + digitsString + digitRounded
    const lengthDigits = digits - rounded.split('.')[1].length
    if (lengthDigits > 0)
      for (let index = 0; index < lengthDigits; index++) rounded += '0'
    return rounded
  },

  parseToPorcent: (value) => {
    // example: 0.45
    const stringValue = value.toString()
    const arrayValue = stringValue.split('.')
    const signo = value < 0 ? '-' : ''
    if (arrayValue[1].length > 2) {
      arrayValue[1] = `${arrayValue[1].slice(0, 2)}.${arrayValue[1].slice(2)}`
      return signo + parseFloat(arrayValue[1])
    }
    return signo + parseInt(arrayValue[1])
  },

  difHours: (dateStart = '', dateEnd = '') => {
    if (dateStart === '' || dateEnd === '') return ''

    const dateInit = moment(dateStart)
    const dateFinal = moment(dateEnd)
    const diff = dateFinal.diff(dateInit, 'minutes')
    const time = `${parseInt(diff / 60)} Hrs ${diff % 60} Min`
    return time
  },

  formatWithMoment: (date = '', format = '') => {
    if (date === '' || format === '') return ''
    const formatResult = moment(date).format(format)
    if (formatResult === 'Invalid date') return ''
    return formatResult
  },

  sumHours: (hoursFirst = '0 Hrs 0 Min', hoursSecond = '0 Hrs 0 Min') => {
    if (hoursFirst === '0 Hrs 0 Min' && hoursSecond === '0 Hrs 0 Min')
      return '0 Hrs 0 Min'
    if (hoursFirst === '0 Hrs 0 Min') return hoursSecond
    if (hoursSecond === '0 Hrs 0 Min') return hoursFirst
    const hrsFirst = hoursFirst.split(' ')
    const hrsSecond = hoursSecond.split(' ')
    let totalHrs = parseInt(hrsFirst[0]) + parseInt(hrsSecond[0])
    let totalMin = parseInt(hrsFirst[2]) + parseInt(hrsSecond[2])
    if (totalMin > 59) totalHrs += parseInt(totalMin / 60)
    totalMin = totalMin % 60
    return `${totalHrs} Hrs ${totalMin} Min`
  },

  getDateNow: () => moment().local(true),

  _arrayMonths,

  completeDateHour,

  refactorHora,

  createPdfAsistenciasSpa,
}

export default utils
