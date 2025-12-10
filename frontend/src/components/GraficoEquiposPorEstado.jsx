import PropTypes from 'prop-types'
import { ResponsivePie } from '@nivo/pie'
import Card from './Card'
import EmptyState from './EmptyState'

function GraficoEquiposPorEstado({ data = [] }) {
  const formatted = data.map((item) => ({ id: item.estado, label: item.estado, value: item.total }))

  return (
    <Card title="Equipos por estado">
      {formatted.length === 0 ? (
        <EmptyState title="Sin datos" message="Aún no hay estados registrados." />
      ) : (
        <div style={{ height: 360 }}>
          <ResponsivePie
            data={formatted}
            margin={{ top: 10, right: 10, bottom: 40, left: 10 }}
            innerRadius={0.55}
            padAngle={1.4}
            activeOuterRadiusOffset={6}
            colors={{ scheme: 'set2' }}
            borderWidth={1}
            borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#334155"
            arcLinkLabelsThickness={2}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
            legends={[
              {
                anchor: 'bottom',
                direction: 'row',
                justify: false,
                translateY: 30,
                itemWidth: 120,
                itemHeight: 18,
                itemsSpacing: 6,
                symbolSize: 12,
                itemTextColor: '#475569',
              },
            ]}
            role="application"
            ariaLabel="Gráfico de torta de equipos por estado"
          />
        </div>
      )}
    </Card>
  )
}

GraficoEquiposPorEstado.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      estado: PropTypes.string.isRequired,
      total: PropTypes.number.isRequired,
    }),
  ),
}

export default GraficoEquiposPorEstado
