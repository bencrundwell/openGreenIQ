<script>
import { Line } from 'vue-chartjs'
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities'
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips'
import { random } from '@/shared/utils'
var moment = require('moment');

export default {
  extends: Line,
  props: ['height'],
  mounted () {
    const brandSuccess = getStyle('--success') || '#4dbd74'
    const brandInfo = getStyle('--info') || '#20a8d8'
    const brandDanger = getStyle('--danger') || '#f86c6b'

    let elements = 7
    const temperatureData = []
    const labels = []

    let options = []
    
    this.$store.dispatch('getHistory')
      .then( d => {
        for (let i = 0; i <= elements; i++) {
            temperatureData[i] = this.$store.state.history[i]
            //temperatureData.push(0)
            labels[i] = moment().subtract(i, "days").format("ddd")
          }

        this.renderChart({
          labels,
          datasets: [
            {
              label: 'Temperature',
              backgroundColor: hexToRgba(brandInfo, 10),
              borderColor: brandInfo,
              pointHoverBackgroundColor: '#fff',
              borderWidth: 2,
              data: temperatureData
            }
          ]
        }, options)
      })

    for (let i = 0; i <= elements; i++) {
      // temperatureData.push(random(50, 200))
      temperatureData.push(0)
      labels.push(moment().subtract(i, "days").format("ddd"))
    }

    options = {
      tooltips: {
        enabled: false,
        custom: CustomTooltips,
        intersect: true,
        mode: 'index',
        position: 'nearest',
        callbacks: {
          labelColor: function (tooltipItem, chart) {
            return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor }
          }
        }
      },
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          gridLines: {
            drawOnChartArea: false
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
            maxTicksLimit: 5,
            stepSize: Math.ceil(250 / 5),
            max: 250
          },
          gridLines: {
            display: true
          }
        }]
      },
      elements: {
        point: {
          radius: 0,
          hitRadius: 10,
          hoverRadius: 4,
          hoverBorderWidth: 3
        }
      }
    }

    this.renderChart({
      labels,
      datasets: [
        {
          label: 'Temperature',
          backgroundColor: hexToRgba(brandInfo, 10),
          borderColor: brandInfo,
          pointHoverBackgroundColor: '#fff',
          borderWidth: 2,
          data: temperatureData
        }
      ]
    }, options)
  }
}
</script>
