import EventEmitter from "./EventEmitter.ts"

export default class Time extends EventEmitter {
  start: number
  current: number
  elapsed: number
  delta: number

  constructor() {
    super()

    //Setup
    this.start = Date.now()
    this.current = this.start
    this.elapsed = 0
    this.delta = 9 // Es nueve porque en algunas pc el fps da 9 o 16 en mi caso da 9 en promedio

    window.requestAnimationFrame(() => {
      this.tick()
    })
  }

  tick(): void {
    const currentTime = Date.now()
    this.delta = currentTime - this.current
    this.current = currentTime
    this.elapsed = this.current - this.start

    this.trigger("tick")

    window.requestAnimationFrame(() => {
      this.tick()
    })
  }
}
