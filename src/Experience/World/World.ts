import Experience from '../Experience.ts'
import Environment from './Environment.ts'
import Resources from '../Utils/Resources.ts'
import Floor from './Floor.ts'
import Fox from './Fox.ts'
import * as THREE from 'three'

export default class World {
  experience!: Experience
  scene!: THREE.Scene
  environment!: Environment
  resources!: Resources
  fox!: Fox
  floor!: Floor

  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources

    //Wait for resources
    this.resources.on('ready', () => {
      //setup
      this.floor = new Floor()
      this.fox = new Fox()
      this.environment = new Environment()
    })
  }

  update() {
    if (this.fox){
      this.fox.update()
    }
  }
}