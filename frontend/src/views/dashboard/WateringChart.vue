<script>
import { Line } from 'vue-chartjs'
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities'
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips'
import { random } from '@/shared/utils'
var moment = require('moment');

let elements = 28
const labels = []      
let options = []
const brandWarning = getStyle('--warning') || '#4dbd74'
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
      let evapotranspirationData = []
      let evapotranspirationShortData = []

      //console.log("function")
      const history = this.$store.state.history;
      const startdate = moment().subtract(elements, "days")

      //console.log(startdate)

      const result = history.filter(item => 
        moment(item.date).isAfter(startdate)
      ) 

      //console.log(result)
      let i=0;
      for (i = 0; i < result.length; i++) {
        rainfallData[i] = result[i].rainfall
        temperatureData[i] = result[i].temp
        evapotranspirationData[i] = result[i].evapotranspiration
        evapotranspirationShortData[i] = result[i].evapotranspiration_short
        labels[i] = moment(result[i].date).format("ddd")
      }

      // Add today to the graph from the hourly data
      if (this.$store.state.hourly) {
        let rainfallToday = 0
        let temperatureToday = 0
        let evapotranspirationToday = 0
        let evapotranspirationShortToday = 0
        this.$store.state.hourly.forEach((h) => {
          rainfallToday += h.rain
          temperatureToday += h.temp
          // evapotranspirationToday += h.evapotranspiration
          // evapotranspirationShortToday += h.evapotranspiration_short
        });
        rainfallToday /= 24;
        temperatureToday /= 24;
        evapotranspirationToday /= 24;
        evapotranspirationShortToday /= 24;

        rainfallData[i] = rainfallToday
        temperatureData[i] = temperatureToday
        // evapotranspirationData[i] = evapotranspirationToday
        // evapotranspirationShortData[i] = evapotranspirationShortToday
        labels[i] = moment().format("ddd")
      }
      //console.log("data: " + temperatureData)
      
      this.renderChart({
        labels,
        datasets: [
          {
            label: 'Temperature',
            backgroundColor: '#fff0',
            borderColor: brandWarning,
            pointHoverBackgroundColor: '#fff',
            borderWidth: 2,
            data: temperatureData
          },
          {
            label: 'Rainfall',
            backgroundColor: hexToRgba(brandInfo, 10),
            borderColor: brandInfo,
            pointHoverBackgroundColor: '#fff',
            borderWidth: 2,
            data: rainfallData
          }
          // {
          //   label: 'Evapotranspiration (L)',
          //   backgroundColor: hexToRgba(brandDanger, 10),
          //   borderColor: brandDanger,
          //   pointHoverBackgroundColor: '#fff',
          //   borderWidth: 2,
          //   data: evapotranspirationData
          // },
          // {
          //   label: 'Evapotranspiration (S)',
          //   backgroundColor: hexToRgba(brandDanger, 10),
          //   borderColor: brandDanger,
          //   pointHoverBackgroundColor: '#fff',
          //   borderWidth: 2,
          //   data: evapotranspirationShortData,
          //   borderDash: [10,5]
          // }
        ]
      }, options)
    }
  }, 

  mounted () {
    this.$store.dispatch('getHistory')
    this.$store.dispatch('getHourly')
    this.$store.subscribe((mutation, state) => {
      
      //console.log(`subscribe ${mutation.type}`);

      switch(mutation.type) {
        case 'SET_HISTORY':
          this.updateChart()
          break
        case 'SET_HOURLY':
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
          },
          label: function(tooltipItems, data) { 
            var units = ""
            if (tooltipItems.datasetIndex == 0) units = " &#8451;"
            else units = " mm"
            return data.datasets[tooltipItems.datasetIndex].label +': ' + tooltipItems.yLabel + units;
          }
        }
      },
      maintainAspectRatio: false,
      legend: {
        display: true,
        position: 'bottom'
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

    // this.renderChart({
    //   labels,
    //   datasets: [
    //     {
    //       label: 'Temperature',
    //       backgroundColor: hexToRgba(brandInfo, 10),
    //       borderColor: brandInfo,
    //       pointHoverBackgroundColor: '#fff',
    //       borderWidth: 2,
    //       //data: temperatureData
    //     }
    //   ]
    // }, options)
  }
}
</script>
