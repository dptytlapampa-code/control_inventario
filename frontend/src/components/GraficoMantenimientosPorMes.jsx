import PropTypes from 'prop-types'
import { ResponsiveLine } from '@nivo/line'
import Card from './Card'
import EmptyState from './EmptyState'

function GraficoMantenimientosPorMes({ data = [] }) {
  const series = [
    {
      id: 'Mantenimientos',
      data: data.map((item) => ({ x: item.mes, y: item.total })),
    },
  ]

  return (
    <Card title="Mantenimientos por mes">
      {data.length === 0 ? (
        <EmptyState title="Sin información" message="Aún no hay registros mensuales para mostrar." />
      ) : (
        <div style={{ height: 360 }}>
          <ResponsiveLine
            data={series}
            margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 0, stacked: false }}
            colors={{ scheme: 'category10' }}
            axisBottom={{
              tickRotation: -35,
              tickSize: 6,
              tickPadding: 10,
              legend: 'Mes',
              legendOffset: 36,
              legendPosition: 'middle',
            }}
            axisLeft={{
              tickSize: 6,
              tickPadding: 10,
              legend: 'Cantidad',
              legendOffset: -46,
              legendPosition: 'middle',
            }}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            useMesh
            enableArea
            areaOpacity={0.1}
            role="application"
            ariaLabel="Gráfico de línea de mantenimientos por mes"
          />
        </div>
      )}
    </Card>
  )
}

GraficoMantenimientosPorMes.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      mes: PropTypes.string.isRequired,
      total: PropTypes.number.isRequired,
    }),
  ),
}

export default GraficoMantenimientosPorMes
