<script>
import { Line } from 'vue-chartjs'
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities'
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips'
import { random } from '@/shared/utils'
var moment = require('moment');

let elements = 7
const labels = []      
let options = []
const brandSuccess = getStyle('--success') || '#4dbd74'
const brandInfo = getStyle('--info') || '#20a8d8'
const brandDanger = getStyle('--danger') || '#f86c6b'

export default {
  name: 'main-chart',
  extends: Line,
  props: ['height'],
  methods: {
    updateChart: function () {

      
      let rainfallData = []
      let temperatureData = []

      console.log("function")
      const history = this.$store.state.history;
      const startdate = moment().subtract(elements+1, "days")

      console.log(startdate)

      const result = history.filter(item => 
        moment(item.date).isAfter(startdate)
      ) 

      console.log(result)

      for (let i = 0; i < result.length; i++) {
        rainfallData[i] = result[i].rainfall
        temperatureData[i] = result[i].temp
        //temperatureData.push(history[i].rainfall)
        //labels[i] = moment().subtract(i, "days").format("ddd")
        labels[i] = moment(result[i].date).format("ddd")
      }

      console.log("data: " + temperatureData)

      this.renderChart({
        labels,
        datasets: [
          {
            label: 'Rainfall',
            backgroundColor: hexToRgba(brandInfo, 10),
            borderColor: brandInfo,
            pointHoverBackgroundColor: '#fff',
            borderWidth: 2,
            data: rainfallData
          }
        ]
      }, options)
    }
  }, 

  mounted () {
    this.$store.dispatch('getHistory')

    this.$store.subscribe((mutation, state) => {
      
      console.log(`subscribe ${mutation.type}`);

      switch(mutation.type) {
        case 'SET_HISTORY':
          this.updateChart()
          break
      }
    })

    if (this.$store.state.history) {
          this.updateChart()
    }

    // for (let i = 0; i <= elements-1; i++) {
    //   // temperatureData.push(random(50, 200))
    //   //temperatureData.push(0)
    //   labels.push(moment().subtract(i, "days").format("ddd"))
    // }

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
            maxTicksLimit: 5
            // stepSize: Math.ceil(250 / 5),
            // max: 250
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
          //data: temperatureData
        }
      ]
    }, options)
  }
}
</script>
