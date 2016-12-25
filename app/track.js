import ko from 'knockout'

const EQ = [
  {
    f: 32,
    type: 'lowshelf'
  }, {
    f: 64,
    type: 'peaking'
  }, {
    f: 125,
    type: 'peaking'
  }, {
    f: 250,
    type: 'peaking'
  }, {
    f: 500,
    type: 'peaking'
  }, {
    f: 1000,
    type: 'peaking'
  }, {
    f: 2000,
    type: 'peaking'
  }, {
    f: 4000,
    type: 'peaking'
  }, {
    f: 8000,
    type: 'peaking'
  }, {
    f: 16000,
    type: 'highshelf'
  }
]

export default class Track {
  constructor (parent, nodes) {
    this.parent = parent
    this.zoom = ko.observable(1)
    this.waveSurfer = ko.observable()
    this.waveSurfer.subscribe(() => this.setupWaveSurfer())
    this.source = ko.observable()
    this.loaded = ko.observable(false)
    this.volume = ko.observable(100)
    this.volume.subscribe((newVal) => {
      this.waveSurfer().setVolume(newVal / 100)
    })
    this.delayStart = ko.observable(0)
    this.startOffset = ko.observable(0)
    this.duration = ko.observable()
    this.currentTime = ko.observable(0)

    this.path = ko.observable()
    this.input = ko.observable()
    this.trackInputLeft = ko.observable()
    this.input.subscribe((newVal) => {
      if (newVal) {
        this.source(newVal)
        this.initSound(nodes)
      }
    })

    this.filters = ko.observableArray()
    this.regions = ko.observableArray()

    this.effects = ko.observableArray()
    this.analyzer = ko.observable()

    this.selectedEffect = ko.observable()
    this.addEffect = () => {
      if (this.selectedEffect()) {
        const Effect = this.selectedEffect().model
        this.effects.push(new Effect())
        this.waveSurfer().backend.setFilters(this.filters().concat(this.effects))
      }
    }
    this.removeEffect = (effect) => {
      effect.remove()
      this.effects.remove(effect)
    }

    this.zoom.subscribe((value) => {
      if (this.waveSurfer()) {
        this.waveSurfer().zoom(Number(value))
      }
    })

    this.stop = this.stop.bind(this)

    this.tempo = ko.observable(1)
    this.tempo.subscribe((newVal) => {
      if (this.loaded()) {
        this.waveSurfer().backend.source.playbackRate.value = parseFloat(newVal)
      }
    })
  }
  initSound (nodes) {
    this.waveSurfer().load(this.source())
  }

  play () {
    if (this.loaded()) {
      this.waveSurfer().play()
    }
  }
  pause () {
    if (this.loaded()) {
      this.waveSurfer().pause()
    }
  }
  stop () {
    if (this.loaded()) {
      this.waveSurfer().stop()
    }
  }

  rewind () {
    if (this.loaded()) {
      this.waveSurfer().stop()
      this.waveSurfer().play()
    }
  }

  setupWaveSurfer () {
    this.waveSurfer().on('ready', () => {
      this.duration(this.waveSurfer().getDuration().toFixed(2))

      this.waveSurfer().enableDragSelection({})

      const backend = this.waveSurfer().backend
      if (backend.analyser) {
        this.analyzer(backend.analyser)
      }

      const filters = EQ.map((band) => {
        var filter = backend.ac.createBiquadFilter()
        filter.type = band.type
        filter.gain.value = 0
        filter.Q.value = 1
        filter.frequency.value = band.f
        filter.watcher = ko.observable(0)
        filter.watcher.subscribe((newVal) => {
          filter.gain.value = ~~newVal
        })
        return filter
      })
      this.filters(filters)
      backend.setFilters(filters)

      this.loaded(true)
    })
    this.waveSurfer().on('audioprocess', (time) => {
      this.currentTime(time.toFixed(2))
    })
    this.waveSurfer().on('seek', (pos) => {
      this.currentTime((this.waveSurfer().getDuration() * pos).toFixed(2))
    })

    this.waveSurfer().on('region-created', (region) => {
      this.regions.push(region)
    })
    this.waveSurfer().on('region-removed', (region) => {
      this.regions.remove(region)
    })
  }

  playRegion (region) {
    return () => {
      region.play()
    }
  }

  removeRegion (region) {
    return () => {
      region.remove()
    }
  }
}
