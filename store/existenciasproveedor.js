if (!localStorage.getItem('spastore_existencias_provider_sucursal'))
  localStorage.setItem('spastore_existencias_provider_sucursal', 'ZR')
if (!localStorage.getItem('spastore_existence_provider_provider'))
  localStorage.setItem('spastore_existence_provider_provider', '')

export const state = () => ({
  data: localStorage.getItem('spastore_existence_provider_data')
    ? JSON.parse(localStorage.getItem('spastore_existence_provider_data'))
    : { data: [] },
  providers: localStorage.getItem('spastore_existence_provider_providers')
    ? JSON.parse(localStorage.getItem('spastore_existence_provider_providers'))
    : {
        data: [
          {
            Proveedor: '010001',
            Nombre: 'TIENDAS COMERCIAL MEXICANA, S. A. DE C.V.',
          },
          {
            Proveedor: '010002',
            Nombre: 'COMERCIALIZADORA DE CALZADO Y SANDALIAS LA PRINCESA',
          },
          {
            Proveedor: '010003',
            Nombre: 'NATIVIDAD ROMAN OSORIO',
          },
          {
            Proveedor: '2110-A00-012',
            Nombre: 'ALIMENTOS  Y VIVERES SAN RAFAEL SA DE CV',
          },
          {
            Proveedor: '2110-A00-041',
            Nombre: 'ABARROTES CORDOBESES SA DE CV',
          },
          {
            Proveedor: '2110-A00-042',
            Nombre: 'ANA MARIA AGUILAR AGUILAR',
          },
          {
            Proveedor: '2110-A00-045',
            Nombre: 'ALMACENES FIESTA JUAREZ',
          },
          {
            Proveedor: '2110-A00-046',
            Nombre: 'ALEJANDRO ALFONSO SORIANO MORALES',
          },
          {
            Proveedor: '2110-A00-047',
            Nombre: 'ALAN ALBERTO TORRES MONTALVO',
          },
          {
            Proveedor: '2110-A00-048',
            Nombre: 'AITOR JOSE ODRIOZOLA GARIN',
          },
          {
            Proveedor: '2110-A00-049',
            Nombre: 'ARTURO TORRES GARCIA',
          },
          {
            Proveedor: '2110-A00-050',
            Nombre: 'ALBERTO GABRIEL SALINAS GUILLEN',
          },
          {
            Proveedor: '2110-A00-051',
            Nombre: 'ABASTECEDORA SAN JOSE SA DE CV',
          },
          {
            Proveedor: '2110-A00-052',
            Nombre: 'AMAYRANI ANOTA ALTAMIRANO',
          },
          {
            Proveedor: '2110-A00-053',
            Nombre: 'ALFONSO DOMINGUEZ VAZQUEZ',
          },
          {
            Proveedor: '2110-A00-054',
            Nombre: 'ABARROTES MONTERREY SA DE CV',
          },
          {
            Proveedor: '2110-A00-055',
            Nombre: 'ANGEL GUSTAVO DOMINGUEZ DE LA FUENTE',
          },
          {
            Proveedor: '2110-A00-056',
            Nombre: 'AURELIANO CASAS SANTIAGO',
          },
          {
            Proveedor: '2110-A00-057',
            Nombre: 'ADAN MELCHOR MORALES',
          },
          {
            Proveedor: '2110-A00-058',
            Nombre: 'ALIMENTOS BENEFITS SA DE CV',
          },
          {
            Proveedor: '2110-B00-021',
            Nombre: 'BOTANAS VIDA RICA S DE RL MI',
          },
          {
            Proveedor: '2110-B00-022',
            Nombre: 'BEATRIZ ROMERO PEREZ',
          },
          {
            Proveedor: '2110-B00-024',
            Nombre: 'BEBIDAS PURIFICADAS S DE RL DE CV',
          },
          {
            Proveedor: '2110-B00-025',
            Nombre: 'BUCSELL COMERCIALIZADORA SA DE CV',
          },
          {
            Proveedor: '2110-B00-026',
            Nombre: 'BOTANAS Y FRITURAS LOS ALTOS DE CHIAPAS SA DE CV',
          },
          {
            Proveedor: '2110-C00-050',
            Nombre: 'COMERCIALIZADORA DE JUGOS Y ALIMENTOS DEL GOLFO SA DE CV',
          },
          {
            Proveedor: '2110-C00-058',
            Nombre: 'CLAUDIA ANAHID GARCIA ANTONIO',
          },
          {
            Proveedor: '2110-C00-060',
            Nombre: 'CORPORATIVO MULTIPLASTIC EL TREBOL SA DE CV',
          },
          {
            Proveedor: '2110-C00-074',
            Nombre: 'COMERCIALIZADORA MAC MA SAPI DE CV',
          },
          {
            Proveedor: '2110-C00-075',
            Nombre: 'COMERCIALIZADORA IMPORTADORA Y EXPORTADO',
          },
          {
            Proveedor: '2110-C00-076',
            Nombre: 'CC DISTRIBUCIONES SA DE CV',
          },
          {
            Proveedor: '2110-C00-077',
            Nombre: 'CARMEN LUZ MORALES MARQUEZHOYOS',
          },
          {
            Proveedor: '2110-C00-078',
            Nombre: 'COMERVER, SA DE CV',
          },
          {
            Proveedor: '2110-C00-079',
            Nombre: 'CARLOS HUGO BAUTISTA ROLDAN',
          },
          {
            Proveedor: '2110-C00-081',
            Nombre: 'CARBALLEDA SA DE CV',
          },
          {
            Proveedor: '2110-C00-082',
            Nombre: 'CISUR COMERCIALIZADORA E INSUMOS DEL SUR',
          },
          {
            Proveedor: '2110-C00-083',
            Nombre: 'CORPORACION SANCHEZ SA DE CV',
          },
          {
            Proveedor: '2110-C00-084',
            Nombre: 'COMPAÑIA CERILLERA ATLAS SA DE CV',
          },
          {
            Proveedor: '2110-C00-085',
            Nombre: 'CLAUDIA IVETTE RAMIREZ RIVAS',
          },
          {
            Proveedor: '2110-C00-086',
            Nombre: 'COMERCIALIZADORA DE ALIMENTOS BALANCEADO',
          },
          {
            Proveedor: '2110-C00-087',
            Nombre: 'CANDELARIA RAMIREZ ALOR',
          },
          {
            Proveedor: '2110-C00-088',
            Nombre: 'CORNELIO LLANOS SANCHEZ',
          },
          {
            Proveedor: '2110-C00-089',
            Nombre: 'CENTRAL MOTZORONGO SA DE CV',
          },
          {
            Proveedor: '2110-C00-090',
            Nombre: 'COMPREHENSIVE VETERINARY SERVICES SA DE CV',
          },
          {
            Proveedor: '2110-C00-091',
            Nombre: 'COBRANZA MODELO S DE RL DE CV',
          },
          {
            Proveedor: '2110-C00-093',
            Nombre: 'CINDY LISBETH ARAUJO SERRANO',
          },
          {
            Proveedor: '2110-D00-013',
            Nombre: 'DISTRIBUIDORA DE PERFUMES Y POPULARES SA',
          },
          {
            Proveedor: '2110-D00-028',
            Nombre: 'DULCERIA JIMMY  SA DE CV',
          },
          {
            Proveedor: '2110-D00-040',
            Nombre: 'DISBRAZZ LOGISTICS SA DE CV',
          },
          {
            Proveedor: '2110-D00-041',
            Nombre: 'DIGRAVA SA DE CV',
          },
          {
            Proveedor: '2110-D00-042',
            Nombre: 'DAVID TREJO ESPAÑA',
          },
          {
            Proveedor: '2110-D00-043',
            Nombre: 'DCC DE COATZACOALCOS SA DE CV',
          },
          {
            Proveedor: '2110-D00-044',
            Nombre: 'DULCERIA LA ESTRELLA SA DE CV',
          },
          {
            Proveedor: '2110-D00-045',
            Nombre: 'DULCERIAS DE YUCATAN SA DE CV',
          },
          {
            Proveedor: '2110-D00-047',
            Nombre: 'DCP IMPULSORA DE MARCAS SA DE CV',
          },
          {
            Proveedor: '2110-D00-048',
            Nombre: 'DIANA KAREN BLANCO LOPEZ',
          },
          {
            Proveedor: '2110-E00-029',
            Nombre: 'ELIAS RAMIRO MENDOZA MENENGUEZ',
          },
          {
            Proveedor: '2110-E00-032',
            Nombre: 'ERIKA FAIDET SANCHEZ PEREZ',
          },
          {
            Proveedor: '2110-E00-035',
            Nombre: ' EDDUAR ALFREDO PEREZ HERNANDEZ',
          },
          {
            Proveedor: '2110-E00-036',
            Nombre: 'ENRIQUE QUIROZ',
          },
          {
            Proveedor: '2110-E00-037',
            Nombre: 'EMPACADORA Y COMERCIALIZADORA DE PRODUCTOS BASICOS',
          },
          {
            Proveedor: '2110-E00-038',
            Nombre: 'ESMERALDA ESCOBAR SANCHEZ',
          },
          {
            Proveedor: '2110-E00-039',
            Nombre: 'EFREN RODRIGUEZ GUILLEN',
          },
          {
            Proveedor: '2110-E00-040',
            Nombre: 'EMBOTELLADORAS BEPENSA SA DE CV',
          },
          {
            Proveedor: '2110-E00-041',
            Nombre: 'EDUARDO MORALES MARQUEZHOYOS',
          },
          {
            Proveedor: '2110-F00-015',
            Nombre: 'FABIAN RAMIREZ BELTRAN',
          },
          {
            Proveedor: '2110-F00-016',
            Nombre: 'FELIPE JOVITO AVILA VIELMA',
          },
          {
            Proveedor: '2110-F00-017',
            Nombre: 'FARMALIVE SAPI DE CV',
          },
          {
            Proveedor: '2110-F00-018',
            Nombre: 'FERESMAR SA DE CV',
          },
          {
            Proveedor: '2110-G00-028',
            Nombre: 'GABRIEL FLORES ZARATE',
          },
          {
            Proveedor: '2110-G00-030',
            Nombre: 'GLORIA ELBA GUTIERREZ GONZALEZ',
          },
          {
            Proveedor: '2110-G00-031',
            Nombre: 'GABRIEL VAZQUEZ LINARES',
          },
          {
            Proveedor: '2110-G00-032',
            Nombre: 'GRUPO NELIMAR SA DE CV',
          },
          {
            Proveedor: '2110-G00-033',
            Nombre: 'GABINA OLGUIN SALAZAR',
          },
          {
            Proveedor: '2110-G00-034',
            Nombre: 'GRUPO PARISINA SA DE CV',
          },
          {
            Proveedor: '2110-G00-035',
            Nombre: 'GRUPO VIKZUR SA DE CV',
          },
          {
            Proveedor: '2110-G00-036',
            Nombre: 'GLORIA KARINA MARTINEZ DE JESUS',
          },
          {
            Proveedor: '2110-G00-037',
            Nombre: 'GRUPO EXIGRAFIC SA DE CV',
          },
          {
            Proveedor: '2110-G00-038',
            Nombre: 'GERARDO JIMENEZ LOPEZ',
          },
          {
            Proveedor: '2110-G00-039',
            Nombre: 'GRUPO LA FLORIDA MEXICO SA DE CV',
          },
          {
            Proveedor: '2110-H00-012',
            Nombre: 'HECTOR MIGUEL REYES ROMAN',
          },
          {
            Proveedor: '2110-I00-032',
            Nombre: 'INDUSTRIA DE REFRESCOS S DE RL DE CV',
          },
          {
            Proveedor: '2110-I00-033',
            Nombre: 'INDUSTRIAS H24 SA DE CV',
          },
          {
            Proveedor: '2110-I00-034',
            Nombre: 'ISRAEL SANCHEZ CASTILLO',
          },
          {
            Proveedor: '2110-I00-036',
            Nombre: 'ISAAC PEREZ RODRIGUEZ',
          },
          {
            Proveedor: '2110-I00-037',
            Nombre: 'INDUSTRIAS ALIMENTICIAS CASCAJAL SA DE C',
          },
          {
            Proveedor: '2110-J00-035',
            Nombre: 'JOSE LUIS ALVAREZ TEMBLADOR',
          },
          {
            Proveedor: '2110-J00-043',
            Nombre: 'JESUS HERRERA GONZALEZ',
          },
          {
            Proveedor: '2110-J00-046',
            Nombre: 'JARABES LA FINCA SA DE CV',
          },
          {
            Proveedor: '2110-J00-047',
            Nombre: 'JUAN BARRETO CARDENAS',
          },
          {
            Proveedor: '2110-J00-048',
            Nombre: 'JARCIMEX SA DE CV',
          },
          {
            Proveedor: '2110-J00-049',
            Nombre: 'JAVIER MOTA MENDEZ',
          },
          {
            Proveedor: '2110-J00-050',
            Nombre: 'JEMAFLEX DE MEXICO SA DE CV',
          },
          {
            Proveedor: '2110-J00-051',
            Nombre: 'JOSE IVAN LOEZA MARQUEZ',
          },
          {
            Proveedor: '2110-J00-052',
            Nombre: 'JOSE JULIO MORALES ALVAREZ',
          },
          {
            Proveedor: '2110-J00-053',
            Nombre: 'JORGE LOPEZ FRANCO',
          },
          {
            Proveedor: '2110-J00-055',
            Nombre: 'JOMI ARTICULOS DE LIMPIEZA S DE RL MI',
          },
          {
            Proveedor: '2110-J00-056',
            Nombre: 'JUAN MANUEL RUIZ TRINIDAD',
          },
          {
            Proveedor: '2110-J00-057',
            Nombre: 'JOSE MANUEL DOMINGUEZ HERNANDEZ',
          },
          {
            Proveedor: '2110-J00-058',
            Nombre: 'JOSEMURRIETA PALOMINO',
          },
          {
            Proveedor: '2110-J00-059',
            Nombre: 'JORGE ARTURO SOTELO RIVERA',
          },
          {
            Proveedor: '2110-J00-060',
            Nombre: 'JOEL GUADALUPE MURILLO SANCHEZ',
          },
          {
            Proveedor: '2110-J00-061',
            Nombre: 'JESUS LAGUNES MORALES',
          },
          {
            Proveedor: '2110-K00-004',
            Nombre: 'KARINA DEL CARMEN DE LA O AGUIRRE',
          },
          {
            Proveedor: '2110-L00-019',
            Nombre: 'LUIS ALBERTO SANCHEZ MENDOZA',
          },
          {
            Proveedor: '2110-L00-021',
            Nombre: 'LIVANA TECHNOLOGY SA DE CV',
          },
          {
            Proveedor: '2110-L00-022',
            Nombre: 'LA FERRE DE COATZACOALCOS SA DE CV',
          },
          {
            Proveedor: '2110-M00-026',
            Nombre: 'MADERAS UTILES SUCESORES SA DE CV',
          },
          {
            Proveedor: '2110-M00-040',
            Nombre: 'MANUEL JEDIDIAS ISLAS BONILLA',
          },
          {
            Proveedor: '2110-M00-045',
            Nombre: 'MAURO MOGUEL FLORES',
          },
          {
            Proveedor: '2110-M00-047',
            Nombre: 'MERCEDES AZOTLA GRAJALES',
          },
          {
            Proveedor: '2110-M00-048',
            Nombre: 'MEGAVELAS SA DE CV',
          },
          {
            Proveedor: '2110-M00-049',
            Nombre: 'MARIA ANGELICA MORALES RAMIREZ',
          },
          {
            Proveedor: '2110-M00-050',
            Nombre: 'MARIA DEL ROSAIO MARTINEZ TECILLO',
          },
          {
            Proveedor: '2110-M00-051',
            Nombre: 'MONICA NARANJO TADEO',
          },
          {
            Proveedor: '2110-M00-052',
            Nombre: 'MARIA DEL CARMEN GARCIA MOLINA',
          },
          {
            Proveedor: '2110-M00-053',
            Nombre: 'MARIA GUADALUPE GARCIA MOLINA',
          },
          {
            Proveedor: '2110-M00-054',
            Nombre: 'MARCELINO HERNANDEZ PAVON',
          },
          {
            Proveedor: '2110-M00-056',
            Nombre: 'MODATELAS SAPI DE CV',
          },
          {
            Proveedor: '2110-M00-057',
            Nombre: 'MARTHA MARIA TORRES SERNA',
          },
          {
            Proveedor: '2110-M00-058',
            Nombre: 'MARIO MENDOZA CHAVEZ',
          },
          {
            Proveedor: '2110-N00-014',
            Nombre: 'NUTRIMARCAS SA DE CV',
          },
          {
            Proveedor: '2110-N00-016',
            Nombre: 'NORMA NICTHE RODRIGUEZ GARCIA',
          },
          {
            Proveedor: '2110-O00-008',
            Nombre: 'ONORATA RAMOS GALLEGOS',
          },
          {
            Proveedor: '2110-O00-012',
            Nombre: 'OMEX ALIMENTARIA SA DE CV',
          },
          {
            Proveedor: '2110-O00-013',
            Nombre: 'OSCAR HERRERA GOMEZ',
          },
          {
            Proveedor: '2110-O00-015',
            Nombre: 'ORGANIZACION FARMACEUTICA ABARROTERA SA DE CV',
          },
          {
            Proveedor: '2110-P00-022',
            Nombre: 'PROMOQUIN SA DE CV',
          },
          {
            Proveedor: '2110-P00-038',
            Nombre: 'PRODUCTOS CAMBAT, S.A. DE C.V.',
          },
          {
            Proveedor: '2110-P00-040',
            Nombre: 'PRODUCTOS ARAMO S DE RL DE CV',
          },
          {
            Proveedor: '2110-P00-041',
            Nombre: 'PRODUCTOS NATURALES MAYU SA DE CV',
          },
          {
            Proveedor: '2110-P00-042',
            Nombre: 'PRODUCTORA MEXICANA DE ARROZ SA PI DE CV',
          },
          {
            Proveedor: '2110-P00-043',
            Nombre: 'PASION POR LOS PRECIOS BAJOS SA DE CV',
          },
          {
            Proveedor: '2110-P00-044',
            Nombre: 'PROGRESO PD SA DE CV',
          },
          {
            Proveedor: '2110-P00-045',
            Nombre: 'PRODUCTOS RICOLINO SAPI DE CV',
          },
          {
            Proveedor: '2110-P00-047',
            Nombre: 'PASCUAL FLORES RANGEL',
          },
          {
            Proveedor: '2110-P00-048',
            Nombre: 'PARAFINAS SAN FELIPE SA DE CV',
          },
          {
            Proveedor: '2110-R00-007',
            Nombre: 'ROSA MARIA SOTO FIGUEROA',
          },
          {
            Proveedor: '2110-R00-022',
            Nombre: 'RODOLFO HERNANDEZ MERCADO',
          },
          {
            Proveedor: '2110-R00-024',
            Nombre: 'ROBERTO SANTIAGO SALAZAR GOMEZ',
          },
          {
            Proveedor: '2110-R00-027',
            Nombre: 'RAFAEL SANTIAGO FLORES',
          },
          {
            Proveedor: '2110-R00-028',
            Nombre: 'REPRESENTACIONES SWEET GOLOSINAS SA DE CV',
          },
          {
            Proveedor: '2110-R00-029',
            Nombre: 'RAUL ALBERTO CANO SILVA',
          },
          {
            Proveedor: '2110-R00-030',
            Nombre: 'RAFAEL MARTINEZ LARA',
          },
          {
            Proveedor: '2110-S00-009',
            Nombre: 'SERGIO ANTONIO VELAZQUEZ ISASSI',
          },
          {
            Proveedor: '2110-S00-021',
            Nombre: 'SALVADOR RAMIREZ YAÑEZ',
          },
          {
            Proveedor: '2110-S00-028',
            Nombre: 'SALMI DEL SURESTE S.A. DE C.V.',
          },
          {
            Proveedor: '2110-S00-030',
            Nombre: 'SERVANDO POZOS MESTIZO',
          },
          {
            Proveedor: '2110-S00-031',
            Nombre: 'SANTIAGO ANGULO ALEJANDRO',
          },
          {
            Proveedor: '2110-S00-032',
            Nombre: 'SIRVIENDO A LA MICROINDUSTRIA SA DE CV',
          },
          {
            Proveedor: '2110-S00-033',
            Nombre: 'SUPER ABARROTES LA Y GRIEGA SA DE CV',
          },
          {
            Proveedor: '2110-S00-034',
            Nombre: 'SUBOTEXX COMERCIALIZADORA SA DE CV',
          },
          {
            Proveedor: '2110-S00-035',
            Nombre: 'SANDRA SALOMON LOPEZ',
          },
          {
            Proveedor: '2110-T00-010',
            Nombre: 'TABACALERA DEL SURESTE SA DE CV',
          },
          {
            Proveedor: '2110-T00-011',
            Nombre: 'TOMAS BATCHELAR AREVALO',
          },
          {
            Proveedor: '2110-V00-011',
            Nombre: 'VICTOR HUGO DOMINGUEZ MIROS',
          },
          {
            Proveedor: '2110-V00-017',
            Nombre: 'VALERIA MARTINEZ GARCIA',
          },
          {
            Proveedor: '2110-V00-018',
            Nombre: 'VICTOR EMMANUEL ROLDAN GRAJEDA',
          },
          {
            Proveedor: '2110-V00-019',
            Nombre: 'VISION COMERCIAL ASOCIADOS VICISAFER DEL',
          },
          {
            Proveedor: '211-V00-014',
            Nombre: 'VICTOR VICENTE MIJANGOS FUENTES',
          },
          {
            Proveedor: 'ACEITERA',
            Nombre: 'INDUSTRIAL ACEITERA SA DE CV',
          },
          {
            Proveedor: 'ADELSBERGER',
            Nombre: 'Irma Adelsberger Bolan',
          },
          {
            Proveedor: 'AGROPECUARIA',
            Nombre: 'COMERCIAL AGROPECUARIA DE ACAYUCAN SA DE CV',
          },
          {
            Proveedor: 'AGROVER',
            Nombre: 'Agro-Industrias De Veracruz, S.A. De C.V.',
          },
          {
            Proveedor: 'AGUASCALIENTES',
            Nombre: 'Conservera De Aguascalientes S.A. C.V.',
          },
          {
            Proveedor: 'ALBERT',
            Nombre: 'Distribuidora De Plasticos Albert S.A. De C.V.',
          },
          {
            Proveedor: 'ALICIA',
            Nombre: 'ALICIA GUADALUPE GONZALEZ CUEVAS',
          },
          {
            Proveedor: 'ALIMENTARIA',
            Nombre: 'ALIMENTARIA SAN CARLOS SA DE CV',
          },
          {
            Proveedor: 'Alimentos Falco',
            Nombre: 'Fab. de Alim. Comestibles Dos Rios S.A. DE C.V.',
          },
          {
            Proveedor: 'ALIMESA',
            Nombre: 'COMERCIAL ALIMESA SA DE CV',
          },
          {
            Proveedor: 'ALMA EDITH',
            Nombre: 'ALMA EDITH ELISA PIÑEIRO GARCIA',
          },
          {
            Proveedor: 'ALPURA',
            Nombre: 'DIPROLACTEOS SA DE CV',
          },
          {
            Proveedor: 'AMIEVA',
            Nombre: 'Amieva Guevara S. de R.L. De C.V.',
          },
          {
            Proveedor: 'ANAHID',
            Nombre: 'CLAUDIA ANAHID GARCIA ANTONIO',
          },
          {
            Proveedor: 'ANDRES',
            Nombre: 'ANDRES ARRES VEGA',
          },
          {
            Proveedor: 'ARROZ SOS',
            Nombre: 'Arroz Sos De México S.A. C.V.',
          },
          {
            Proveedor: 'ASENET',
            Nombre: 'Asenet Irazoqui Sainz',
          },
          {
            Proveedor: 'ASESORIAS',
            Nombre:
              'ASESORIAS ADMINISTRATIVAS OPERATIVAS Y COMERCIALES, S.A. DE C.V',
          },
          {
            Proveedor: 'ASTRAL',
            Nombre: 'ASTRAL DEL PACIFICO SA DE CV',
          },
          {
            Proveedor: 'atoyac',
            Nombre: 'Elsa Maria Molina Moreno',
          },
          {
            Proveedor: 'AVICOLA',
            Nombre: 'JOSE ARTURO AGUILAR MOLINA',
          },
          {
            Proveedor: 'AYSSA',
            Nombre: 'Ayssa Casa Venta S.A. De C.V.',
          },
          {
            Proveedor: 'BAEZ',
            Nombre: 'NICOLAS MORALES BAEZ',
          },
          {
            Proveedor: 'BALTAZAR',
            Nombre: 'CASA BALTAZAR SA DE CV',
          },
          {
            Proveedor: 'BARCEL',
            Nombre: 'BARCEL SA DE CV',
          },
          {
            Proveedor: 'BERMAL',
            Nombre: 'Maria Margarita Beristain Maldonado',
          },
          {
            Proveedor: 'BETONE',
            Nombre: 'Betone S.A. De C.V.',
          },
          {
            Proveedor: 'BIMBO',
            Nombre: 'BIMBO SA DE CV',
          },
          {
            Proveedor: 'BOING',
            Nombre: 'Bernardino Reyes Vazquez',
          },
          {
            Proveedor: 'Bordi',
            Nombre: 'Alejandro Bordi Gutierrez',
          },
          {
            Proveedor: 'BRITISH',
            Nombre: 'British American Tobacco México, S.A. De C.V.',
          },
          {
            Proveedor: 'CAASA',
            Nombre: 'Central Abarrotera De Acayucan, S.A. C.V.',
          },
          {
            Proveedor: 'CADBURY',
            Nombre: 'Cadbury Adams Mexico S. De R.L. De C.V.',
          },
          {
            Proveedor: 'CAFE PALACIO',
            Nombre: 'CAFES DOVICA  SA DE CV',
          },
          {
            Proveedor: 'CAFE TOSTADO',
            Nombre: 'CAFE TOSTADO DE EXPORTACION SA DE CV',
          },
          {
            Proveedor: 'CAFINCO',
            Nombre: 'Cafe Internacional De Cordoba S.A De C.V.',
          },
          {
            Proveedor: 'CALVARIO',
            Nombre: 'PRODUCTOS AVICOLAS EL CALVARIO SA DE CV',
          },
          {
            Proveedor: 'CAPULLO',
            Nombre: 'Alimentos Capullo S. De R.L. De C.V.',
          },
          {
            Proveedor: 'CAREY',
            Nombre: 'Productos Carey S.A. C.V.',
          },
          {
            Proveedor: 'CARMELITA',
            Nombre: 'Comercializadora Tomari S.A. de C.V.',
          },
          {
            Proveedor: 'CASA GM',
            Nombre: 'David Gómez Hernández',
          },
          {
            Proveedor: 'CASA SUAREZ',
            Nombre: 'EDUARDO HUERTA MEJIA',
          },
          {
            Proveedor: 'CASISA',
            Nombre: 'CAFES DE LA SIERRA SA DE CV',
          },
          {
            Proveedor: 'CATALINA',
            Nombre: 'CATALINA ANTONIO RAMIREZ',
          },
          {
            Proveedor: 'CELAM',
            Nombre: 'Distribuidora Celam S.A. De C.V.',
          },
          {
            Proveedor: 'CELAYA',
            Nombre: 'EMPACADORA CELAYA SA DE CV',
          },
          {
            Proveedor: 'CENTENNIAL',
            Nombre: 'Centennial S.A. De C.V.',
          },
          {
            Proveedor: 'Central Viveres',
            Nombre: 'CENTRAL DE VIVERES DEL SURESTE SA DE CV',
          },
          {
            Proveedor: 'CERVEZAS MODELO',
            Nombre: 'LAS CERVEZAS MODELO EN VERACRUZ SA DE CV',
          },
          {
            Proveedor: 'CERVI DISTRIB',
            Nombre: 'ROSALBA VILLALVAZO CRISANTOS',
          },
          {
            Proveedor: 'CESAR ROMERO',
            Nombre: 'Cesar Romero Hernández',
          },
          {
            Proveedor: 'CG INSUMOS',
            Nombre: 'GG Insumos S. De R.L. De C.V.',
          },
          {
            Proveedor: 'CHEDRAUI',
            Nombre: 'Tiendas Chedraui S.A. de C.V.',
          },
          {
            Proveedor: 'CHILES XALAPA',
            Nombre: 'Alfredo Mendiola Sedeño',
          },
          {
            Proveedor: 'Chocotepa',
            Nombre: 'Maria De Jesus Morales Temis',
          },
          {
            Proveedor: 'COCA',
            Nombre: 'Inmuebles del Golfo S.A. de C.V.',
          },
          {
            Proveedor: 'CODIGO',
            Nombre: 'BERNARDO DANIEL ROJAS FLORES',
          },
          {
            Proveedor: 'COMA',
            Nombre: 'COMPAÑIA MAYORISTA DE ABARROTES SA DE CV',
          },
          {
            Proveedor: 'COMERVER',
            Nombre: 'COMERVER, S. A. DE C. V.',
          },
          {
            Proveedor: 'CON ALIMENTOS',
            Nombre: 'CON ALIMENTOS SA DE CV',
          },
          {
            Proveedor: 'COPASBA',
            Nombre: 'Corporativo Papelero Suministros S.A. De C.V.',
          },
          {
            Proveedor: 'COSTEÑA',
            Nombre: 'CONSERVAS LA COSTEÑA SA DE CV',
          },
          {
            Proveedor: 'CREMERIA',
            Nombre: 'CREMERIA AMERICANA SA DE CV',
          },
          {
            Proveedor: 'CRUGAR',
            Nombre: 'HONORIA RAMOS GALLEGOS',
          },
          {
            Proveedor: 'CUETARA',
            Nombre: 'Galletas Cuetara S.A. de C.V.',
          },
          {
            Proveedor: 'DANONE',
            Nombre: 'DANONE DE MEXICO SA DE CV',
          },
          {
            Proveedor: 'DECASA',
            Nombre: 'DESARROLLO COMERCIAL ABARROTERO SA DE CV',
          },
          {
            Proveedor: 'DEGASA',
            Nombre: 'Degasa, S.A. De C.V.',
          },
          {
            Proveedor: 'DEL MONTE',
            Nombre: 'ConAgra Foods Mexico S.A. de C.V.',
          },
          {
            Proveedor: 'DELICIA',
            Nombre: 'Jarabes Veracruzanos S.A. de C.V.',
          },
          {
            Proveedor: 'DIPEPSA',
            Nombre: 'Dist. De Perfumeria Y Populares S.A. De C.V.',
          },
          {
            Proveedor: 'DIPLASA',
            Nombre: 'Distribuidora De Plasticos De Cordoba, S.A. C.V.',
          },
          {
            Proveedor: 'Dist. Lopez',
            Nombre: 'Jose Lopez Luna',
          },
          {
            Proveedor: 'DIVERSOS',
            Nombre: 'Proveedores Diversos',
          },
          {
            Proveedor: 'DNAC',
            Nombre: 'Dnac S.A. De C.V.',
          },
          {
            Proveedor: 'DOÑA MAGO',
            Nombre: 'MARGARITA VAZQUEZ DE LA PAZ',
          },
          {
            Proveedor: 'EGDAL',
            Nombre: 'EGDAL VAZQUEZ HIDALGO',
          },
          {
            Proveedor: 'EL MADRUGADOR',
            Nombre: 'El Madrugador Industrial Molinera S.A. De C.V.',
          },
          {
            Proveedor: 'EL PAYASO',
            Nombre: 'Dulceria El Payaso, S.A. de C.V.',
          },
          {
            Proveedor: 'EL ROSARIO',
            Nombre: 'Juan Manuel Virues Colorado',
          },
          {
            Proveedor: 'EL TREBOL',
            Nombre: 'CORPORATIVO MULTIPLASTIC EL TREBOL S. A. DE C. V.',
          },
          {
            Proveedor: 'ELECTROPURA',
            Nombre: 'ELECTROPURAS S DE RL DE CV',
          },
          {
            Proveedor: 'ELIAS RAMIRO',
            Nombre: 'ELIAS RAMIRO MENDOZA MENENGUEZ',
          },
          {
            Proveedor: 'ELVA',
            Nombre: 'Distribuidora Elva S.A. De C.V.',
          },
          {
            Proveedor: 'ESCONDIDA',
            Nombre: 'GERARDO MORALES RAMIREZ',
          },
          {
            Proveedor: 'EUROL',
            Nombre: 'Chocolates Selectos De Jalisco S.A.C.V.',
          },
          {
            Proveedor: 'FARMABASTO',
            Nombre: 'Farmabasto Veracruz S.A. de C.V.',
          },
          {
            Proveedor: 'FARMACIAS',
            Nombre: 'FARMACIAS HOSPITALARIAS AN, S. A. DE C. V.',
          },
          {
            Proveedor: 'FARMADEPOT',
            Nombre: 'MOEDANO S OTC SA DE CV',
          },
          {
            Proveedor: 'Fibrasmex',
            Nombre: 'Jose Alberto Sarda Cue',
          },
          {
            Proveedor: 'FINAVEL',
            Nombre: 'Parafinas y Veladoras Finavel S.A. C.V.',
          },
          {
            Proveedor: 'FLAMINGOS',
            Nombre: 'Rigoberto Mota Ramírez',
          },
          {
            Proveedor: 'FRAFT',
            Nombre: 'KRAFT  FOODS  DE MEXICO S DE R L DE C V',
          },
          {
            Proveedor: 'FRANCISCO',
            Nombre: 'FRANCISCO MAXIMINO MARTINEZ ISLA',
          },
          {
            Proveedor: 'FRITEHSA',
            Nombre: 'FRITEHSA SA DE CV',
          },
          {
            Proveedor: 'FRUTI QUEKO',
            Nombre: 'Heber Basurto Morozumi',
          },
          {
            Proveedor: 'FUERTE',
            Nombre: 'Corfuerte S.A. De C.V.',
          },
          {
            Proveedor: 'GABRIEL',
            Nombre: 'GABRIEL VAZQUEZ LINARES',
          },
          {
            Proveedor: 'GAMESA',
            Nombre: 'Grupo Gamesa S. De R.L. De C.V.',
          },
          {
            Proveedor: 'GANDA',
            Nombre: 'Ganda Representaciones, S.A. De C.V.',
          },
          {
            Proveedor: 'GANE',
            Nombre: 'Industrias Gane S.A. de C.V.',
          },
          {
            Proveedor: 'GARZA',
            Nombre: 'RUBEN TORRES CASTILLO',
          },
          {
            Proveedor: 'GAVIOTA',
            Nombre: 'DISTRIBUIDORA DE MATERIAS PRIMAS LA GAVI',
          },
          {
            Proveedor: 'GENERAL',
            Nombre: 'General de Abastos S.A. De C.V.',
          },
          {
            Proveedor: 'GEPP',
            Nombre: 'EMBOTELLADORA Y DISTRIBUIDORA GEPP SA DE CV',
          },
          {
            Proveedor: 'GEVSA',
            Nombre: 'Grupo Gevsa S.A. De C.V.',
          },
          {
            Proveedor: 'GIGANTE',
            Nombre: 'GIGANTE S.A. DE C.V.',
          },
          {
            Proveedor: 'GIVSA',
            Nombre: 'Grupo Industrial Vida S.A. De C.V.',
          },
          {
            Proveedor: 'GLOBA',
            Nombre: 'Globa Distribuciones, S.A. De C.V.',
          },
          {
            Proveedor: 'H-24',
            Nombre: 'Industrias H-24, S.A DE C.V.',
          },
          {
            Proveedor: 'HELEN',
            Nombre: 'Helen Of Troy De Mexico S.R.L. De C.V.',
          },
          {
            Proveedor: 'HERDEZ',
            Nombre: 'COMPAÑIA COMERCIAL HERDEZ SA DE CV',
          },
          {
            Proveedor: 'HERTIPAK',
            Nombre: 'Grupo Alimenticio del Golfo S.A. de C.V.',
          },
          {
            Proveedor: 'HIDALMEX',
            Nombre: 'LUCIA RIVAS GOMEZ',
          },
          {
            Proveedor: 'HORCHAMEX',
            Nombre: 'HORCHAMEX, S.A. DE C. V.',
          },
          {
            Proveedor: 'IDEAL',
            Nombre: 'CHOCOLATE IDEAL SA DE CV',
          },
          {
            Proveedor: 'IMP OSO',
            Nombre: 'IMPORTADORA OSO SA DE CV',
          },
          {
            Proveedor: 'IMPERIAL',
            Nombre: 'Imperial Bebidas S.A. De C.V.',
          },
          {
            Proveedor: 'IMPORTADORA OSO',
            Nombre: 'IMPORTADORA OSO SA DE CV',
          },
          {
            Proveedor: 'INDELPA',
            Nombre: 'Indelpa S.A DE C.V.',
          },
          {
            Proveedor: 'INFASA',
            Nombre: 'INDUSTRIAL LA FAMA  SA DE CV',
          },
          {
            Proveedor: 'INGRID',
            Nombre: 'INGRID ESTEFANIA VALLEJOS VASQUEZ',
          },
          {
            Proveedor: 'IPACPA',
            Nombre: 'IPACPA, S.A. DE C.V.',
          },
          {
            Proveedor: 'ISABEL',
            Nombre: 'COMERCIALIZADORA ISABEL  SA DE CV',
          },
          {
            Proveedor: 'ITALIANA',
            Nombre: 'La Italiana, S.A. De C.V.',
          },
          {
            Proveedor: 'JABON CORONA',
            Nombre: 'FABRICA DE JABON LA CORONA SA DE CV',
          },
          {
            Proveedor: 'JACOME',
            Nombre: 'José Luis Jácome Arias',
          },
          {
            Proveedor: 'JAROCHO',
            Nombre: 'EMBOTELLADORA EL JAROCHO SA DE CV',
          },
          {
            Proveedor: 'Jose',
            Nombre: 'José Luís Jacome',
          },
          {
            Proveedor: 'JUAN CARLOS',
            Nombre: 'JUAN CARLOS MARTINEZ VENEGAS',
          },
          {
            Proveedor: 'JUANA',
            Nombre: 'JUANA CASTILLO MAYA',
          },
          {
            Proveedor: 'JULIO CESAR',
            Nombre: 'JULIO CESAR RODRIGUEZ ABAD',
          },
          {
            Proveedor: 'KRAFT',
            Nombre: 'KRAFT  FOODS  DE MEXICO S DE R L DE C V',
          },
          {
            Proveedor: 'LA ACAYUQUEÑA',
            Nombre: 'Cesar Carmona Uscanga',
          },
          {
            Proveedor: 'La Anita',
            Nombre: 'La Anita Condimentos Y Salsas S.A. De C.V.',
          },
          {
            Proveedor: 'LA GLORIA',
            Nombre: 'Cia. Manufacturera De Veladoras S.A.C.V.',
          },
          {
            Proveedor: 'LA INDUSTRIAL',
            Nombre: 'LA INDUSTRIAL DEL GOLFO DE VERACRUZ, S.A. DE C.V.',
          },
          {
            Proveedor: 'LA ITALIANA',
            Nombre: 'GALLETERA ITALIANA SA DE CV',
          },
          {
            Proveedor: 'LA JOSEFINA',
            Nombre: 'DULCERIA JOSEFINA SA DE CV',
          },
          {
            Proveedor: 'La Princesa ',
            Nombre: 'ORALIA DOMINGUEZ GARCIA',
          },
          {
            Proveedor: 'La Y Griega',
            Nombre: 'MAYOREO Y DISTRIBUCIONES LA Y GRIEGA SA ',
          },
          {
            Proveedor: 'LACTEOS NORTE',
            Nombre: 'Dist. y Com. Lacteos Del Norte S.A. De C.V.',
          },
          {
            Proveedor: 'LAGIRALDA',
            Nombre: 'Fabrica de dulces y chocolates la Giralda',
          },
          {
            Proveedor: 'LALA',
            Nombre: 'COMERCIALIZADORA DE LACTEOS Y DERIVADOS ',
          },
          {
            Proveedor: 'LAMBI',
            Nombre: 'Lambi S.A De C.V.',
          },
          {
            Proveedor: 'LaNavarra',
            Nombre: 'Mercantil Navarra en Córdoba S. de R.L',
          },
          {
            Proveedor: 'LAS ESTACIONES',
            Nombre: 'Auto Servicio Las Estaciones S.A. De C.V.',
          },
          {
            Proveedor: 'LEDESMA',
            Nombre: 'Carlos Martin Ledesma Capdevielle',
          },
          {
            Proveedor: 'LICORES VER',
            Nombre: 'LICORES VERACRUZ SA DE CV',
          },
          {
            Proveedor: 'LLOD',
            Nombre: 'Leopoldo Loyola Díaz',
          },
          {
            Proveedor: 'LOGI COMER',
            Nombre: 'Logi Comer Pro S.A. De C.V.',
          },
          {
            Proveedor: 'LOS TUXTLAS',
            Nombre: 'Vinos Y Licores De Los Tuxtlas S.A. de C.V.',
          },
          {
            Proveedor: 'MAB',
            Nombre: 'MEXICANA DE ABARROTES SA DE CV',
          },
          {
            Proveedor: 'MABE',
            Nombre: 'Productos Internacionales Mabe S.A C.V.',
          },
          {
            Proveedor: 'MADRID',
            Nombre: 'ARMANDO MADRID LOPEZ',
          },
          {
            Proveedor: 'MANUEL',
            Nombre: 'MANUEL JEDIDIAS ISLAS BONILLA ',
          },
          {
            Proveedor: 'MARDIA',
            Nombre: 'MARDIA DE VERACRUZ SA DE CV',
          },
          {
            Proveedor: 'MARIO',
            Nombre: 'Mario Alberto Reyes Mogo',
          },
          {
            Proveedor: 'MARLA',
            Nombre: 'Gloria Lara Garcia',
          },
          {
            Proveedor: 'MARTHA LUCERO',
            Nombre: 'MARTHA LUCERO AVILA CHAVEZ',
          },
          {
            Proveedor: 'Matanzo',
            Nombre: 'Matanzo S.A. de C.V.',
          },
          {
            Proveedor: 'MAYWARE',
            Nombre: 'MAYWARE SA DE CV',
          },
          {
            Proveedor: 'MODERNA',
            Nombre: 'PRODUCTOS ALIMENTICIOS LA MODERNA SA DE ',
          },
          {
            Proveedor: 'Mole Castizo',
            Nombre: 'JAIME HERNANDEZ MERCAD',
          },
          {
            Proveedor: 'MONDELEZ',
            Nombre: 'MONDELEZ MEXICO, S. DE R.L. DE C.V.',
          },
          {
            Proveedor: 'MULTIFARMA',
            Nombre: 'Multifarma S. de R.L. de C.V.',
          },
          {
            Proveedor: 'Muñoz',
            Nombre: 'SERGIO MUÑOZ Y VARGAS',
          },
          {
            Proveedor: 'MYRNA',
            Nombre: 'CAFE MYRNA S DE RL Y CV',
          },
          {
            Proveedor: 'NATURAL',
            Nombre: 'Natural De Alimentos, S.A. De C.V.',
          },
          {
            Proveedor: 'NESTLE',
            Nombre: 'MARCAS NESTLE SA DE CV',
          },
          {
            Proveedor: 'NICTE',
            Nombre: 'NICTE QUETZALLI RODRIGUEZ RUIZ',
          },
          {
            Proveedor: 'NISSIN',
            Nombre: 'NISSIN FOODS DE MEXICO SA DE CV',
          },
          {
            Proveedor: 'NORVER',
            Nombre: 'Empacadora Norver S.A. De C.V.',
          },
          {
            Proveedor: 'NUTRIGO',
            Nombre: 'Nutrigo S.A. De C.V.',
          },
          {
            Proveedor: 'OMNILIFE',
            Nombre: 'Omnilife De Mexico, S.A. De C.V.',
          },
          {
            Proveedor: 'ONORATA',
            Nombre: 'ONORATA RAMOS GALLEGOS',
          },
          {
            Proveedor: 'P&P',
            Nombre: 'P&P Alimentos, S.A. De C.V.',
          },
          {
            Proveedor: 'PANAMERICANA',
            Nombre: 'Compañia Panamericana De Cigarrillos, S.A. De C.V.',
          },
          {
            Proveedor: 'PARAISO',
            Nombre: 'VELADORAS PARAISO SA DE CV',
          },
          {
            Proveedor: 'PASTELERO',
            Nombre: 'Victoria Palma Peralta',
          },
          {
            Proveedor: 'PATRONA',
            Nombre: 'INDUSTRIAL PATRONA SA DE CV',
          },
          {
            Proveedor: 'PCS',
            Nombre: 'Precio Calidad Y Servicio S.A. De C.V.',
          },
          {
            Proveedor: 'PDM',
            Nombre: 'Productos Domesticos De México S.A. De C.V.',
          },
          {
            Proveedor: 'PEÑAFIEL',
            Nombre: 'BEBIDAS REFRESCANTES DE ACAYUCAN SA DE C',
          },
          {
            Proveedor: 'PEPSI',
            Nombre: 'Embotelladora Tropical S.A. De C.V.',
          },
          {
            Proveedor: 'PEPSICO',
            Nombre: 'COMERCIALIZADORA PEPSICO MEXICO S DE RL DE CV',
          },
          {
            Proveedor: 'PHILIP MORRIS',
            Nombre: 'PHILIP MORRIS MEXICO, S.A DE C.V.',
          },
          {
            Proveedor: 'PINGUINOS',
            Nombre: 'Mireya Lopez Garcia',
          },
          {
            Proveedor: 'PINSA',
            Nombre: 'Pescados Industrializados S.A. De C.V.',
          },
          {
            Proveedor: 'PLATANOS WIL',
            Nombre: 'WILFRIDO PEREZ ARIAS',
          },
          {
            Proveedor: 'POLO',
            Nombre: 'MAGDALENA NARCISA BARRIA ALVAREZ',
          },
          {
            Proveedor: 'PRADEL',
            Nombre: 'Lacteos De Chiapas S.A. De C.V.',
          },
          {
            Proveedor: 'PROCESADORA',
            Nombre: 'Procesadora De Prod. Agrop. De Acayucan, S.A. C.V.',
          },
          {
            Proveedor: 'PRODUCTOS Z',
            Nombre: 'PRODUCTOS DE CONSUMO Z  SA DE CV',
          },
          {
            Proveedor: 'PROMODISA',
            Nombre: 'DISTRIBUCION FRESCA Y NATURAL DEL SUR SA',
          },
          {
            Proveedor: 'PROPIMEX',
            Nombre: 'PROPIMEX S. DE R.L. DE C.V.',
          },
          {
            Proveedor: 'PROTEINA',
            Nombre: 'PROTEINA ANIMAL SA DE CV',
          },
          {
            Proveedor: 'PROVEL',
            Nombre: 'PRODUCTORA DE VELAS Y VELADORAS SA DE CV',
          },
          {
            Proveedor: 'QAT',
            Nombre: 'Pedro Vallejos Diaz',
          },
          {
            Proveedor: 'QUALAMEX',
            Nombre: 'Qualamex, S.A de C.V.',
          },
          {
            Proveedor: 'QUALTIA',
            Nombre: 'QUALTIA ALIMENTOS OPERACIONES S DE RL DE',
          },
          {
            Proveedor: 'QUIM LA ANITA',
            Nombre: 'Productos Quimicos La Anita, S.A. C.V.',
          },
          {
            Proveedor: 'RACCSA',
            Nombre: 'Ralfer Comercio Creativo, S.A. De C.V.',
          },
          {
            Proveedor: 'RAGON',
            Nombre: 'Comercializadora Ragón, S.A. De C.V.',
          },
          {
            Proveedor: 'REMES',
            Nombre: 'Representaciones Y Mediaciones De Sotavento S.A.',
          },
          {
            Proveedor: 'RIVERA',
            Nombre: 'PROVEEDORA DE ABARROTES RIVERA SA DE CV',
          },
          {
            Proveedor: 'ROGELIO',
            Nombre: 'ROGELIO MENDOZA MENDEZ',
          },
          {
            Proveedor: 'ROX RAM',
            Nombre: 'COMERCIALIZADORA ROX RAM S.A. DE C.V.',
          },
          {
            Proveedor: 'ROYAL TEA',
            Nombre: 'Royal Tea S.A. De C.V.',
          },
          {
            Proveedor: 'RYC',
            Nombre: 'RYC ALIMENTOS SA DE CV',
          },
          {
            Proveedor: 'SABORMEX',
            Nombre: 'SABORMEX SA DE CV',
          },
          {
            Proveedor: 'SABRITAS',
            Nombre: 'Sabritas S. De R.L. De C.V.',
          },
          {
            Proveedor: 'SAGAHON',
            Nombre: 'CONSULTORIA Y REPRESENTACIONES SAGAHON SA DE CV',
          },
          {
            Proveedor: 'SAHUAYO',
            Nombre: 'ORGANIZACION SAHUAYO SA DE CV',
          },
          {
            Proveedor: 'SALAZAR',
            Nombre: 'Hiram Ruperto Luna Caamaño',
          },
          {
            Proveedor: 'SALSA ACAYUCAN',
            Nombre: 'SALSAS ACAYUCAN SA DE CV',
          },
          {
            Proveedor: 'SALSAS ACAYUCAN',
            Nombre: 'SALSAS ACAYUCAN SA DE CV',
          },
          {
            Proveedor: 'SAMUEL',
            Nombre: 'SAMUEL PEREZ ALEJO',
          },
          {
            Proveedor: 'San Blas',
            Nombre: 'MOLINO HARINERO SAN BLAS SA DE CV',
          },
          {
            Proveedor: 'San Marcos',
            Nombre: 'EMPACADORA SAN MARCOS SA DE CV',
          },
          {
            Proveedor: 'SCHETTINO',
            Nombre: 'SCHETTINO HERMANOS S DE RL DE CV',
          },
          {
            Proveedor: 'SECOMSA',
            Nombre: 'Servicios Comerciales Moran S.A. C.V.',
          },
          {
            Proveedor: 'SEDIVER',
            Nombre: 'SERVICIO Y DISTISTRIBUCION DE VERACRUZ  ',
          },
          {
            Proveedor: 'SELECTOS',
            Nombre: 'Envasadora Y Dist. De Prod. Selectos, S.A. C.V.',
          },
          {
            Proveedor: 'serviplastic',
            Nombre: 'Armando Ignacio Ortiz',
          },
          {
            Proveedor: 'SID TEXMELUCAN',
            Nombre: 'INDUSTRIAL SIDRERA DE TEXMELUCAN SA DE CV',
          },
          {
            Proveedor: 'SIGMA',
            Nombre: 'SIGMA ALIMENTOS COMERCIAL, S.A. DE C.V.',
          },
          {
            Proveedor: 'SILVA',
            Nombre: 'EMPACADORA SILVA SA DE CV',
          },
          {
            Proveedor: 'SOCIEDAD',
            Nombre: 'SOCIEDAD COOPERATIVA TRABAJADORES DE PASCUAL, S.C.L.',
          },
          {
            Proveedor: 'SORIANA',
            Nombre: 'TIENDAS SORIANA SA DE CV',
          },
          {
            Proveedor: 'SPA CENTRO',
            Nombre: 'Super Promociones De Acayucan, Centro',
          },
          {
            Proveedor: 'SPA ENRIQUEZ',
            Nombre: 'Super Promociones De Acayucan, Enriquez',
          },
          {
            Proveedor: 'SPA JALTIPAN',
            Nombre: 'Super Promociones De Acayucan, Jaltipan',
          },
          {
            Proveedor: 'STA CRUZ',
            Nombre: 'Procesadora Real Sta Cruz (S.DE R.L.MI)',
          },
          {
            Proveedor: 'Super de Todo',
            Nombre: 'Nosotros Mismos',
          },
          {
            Proveedor: 'SURESTE',
            Nombre: '*',
          },
          {
            Proveedor: 'TANIA',
            Nombre: 'TANIA ABREGO DELFIN',
          },
          {
            Proveedor: 'TELENO',
            Nombre: 'ABASTOS TELENO  SA DE CV',
          },
          {
            Proveedor: 'TRESMONTES',
            Nombre: 'Tresmontes Lucchetti Mexico, S.A. De C.V.',
          },
          {
            Proveedor: 'Tropical',
            Nombre: 'JUANA MARIA LOPEZ GONZALEZ',
          },
          {
            Proveedor: 'TUCA',
            Nombre: 'DISTRIBUIDORA TUCA  SA DE CV',
          },
          {
            Proveedor: 'TUXTEPEC',
            Nombre: 'Distribuidora Tuxtepec, S.A. De C.V.',
          },
          {
            Proveedor: 'ULTRA FRESCA',
            Nombre: 'Ultra Fresca S.A. De C.V.',
          },
          {
            Proveedor: 'ULTRALACTEOS',
            Nombre: 'Ultralacteos S.A. De C.V.',
          },
          {
            Proveedor: 'UNILEVER',
            Nombre: 'Unilever de México, S de R.L. de C.V.',
          },
          {
            Proveedor: 'Velas Oaxaca',
            Nombre: 'VELAS Y VELADORAS DE OAXACA SA DE CV',
          },
          {
            Proveedor: 'VERASUR',
            Nombre: 'Dist. Comercial Verasur S.A. De C.V.',
          },
          {
            Proveedor: 'VERMEX',
            Nombre: 'CONSERVAS VERMEX  SA DE CV',
          },
          {
            Proveedor: 'vicman',
            Nombre: 'DESECHABLES VICMAN S. A. DE C. V.',
          },
          {
            Proveedor: 'VICVEMI',
            Nombre: 'GRUPO VICVEMI S. A. DE C. V.',
          },
          {
            Proveedor: 'WALTMAR',
            Nombre: 'NUEVA WALMART DE MEXICO S DE RL DE CV',
          },
          {
            Proveedor: 'YAKULT',
            Nombre: 'YAKULT SA DE CV',
          },
          {
            Proveedor: 'YAMPI',
            Nombre: 'Antonia Del Carmen Pimienta May',
          },
          {
            Proveedor: 'YOLANDA',
            Nombre: 'YOLANDA MARGARITA SALAZAR CASTAÑEDA',
          },
        ],
      },
  provider: localStorage.getItem('spastore_existence_provider_provider'),
  sucursal: localStorage.getItem('spastore_existencias_provider_sucursal'),
})

export const mutations = {
  setConsolidacionActual(state, consolidacionActual) {
    state.consolidacionActual = consolidacionActual
    localStorage.setItem(
      'spastore_consolidaciones_actual',
      JSON.stringify(consolidacionActual)
    )
  },
  setData(state, data) {
    state.data = data
    localStorage.setItem(
      'spastore_existence_provider_data',
      JSON.stringify(data)
    )
  },
  setProviders(state, providers) {
    state.data = providers
    localStorage.setItem(
      'spastore_existence_provider_providers',
      JSON.stringify(providers)
    )
  },
  setSucursal(state, sucursal) {
    state.sucursal = sucursal
    localStorage.setItem('spastore_existencias_provider_sucursal', sucursal)
  },
  setProvider(state, provider) {
    state.provider = provider
    localStorage.setItem('spastore_existence_provider_provider', provider)
  },
}

export const actions = {
  async changeData({ commit }, [dateStart, dateEnd, sucursal]) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/consolidaciones/' +
        sucursal +
        '?fechaIni=' +
        dateStart +
        '&fechaFin=' +
        dateEnd

      const response = await this.$axios({
        url,
        method: 'get',
      })

      if (response.data.response.success) {
        commit('setData', { data: response.data.response.data })
      }

      return response.data.response
    } catch (error) {
      if (error.response) {
        return error.response.data
      }
      return {
        success: false,
        message: 'Error con el servidor',
        error,
      }
    }
  },
  async loadDetails({ commit }, [sucursal, documento, data, dateDocument]) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/consolidaciones/' +
        sucursal +
        '/articulos/' +
        documento +
        '?dateDocument=' +
        dateDocument
      const response = await this.$axios({
        url,
        method: 'get',
      })

      if (response.data.success) {
        commit('setDetails', { data: response.data.data })
        commit('setConsolidacionActual', { data })
      }

      return response.data
    } catch (error) {
      if (error.response) {
        return error.response.data
      }
      return {
        success: false,
        message: 'Error con el servidor',
        error,
      }
    }
  },
}
