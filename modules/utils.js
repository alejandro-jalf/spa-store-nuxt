import moment from 'moment'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

const utils = (() => {
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
    OFICINA: 'ZR',
    'CAASA ENRIQUEZ': 'EN',
    'CAASA SAYULA': 'SA',
    'CAASA SAYULAB': 'SB',
    'CAASA MAYOREO': 'MA',
    'CAASA SUPER': 'SU',
    'CAASA BODEGA': 'RE',
    'CAASA OFICINA': 'CO',
  }

  const sucursalesData = [
    { name: 'ZARAGOZA', alias: 'ZR' },
    { name: 'VICTORIA', alias: 'VC' },
    { name: 'OLUTA', alias: 'OU' },
    { name: 'JALTIPAN', alias: 'JL' },
    { name: 'BODEGA', alias: 'BO' },
    { name: 'OFICINA', alias: 'ZR' },
    { name: 'CAASA ENRIQUEZ', alias: 'EN' },
    { name: 'CAASA SAYULA', alias: 'SA' },
    { name: 'CAASA SAYULAB', alias: 'SB' },
    { name: 'CAASA MAYOREO', alias: 'MA' },
    { name: 'CAASA SUPER', alias: 'SU' },
    { name: 'CAASA BODEGA', alias: 'RE' },
    { name: 'CAASA OFICINA', alias: 'CO' },
  ]

  const getDataSucursal = (sucursal = '') => {
    if (sucursal === '') return null

    sucursal = sucursal.toUpperCase()

    const dataSucursales = [
      {
        sucursal: ['ZR', 'SPAZARAGOZA'],
        municipio: 'ACAYUCAN, VERACRUZ.',
        direccion: 'ZARAGOZA No 109 COL. CENTRO CP 96000',
        empresa: 'SUPER PROMOCIONES DE ACAYUCAN SA DE CV',
      },
      {
        sucursal: ['SU', 'CAASA'],
        municipio: 'ACAYUCAN, VERACRUZ.',
        direccion: 'MNUEL ACUÑA SUR. CP 96049',
        empresa: 'CENTRAL ABARROTERA DE ACAYUCAN SA DE CV',
      },
      {
        sucursal: ['HM', 'HUAMUCHIL'],
        municipio: 'ACAYUCAN, VERACRUZ.',
        direccion: 'ZARAGOZA No 109 COL. CENTRO CP 96000',
        empresa: 'SUPER PROMOCIONES DE ACAYUCAN SA DE CV',
      },
    ]

    const sucFinded = dataSucursales.find(
      (suc) => suc.sucursal[0] === sucursal || suc.sucursal[1] === sucursal
    )

    return sucFinded || dataSucursales[0]
  }

  const createPdfValuacionInventarioCierre = (
    titulo,
    direccion,
    mnpo,
    sucursal,
    data,
    horaImpresion,
    logo
  ) => {
    // eslint-disable-next-line new-cap
    const doc = new jsPDF('p', 'mm', 'letter')

    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    if (logo) {
      doc.text(titulo, 200, 20, 'right')
      doc.addImage(logo, 'PNG', 10, 15, 23, 23)
    } else doc.text(titulo, 105, 20, 'center')

    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text(direccion, 200, 29, 'right')
    doc.text(mnpo, 200, 36, 'right')

    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text(sucursal, 200, 43, 'right')

    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('Inventario al ' + horaImpresion, 10, 43, 'left')

    const body = data.reduce((acumData, dato) => {
      acumData.push([
        { content: dato.Articulo },
        { content: dato.Nombre },
        {
          content: dato.footer
            ? ''
            : utils.aplyFormatNumeric(utils.roundTo(dato.Existencia)),
        },
        {
          content: dato.footer
            ? dato.UCosto
            : utils.aplyFormatNumeric(utils.roundTo(dato.UCosto)),
          styles: dato.footer ? { fontStyle: 'bold' } : undefined,
        },
        {
          content: utils.aplyFormatNumeric(utils.roundTo(dato.Valuacion)),
          styles: dato.footer ? { fontStyle: 'bold' } : undefined,
        },
        {
          content: utils.aplyFormatNumeric(utils.roundTo(dato.Ieps)),
          styles: dato.footer ? { fontStyle: 'bold' } : undefined,
        },
        {
          content: utils.aplyFormatNumeric(utils.roundTo(dato.Iva)),
          styles: dato.footer ? { fontStyle: 'bold' } : undefined,
        },
        {
          content: utils.aplyFormatNumeric(utils.roundTo(dato.ValuacionNeta)),
          styles: dato.footer ? { fontStyle: 'bold' } : undefined,
        },
      ])
      return acumData
    }, [])

    doc.autoTable({
      startY: 49,
      tableWidth: 190,
      margin: {
        left: 10,
      },
      styles: { fontSize: 9 },
      headStyles: {
        fontStyle: 'bold',
        halign: 'center',
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
      },
      bodyStyles: { textColor: [0, 0, 0] },
      head: [
        [
          'Articulo',
          'Nombre',
          'Exist.',
          'U Costo',
          'Valuacion',
          'Ieps',
          'va',
          'Valuacion Neta',
        ],
      ],
      body,
    })

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text(horaImpresion, 10, 275)

    const fecha = horaImpresion.split(' ')
    const fechaSplit = fecha[0].split('/')
    doc.save(
      `${fechaSplit[2]} ${fechaSplit[1]}${fechaSplit[0]} - Valuacion Inventario - ${sucursal}.pdf`
    )
    // doc.output('dataurlnewwindow')
  }

  const createPdfAsistenciasSpa = (
    company,
    titulo,
    direccion,
    mnpo,
    fechas,
    sucursal,
    data,
    horaImpresion,
    logo,
    preview = false
  ) => {
    // eslint-disable-next-line new-cap
    const doc = new jsPDF('p', 'mm', 'letter')

    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    if (logo) {
      doc.text(titulo, 200, 20, 'right')
      doc.addImage(logo, 'PNG', 10, 15, 23, 23)
    } else doc.text(titulo, 105, 20, 'center')

    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text(direccion, 200, 29, 'right')
    doc.text(mnpo, 200, 36, 'right')

    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text(fechas, 10, 43)
    doc.text(sucursal, 200, 43, 'right')

    const body = data.reduce((acumData, dato) => {
      if (dato.header) {
        acumData.push([
          {
            content: dato.nombre,
            rowSpan: dato.dias,
          },
          {
            content: 'Dias Asists.',
            styles: { halign: 'center', fontStyle: 'bold' },
          },
          {
            content: dato.dias - 1,
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
            content: dato.sumaHoras,
            colSpan: 2,
            styles: {
              halign: 'center',
              fontStyle: 'bold',
              fillColor: [210, 210, 210],
            },
          },
          { content: '' },
        ])
      } else {
        acumData.push([
          {
            content: dato.fecha,
            styles: { fontStyle: 'bold' },
          },
          { content: 'SI', halign: 'left' },
          { content: dato.entrada },
          { content: dato.scomida },
          { content: dato.ecomida },
          { content: dato.salida },
          {
            content: dato.trabajo,
            styles: {
              halign: 'center',
              fontStyle: 'bold',
            },
          },
          {
            content: dato.comida,
            styles: {
              halign: 'center',
              fontStyle: 'bold',
            },
          },
        ])
      }
      return acumData
    }, [])

    doc.autoTable({
      startY: 47,
      tableWidth: 190,
      margin: {
        left: 10,
      },
      styles: { fontSize: 7 },
      headStyles: {
        fontStyle: 'bold',
        halign: 'center',
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
      },
      bodyStyles: { textColor: [0, 0, 0] },
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
      body,
    })

    const finalY = doc.lastAutoTable.finalY
    doc.setDrawColor(0, 0, 0)

    doc.setFont('helvetica', 'bold')
    if (finalY > 240) {
      doc.addPage()
      doc.line(25, 50, 85, 50)
      doc.text('ENCARGADO', 45, 55)
      doc.line(131, 50, 191, 50)
      if (company === 'CAASA') doc.text('RECURSOS HUMANOS', 145, 55)
      else doc.text('LC ARTEMIO PEREZ MORATILLA', 136, 55)
    } else {
      doc.line(25, 260, 85, 260)
      doc.text('ENCARGADO', 45, 265)
      doc.line(131, 260, 191, 260)
      if (company === 'CAASA') doc.text('RECURSOS HUMANOS', 145, 265)
      else doc.text('LC ARTEMIO PEREZ MORATILLA', 136, 265)
    }

    const countPages = doc.getNumberOfPages()
    let pageCurrent = 0
    doc.setFontSize(9)
    doc.setFont('helvetica', 'italic')
    for (let page = 0; page < countPages; page++) {
      doc.setPage(page)
      pageCurrent = doc.internal.getCurrentPageInfo().pageNumber
      doc.text(`Pagina ${pageCurrent} de ${countPages}`, 207, 275, 'right')
      doc.text(horaImpresion, 8, 275)
    }

    if (preview) doc.output('dataurlnewwindow')
    else doc.save(`ASISTENCIAS ${sucursal}.pdf`)
  }

  const getSucursalByName = (sucursal = 'zaragoza') => {
    const sucursalFinded = sucursalesByName[`${sucursal.toUpperCase()}`]
    if (sucursalFinded) return sucursalFinded
    return 'ZR'
  }

  const toDate = (stringDate = '2021-08-24T00:00:00') => {
    const splitDate = stringDate.split('-')
    return `${splitDate[2].slice(0, 2)}/${splitDate[1]}/${splitDate[0]}`
  }

  const toHour = (stringDate = '1900-01-01T09:15:45') => {
    const splitDate = stringDate.split('T')
    return refactorHora(splitDate[1])
  }

  const parseFecha = (stringFecha, withHour = false) => {
    if (typeof stringFecha === 'undefined') return '00/00/0000'
    const fecha = new Date(stringFecha)
    let newFormat = `${stringFecha.slice(8, 10)} de ${
      _arrayMonths[fecha.getMonth()]
    } del ${fecha.getFullYear()}`
    if (withHour) {
      newFormat += ` a las ${fecha.getHours()}:${fecha.getMinutes()}`
    }
    return newFormat
  }

  const aplyFormatNumeric = (numberString) => {
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
  }

  const roundTo = (number, digits = 2, autoComplete = true) => {
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
  }

  const parseToPorcent = (value) => {
    // example: 0.45
    const stringValue = value.toString()
    const arrayValue = stringValue.split('.')
    const signo = value < 0 ? '-' : ''
    if (arrayValue[1].length > 2) {
      arrayValue[1] = `${arrayValue[1].slice(0, 2)}.${arrayValue[1].slice(2)}`
      return signo + parseFloat(arrayValue[1])
    }
    return signo + parseInt(arrayValue[1])
  }

  const difHours = (dateStart = '', dateEnd = '') => {
    if (dateStart === '' || dateEnd === '') return ''

    const dateInit = moment(dateStart)
    const dateFinal = moment(dateEnd)
    const diff = dateFinal.diff(dateInit, 'minutes')
    const time = `${parseInt(diff / 60)} Hrs ${diff % 60} Min`
    return time
  }

  const formatWithMoment = (date = '', format = '') => {
    if (date === '' || format === '') return ''
    const formatResult = moment(date).format(format)
    if (formatResult === 'Invalid date') return ''
    return formatResult
  }

  const sumHours = (
    hoursFirst = '0 Hrs 0 Min',
    hoursSecond = '0 Hrs 0 Min'
  ) => {
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
  }

  const getDateNow = () => moment().local(true)

  // eslint-disable-next-line new-cap
  const toMoment = (cadena) => new moment(cadena)

  return {
    _arrayMonths,
    sucursalesByName,
    sucursalesData,
    toDate,
    toHour,
    roundTo,
    toMoment,
    sumHours,
    difHours,
    getDateNow,
    parseFecha,
    refactorHora,
    parseToPorcent,
    getDataSucursal,
    completeDateHour,
    formatWithMoment,
    aplyFormatNumeric,
    getSucursalByName,
    createPdfAsistenciasSpa,
    createPdfValuacionInventarioCierre,
  }
})()

// const utilsOld = {}

export default utils
