document.onkeydown = detectKey
let lTetro = [[1, 0, 0],
			  [1, 0, 0],
			  [1, 1, 0]]

let jTetro = [[0, 0, 1],
			  [0, 0, 1],
			  [0, 1, 1]]

let zTetro = [[0, 0, 0],
			  [1, 1, 0],
			  [0, 1, 1]]

let sTetro = [[0, 0, 0],
			  [0, 1, 1],
			  [1, 1, 0]]

let oTetro = [[1, 1],
			  [1, 1]]

let tTetro = [[0, 0, 0],
			  [1, 1, 1],
			  [0, 1, 0]]

let iTetro = [[0, 1, 0, 0],
			  [0, 1, 0, 0],
			  [0, 1, 0, 0],
			  [0, 1, 0, 0]]
let colors = ['blue', 'peach', 'green', 'pink', 'purple', 'yellow', 'navy']
let sclx = 5
let scly = 5
let rects = []
let allnextRects = []
let tetrominoes = [lTetro, jTetro, zTetro, sTetro, oTetro, tTetro, iTetro]
let main = document.querySelector('main')
let next_tet = document.querySelector('.next_tet')
let random
let nextRandom
let ry = 0
let rx = 6
let tet
let counter = 0
let allRects
let pos = []
let xlimit
let ylimit
let isOn = false
let isOver = false
let isStarted = false
let speed = 0
let interval
let pause = document.querySelector('.pause')
let burger = document.querySelector('.burger')
let howto = document.querySelector('.how_to')
let my_score = document.querySelector('.my_score')
let level = document.querySelector('.level')
let msg = document.querySelector('.msg')
let leftbtn = document.querySelector('.left')
let rightbtn = document.querySelector('.right')
let upbtn = document.querySelector('.up')
let downbtn = document.querySelector('.down')
let dropbtn = document.querySelector('.drop')
let ngbtn = document.querySelector('.ngbtn')

upbtn.addEventListener('click', rotateTetro)
leftbtn.addEventListener('click', moveTetroToLeft)
rightbtn.addEventListener('click', moveTetroToRight)
downbtn.addEventListener('click', moveTetroDown)
dropbtn.addEventListener('click', dropTetro)
ngbtn.addEventListener('click', startGame)

burger.addEventListener('click', () => {
	burger.classList.toggle('move')
	howto.classList.toggle('hide')
})

if (window.innerWidth <= 768) {
	main.addEventListener('click', pauseResume)
	document.querySelector('.enter').textContent = "Game board"
	document.querySelector('.drp').textContent = "Drop"
}

//Push the game area borders positions to pos 
function getAreaBorders () {
	xlimit = 0
	ylimit = 0
	for (let i = 0; i < 15; i++) {
		pos.push({'x':xlimit, 'y':100})
		xlimit += 5
	}
	for (let i = 0; i < 20; i++) {
		pos.push({'x':-5, 'y':ylimit})
		pos.push({'x':75, 'y':ylimit})
		ylimit += 5
	}
}

function detectKey(e) {
	if (e.keyCode == '38' && isOn) rotateTetro()
	else if (e.keyCode == '39' && isOn) moveTetroToRight()
	else if (e.keyCode == '37' && isOn) moveTetroToLeft()
	else if (e.keyCode == '40' && isOn) moveTetroDown()
	else if (e.keyCode == '32' && isOn) dropTetro()
	else if (e.keyCode == '13') pauseResume()
}

function genTetro() {
	if (random == undefined)
		random = Math.floor(Math.random() * tetrominoes.length)
	else {
		random = nextRandom
		genNextTetro()
	}
	tet = tetrominoes[random]
	rects = []
	for (let i = 0; i < 4; i++) {
		var rect = main.appendChild(document.createElement('div'))
		rect.classList.add('rects')
		rect.style.backgroundImage = `url('imgs/${colors[random]}.png')`
		rects.push(rect)
	}
	allRects = document.querySelectorAll('.rects')
}

function genNextTetro() {
	let ll = []
	nextRandom = Math.floor(Math.random() * tetrominoes.length)
	let teto = tetrominoes[nextRandom]
	allnextRects = document.querySelectorAll('.nrects')
	if (allnextRects.length == 4)
		for (let i = 0; i < 4; i++)
			allnextRects[i].remove()
	for (let i = 0; i < 4; i++) {
		var nrect = next_tet.appendChild(document.createElement('div'))
		nrect.classList.add('nrects')
		nrect.style.backgroundImage = `url('imgs/${colors[nextRandom]}.png')`
		ll.push(nrect)
	}
	let k = 0
	for (let i = 0; i < teto.length; i++) {
		for (let j = 0; j < teto.length; j++) {
			if (teto[i][j]) {
				ll[k].style.left = `${(j+0.75)*ll[k].offsetWidth}px`
				ll[k].style.top = `${(i+3)*ll[k].offsetHeight}px`
				k++
			}
		}
	}
}

function formatTetro() {
	let k = 0
	for (let i = 0; i < tet.length; i++) {
		for (let j = 0; j < tet.length; j++) {
			if (tet[i][j]) {
				rects[k].style.left = `${(j+rx) * sclx}%`
				rects[k].style.top = `${(i+ry) * scly}%`
				k++
			}
		}
	}
}

function moveTetro() {
	if (checkArround(0, 5)) {
		ry++
	} else {
		for (let i = 0; i < 4; i++)
			pos.push({'x':parseInt(rects[i].style.left), 'y':parseInt(rects[i].style.top)})
		while(!checkLines())
			checkLines()
		rx = 6
		ry = 0
		genTetro()
	}
	formatTetro()
	if(!checkArround(0, 0)) {
		isOver = true
		isOn = false
		isStarted = false
		for (let i = 0; i < 4; i++)
			rects[i].remove()
		clearInterval(interval)
		allRects.forEach(elmnt => elmnt.style.backgroundImage = `url('imgs/gray.png')`)
		document.querySelectorAll('.nrects').forEach(elmnt => elmnt.style.backgroundImage = `url('imgs/gray.png')`)
		ngbtn.classList.remove('hide_ngbtn')
		ngbtn.addEventListener('click', startGame)
	}
	msg.textContent = 100 + speed * 100
}

function checkArround(lr, d) {
	for(let i = 0; i < pos.length; i++) {
		let j = 0
		while(j < 4) {
			if (parseInt(rects[j].style.left)+lr == pos[i].x && parseInt(rects[j].style.top)+d == pos[i].y)
				return false
			else
				j++
		}
	}
	return true
}

function rotateTetro() {
	let rotated = []
	for (let i in tet)
		rotated.push([])
	for (let i in tet) {
		for (let j in tet)
			rotated[i][j] = tet[tet.length - 1 - j][i]
	}
	tet = rotated
	formatTetro()
	if(!checkArround(0, 0)) {
		rotated = []
		for (let i in tet)
			rotated.push([])
		for (let i in tet) {
			for (let j in tet)
				rotated[i][j] = tet[j][tet.length - 1 - i]
		}
		tet = rotated
	}
	formatTetro()
}

function checkLines () {
	for (let j = 0; j < 95; j ++) {
		let lines = []
		for (let i = 0; i < allRects.length; i++) {
			if (parseInt(allRects[i].style.top) == 95-(j*5))
				lines.push(allRects[i])
		}
		if (lines.length == 15) {
			counter++
			my_score.textContent = counter
			level.textContent = Math.floor(counter / 6) + 1
			if (counter > 0 && counter % 6 == 0) {
				speed++
				clearInterval(interval)
				interval = setInterval(moveTetro, 500 - speed * 30)
			}
			pos = []
			getAreaBorders()
			for (let k = 0; k < 15; k++)
				lines[k].remove()
			allRects = document.querySelectorAll('.rects')
			for (let s = 0; s < allRects.length; s++) {
				if (parseInt(allRects[s].style.top) < 95-(j*5)) {
					allRects[s].style.top = `${parseInt(allRects[s].style.top)+5}%`
				}
			}
			for (let h = 0; h < allRects.length; h++)
				pos.push({'x':parseInt(allRects[h].style.left), 'y':parseInt(allRects[h].style.top)})
			return false
		}
	}
	return true
}

function moveTetroToRight() {
	if(checkArround(5, 0)) {
		rx++
		formatTetro()
	}
}

function moveTetroToLeft() {
	if(checkArround(-5, 0)) {
		rx--
		formatTetro()
	}
}

function moveTetroDown() {
	if(checkArround(0, 5)) {
		ry++
		formatTetro()
	}
}

function dropTetro() {
	while(checkArround(0, 5)) {
		ry++
		formatTetro()
	}
}

function startGame() {
	if(!isOver) {
		ngbtn.removeEventListener('click', startGame)
		ngbtn.classList.add('hide_ngbtn')
		isStarted = true
		pauseResume()
	} else {
		counter = 0
		my_score.textContent = counter
		level.textContent = Math.floor(counter / 6) + 1
		ngbtn.classList.remove('hide_ngbtn')
		ngbtn.addEventListener('click', startGame)
		allRects.forEach(rect => rect.remove())
		pos = []
		getAreaBorders()
		genNextTetro()
		genTetro()
		formatTetro()
		isOver = false
		speed = 0
		startGame()
	}
}

function pauseResume() {
    if (isStarted) {
        if (!isOn) {
            interval = setInterval(moveTetro, 500 - speed * 30)
            isOn = true
            pause.classList.remove('play')
        } else {
            clearInterval(interval)
            isOn = false
            pause.classList.add('play')
        }
    }
}

genNextTetro()
genTetro()
formatTetro()
getAreaBorders()