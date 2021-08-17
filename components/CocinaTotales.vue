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
          Venta: 1344.2,
          PrimeraVenta: '1900-01-01T08:31:36',
          UltimaVenta: '1900-01-01T17:54:57',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 2,
          Venta: 1594.6,
          PrimeraVenta: '1900-01-01T08:31:30',
          UltimaVenta: '1900-01-01T17:39:40',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 3,
          Venta: 869.8,
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
          Venta: 1307.3,
          PrimeraVenta: '1900-01-01T07:54:56',
          UltimaVenta: '1900-01-01T17:14:48',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 6,
          Venta: 1051.45,
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
          Venta: 1530.18,
          PrimeraVenta: '1900-01-01T08:21:26',
          UltimaVenta: '1900-01-01T20:27:29',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 9,
          Venta: 1407.15,
          PrimeraVenta: '1900-01-01T08:01:16',
          UltimaVenta: '1900-01-01T16:34:12',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 10,
          Venta: 952.7,
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
          Venta: 833.1,
          PrimeraVenta: '1900-01-01T08:27:55',
          UltimaVenta: '1900-01-01T18:52:27',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 13,
          Venta: 1127.15,
          PrimeraVenta: '1900-01-01T08:38:19',
          UltimaVenta: '1900-01-01T15:02:13',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 14,
          Venta: 771.63,
          PrimeraVenta: '1900-01-01T08:29:59',
          UltimaVenta: '1900-01-01T18:07:06',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 15,
          Venta: 1163.62,
          PrimeraVenta: '1900-01-01T08:49:42',
          UltimaVenta: '1900-01-01T18:29:55',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 16,
          Venta: 722.2,
          PrimeraVenta: '1900-01-01T08:43:11',
          UltimaVenta: '1900-01-01T19:04:18',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 17,
          Venta: 863.52,
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
          Venta: 1302.43,
          PrimeraVenta: '1900-01-01T08:34:57',
          UltimaVenta: '1900-01-01T16:49:25',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 20,
          Venta: 1101.1,
          PrimeraVenta: '1900-01-01T08:23:04',
          UltimaVenta: '1900-01-01T17:30:28',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 21,
          Venta: 951.0,
          PrimeraVenta: '1900-01-01T08:21:28',
          UltimaVenta: '1900-01-01T16:54:56',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 22,
          Venta: 1457.7,
          PrimeraVenta: '1900-01-01T08:00:01',
          UltimaVenta: '1900-01-01T19:02:15',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 23,
          Venta: 879.95,
          PrimeraVenta: '1900-01-01T08:16:03',
          UltimaVenta: '1900-01-01T17:52:17',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 24,
          Venta: 980.3,
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
          Venta: 1278.28,
          PrimeraVenta: '1900-01-01T07:47:08',
          UltimaVenta: '1900-01-01T15:48:44',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 27,
          Venta: 1170.55,
          PrimeraVenta: '1900-01-01T08:43:24',
          UltimaVenta: '1900-01-01T19:16:19',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 28,
          Venta: 918.05,
          PrimeraVenta: '1900-01-01T08:05:02',
          UltimaVenta: '1900-01-01T17:01:02',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 29,
          Venta: 789.3,
          PrimeraVenta: '1900-01-01T08:31:07',
          UltimaVenta: '1900-01-01T18:55:38',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 30,
          Venta: 972.5,
          PrimeraVenta: '1900-01-01T09:02:53',
          UltimaVenta: '1900-01-01T16:33:45',
        },
        {
          Suc: 'ZR',
          Mes: 7,
          MesMovimientoLetra: 'Julio',
          Dia: 31,
          Venta: 1016.45,
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
          Venta: 834.06,
          PrimeraVenta: '1900-01-01T08:03:00',
          UltimaVenta: '1900-01-01T19:21:58',
        },
        {
          Suc: 'ZR',
          Mes: 8,
          MesMovimientoLetra: 'Agosto',
          Dia: 3,
          Venta: 926.36,
          PrimeraVenta: '1900-01-01T09:07:14',
          UltimaVenta: '1900-01-01T19:14:49',
        },
        {
          Suc: 'ZR',
          Mes: 8,
          MesMovimientoLetra: 'Agosto',
          Dia: 4,
          Venta: 1226.1,
          PrimeraVenta: '1900-01-01T08:14:33',
          UltimaVenta: '1900-01-01T20:03:04',
        },
        {
          Suc: 'ZR',
          Mes: 8,
          MesMovimientoLetra: 'Agosto',
          Dia: 5,
          Venta: 1645.26,
          PrimeraVenta: '1900-01-01T08:44:26',
          UltimaVenta: '1900-01-01T16:21:00',
        },
        {
          Suc: 'ZR',
          Mes: 8,
          MesMovimientoLetra: 'Agosto',
          Dia: 6,
          Venta: 805.84,
          PrimeraVenta: '1900-01-01T07:42:15',
          UltimaVenta: '1900-01-01T17:30:36',
        },
        {
          Suc: 'ZR',
          Mes: 8,
          MesMovimientoLetra: 'Agosto',
          Dia: 7,
          Venta: 1007.15,
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
          Venta: 925.4,
          PrimeraVenta: '1900-01-01T08:16:36',
          UltimaVenta: '1900-01-01T15:43:54',
        },
        {
          Suc: 'ZR',
          Mes: 8,
          MesMovimientoLetra: 'Agosto',
          Dia: 10,
          Venta: 797.26,
          PrimeraVenta: '1900-01-01T09:02:20',
          UltimaVenta: '1900-01-01T18:49:58',
        },
        {
          Suc: 'ZR',
          Mes: 8,
          MesMovimientoLetra: 'Agosto',
          Dia: 11,
          Venta: 1247.5,
          PrimeraVenta: '1900-01-01T08:16:43',
          UltimaVenta: '1900-01-01T15:17:10',
        },
        {
          Suc: 'ZR',
          Mes: 8,
          MesMovimientoLetra: 'Agosto',
          Dia: 12,
          Venta: 783.35,
          PrimeraVenta: '1900-01-01T09:03:16',
          UltimaVenta: '1900-01-01T17:14:45',
        },
        {
          Suc: 'ZR',
          Mes: 8,
          MesMovimientoLetra: 'Agosto',
          Dia: 13,
          Venta: 703.05,
          PrimeraVenta: '1900-01-01T08:45:16',
          UltimaVenta: '1900-01-01T14:52:42',
        },
        {
          Suc: 'ZR',
          Mes: 8,
          MesMovimientoLetra: 'Agosto',
          Dia: 14,
          Venta: 693.21,
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
          Venta: 491.0,
          PrimeraVenta: '1900-01-01T07:51:23',
          UltimaVenta: '1900-01-01T10:57:06',
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
          Venta: 100.0,
          PrimeraVenta: '1900-01-01T08:44:20',
          UltimaVenta: '1900-01-01T10:44:15',
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
      const datos = this.data.reduce((acumItems, item) => {
        if (item.Suc === sucursal) {
          const mesFinded = acumItems.findIndex(
            (acumItem) => acumItem.Dia === item.Dia
          )
          if (mesFinded === -1) {
            item[`${item.MesMovimientoLetra}`] = this.utils.aplyFormatNumeric(
              this.utils.roundTo(item.Venta)
            )
            item[`Venta${item.MesMovimientoLetra}`] = item.Venta
            acumItems.push(item)
          } else {
            acumItems[mesFinded][
              `${item.MesMovimientoLetra}`
            ] = this.utils.aplyFormatNumeric(this.utils.roundTo(item.Venta))
            acumItems[mesFinded][`Venta${item.MesMovimientoLetra}`] = item.Venta
          }
        } else if (sucursal === 'ALL') {
          const diaFinded = acumItems.findIndex(
            (acumItem) => acumItem.Dia === item.Dia
          )
          // eslint-disable-next-line no-console
          console.log(
            'ADD ' + item.Suc,
            item.MesMovimientoLetra,
            item.Dia,
            item.Venta,
            diaFinded
          )
          if (diaFinded === -1) {
            item[`${item.MesMovimientoLetra}`] = this.utils.aplyFormatNumeric(
              this.utils.roundTo(item.Venta)
            )
            item[`Venta${item.MesMovimientoLetra}`] = item.Venta
            acumItems.push(item)
          } else {
            const mesFinded = acumItems.findIndex(
              (acumItem) => acumItem.Mes === item.Mes
            )
            // eslint-disable-next-line no-console
            console.log(item.MesMovimientoLetra, mesFinded, diaFinded)
            if (mesFinded === -1) {
              acumItems[diaFinded][
                `${item.MesMovimientoLetra}`
              ] = this.utils.aplyFormatNumeric(this.utils.roundTo(item.Venta))
              acumItems[diaFinded][`Venta${item.MesMovimientoLetra}`] =
                item.Venta
              // eslint-disable-next-line no-console
              console.log(
                'ADD ' + item.Suc,
                item.MesMovimientoLetra,
                item.Dia,
                acumItems[diaFinded][`${item.MesMovimientoLetra}`]
              )
            } else {
              // eslint-disable-next-line no-console
              console.log(
                acumItems[diaFinded][`Venta${item.MesMovimientoLetra}`]
              )
              acumItems[diaFinded][`Venta${item.MesMovimientoLetra}`] +=
                item.Venta
              // eslint-disable-next-line no-console
              console.log(
                acumItems[diaFinded][`Venta${item.MesMovimientoLetra}`],
                item.Venta
              )
              acumItems[diaFinded][
                `${item.MesMovimientoLetra}`
              ] = this.utils.aplyFormatNumeric(
                this.utils.roundTo(
                  acumItems[diaFinded][`Venta${item.MesMovimientoLetra}`]
                )
              )
              // acumItems[diaFinded][`Venta${item.MesMovimientoLetra}`] = suma
              delete acumItems[diaFinded].PrimeraVenta
              delete acumItems[diaFinded].UltimaVenta
              // eslint-disable-next-line no-console
              console.log(
                'SUM ' + item.Suc,
                item.MesMovimientoLetra,
                item.Dia,
                acumItems[diaFinded][`Venta${item.MesMovimientoLetra}`],
                item.Venta,
                acumItems[diaFinded][`${item.MesMovimientoLetra}`],
                acumItems[diaFinded][`Venta${item.MesMovimientoLetra}`] +
                  item.Venta
              )
            }
          }
        }
        return acumItems
      }, [])
      return datos.sort((a, b) => a.Dia - b.Dia)
    },
  },
  methods: {
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
