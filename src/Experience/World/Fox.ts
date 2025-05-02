import * as THREE from 'three'
import Experience from '../Experience.ts'
import Resources from '../Utils/Resources.ts'
import Debug from '../Utils/Debug.ts'
// Interfaces para los tipos
interface AnimationActions {
  idle: THREE.AnimationAction;
  walking: THREE.AnimationAction;
  running: THREE.AnimationAction;
  current: THREE.AnimationAction;
}

interface AnimationType {
  mixer: THREE.AnimationMixer;
  actions: AnimationActions;
  play: (name: string) => void;
}

// Ajustamos la interfaz para que coincida con la estructura real
interface ResourcesType extends Resources {
  items: {
    foxModel: {
      scene: THREE.Group;
      animations: THREE.AnimationClip[];
    }
  }
}

export default class Fox {
  experience: Experience;
  scene: THREE.Scene;
  resources: ResourcesType;
  time: { delta: number };
  debugFolder!: any; // Usamos ! para indicar que será asignada después
  resource: { scene: THREE.Group; animations: THREE.AnimationClip[] };
  model!: THREE.Group; // Usamos ! para indicar que será asignada en setModel()
  animation!: AnimationType; // Usamos ! para indicar que será asignada en setAnimation()
  debug!: Debug
  
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources as ResourcesType;
    this.time = this.experience.time;
    this.debug = this.experience.debug;

    //debug
    if(this.debug.active) {
      this.debugFolder = this.debug.ui?.addFolder('Fox');
    }
  
    // setup
    this.resource = this.resources.items.foxModel;

    this.setModel();
    this.setAnimation();
  }

  setModel(): void {
    this.model = this.resource.scene;
    this.model.scale.set(0.02, 0.02, 0.02);
    this.scene.add(this.model);

    this.model.traverse((child) => {
      if(child instanceof THREE.Mesh) {
        child.castShadow = true;
      }
    });
  }

  setAnimation(): void {
    this.animation = {} as AnimationType;
    this.animation.mixer = new THREE.AnimationMixer(this.model);
    
    this.animation.actions = {} as AnimationActions;
    this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0]);
    this.animation.actions.walking = this.animation.mixer.clipAction(this.resource.animations[1]);
    this.animation.actions.running = this.animation.mixer.clipAction(this.resource.animations[2]);
    
    this.animation.actions.current = this.animation.actions.idle;
    this.animation.actions.current.play();

    this.animation.play = (name: string) => {
      const newAction = this.animation.actions[name as keyof Omit<AnimationActions, 'current'>];
      const oldAction = this.animation.actions.current;

      newAction.reset();
      newAction.play();
      newAction.crossFadeFrom(oldAction, 1);

      this.animation.actions.current = newAction;
    };

    if(this.debug.active) {
      const debugObject = {
        playIdle: () => { this.animation.play('idle')},
        playWalking: () => { this.animation.play('walking')},
        playRunning: () => { this.animation.play('running')},
      };
      this.debugFolder.add(debugObject, 'playIdle');
      this.debugFolder.add(debugObject, 'playWalking');
      this.debugFolder.add(debugObject, 'playRunning');
    }
  }

  update(): void {
    this.animation.mixer.update(this.time.delta * 0.001);
  }
}