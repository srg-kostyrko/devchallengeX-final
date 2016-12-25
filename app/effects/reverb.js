import Pizzicato from 'pizzicato'
import ko from 'knockout'

export default class Reverb {
  constructor (track) {
    this.templateName = 'effect-reverb'
    this.track = track

    this.time = ko.observable(0.01)
    this.decay = ko.observable(0.01)
    this.reverse = ko.observable(false)
    this.mix = ko.observable(0.5)

    this.config = ko.computed(() => {
      return {
        time: this.time(),
        decay: this.decay(),
        reverse: this.reverse(),
        mix: this.mix()
      }
    })
    this.effect = new Pizzicato.Effects.Reverb(this.config())

    track.sound.addEffect(this.effect)

    this.time.subscribe(newVal => {
      this.effect.time = newVal
    })
    this.decay.subscribe(newVal => {
      this.effect.decay = newVal
    })
    this.reverse.subscribe(newVal => {
      this.effect.reverse = newVal
    })
    this.mix.subscribe(newVal => {
      this.effect.mix = newVal
    })
  }

  remove () {
    this.track.sound.removeEffect(this.effect)
  }
}
