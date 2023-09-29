import './style.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const canvas = document.querySelector('#webgl')
const scene = new THREE.Scene()

scene.fog = new THREE.Fog(0XADDEFF, 7, 25);



const sizes = {
  width: innerWidth,
  height: innerHeight,
}

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
)

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(window.devicePixelRatio)

const light = new THREE.DirectionalLight( 0xffffff, 20, 50 ,1.0)
light.position.set(0, 10, 0)
scene.add(light)

const lightHelper = new THREE.DirectionalLightHelper(light)
scene.add(lightHelper)

const group = new THREE.Group()
scene.add(group)

const controls = new OrbitControls(camera, renderer.domElement)
controls.autoRotate = true
controls.autoRotateSpeed = 6.0
controls.enableDamping = true
controls.dampingFactor = 0.01
controls.enablePan = false

let frame = 0
const animation = () => {
  window.requestAnimationFrame(animation)
  frame = frame <= 350 ? frame + 1 : frame + 1
  controls.update()
  for(let i = 0; i < sakura_num; i++) {
    group.children[i].rotation.y += Math.random() * 0.005
    group.children[i].rotation.x += Math.random() * 0.005
    // group.children[i].position.y = Math.sin(frame * Math.PI / 300 - i / sakura_num * Math.PI * 2 + Math.PI * 3 / 4) * 3
    // group.children[i].position.y = Math.sin(frame * Math.PI / 300 - i / sakura_num * Math.PI * 2 + Math.PI * 3 / 4) * 3
    
    group.children[i].position.y = Math.exp(Math.sin(frame * Math.PI / 300 - i / sakura_num * Math.PI * 2 + Math.PI * 3 / 4)) * 2 - 3

    // group.children[i].position.y = 3/2 * Math.cos(Math.exp(Math.sin(frame * Math.PI / 300 - i / sakura_num * Math.PI * 2 + Math.PI * 3 / 4 + 7/2 ))) * 2 - 3
    

    // group.children[i].position.y = 3 * Math.sin(frame * 0.02 * Math.PI / 4 + - i / sakura_num * Math.PI * 2 + Math.PI * 3 / 4) * 0.5 + 5 * Math.cos(frame * 0.01 * Math.PI / 8 - i / sakura_num * Math.PI * 2 + Math.PI * 3 / 4) * 0.5
  }
  if(frame < 350) {
    const rotSpeed = -easeOutCirc(frame / 500) * Math.PI * 4
    camera.position.z = Math.cos(rotSpeed) * 15 
    camera.position.x = Math.sin(rotSpeed) * 15 
    camera.lookAt(0, 0, 0)
  }
  renderer.render(scene, camera)
}

const loader = new GLTFLoader()
const model = await loader.loadAsync('/public/Strawberry.gltf')
const sakura = model.scene
const sakura_num = 10
for(let i = 0; i < sakura_num + 1; i++) {
  if (i < sakura_num){
    group.add(sakura.clone())
    group.children[i].scale.set(0.3, 0.3, 0.3)
    group.children[i].position.set(
      Math.cos(i / sakura_num * Math.PI * 2) * 5, 
      0,
      Math.sin(i / sakura_num * Math.PI * 2) * 5
    )
    group.children[i].rotation.set(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    )
  }else {
    animation()
  }
}

const spmaterial = new THREE.SpriteMaterial({
  map: new THREE.TextureLoader().load( 'vite.svg')
})

const sprite = new THREE.Sprite(spmaterial)
scene.add(sprite)

function easeOutCirc(x) {
  return Math.sqrt(1 - Math.pow(x - 1, 2))
}

window.addEventListener('resize', function() { 
  const width = window.innerWidth
  const height = window.innerHeight
  renderer.setPixelRatio
  renderer.setSize(width, height)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
})
