import * as d3 from 'd3'

export default {
  init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
    const frequencyData = new Uint8Array(20)
    const svgWidth = element.clientWidth
    const svgHeight = svgWidth * 0.75
    const barPadding = 1
    const svg = d3.select(element).append('svg').attr('height', svgHeight).attr('width', svgWidth)
    const analyser = valueAccessor()()

    svg.selectAll('rect')
      .data(frequencyData)
      .enter()
      .append('rect')
      .attr('x', function (d, i) {
        return i * (svgWidth / frequencyData.length)
      })
      .attr('width', svgWidth / frequencyData.length - barPadding)

    function renderChart () {
      requestAnimationFrame(renderChart)

      // Copy frequency data to frequencyData array.
      analyser.getByteFrequencyData(frequencyData)

      // Update d3 chart with new data.
      svg.selectAll('rect')
          .data(frequencyData)
          .attr('y', function (d) {
            return svgHeight - d
          })
          .attr('height', function (d) {
            return d
          })
          .attr('fill', function (d) {
            return 'rgb(0, 0, ' + d + ')'
          })
    }

    renderChart()
  }
}
