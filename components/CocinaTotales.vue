<template>
  <div>
    Sucursal:
    <b-badge
      v-for="(sucursal, indexSuc) in sucursales"
      :key="indexSuc"
      pill
      variant="info"
      class="sucursal"
      @click="changeSucursal(sucursal)"
    >
      <b-icon-check-circle-fill v-if="sucursalSelected === sucursal" />
      <b-icon-circle v-else />
      {{ sucursal }}
    </b-badge>
    <b-badge
      pill
      variant="info"
      class="sucursal"
      @click="changeSucursal('ALL')"
    >
      <b-icon-check-circle-fill v-if="sucursalSelected === 'ALL'" />
      <b-icon-circle v-else />
      TODO
    </b-badge>
    <b-table
      striped
      hover
      head-variant="dark"
      responsive=""
      :fields="fields"
      :items="itemsRafactor"
      :class="variantThemeTableBody"
      class="mt-2"
      :tbody-tr-class="rowClass"
    >
      <template #cell(Total)="row">
        {{ getTotal(row.item) }}
      </template>
    </b-table>
  </div>
</template>

<script>
import { BIconCircle, BIconCheckCircleFill } from 'bootstrap-vue'
import utils from '../modules/utils'

export default {
  components: {
    BIconCircle,
    BIconCheckCircleFill,
  },
  data() {
    return {
      sucursalSelected: 'ZR',
      sucursales: ['ZR', 'VC'],
      utils,
      data: [
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 1,
          Venta: 1391.6,
          PrimeraVenta: '1900-01-01T08:31:36',
          UltimaVenta: '1900-01-01T17:54:57',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 2,
          Venta: 1673.2,
          PrimeraVenta: '1900-01-01T08:31:30',
          UltimaVenta: '1900-01-01T17:39:40',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 3,
          Venta: 951.4,
          PrimeraVenta: '1900-01-01T08:06:37',
          UltimaVenta: '1900-01-01T20:05:36',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 4,
          Venta: 518.0,
          PrimeraVenta: '1900-01-01T09:28:48',
          UltimaVenta: '1900-01-01T13:33:12',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 5,
          Venta: 1362.2,
          PrimeraVenta: '1900-01-01T07:54:56',
          UltimaVenta: '1900-01-01T17:14:48',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 6,
          Venta: 1101.25,
          PrimeraVenta: '1900-01-01T08:41:26',
          UltimaVenta: '1900-01-01T19:37:01',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 7,
          Venta: 884.2,
          PrimeraVenta: '1900-01-01T08:20:23',
          UltimaVenta: '1900-01-01T21:07:49',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 8,
          Venta: 1594.38,
          PrimeraVenta: '1900-01-01T08:21:26',
          UltimaVenta: '1900-01-01T20:27:29',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 9,
          Venta: 1492.95,
          PrimeraVenta: '1900-01-01T08:01:16',
          UltimaVenta: '1900-01-01T16:34:12',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 10,
          Venta: 983.6,
          PrimeraVenta: '1900-01-01T08:10:46',
          UltimaVenta: '1900-01-01T17:07:15',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 11,
          Venta: 504.28,
          PrimeraVenta: '1900-01-01T08:38:42',
          UltimaVenta: '1900-01-01T15:49:46',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 12,
          Venta: 867.6,
          PrimeraVenta: '1900-01-01T08:27:55',
          UltimaVenta: '1900-01-01T18:52:27',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 13,
          Venta: 1145.15,
          PrimeraVenta: '1900-01-01T08:38:19',
          UltimaVenta: '1900-01-01T15:02:13',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 14,
          Venta: 825.63,
          PrimeraVenta: '1900-01-01T08:29:59',
          UltimaVenta: '1900-01-01T18:07:06',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 15,
          Venta: 1266.82,
          PrimeraVenta: '1900-01-01T08:49:42',
          UltimaVenta: '1900-01-01T18:29:55',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 16,
          Venta: 747.1,
          PrimeraVenta: '1900-01-01T08:43:11',
          UltimaVenta: '1900-01-01T19:04:18',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 17,
          Venta: 903.42,
          PrimeraVenta: '1900-01-01T08:05:44',
          UltimaVenta: '1900-01-01T16:01:42',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 18,
          Venta: 283.32,
          PrimeraVenta: '1900-01-01T08:29:55',
          UltimaVenta: '1900-01-01T15:09:21',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 19,
          Venta: 1345.03,
          PrimeraVenta: '1900-01-01T08:34:57',
          UltimaVenta: '1900-01-01T16:49:25',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 20,
          Venta: 1165.9,
          PrimeraVenta: '1900-01-01T08:23:04',
          UltimaVenta: '1900-01-01T17:30:28',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 21,
          Venta: 1003.8,
          PrimeraVenta: '1900-01-01T08:21:28',
          UltimaVenta: '1900-01-01T16:54:56',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 22,
          Venta: 1492.8,
          PrimeraVenta: '1900-01-01T08:00:01',
          UltimaVenta: '1900-01-01T19:02:15',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 23,
          Venta: 919.25,
          PrimeraVenta: '1900-01-01T08:16:03',
          UltimaVenta: '1900-01-01T17:52:17',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 24,
          Venta: 1018.1,
          PrimeraVenta: '1900-01-01T08:23:42',
          UltimaVenta: '1900-01-01T20:45:03',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 25,
          Venta: 373.6,
          PrimeraVenta: '1900-01-01T08:10:55',
          UltimaVenta: '1900-01-01T15:27:23',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 26,
          Venta: 1340.08,
          PrimeraVenta: '1900-01-01T07:47:08',
          UltimaVenta: '1900-01-01T15:48:44',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 27,
          Venta: 1202.95,
          PrimeraVenta: '1900-01-01T08:43:24',
          UltimaVenta: '1900-01-01T19:16:19',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 28,
          Venta: 936.35,
          PrimeraVenta: '1900-01-01T08:05:02',
          UltimaVenta: '1900-01-01T17:01:02',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 29,
          Venta: 814.5,
          PrimeraVenta: '1900-01-01T08:31:07',
          UltimaVenta: '1900-01-01T18:55:38',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 30,
          Venta: 1003.7,
          PrimeraVenta: '1900-01-01T09:02:53',
          UltimaVenta: '1900-01-01T16:33:45',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 31,
          Venta: 1076.84,
          PrimeraVenta: '1900-01-01T08:26:10',
          UltimaVenta: '1900-01-01T18:28:07',
        },
        {
          Suc: 'ZR',
          Mes: 8,
          MesMovimientoLetra: 'Agosto',
          Dia: 1,
          Venta: 360.0,
          PrimeraVenta: '1900-01-01T08:20:45',
          UltimaVenta: '1900-01-01T19:52:50',
        },
        {
          Suc: 'ZR',
          Mes: 8,
          MesMovimientoLetra: 'Agosto',
          Dia: 2,
          Venta: 955.86,
          PrimeraVenta: '1900-01-01T08:03:00',
          UltimaVenta: '1900-01-01T19:21:58',
        },
        {
          Suc: 'ZR',
          Mes: 8,
          MesMovimientoLetra: 'Agosto',
          Dia: 3,
          Venta: 951.26,
          PrimeraVenta: '1900-01-01T09:07:14',
          UltimaVenta: '1900-01-01T19:14:49',
        },
        {
          Suc: 'ZR',
          Mes: 8,
          MesMovimientoLetra: 'Agosto',
          Dia: 4,
          Venta: 1285.92,
          PrimeraVenta: '1900-01-01T08:14:33',
          UltimaVenta: '1900-01-01T20:03:04',
        },
        {
          Suc: 'ZR',
          Mes: 8,
          MesMovimientoLetra: 'Agosto',
          Dia: 5,
          Venta: 1683.36,
          PrimeraVenta: '1900-01-01T08:44:26',
          UltimaVenta: '1900-01-01T16:21:00',
        },
        {
          Suc: 'ZR',
          Mes: 8,
          MesMovimientoLetra: 'Agosto',
          Dia: 6,
          Venta: 820.84,
          PrimeraVenta: '1900-01-01T07:42:15',
          UltimaVenta: '1900-01-01T17:30:36',
        },
        {
          Suc: 'ZR',
          Mes: 8,
          MesMovimientoLetra: 'Agosto',
          Dia: 7,
          Venta: 1062.35,
          PrimeraVenta: '1900-01-01T08:09:11',
          UltimaVenta: '1900-01-01T20:29:18',
        },
        {
          Suc: 'ZR',
          Mes: 8,
          MesMovimientoLetra: 'Agosto',
          Dia: 8,
          Venta: 311.4,
          PrimeraVenta: '1900-01-01T08:55:11',
          UltimaVenta: '1900-01-01T14:46:32',
        },
        {
          Suc: 'ZR',
          Mes: 8,
          MesMovimientoLetra: 'Agosto',
          Dia: 9,
          Venta: 963.2,
          PrimeraVenta: '1900-01-01T08:16:36',
          UltimaVenta: '1900-01-01T15:43:54',
        },
        {
          Suc: 'ZR',
          Mes: 8,
          MesMovimientoLetra: 'Agosto',
          Dia: 10,
          Venta: 861.34,
          PrimeraVenta: '1900-01-01T09:02:20',
          UltimaVenta: '1900-01-01T18:49:58',
        },
        {
          Suc: 'ZR',
          Mes: 8,
          MesMovimientoLetra: 'Agosto',
          Dia: 11,
          Venta: 1307.5,
          PrimeraVenta: '1900-01-01T08:16:43',
          UltimaVenta: '1900-01-01T15:17:10',
        },
        {
          Suc: 'ZR',
          Mes: 8,
          MesMovimientoLetra: 'Agosto',
          Dia: 12,
          Venta: 810.95,
          PrimeraVenta: '1900-01-01T09:03:16',
          UltimaVenta: '1900-01-01T17:14:45',
        },
        {
          Suc: 'ZR',
          Mes: 8,
          MesMovimientoLetra: 'Agosto',
          Dia: 13,
          Venta: 740.85,
          PrimeraVenta: '1900-01-01T08:45:16',
          UltimaVenta: '1900-01-01T14:52:42',
        },
        {
          Suc: 'ZR',
          Mes: 8,
          MesMovimientoLetra: 'Agosto',
          Dia: 14,
          Venta: 704.61,
          PrimeraVenta: '1900-01-01T09:14:11',
          UltimaVenta: '1900-01-01T17:46:31',
        },
        {
          Suc: 'ZR',
          Mes: 8,
          MesMovimientoLetra: 'Agosto',
          Dia: 15,
          Venta: 60.0,
          PrimeraVenta: '1900-01-01T08:11:31',
          UltimaVenta: '1900-01-01T09:31:31',
        },
        {
          Suc: 'ZR',
          Mes: 8,
          MesMovimientoLetra: 'Agosto',
          Dia: 16,
          Venta: 992.6,
          PrimeraVenta: '1900-01-01T07:51:23',
          UltimaVenta: '1900-01-01T17:15:36',
        },
        {
          Suc: 'ZR',
          Mes: 8,
          MesMovimientoLetra: 'Agosto',
          Dia: 17,
          Venta: 1292.2,
          PrimeraVenta: '1900-01-01T07:54:36',
          UltimaVenta: '1900-01-01T20:41:00',
        },
        {
          Suc: 'ZR',
          Mes: 8,
          MesMovimientoLetra: 'Agosto',
          Dia: 18,
          Venta: 1525.38,
          PrimeraVenta: '1900-01-01T08:07:04',
          UltimaVenta: '1900-01-01T17:15:56',
        },
        {
          Suc: 'VC',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 2,
          Venta: 100.0,
          PrimeraVenta: '1900-01-01T09:26:31',
          UltimaVenta: '1900-01-01T10:53:28',
        },
        {
          Suc: 'VC',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 3,
          Venta: 90.0,
          PrimeraVenta: '1900-01-01T09:01:33',
          UltimaVenta: '1900-01-01T20:12:38',
        },
        {
          Suc: 'VC',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 4,
          Venta: 100.0,
          PrimeraVenta: '1900-01-01T09:53:06',
          UltimaVenta: '1900-01-01T13:00:46',
        },
        {
          Suc: 'VC',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 6,
          Venta: 90.0,
          PrimeraVenta: '1900-01-01T09:53:57',
          UltimaVenta: '1900-01-01T13:20:23',
        },
        {
          Suc: 'VC',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 7,
          Venta: 100.0,
          PrimeraVenta: '1900-01-01T08:38:42',
          UltimaVenta: '1900-01-01T09:33:34',
        },
        {
          Suc: 'VC',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 8,
          Venta: 100.0,
          PrimeraVenta: '1900-01-01T09:26:25',
          UltimaVenta: '1900-01-01T11:44:24',
        },
        {
          Suc: 'VC',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 9,
          Venta: 90.0,
          PrimeraVenta: '1900-01-01T09:05:04',
          UltimaVenta: '1900-01-01T12:45:47',
        },
        {
          Suc: 'VC',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 10,
          Venta: 100.0,
          PrimeraVenta: '1900-01-01T12:28:58',
          UltimaVenta: '1900-01-01T14:16:52',
        },
        {
          Suc: 'VC',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 11,
          Venta: 100.0,
          PrimeraVenta: '1900-01-01T09:01:44',
          UltimaVenta: '1900-01-01T12:41:21',
        },
        {
          Suc: 'VC',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 12,
          Venta: 110.0,
          PrimeraVenta: '1900-01-01T10:08:50',
          UltimaVenta: '1900-01-01T13:46:08',
        },
        {
          Suc: 'VC',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 13,
          Venta: 70.0,
          PrimeraVenta: '1900-01-01T08:55:06',
          UltimaVenta: '1900-01-01T13:10:40',
        },
        {
          Suc: 'VC',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 14,
          Venta: 150.0,
          PrimeraVenta: '1900-01-01T09:25:06',
          UltimaVenta: '1900-01-01T16:40:17',
        },
        {
          Suc: 'VC',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 15,
          Venta: 100.0,
          PrimeraVenta: '1900-01-01T09:59:44',
          UltimaVenta: '1900-01-01T15:46:16',
        },
        {
          Suc: 'VC',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 16,
          Venta: 100.0,
          PrimeraVenta: '1900-01-01T10:35:34',
          UltimaVenta: '1900-01-01T14:44:20',
        },
        {
          Suc: 'VC',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 17,
          Venta: 100.0,
          PrimeraVenta: '1900-01-01T10:12:50',
          UltimaVenta: '1900-01-01T14:30:59',
        },
        {
          Suc: 'VC',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 18,
          Venta: 100.0,
          PrimeraVenta: '1900-01-01T09:16:04',
          UltimaVenta: '1900-01-01T14:44:08',
        },
        {
          Suc: 'VC',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 20,
          Venta: 100.0,
          PrimeraVenta: '1900-01-01T08:33:18',
          UltimaVenta: '1900-01-01T12:06:54',
        },
        {
          Suc: 'VC',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 21,
          Venta: 120.0,
          PrimeraVenta: '1900-01-01T09:24:22',
          UltimaVenta: '1900-01-01T18:29:18',
        },
        {
          Suc: 'VC',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 22,
          Venta: 100.0,
          PrimeraVenta: '1900-01-01T08:54:27',
          UltimaVenta: '1900-01-01T14:21:28',
        },
        {
          Suc: 'VC',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 23,
          Venta: 100.0,
          PrimeraVenta: '1900-01-01T08:44:28',
          UltimaVenta: '1900-01-01T15:02:12',
        },
        {
          Suc: 'VC',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 24,
          Venta: 100.0,
          PrimeraVenta: '1900-01-01T09:04:36',
          UltimaVenta: '1900-01-01T18:25:29',
        },
        {
          Suc: 'VC',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 25,
          Venta: 100.0,
          PrimeraVenta: '1900-01-01T09:09:41',
          UltimaVenta: '1900-01-01T13:27:34',
        },
        {
          Suc: 'VC',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 26,
          Venta: 100.0,
          PrimeraVenta: '1900-01-01T09:38:34',
          UltimaVenta: '1900-01-01T11:48:26',
        },
        {
          Suc: 'VC',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 28,
          Venta: 90.0,
          PrimeraVenta: '1900-01-01T09:10:38',
          UltimaVenta: '1900-01-01T15:27:51',
        },
        {
          Suc: 'VC',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 30,
          Venta: 100.0,
          PrimeraVenta: '1900-01-01T08:58:51',
          UltimaVenta: '1900-01-01T13:24:13',
        },
        {
          Suc: 'VC',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 31,
          Venta: 120.0,
          PrimeraVenta: '1900-01-01T09:26:22',
          UltimaVenta: '1900-01-01T16:50:34',
        },
        {
          Suc: 'VC',
          Mes: 8,
          MesMovimientoLetra: 'Agosto',
          Dia: 1,
          Venta: 70.0,
          PrimeraVenta: '1900-01-01T09:07:25',
          UltimaVenta: '1900-01-01T15:06:16',
        },
        {
          Suc: 'VC',
          Mes: 8,
          MesMovimientoLetra: 'Agosto',
          Dia: 4,
          Venta: 100.0,
          PrimeraVenta: '1900-01-01T08:51:33',
          UltimaVenta: '1900-01-01T13:03:41',
        },
        {
          Suc: 'VC',
          Mes: 8,
          MesMovimientoLetra: 'Agosto',
          Dia: 5,
          Venta: 100.0,
          PrimeraVenta: '1900-01-01T11:24:19',
          UltimaVenta: '1900-01-01T16:55:41',
        },
        {
          Suc: 'VC',
          Mes: 8,
          MesMovimientoLetra: 'Agosto',
          Dia: 6,
          Venta: 90.0,
          PrimeraVenta: '1900-01-01T11:25:24',
          UltimaVenta: '1900-01-01T14:03:48',
        },
        {
          Suc: 'VC',
          Mes: 8,
          MesMovimientoLetra: 'Agosto',
          Dia: 7,
          Venta: 100.0,
          PrimeraVenta: '1900-01-01T09:55:36',
          UltimaVenta: '1900-01-01T13:30:56',
        },
        {
          Suc: 'VC',
          Mes: 8,
          MesMovimientoLetra: 'Agosto',
          Dia: 8,
          Venta: 100.0,
          PrimeraVenta: '1900-01-01T10:03:11',
          UltimaVenta: '1900-01-01T16:23:28',
        },
        {
          Suc: 'VC',
          Mes: 8,
          MesMovimientoLetra: 'Agosto',
          Dia: 9,
          Venta: 120.0,
          PrimeraVenta: '1900-01-01T09:58:15',
          UltimaVenta: '1900-01-01T16:02:25',
        },
        {
          Suc: 'VC',
          Mes: 8,
          MesMovimientoLetra: 'Agosto',
          Dia: 10,
          Venta: 100.0,
          PrimeraVenta: '1900-01-01T11:00:48',
          UltimaVenta: '1900-01-01T14:49:37',
        },
        {
          Suc: 'VC',
          Mes: 8,
          MesMovimientoLetra: 'Agosto',
          Dia: 11,
          Venta: 100.0,
          PrimeraVenta: '1900-01-01T09:03:54',
          UltimaVenta: '1900-01-01T11:26:48',
        },
        {
          Suc: 'VC',
          Mes: 8,
          MesMovimientoLetra: 'Agosto',
          Dia: 12,
          Venta: 120.0,
          PrimeraVenta: '1900-01-01T09:12:23',
          UltimaVenta: '1900-01-01T14:58:42',
        },
        {
          Suc: 'VC',
          Mes: 8,
          MesMovimientoLetra: 'Agosto',
          Dia: 13,
          Venta: 100.0,
          PrimeraVenta: '1900-01-01T09:22:28',
          UltimaVenta: '1900-01-01T13:36:19',
        },
        {
          Suc: 'VC',
          Mes: 8,
          MesMovimientoLetra: 'Agosto',
          Dia: 15,
          Venta: 80.0,
          PrimeraVenta: '1900-01-01T09:17:33',
          UltimaVenta: '1900-01-01T12:00:24',
        },
        {
          Suc: 'VC',
          Mes: 8,
          MesMovimientoLetra: 'Agosto',
          Dia: 16,
          Venta: 120.0,
          PrimeraVenta: '1900-01-01T08:44:20',
          UltimaVenta: '1900-01-01T12:08:14',
        },
        {
          Suc: 'VC',
          Mes: 8,
          MesMovimientoLetra: 'Agosto',
          Dia: 17,
          Venta: 100.0,
          PrimeraVenta: '1900-01-01T08:39:32',
          UltimaVenta: '1900-01-01T11:05:09',
        },
        {
          Suc: 'VC',
          Mes: 8,
          MesMovimientoLetra: 'Agosto',
          Dia: 18,
          Venta: 100.0,
          PrimeraVenta: '1900-01-01T09:23:08',
          UltimaVenta: '1900-01-01T11:51:13',
        },
      ],
      fields: ['Dia', 'Agosto', 'Julio', 'Total'],
    }
  },
  computed: {
    variantThemeTableBody() {
      if (this.$store.state.general.themePreferences === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
        if (systemDark) return 'darkThemeTableBody'
        return ''
      } else if (this.$store.state.general.themePreferences === 'dark')
        return 'darkThemeTableBody'
      else if (this.$store.state.general.themePreferences === 'sepia')
        return 'sepiaThemeItemList'
      else return ''
    },
    itemsRafactor() {
      const sucursal = this.sucursalSelected
      let sumaMes1 = 0
      let sumaMes2 = 0
      let datos
      if (sucursal !== 'ALL') {
        datos = this.data.reduce((acumItems, item) => {
          if (item.Suc === sucursal) {
            const mesFinded = acumItems.findIndex(
              (acumItem) => acumItem.Dia === item.Dia
            )
            if (mesFinded === -1) {
              item[`${item.MesMovimientoLetra}`] = this.utils.aplyFormatNumeric(
                this.utils.roundTo(item.Venta)
              )
              item.Mes = [item.Mes]
              item[`Venta${item.MesMovimientoLetra}`] = item.Venta
              acumItems.push(item)
            } else {
              acumItems[mesFinded][
                `${item.MesMovimientoLetra}`
              ] = this.utils.aplyFormatNumeric(this.utils.roundTo(item.Venta))
              acumItems[mesFinded][`Venta${item.MesMovimientoLetra}`] =
                item.Venta
              acumItems[mesFinded].Mes.push(item.Mes)
            }
            if (item.MesMovimientoLetra === this.fields[1])
              sumaMes1 += item.Venta
            if (item.MesMovimientoLetra === this.fields[2])
              sumaMes2 += item.Venta
          }
          return acumItems
        }, [])
      } else {
        datos = []
        this.data.forEach((sucursal) => {
          const diaFinded = datos.findIndex((suc) => suc.Dia === sucursal.Dia)
          if (diaFinded === -1) {
            const newSuc = {
              Dia: sucursal.Dia,
            }
            newSuc[
              `${sucursal.MesMovimientoLetra}`
            ] = this.utils.aplyFormatNumeric(this.utils.roundTo(sucursal.Venta))
            newSuc[`Venta${sucursal.MesMovimientoLetra}`] = sucursal.Venta
            datos.push(newSuc)
          } else {
            const mesFinded =
              datos[diaFinded][`Venta${sucursal.MesMovimientoLetra}`]
            if (!mesFinded) {
              datos[diaFinded][
                `${sucursal.MesMovimientoLetra}`
              ] = this.utils.aplyFormatNumeric(
                this.utils.roundTo(sucursal.Venta)
              )
              datos[diaFinded][`Venta${sucursal.MesMovimientoLetra}`] =
                sucursal.Venta
            } else {
              const suma = parseFloat(
                datos[diaFinded][`Venta${sucursal.MesMovimientoLetra}`] +
                  sucursal.Venta
              )
              datos[diaFinded][`Venta${sucursal.MesMovimientoLetra}`] = suma
              datos[diaFinded][
                `${sucursal.MesMovimientoLetra}`
              ] = this.utils.aplyFormatNumeric(this.utils.roundTo(suma))
            }
          }
          if (sucursal.MesMovimientoLetra === this.fields[1])
            sumaMes1 += sucursal.Venta
          if (sucursal.MesMovimientoLetra === this.fields[2])
            sumaMes2 += sucursal.Venta
        })
      }
      const foot = {
        Dia: 'Total',
        status: 'end',
      }
      foot[`${this.fields[1]}`] = this.utils.aplyFormatNumeric(
        this.utils.roundTo(sumaMes1)
      )
      foot[`Venta${this.fields[1]}`] = sumaMes1
      foot[`${this.fields[2]}`] = this.utils.aplyFormatNumeric(
        this.utils.roundTo(sumaMes2)
      )
      foot[`Venta${this.fields[2]}`] = sumaMes2
      const datosSort = datos.sort((a, b) => a.Dia - b.Dia)
      datosSort.push(foot)
      return datosSort
    },
  },
  mounted() {
    // eslint-disable-next-line no-console
    // console.log(this.data)
  },
  methods: {
    rowClass(item, type) {
      if (!item || type !== 'row') return
      if (item.status === 'end') return 'table-primary'
    },
    changeSucursal(sucursal) {
      this.sucursalSelected = sucursal
    },
    getTotal(item) {
      if (!item[`Venta${this.fields[1]}`]) item[`Venta${this.fields[1]}`] = 0
      if (!item[`Venta${this.fields[2]}`]) item[`Venta${this.fields[2]}`] = 0
      return this.utils.aplyFormatNumeric(
        this.utils.roundTo(
          item[`Venta${this.fields[1]}`] + item[`Venta${this.fields[2]}`]
        )
      )
    },
  },
}
</script>

<style scoped>
.sucursal {
  padding: 5px 10px 5px 5px;
  font-size: 19px;
  margin-right: 5px;
  cursor: pointer;
}

.sucursal:hover {
  background: rgb(1, 88, 122);
}
</style>
