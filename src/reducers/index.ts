import { ActionTypes, GAME_SETTINGS_REQUEST, GAME_SETTINGS_SUCCESS, WINNERS_REQUEST, WINNERS_SUCCESS, CHANGE_NAME, START_GAME, CHANGE_MODE, STOP_GAME, SELECT_SETTINGS,  } from "../actions";
import { WinnersResponse, GameSettingsResponse, GameSettings } from "../services/test-starnavi-api-service";

export type FieldMode = 'free' | 'active' | 'human' | 'comp'

const initialState = {
  name: '',
  winners: {
    values: [] as WinnersResponse,
    isLoading: false
  },
  gameSettings: {
    values: {} as GameSettingsResponse,
    active: {} as ActiveGameSettingsState,
    isLoading: false
  },
  game: {
    fields: [] as FieldMode[],
    gamesPlayed: 0,
    winner: '',
    isGoing: false
  }
};

export type State = typeof initialState
export type WinnersState = typeof initialState.winners
export type GameSettingsState = typeof initialState.gameSettings
export type GameState = typeof initialState.game
export interface ActiveGameSettingsState extends GameSettings {
  name: string
}

const reducer = (state = initialState, action: ActionTypes) => {
  console.log(action)
  switch (action.type) {
    case START_GAME: {
      return {...state, game: {
        ...state.game,
        fields: Array.from(new Array(state.gameSettings.active.field ** 2),() => 'free' as FieldMode),
        isGoing: true,
        winner: ''
      }}
    }

    case CHANGE_MODE: {
      if (state.game.fields[action.payload.idx] !== 'active' && action.payload.mode !== 'active') {
        return state
      }

      const newArr = [ ...state.game.fields ]
      newArr[action.payload.idx] = action.payload.mode

      return {...state, game: {
        ...state.game,
        fields: newArr
      }}
    }

    case STOP_GAME: {
      return {...state, game: {
        ...state.game,
        gamesPlayed: state.game.gamesPlayed + 1,
        isGoing: false,
        winner: action.payload
      }}
    }

    case SELECT_SETTINGS: {
      return {...state, gameSettings: {
        ...state.gameSettings,
        active: {...state.gameSettings.values[action.payload], name: action.payload}
      },
      game: {
        ...state.game, 
        fields: [],
        isGoing: false
      }}
    }
    
    case GAME_SETTINGS_REQUEST: {
      return {...state, gameSettings: {
          ...state.gameSettings,
          isLoading: true
        }
      }
    }

    case GAME_SETTINGS_SUCCESS: {
      return {...state, gameSettings: {
          ...state.gameSettings,
          values: action.payload,
          isLoading: false
        }
      }
    }

    case WINNERS_REQUEST: {
      return {...state, winners: {
        ...state.winners,
        isLoading: true
      }}
    }

    case WINNERS_SUCCESS: {
      return {...state, winners: {
        ...state.winners,
        values: action.payload.reverse().slice(0, 30),
        isLoading: false
      }}
    }

    case CHANGE_NAME: {
      return {...state, name: action.payload}
    }
    
    default:
      return state
  }
};

export default reducer