const speedModifier = 0.001

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100000 )
camera.position.z = 200

const light1 = new THREE.PointLight( 0xffffff, 4, 10000 )
light1.position.set( 0, 0, 0 )/*

const light2 = new THREE.PointLight( 0xffffff, 1, 10000 )
light2.position.set( 0, -100, 0 )

const light3 = new THREE.PointLight( 0xffffff, 1, 10000 )
light3.position.set( 100, 0, 0 )

const light4 = new THREE.PointLight( 0xffffff, 1, 10000 )
light4.position.set( -100, 0, 0 )

const light5 = new THREE.PointLight( 0xffffff, 1, 10000 )
light5.position.set( 0, 0, 100 )

const light6 = new THREE.PointLight( 0xffffff, 1, 10000 )
light6.position.set( 0, 0, -100 )*/

scene.add( light1 )/*
scene.add( light2 )
scene.add( light3 )
scene.add( light4 )
scene.add( light5 )
scene.add( light6 )*/

const controls = new THREE.OrbitControls( camera )

const renderer = new THREE.WebGLRenderer()
renderer.setSize( window.innerWidth - 1, window.innerHeight - 10 )
document.body.appendChild( renderer.domElement )


const dir1 = new THREE.Vector3( 1, 0, 0 )
const dir2 = new THREE.Vector3( 0, 1, 0 )
const dir3 = new THREE.Vector3( 0, 0, 1 )

//normalize the direction vector (convert to vector of length 1)
dir1.normalize()
dir2.normalize()
dir3.normalize()

const origin1 = new THREE.Vector3( 0, 0, 0 )
const origin2 = new THREE.Vector3( 0, 0, 0 )
const origin3 = new THREE.Vector3( 0, 0, 0 )

const length = 550

const arrowHelper1 = new THREE.ArrowHelper( dir1, origin1, length, 0xff0000 )
const arrowHelper2 = new THREE.ArrowHelper( dir2, origin2, length, 0x00ff00 )
const arrowHelper3 = new THREE.ArrowHelper( dir3, origin3, length, 0x0000ff )

scene.add( arrowHelper1 )
scene.add( arrowHelper2 )
scene.add( arrowHelper3 )



const earthSize = 1
const earthSpeedAngle = 1
const earthSpeed = 1 // 8.4
const earthDistance = 20 // 11760

const planetsConfig = {
  sun: {
    size: 20, // 109,
    speedAngle: 1,
    speed: 0,
    distance: 0,
    angle: 0,
    texture: new THREE.TextureLoader().load( 'img/textures/sun.jpg' )
  },
  mercury: {
    size: 0.382,
    speedAngle: 1,
    speed: 1.608,
    distance: 0.31,
    angle: 0.1,
    texture: new THREE.TextureLoader().load( 'img/textures/mercury.jpg' )
  },
  venus: {
    size: 0.929,
    speedAngle: 1,
    speed: 1.176,
    distance: 0.73,
    angle: 177,
    texture: new THREE.TextureLoader().load( 'img/textures/venus.jpg' )
  },
  earth: {
    size: earthSize,
    speedAngle: earthSpeedAngle,
    speed: earthSpeed,
    distance: earthDistance,
    angle: 23,
    texture: new THREE.TextureLoader().load( 'img/textures/earth.jpg' )
  },
  mars: {
    size: 0.532,
    speedAngle: 1,
    speed: 0.810,
    distance: 1.405,
    angle: 25,
    texture: new THREE.TextureLoader().load( 'img/textures/mars.jpg' )
  },
  jupiter: {
    size: 11.209,
    speedAngle: 1,
    speed: 0.438,
    distance: 5.037,
    angle: 3,
    texture: new THREE.TextureLoader().load( 'img/textures/jupiter.jpg' )
  },
  saturn: {
    size: 9.449,
    speedAngle: 1,
    speed: 0.323,
    distance: 9.164,
    angle: 27,
    texture: new THREE.TextureLoader().load( 'img/textures/saturn.jpg' )
  },
  uranus: {
    size: 4.007,
    speedAngle: 1,
    speed: 0.229,
    distance: 18.6,
    angle: 98,
    texture: new THREE.TextureLoader().load( 'img/textures/uranus.jpg' )
  },
  neptune: {
    size: 3.883,
    speedAngle: 1,
    speed: 0.182,
    distance: 30.31,
    angle: 30,
    texture: new THREE.TextureLoader().load( 'img/textures/neptune.jpg' )
  },
  pluto: {
    size: 0.180,
    speedAngle: 1,
    speed: 0.159,
    distance: 31.1,  //30.09,
    angle: 120,
    texture: new THREE.TextureLoader().load( 'img/textures/pluto.jpg' )
  },
}

const planetsList = []

class Planet {
  constructor (
    o = {
      size: 1,
      speedAngle: 0.01,
      speed: 1,
      distance: 1,
      angle: 1,
      color: 0x00ff00,
      name: 'xyz',
    }
  ) {
    this.size = o.size
    this.speedAngle = o.speedAngle
    this.speed = o.speed * speedModifier
    this.distance = o.distance
    this.angle = o.angle
    this.color = o.color
    this.texture = o.texture
    this.name = o.name

    const geometry = new THREE.SphereGeometry( this.size, 32, 32 )
    let material = new THREE.MeshPhysicalMaterial( { map: this.texture } )

    if (o.name === 'sun') {
      material = new THREE.MeshLambertMaterial( { emissiveMap: this.texture, emissive: 0xffffff, emissiveIntensity: 1.3 } )
    }

    this.sphere = new THREE.Mesh( geometry, material )
    this.currentDistance = 360 * Math.random()

    this.sphere.position.set(
      0,
      0,
      0,
    );

    this.sphere.rotation.x -= Math.PI / 180 * this.angle
  }
}

Object.keys(planetsConfig).forEach(planetName => {
  const planet = planetsConfig[planetName]
  planet.name = planetName

  if (planetName !== 'sun') {
    let addDistance = planetName !== 'earth' ? earthDistance * planet.distance : earthDistance
    const addSpeed = planetName !== 'earth' ? earthSpeed * planet.speed : earthSpeed

    addDistance += 109

    planet.distance = addDistance
    planet.speed = addSpeed
  }

  const newPlanet = new Planet(planet)

  planetsList.push(newPlanet)
  scene.add(newPlanet.sphere)
})

const animate = function () {
  requestAnimationFrame( animate )

  planetsList.forEach(planet => {
    if (planet.name === 'venus') {
      planet.sphere.rotation.y -= planet.speedAngle * 0.01
    } else {
      planet.sphere.rotation.y += planet.speedAngle * 0.01
    }

    if (planet.name === 'sun') {
      return
    }

    planet.currentDistance += planet.speed

    planet.sphere.position.set(
      Math.cos(planet.currentDistance) * planet.distance,
      0,
      -Math.sin(planet.currentDistance) * planet.distance,
    )
  })

  controls.update()
  renderer.render( scene, camera )
};

// setInterval(animate, 1000)
animate()