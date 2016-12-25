import * as d3 from 'd3'

function getAverageVolume (array) {
  return array.reduce((acc, val) => acc + val, 0) / array.length
}
function getMaxVolume (array) {
  return array.reduce((acc, val) => acc < val ? val : acc, 0)
}

export default {
  init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
    const frequencyData = new Uint8Array(200)
    const svgWidth = element.clientWidth
    const svgHeight = 50
    const svg = d3.select(element).append('svg').attr('height', svgHeight).attr('width', svgWidth)
    const analyser = valueAccessor()()

    const average = getAverageVolume(frequencyData) || 1


    svg.selectAll('rect')
      .data([average])
      .enter()
      .append('rect')
      .attr('x', function (d, i) {
        return i
      })
      .attr('height', svgHeight)
      .attr('width', svgWidth / average)

    function renderChart () {
      requestAnimationFrame(renderChart)

      // Copy frequency data to frequencyData array.
      analyser.getByteFrequencyData(frequencyData)
      const average = getAverageVolume(frequencyData) || 1
      const max = getMaxVolume(frequencyData) || 1

      // Update d3 chart with new data.
      svg.selectAll('rect')
          .data([average])
          .attr('width', svgWidth * (average / max))
          .attr('fill', function (d) {
            return 'rgb(0, 0, ' + Math.round(256 * (average / max)) + ')'
          })
    }

    renderChart()
  }
}
