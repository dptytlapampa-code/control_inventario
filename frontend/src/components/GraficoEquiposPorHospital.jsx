import PropTypes from 'prop-types'
import { ResponsiveBar } from '@nivo/bar'
import Card from './Card'
import EmptyState from './EmptyState'

function GraficoEquiposPorHospital({ data = [] }) {
  return (
    <Card title="Equipos por hospital">
      {data.length === 0 ? (
        <EmptyState title="Sin datos" message="Registra hospitales y equipos para ver esta distribución." />
      ) : (
        <div style={{ height: 360 }}>
          <ResponsiveBar
            data={data}
            keys={['total']}
            indexBy="hospital"
            margin={{ top: 10, right: 30, bottom: 50, left: 120 }}
            padding={0.3}
            layout="horizontal"
            colors={{ scheme: 'pastel1' }}
            axisTop={null}
            axisRight={null}
            axisBottom={{ tickSize: 6, tickPadding: 8 }}
            axisLeft={{ tickSize: 6, tickPadding: 8 }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: 'color', modifiers: [['darker', 1.4]] }}
            role="application"
            ariaLabel="Gráfico de barras horizontales de equipos por hospital"
          />
        </div>
      )}
    </Card>
  )
}

GraficoEquiposPorHospital.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      hospital: PropTypes.string.isRequired,
      total: PropTypes.number.isRequired,
    }),
  ),
}

export default GraficoEquiposPorHospital
