/* 
  https://starnavi-frontend-test-task.herokuapp.com/game-settings

  Response: 
  {
    "easyMode":{"field":5,"delay":2000},
    "normalMode":{"field":10,"delay":1000},
    "hardMode":{"field":15,"delay":900}
  }
*/

export interface GameSettings {
  field: number,
  delay: number
}

export interface GameSettingsResponse {
  easyMode: GameSettings,
  normalMode: GameSettings,
  hardMode: GameSettings
}

export type GameMode = keyof GameSettingsResponse

/* 
  https://starnavi-frontend-test-task.herokuapp.com/winners

  Response:
  [
    {"id":0.45737727636626135,"winner":"User","date":"13:21; 17 May 2020"},
    {"id":0.15529652809719385,"winner":"Computer","date":"13:21; 17 May 2020"}
  ]
*/

interface Winner {
  id: number,
  winner: string,
  date: string
}

export type WinnersResponse = Winner[]

/*
  POST https://starnavi-frontend-test-task.herokuapp.com/winners

  { winner: "", date: ""}
*/

interface WinnerQuery {
  winner: string,
  date: string
}

export default class StarNaviApiService {
  settings = {
    "easyMode":{"field":5,"delay":2000},
    "normalMode":{"field":10,"delay":1000},
    "hardMode":{"field":15,"delay":900}
  } 

  winners = [
    {"id":0.45737727636626135,"winner":"User","date":"13:21; 17 May 2020"},
    {"id":0.15529652809719385,"winner":"Computer","date":"13:21; 17 May 2020"}
  ]

  getGameSettings(): Promise<GameSettingsResponse> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.settings)
      }, 700)
    })
  }

  getWinners(): Promise<WinnersResponse> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.winners)
      }, 700)
    })
  }

  setWinner(query: WinnerQuery) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('ok')
      }, 700)
    })
  }

}