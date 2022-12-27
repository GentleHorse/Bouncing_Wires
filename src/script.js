import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'

//0.gui
const gui = new dat.GUI({width:300})

//1.canvas, scene, size
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

//1.5.fog
const fog = new THREE.Fog('#262837', 1, 7)
scene.fog = fog


//2.lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001).name('ambientLight')
scene.add(ambientLight)

//-------------------------------------

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3)
directionalLight.position.set(2, 2, - 1)
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001).name('directionalLight - Intensity')
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001).name('directionalLight - X')
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001).name('directionalLight - Y')
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001).name('directionalLight - Z')
scene.add(directionalLight)

directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.bottom = -2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.left = -2
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 6
directionalLight.shadow.radius = 10

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
directionalLightCameraHelper.visible = false
gui.add(directionalLightCameraHelper, 'visible').name('directionalLight - Helper')
scene.add(directionalLightCameraHelper)

//-------------------------------------

const spotLight = new THREE.SpotLight(0xffffff, 0.4, 10, Math.PI * 0.3)
spotLight.position.set(0, 2, 2)
gui.add(spotLight, 'intensity').min(0).max(1).step(0.001).name('spotLight - Intensity')
scene.add(spotLight)
scene.add(spotLight.target)

spotLight.castShadow = true
spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024
spotLight.shadow.camera.fov = 30
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 6

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
spotLightCameraHelper.visible = false
gui.add(spotLightCameraHelper, 'visible').name('spotLight - Helper')
scene.add(spotLightCameraHelper)


//-------------------------------------

const pointLight = new THREE.PointLight(0xffffff, 0.3)
pointLight.position.set(-1, 1, 0)
gui.add(pointLight, 'intensity').min(0).max(1).step(0.001).name('pointLight - Intensity')
scene.add(pointLight)

pointLight.castShadow = true
pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024
pointLight.shadow.camera.near = 0.1
pointLight.shadow.camera.far = 5

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
pointLightCameraHelper.visible = false
gui.add(pointLightCameraHelper, 'visible').name('pointLight - Helper')
scene.add(pointLightCameraHelper)

//3.object
const axesHelper = new THREE.AxesHelper()
axesHelper.visible = false
gui.add(axesHelper, 'visible').name('axes - Helper')

const material = new THREE.MeshStandardMaterial()
material.wireframe = true
material.metalness = 0.7
material.roughness = 0.2
material.color = new THREE.Color(0x5e12ba)
gui.add(material, 'wireframe')
gui.addColor(material, 'color').name('color')
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)



const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.5, 5, 5, 5),
    material
)
cube.position.x = -2
cube.castShadow = true

const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.25, 0.08, 50, 18),
    material
)
torusKnot.castShadow = true

const cone = new THREE.Mesh(
    new THREE.ConeGeometry(0.3, 0.6, 25, 12),
    material
)
cone.position.x = 2
cone.castShadow = true

const floor = new THREE.Mesh(
    new THREE.BoxGeometry(30, 30, 0.1),
    new THREE.MeshStandardMaterial({ color: 0xffffff })
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = - 0.8
floor.receiveShadow = true

scene.add(axesHelper, cube, torusKnot, cone, floor)


//4.camera, controls
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

//5.renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setClearColor('#262837')

//6.animation
const clock = new THREE.Clock()
const tick = () =>{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    cube.rotation.x = 0.3 * elapsedTime
    cube.rotation.y = 0.4 * elapsedTime
    torusKnot.rotation.x = 0.3 * elapsedTime
    torusKnot.rotation.y = 0.4 * elapsedTime
    cone.rotation.x = 0.3 * elapsedTime
    cone.rotation.y = 0.4 * elapsedTime

    cube.position.x = Math.sin(elapsedTime * 0.35) * (2 + Math.sin(elapsedTime * 0.32))
    cube.position.z = Math.cos(elapsedTime * 0.35) * (2 + Math.sin(elapsedTime * 0.32))
    torusKnot.position.x = Math.sin(elapsedTime * 0.2) * (1 + Math.sin(elapsedTime * 0.32))
    torusKnot.position.z = Math.cos(elapsedTime * 0.2) * (1 + Math.sin(elapsedTime * 0.32))
    cone.position.x = Math.sin(elapsedTime * 0.4) * (1.5 + Math.sin(elapsedTime * 0.32))
    cone.position.z = Math.cos(elapsedTime * 0.4) * (1.5 + Math.sin(elapsedTime * 0.32))

    cube.position.y = Math.abs(Math.sin(elapsedTime * 0.8)) * 0.6
    torusKnot.position.y = Math.abs(Math.sin(elapsedTime * 1.2)) * 0.6
    cone.position.y = Math.abs(Math.sin(elapsedTime * 0.6)) * 0.6


    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()