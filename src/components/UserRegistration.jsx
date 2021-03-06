import { Form, Modal } from 'react-bootstrap'
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameContext } from '../contexts/UserContext'
import ChooseYacht from './ChooseYacht'
import standard_seagull from '../assets/images/seagull5.svg'

const UserRegistration = () => {

    const { userName, setUserName, setYachts, setWaiting, setManualChoice, setResultsMessage, setIllustration, socket } = useGameContext()
    const [nameInput, setNameInput] = useState('')
    const [yachtChoice, setYachtChoice] = useState(false)

    const nameInputRef = useRef()

    const navigate = useNavigate()

    const handleSubmit = async e => {
        e.preventDefault()
        if (!nameInput.length) {
            return
        }

        setUserName(nameInput)
        setNameInput('')
        setYachtChoice(true)
        setIllustration(standard_seagull)
        setResultsMessage('Welcome to game!')
    }

    const handleManualChoice = () => {
        setManualChoice(true)
        setYachtChoice(false)
    }

    const handleRandomChoice = () => {
        let yachts_to_server = false
        socket.emit('user:joined', userName, yachts_to_server, (result) => {
            setYachts(result.yachts)
            setWaiting(result.waiting)
        })

        navigate('/game')
    }

    return (
        <div>

            {!userName && <div className="game-container form-container">
                <h1>{!userName && "Please sign your name:"}</h1>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="form-username">
                        <Form.Control
                            id="input-username"
                            onChange={e => setNameInput(e.target.value)}
                            placeholder="Enter name here"
                            ref={nameInputRef}
                            required
                            type="text"
                            value={nameInput} />
                        <button className="button btn-gold" id="start-button" type="submit">Start the game</button>
                    </Form.Group>
                </Form>
            </div>
            }


            <Modal id="modalDialogYachts" show={yachtChoice}>
                <Modal.Body id="modalContentYachts">
                    <h2>Do you want to place yachts yourself or get them randomly?</h2>

                    <div className="btnPlaceYachts">
                        <button className="button btn-gold" onClick={handleManualChoice}>I'll place them myself</button>
                        <button className="button btn-gold" onClick={handleRandomChoice}>Place them randomly for me</button>
                    </div>
                </Modal.Body>
            </Modal>

            <ChooseYacht></ChooseYacht>
        </div >
    )
}

export default UserRegistration