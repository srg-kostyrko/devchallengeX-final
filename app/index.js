import ko from 'knockout'

import Track from './track'
import effectsList from './effects'

import audioLoader from './bindings/audioLoader'
import soundVisualization from './bindings/soundVisualization'
import volumeVisualization from './bindings/volumeVisualization'
import waveSurfer from './bindings/waveSurfer'

require('bootstrap-webpack')

ko.bindingHandlers.audioLoader = audioLoader
ko.bindingHandlers.soundVisualization = soundVisualization
ko.bindingHandlers.volumeVisualization = volumeVisualization
ko.bindingHandlers.waveSurfer = waveSurfer

class DJController {
  constructor () {
    this.effectsList = effectsList

    this.volume = ko.observable(100)

    this.context = new AudioContext()
    const gainNode = this.context.createGain()
    const destination = this.context.destination
    gainNode.connect(destination)
    this.volume.subscribe((newVal) => {
      gainNode.gain.value = newVal / 100
    })
    this.destination = gainNode

    this.trackLeft = ko.observable(new Track(this, []))
    this.trackRight = ko.observable(new Track(this, []))
  }

  play () {
    this.trackLeft().play()
    this.trackRight().play()
  }
  pause () {
    this.trackLeft().pause()
    this.trackRight().pause()
  }
  stop () {
    this.trackLeft().stop()
    this.trackRight().stop()
  }
}

window.root = new DJController()
ko.applyBindings(window.root, document.getElementById('app'))

