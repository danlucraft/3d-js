
var PIXEL_WIDTH  = 160
var PIXEL_HEIGHT = 120

var WIN_WIDTH  = window.innerWidth
var WIN_HEIGHT = window.innerHeight

var ratio_width  = WIN_WIDTH / PIXEL_WIDTH
var ratio_height = WIN_HEIGHT / PIXEL_HEIGHT
var pixel_size = Math.floor(Math.min(ratio_width, ratio_height))

var canvas = document.getElementById("canvas")
canvas.width = PIXEL_WIDTH * pixel_size
canvas.height = PIXEL_HEIGHT * pixel_size

var ctx = canvas.getContext("2d")

function setPixel(ctx, x, y) {
  if (x > 0 && x < PIXEL_WIDTH && y > 0 && y < PIXEL_HEIGHT)
    ctx.fillRect(x*pixel_size, y*pixel_size, pixel_size, pixel_size)
}

console.log("screen info", [PIXEL_WIDTH, PIXEL_HEIGHT], [WIN_WIDTH, WIN_HEIGHT], [ratio_width, ratio_height], pixel_size, PIXEL_WIDTH*pixel_size, PIXEL_HEIGHT*pixel_size)

var screen_dist = 100

function drawPoint3d(ctx, p) {
  var x = Math.round(p.x * (screen_dist / p.z))
  var y = Math.round(p.y * (screen_dist / p.z))
  setPixel(ctx, x + PIXEL_WIDTH/2, y + PIXEL_HEIGHT/2)
}

var cube = [
  { x: 50,  y: 50,  z: 250},
  { x: 50,  y: 50,  z: 150},
  { x: 50,  y: -50, z: 250},
  { x: -50, y: 50,  z: 250},
  { x: 50,  y: -50, z: 150},
  { x: -50, y: 50,  z: 150},
  { x: -50, y: -50, z: 250}, 
  { x: -50, y: -50, z: 150}
]

var edges = [
  [0, 1],
  [0, 2],
  [0, 3],
  [1, 4],
  [1, 5],
  [2, 4],
  [2, 6],
  [3, 5],
  [3, 6],
  [4, 7],
  [5, 7],
  [6, 7],
]

var keyState = {
  up: false,
  down: false,
  left: false,
  right: false,
}

document.addEventListener('keydown', function(e) {
  if (e.keyIdentifier == "Up")    keyState.up = true
  if (e.keyIdentifier == "Down")  keyState.down = true
  if (e.keyIdentifier == "Left")  keyState.left = true
  if (e.keyIdentifier == "Right")  keyState.right = true
})

document.addEventListener('keyup', function(e) {
  if (e.keyIdentifier == "Up")    keyState.up = false
  if (e.keyIdentifier == "Down")  keyState.down = false
  if (e.keyIdentifier == "Left")  keyState.left = false
  if (e.keyIdentifier == "Right") keyState.right = false
})

var touches = ["right", "up", "down", "left"]

for (var i = 0; i < touches.length; i++) {
  var touch = touches[i]
  var controlCanvas = document.getElementById(touch)
 
  ;(function() {
    var touchInner = touch
    controlCanvas.addEventListener("touchstart", function(e) {
      e.preventDefault()
      keyState[touchInner] = true
    }, false)
  
    controlCanvas.addEventListener("touchend", function(e) {
      keyState[touchInner] = false
    }, false)
  })()

  var controlCtx = controlCanvas.getContext("2d")
  controlCtx.fillStyle = "blue"
  controlCtx.fillRect(0, 0, 200, 200)
}

var transform = {x: 0, y: 0, z: 0}

function drawLine(ctx, x1, y1, x2, y2) {
  // ensure line from left to right
  if (x2 < x1) {
    var xt = x1
    var yt = y1
    x1 = x2
    y1 = y2
    x2 = xt
    y2 = yt
  }

  var x = x1
  var y = y1
  var s = (x2 - x1) / (y2 - y1)
  if ((s > 0 && s <= 1) || (s == 0 && y2 > y1)) {
    while (y <= y2) {
      setPixel(ctx, Math.round(x), y)
      y++
      x += s
    }
  } else if ((s < 0 && s >= -1) || (s == 0 && y2 < y1)) {
    while (y >= y2) {
      setPixel(ctx, Math.round(x), y)
      y--
      x -= s
    }
  } else if (s < -1) {
    while (x <= x2) {
      setPixel(ctx, x, Math.round(y))
      x++
      y += 1/s
    }
  } else if (s > 1) {
    while (x <= x2) {
      setPixel(ctx, x, Math.round(y))
      x++
      y += 1/s
    }
  }
}

function drawLine3d(ctx, p1, p2) {
  var x1 = Math.round(p1.x * (screen_dist / p1.z))
  var y1 = Math.round(p1.y * (screen_dist / p1.z))
  var x2 = Math.round(p2.x * (screen_dist / p2.z))
  var y2 = Math.round(p2.y * (screen_dist / p2.z))
  drawLine(ctx, x1 + PIXEL_WIDTH/2, y1 + PIXEL_HEIGHT/2, x2 + PIXEL_WIDTH/2, y2 + PIXEL_HEIGHT/2)
}

function drawFrame() {
  // clear frame
  ctx.fillStyle = "black"
  ctx.fillRect(0, 0, PIXEL_WIDTH*pixel_size, PIXEL_HEIGHT*pixel_size)

  ctx.fillStyle = "yellow"
  drawLine(ctx, 10, 60, 10, 100)
  drawLine(ctx, 10, 60, 20, 100)
  drawLine(ctx, 10, 60, 30, 100)
  drawLine(ctx, 10, 60, 40, 100)
  drawLine(ctx, 10, 60, 50, 100)

  ctx.fillStyle = "red"
  drawLine(ctx, 10, 60, 10, 20)
  drawLine(ctx, 10, 60, 20, 20)
  drawLine(ctx, 10, 60, 30, 20)
  drawLine(ctx, 10, 60, 40, 20)
  drawLine(ctx, 10, 60, 50, 20)

  ctx.fillStyle = "green"
  drawLine(ctx, 10, 60, 50, 30)
  drawLine(ctx, 10, 60, 50, 40)
  drawLine(ctx, 10, 60, 50, 50)
  drawLine(ctx, 10, 60, 50, 60)

  ctx.fillStyle = "purple"
  drawLine(ctx, 10, 60, 50, 70)
  drawLine(ctx, 10, 60, 50, 80)
  drawLine(ctx, 10, 60, 50, 90)

  ctx.fillStyle = "blue"
  
  // draw edges
  for (var j = 0; j < edges.length; j++) {
    var p1 = cube[edges[j][0]]
    var p2 = cube[edges[j][1]]
    var newP1 = {x: p1.x + transform.x, y: p1.y + transform.y, z: p1.z + transform.z}
    var newP2 = {x: p2.x + transform.x, y: p2.y + transform.y, z: p2.z + transform.z}
    if (isPointInView(newP1) && isPointInView(newP2))
      drawLine3d(ctx, newP1, newP2)
  }

  // update cube location
  if (keyState.up) transform.z += 3
  if (keyState.down) transform.z -= 3
  if (keyState.left) transform.x -= 3
  if (keyState.right) transform.x += 3

  window.requestAnimationFrame(drawFrame)
}

window.requestAnimationFrame(drawFrame)

function cross(u, v) {
  return [
    u[1]*v[2] - u[2]*v[1], 
    u[2]*v[0] - u[0]*v[2],
    u[0]*v[1] - u[1]*v[0],
  ]
}

// u and v are vectors with x,y,z components
function dot(u, v) {
  return u[0]*v[0] + u[1]*v[1] + u[2]*v[2]
}

// clockwise from bottom right
var screen_coords = [
  [ PIXEL_WIDTH/2 - 5,  PIXEL_HEIGHT/2 - 5, screen_dist], // bottom rt
  [-PIXEL_WIDTH/2 + 5,  PIXEL_HEIGHT/2 - 5, screen_dist], // bottom left
  [-PIXEL_WIDTH/2 + 5, -PIXEL_HEIGHT/2 + 5, screen_dist], // top left
  [ PIXEL_WIDTH/2 - 5, -PIXEL_HEIGHT/2 + 5, screen_dist], // top right
]

// cross product of two points in each place
var view_plane_normals = [
  cross(screen_coords[0], screen_coords[1]), // bottom
  cross(screen_coords[1], screen_coords[2]), // left
  cross(screen_coords[2], screen_coords[3]), // top
  cross(screen_coords[3], screen_coords[0]), // right
]

function isPointInView(p) {
  for (var i = 0; i < view_plane_normals.length; i++)
    if (dot([p.x, p.y, p.z], view_plane_normals[i]) < 0)
      return false
  return true
}
