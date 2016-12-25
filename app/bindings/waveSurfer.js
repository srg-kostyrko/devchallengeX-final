import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin from 'wavesurfer.js/plugin/wavesurfer.regions'

export default {
  init: function (element, valueAncessor, allBindings) {
    const wavesurfer = WaveSurfer.create({
      container: element,
      audioContext: allBindings().context,
      destination: allBindings().destination,
      waveColor: 'violet',
      progressColor: 'purple'
    })
    valueAncessor()(wavesurfer)
  }
}
