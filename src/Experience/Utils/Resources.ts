import * as THREE from "three"
import EventEmitter from './EventEmitter.ts'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// Interfaz para las fuentes de recursos
export interface Source {
  name: string;
  type: string; // Cambiamos a string para aceptar cualquier tipo
  path: string | string[]; // path puede ser un string o un array de strings para cubeTexture
}

// Interfaz para los loaders
interface Loaders {
  gltfLoader: GLTFLoader;
  textureLoader: THREE.TextureLoader;
  cubeTextureLoader: THREE.CubeTextureLoader;
}

// Interfaz para los items (recursos cargados)
export interface Items {
  [key: string]: THREE.Texture | THREE.CubeTexture | any; // Usamos any para el modelo GLTF por ahora
}

export default class Resources extends EventEmitter {
  sources: Array<Source>;
  items: Items;
  toLoad: number;
  loaded: number;
  loaders!: Loaders;

  constructor(sources: Array<Source>) {
    super();

    //Options
    this.sources = sources;

    // Setup
    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;

    this.setLoaders();
    this.startLoading();
  }

  setLoaders(): void {
    this.loaders = {} as Loaders;
    this.loaders.gltfLoader = new GLTFLoader();
    this.loaders.textureLoader = new THREE.TextureLoader();
    this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
  }

  startLoading(): void {
    for(const source of this.sources) {
      if(source.type === 'gltfModel') {
        this.loaders.gltfLoader.load(
          source.path as string,
          (file: any) => {
            this.sourceLoaded(source, file);
          }
        );
      } else if(source.type === 'texture') {
        this.loaders.textureLoader.load(
          source.path as string,
          (file: THREE.Texture) => {
            this.sourceLoaded(source, file);
          }
        );
      } else if(source.type === 'cubeTexture') {
        this.loaders.cubeTextureLoader.load(
          source.path as string[],
          (file: THREE.CubeTexture) => {
            this.sourceLoaded(source, file);
          }
        );
      }
    }
  }

  sourceLoaded(source: Source, file: any): void {
    this.items[source.name] = file;
    this.loaded++;

    if(this.loaded === this.toLoad) {
      this.trigger('ready');
    }
  }
}