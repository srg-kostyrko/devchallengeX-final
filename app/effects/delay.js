import Pizzicato from 'pizzicato'
import ko from 'knockout'

export default class Delay {
  constructor (track) {
    this.templateName = 'effect-delay'
    this.track = track

    this.feedback = ko.observable(0.5)
    this.time = ko.observable(0.3)
    this.mix = ko.observable(0.5)

    this.config = ko.computed(() => {
      return {
        feedback: this.feedback(),
        time: this.time(),
        mix: this.mix()
      }
    })
    this.effect = new Pizzicato.Effects.Reverb(this.config())

    track.sound.addEffect(this.effect)

    this.feedback.subscribe(newVal => {
      this.effect.feedback = newVal
    })
    this.time.subscribe(newVal => {
      this.effect.time = newVal
    })
    this.mix.subscribe(newVal => {
      this.effect.mix = newVal
    })
  }

  remove () {
    this.track.sound.removeEffect(this.effect)
  }
}
