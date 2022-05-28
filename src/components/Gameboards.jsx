import { useGameContext } from '../contexts/UserContext'
import { useEffect } from 'react'
import Chat from './Chat'
// import img_hit from '../assets/images/hit.png'
// import img_miss from '../assets/images/miss.png'
import Results from './Results'

const Gameboards = () => {
	const { userName, opponentName, yachts, shootTarget, move, setMove, setShootTarget, set_results_Message, socket } = useGameContext()

	const update = (e) => {
		e.preventDefault()
		if (move && !e.target.classList.contains('blocked')) {

			let result = e.target.id.split("_")
			console.log('target', Number(String(result[1])[0]), Number(String(result[1])[1]))
			setShootTarget({ row: Number(String(result[1])[0]), col: Number(String(result[1])[1]) })
		}
	}

	useEffect(() => {
		const handleHit = (user_id, point, killed_yacht) => {
			console.log('hit', point)
			if (socket.id === user_id) {
				setMove(false)

				let cell = document.getElementById('enemyfield_' + point.row + point.col)
				cell.classList.add('board_hit', 'blocked')

				if (killed_yacht) {
					for (let point of killed_yacht.points) {
						let cell = document.getElementById('enemyfield_' + point.row + point.col)
						cell.classList.add('board_killed', 'blocked')
					}
					set_results_Message('Great! You killed one of the ships! Wait and try again!')
				} else {
					set_results_Message('Good job! You shot one of the ships! Try more on the next turn! Wait and try again!')
				}
			} else {
				setMove(true)

				let cell = document.getElementById('myfield_' + point.row + point.col)
				cell.classList.add('board_my_yacht_hit')
				if (killed_yacht) {
					for (let point of killed_yacht.points) {
						let cell = document.getElementById('myfield_' + point.row + point.col)
						cell.classList.add('board_my_yacht_killed')
					}
					set_results_Message('Tragedy! One of your ships was killed! Your turn now!')
				} else {
					set_results_Message('Oh no! One of your ships was shot! Your turn now!')
				}
			}
		}
		socket.on('shot:hit', handleHit)
	}, [socket, setMove, set_results_Message])

	useEffect(() => {
		const handleMiss = (user_id, point) => {
			console.log('miss', point)
			if (socket.id === user_id) {
				setMove(false)

				let cell = document.getElementById('enemyfield_' + point.row + point.col)
				cell.classList.add('board_miss', 'blocked')
				set_results_Message('You missed! Wait and try again!')
			} else {
				setMove(true)
				let cell = document.getElementById('myfield_' + point.row + point.col)
				cell.classList.add('board_my_yacht_miss')
				set_results_Message('Your opponent missed! Your turn now!')
			}
		}
		socket.on('shot:miss', handleMiss)
	}, [socket, setMove, set_results_Message])

	useEffect(() => {
		const handleWinner = (user_id, point, killed_yacht) => {
			if (socket.id === user_id) {

				let cell = document.getElementById('enemyfield_' + point.row + point.col)
				cell.classList.add('board_hit', 'blocked')
				cell.style.cursor = "not-allowed"
				set_results_Message('You won!!! Congratulations!!!')
			} else {

				let cell = document.getElementById('myfield_' + point.row + point.col)
				cell.classList.add('board_my_yacht_hit')
				set_results_Message('Looooooseeeeeer!!!')
			}
		}
		socket.on('shot:winner', handleWinner)
	}, [socket, set_results_Message])

	useEffect(() => {
		socket.emit('game:shoot', shootTarget)
	}, [shootTarget, socket])

	useEffect(() => {
		if (yachts.length !== 0) {
			for (let yacht of yachts) {
				for (let point of yacht.points) {
					let cell = document.getElementById('myfield_' + point.row + point.col)
					cell.classList.add('board_yacht')
				}

			}
		}

	}, [yachts])

	return (
		<>
			<Results />
			<div className='container d-flex justify-content-around'>

				<div className="board-container text-center">
					<h1>{userName}</h1>
					<div className="board player-grid m-auto" >

						{yachts &&
							[...Array(100).keys()].map((div) =>
								<div key={div} className="board_cell" id={div < 10 ? 'myfield_0' + div : 'myfield_' + div}></div>
							)
						}


					</div>
				</div>
				<div className="board-container text-center">
					<h1>{opponentName}</h1>

					<div className="board enemy-grid m-auto" style={{ cursor: move === true ? "pointer" : "not-allowed" }} >

						{
							[...Array(100).keys()].map((div) =>
								<div key={div} className="board_cell" id={div < 10 ? 'enemyfield_0' + div : 'enemyfield_' + div} onClick={update}></div>
							)
						}

					</div>
				</div>
			</div>

			<Chat />

		</>
	)
}

export default Gameboards
