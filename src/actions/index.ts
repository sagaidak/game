import { Dispatch } from "redux";
import StarNaviApiService, { GameSettingsResponse, WinnersResponse, GameSettings, GameMode } from "../services/starnavi-api-service";
import { FieldMode } from "../reducers";

const starNaviApiService = new StarNaviApiService()

export const GAME_SETTINGS_REQUEST = 'GAME_SETTINGS_REQUEST'
export const GAME_SETTINGS_SUCCESS = 'GAME_SETTINGS_SUCCESS'
export const SELECT_SETTINGS = 'SELECT_SETTINGS'
export const WINNERS_REQUEST = 'WINNERS_REQUEST'
export const WINNERS_SUCCESS = 'WINNERS_SUCCESS'
export const CHANGE_NAME = 'CHANGE_NAME'
export const START_GAME = 'START_GAME'
export const STOP_GAME = 'STOP_GAME'
export const CHANGE_MODE = 'CHANGE_MODE'

interface GameSettingsRequest { 
  type: typeof GAME_SETTINGS_REQUEST 
}

interface GameSettingsLoaded {
  type: typeof GAME_SETTINGS_SUCCESS
  payload: GameSettingsResponse
}

interface WinnersRequest { 
  type: typeof WINNERS_REQUEST 
}

interface WinnersLoaded {
  type: typeof WINNERS_SUCCESS
  payload: WinnersResponse
}

interface ChangeName {
  type: typeof CHANGE_NAME
  payload: string
}

interface StartGame {
  type: typeof START_GAME
}

interface StopGame {
  type: typeof STOP_GAME,
  payload: 'human' | 'comp'
}

interface ChangeMode {
  type: typeof CHANGE_MODE,
  payload: { idx: number, mode: FieldMode }
}

interface SelectSettings {
  type: typeof SELECT_SETTINGS,
  payload: GameMode
}

export type ActionTypes = 
    GameSettingsRequest
  | GameSettingsLoaded
  | SelectSettings
  | WinnersRequest
  | WinnersLoaded
  | ChangeName
  | StartGame
  | StopGame
  | ChangeMode

export const selectSettings = (key: GameMode) => {
  return {
    type: SELECT_SETTINGS,
    payload: key
  }
}

const gameSettingsRequest = (): GameSettingsRequest => {
  return {
    type: GAME_SETTINGS_REQUEST
  }
};

const gameSettingsLoaded = (gameSettings: GameSettingsResponse): GameSettingsLoaded => {
  return {
    type: GAME_SETTINGS_SUCCESS,
    payload: gameSettings
  };
};

export const fetchGameSettings = (dispatch: Dispatch) => () => {
  dispatch(gameSettingsRequest());
  starNaviApiService.getGameSettings()
    .then((data: GameSettingsResponse) => {
      dispatch(gameSettingsLoaded(data))
    })
    .catch((err: any) => console.log(err));
}

const winnersRequest = (): WinnersRequest => {
  return {
    type: WINNERS_REQUEST
  }
};

const winnersLoaded = (winners: WinnersResponse): WinnersLoaded => {
  return {
    type: WINNERS_SUCCESS,
    payload: winners
  };
};

export const fetchWinners = (dispatch: Dispatch) => () => {
  const fetch = () => {
    dispatch(winnersRequest());
    starNaviApiService.getWinners()
      .then((data: WinnersResponse) => {
        dispatch(winnersLoaded(data))
      })
      .catch((err: any) => console.log(err));
  }
  fetch()
  setInterval(() => {
    fetch()
  }, 30*1000)
  
}

export const changeName = (name: string) => {
  return {
    type: CHANGE_NAME,
    payload: name
  }
}

// Game 

export const startGame = () => {
  return {
    type: START_GAME
  }
}

export const stopGame = (winner: 'comp' | 'human') => {
  return {
    type: STOP_GAME,
    payload: winner
  }
}

export const changeMode = (idx: number, mode: FieldMode) => {
  return {
    type: CHANGE_MODE,
    payload: { idx, mode }
  }
}

export const setRandomFieldTimeout = (dispatch: Dispatch, settings: GameSettings, fields: FieldMode[]) => {

  if (fields.filter((x) => x === 'comp').length > fields.length / 2 ) {
    dispatch(stopGame('comp'))
    return
  }

  if (fields.filter((x) => x === 'human').length > fields.length / 2 ) {
    dispatch(stopGame('human'))
    return
  }

  let randomIdx = Math.floor(Math.random() * fields.length)

  while (fields[randomIdx] !== 'free') {
    randomIdx = Math.floor(Math.random() * fields.length)
  }

  dispatch(changeMode(randomIdx, 'active'))

  setTimeout(() => {
    dispatch(changeMode(randomIdx, 'comp'))
  }, settings.delay)
}

export const sendWinner = (dispatch: Dispatch, winner: string) => {
  const d = new Date()
  const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit' }) 
  const [{ value: month },,{ value: day },,{ value: year }] = dateTimeFormat.formatToParts(d) 
  dispatch(winnersRequest());
  starNaviApiService
    .setWinner({winner, date: `${d.getHours()}:${d.getMinutes()}; ${day} ${month} ${year}` })
    .then((data: WinnersResponse) => {
      dispatch(winnersLoaded(data))
    })
    .catch((err: any) => console.log(err));
}