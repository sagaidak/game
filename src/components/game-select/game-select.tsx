import React, { useState } from 'react'
import { GameMode, GameSettings } from '../../services/test-starnavi-api-service'

export type PreparedElement = [
  GameMode,
  GameSettings
]

type GameSelectProps = {
  activeName: string
  preparedSettings: Array<PreparedElement>
  onChange: (gameMode: GameMode) => void
}

const GameSelect = (props: GameSelectProps) => {
  const { activeName, preparedSettings, onChange } = props
  const [ open, setOpen ] = useState(false)

  const handleSelect = (gameMode: GameMode) => {
    onChange(gameMode)
    setOpen(false)
  }

  return <div className={`game_select ${open ? 'open' : ''}`}>
    <div className={'current'} onClick={() => setOpen(!open)}>{activeName ? activeName : 'Pick game mode'}</div>
    <div className={'game_options'}>
      {
        preparedSettings.map((x: PreparedElement) => {
          return <div key={x[0]} onClick={() => handleSelect(x[0])}>{x[1].delay} , {x[0]}</div>
        })
      }
    </div>
    
  </div>
}

export default GameSelect