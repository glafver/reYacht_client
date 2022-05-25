import { Form } from 'react-bootstrap'
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameContext } from '../contexts/UserContext'

const UserRegistration = () => {

    const { userName, setUserName, setYachts, setWaiting, socket } = useGameContext()
    const [nameInput, setNameInput] = useState('')
    const nameInputRef = useRef()

    const navigate = useNavigate()

    const handleSubmit = async e => {
        e.preventDefault()
        if (!nameInput.length) {
            return
        }

        socket.emit('user:joined', nameInput, (result) => {
            setYachts(result.yachts)
            setWaiting(result.waiting)
        })
        setUserName(nameInput)
        setNameInput('')
        navigate('/game')
    }

    return (
        <div>
            {!userName && <div className="form-container">
                <h1 className='mb-4'>{!userName && 'Please sign your name:'}</h1>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3 form-username" >
                        <Form.Control id="input-username"
                            onChange={e => setNameInput(e.target.value)}
                            placeholder="Enter name here"
                            ref={nameInputRef}
                            required
                            type="text"
                            value={nameInput} />
                        <button className="button btn-gold" type="submit">Start the game</button>
                    </Form.Group>
                </Form>
            </div>}
        </div>
    )
}

export default UserRegistration