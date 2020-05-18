import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { State, FieldMode, WinnersState, GameSettingsState, GameState } from '../../reducers'
import { Dispatch } from 'redux'
import { fetchGameSettings, fetchWinners, changeName, startGame, changeMode, setRandomFieldTimeout, selectSettings, sendWinner } from '../../actions'
import './main.scss'
import { GameSettings, GameMode } from '../../services/test-starnavi-api-service'
import GameSelect, { PreparedElement } from '../game-select/game-select'
import Spinner from '../spinner/spinner'
import { Winner } from '../../services/starnavi-api-service'

type Props = {
  name: string
  winners: WinnersState
  gameSettings: GameSettingsState
  game: GameState
  fetchGameSettings: () => void
  fetchWinners: () => void
  changeName: (v: string) => void
  setRandomFieldTimeout: (settings: GameSettings, fields: FieldMode[]) => void
  changeMode: (idx: number, m: FieldMode) => void
  startGame: () => void
  selectSettings: (k: GameMode) => void
  sendWinner: (winner: string) => void
}

const Main = (props: Props) => {
  const { name, winners, gameSettings, game } = props
  const { fetchGameSettings, fetchWinners, changeName, setRandomFieldTimeout, changeMode, startGame, selectSettings, sendWinner } = props

  useEffect(() => {
    fetchGameSettings()
    fetchWinners()
  }, [])

  useEffect(() => {
    const hasActive = game.fields.findIndex((x: FieldMode) => x === 'active') !== -1

    if (game.isGoing && !hasActive) {
      setRandomFieldTimeout(gameSettings.active, game.fields)
    }
  }, [game.fields])

  const preparedSettings: PreparedElement[] = Object.keys(gameSettings.values).map((key) => { 
    return [key as GameMode, gameSettings.values[key as GameMode]]; 
  })


  useEffect(() => {
    if (game.gamesPlayed > 0) {
      const newName = name || 'No Name'
      const winner = game.winner === 'human' ? newName : 'Computer'
      sendWinner(winner)
    }
  }, [game.gamesPlayed])

  return <div className='game_wrapper'>
    <div className='left_side'>
      <div className='menu'>
        {gameSettings.isLoading && <Spinner />}
        <GameSelect 
          activeName={gameSettings.active.name} 
          preparedSettings={preparedSettings}
          onChange={selectSettings}
        />

        <input value={name} onChange={(e) => changeName(e.currentTarget.value)} placeholder='Enter your name' />

        <button 
          onClick={() => startGame()}
          disabled={game.isGoing || !gameSettings.active.name}
        >{game.gamesPlayed > 0 ? 'Play again' : 'Start Game'}</button>
      </div>
      
      <div className='message'>
        {game.winner === 'human' && `Winner: ${name ? name : 'No Name'}`}
        {game.winner === 'comp' && `Winner: Computer`}
      </div>

      <div className={`game_fields`}>
        {
          game.fields.map((y: FieldMode, i: number) => {
            let breakEl = null
            if (i % gameSettings.active.field === 0) {
              breakEl = <div className="break"></div>
            }
            return <React.Fragment key={i}>
              { breakEl }  
              <div className={`field ${y}`} onClick={() => changeMode(i, 'human')}></div>  
            </React.Fragment>
          })
        }
      </div>
    </div>

    <div className='right_side'>
      <div className='winner_wrapper'>
        <div className='winner_head'>Leader Board</div>
        <div className='winners'>
          {winners.isLoading && <Spinner />}
          {
            winners.values.map((x: Winner) => {
              return <div key={x.id}><span>{x.winner}</span> <span>{x.date}</span></div>
            })
          }
        </div>
      </div>
    </div>
  </div>
}

const mapStateToProps = (state: State) => {
  return {
    name: state.name,
    winners: state.winners,
    gameSettings: state.gameSettings,
    game: state.game
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    fetchGameSettings: fetchGameSettings(dispatch),
    fetchWinners: fetchWinners(dispatch),
    changeName: (value: string) => dispatch(changeName(value)),
    changeMode: (idx: number, mode: FieldMode) => dispatch(changeMode(idx, mode)),
    startGame: () => dispatch(startGame()),
    setRandomFieldTimeout: (settings: GameSettings, fields: FieldMode[]) => setRandomFieldTimeout(dispatch, settings, fields),
    selectSettings: (key: GameMode) => dispatch(selectSettings(key)),
    sendWinner: (winner: string) => sendWinner(dispatch, winner)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)