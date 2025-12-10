import PropTypes from 'prop-types'
import { ResponsiveBar } from '@nivo/bar'
import Card from './Card'
import EmptyState from './EmptyState'

function GraficoEquiposPorTipo({ data = [] }) {
  return (
    <Card title="Equipos por tipo">
      {data.length === 0 ? (
        <EmptyState title="Sin datos" message="No hay equipos registrados para mostrar." />
      ) : (
        <div style={{ height: 360 }}>
          <ResponsiveBar
            data={data}
            keys={['total']}
            indexBy="tipo"
            margin={{ top: 10, right: 20, bottom: 60, left: 60 }}
            padding={0.35}
            colors={{ scheme: 'nivo' }}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickRotation: -35,
              tickSize: 6,
              tickPadding: 8,
            }}
            axisLeft={{
              tickSize: 6,
              tickPadding: 8,
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: 'color', modifiers: [['darker', 1.2]] }}
            role="application"
            ariaLabel="Gráfico de barras de equipos por tipo"
          />
        </div>
      )}
    </Card>
  )
}

GraficoEquiposPorTipo.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      tipo: PropTypes.string.isRequired,
      total: PropTypes.number.isRequired,
    }),
  ),
}

export default GraficoEquiposPorTipo
