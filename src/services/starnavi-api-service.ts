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

export interface Winner {
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
  baseUrl = 'https://starnavi-frontend-test-task.herokuapp.com/'

  fetchData = async (URI: string) => {
    const res = await fetch(`${this.baseUrl}${URI}`)
    
    if (!res.ok) {
      throw new Error(`Could not fetch ${URI}` +
        `, received ${res.status}`)
    }
    return await res.json();
  }

  postData = async (URI: string, data = {}) => {
    const response = await fetch(`${this.baseUrl}${URI}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return await response.json(); 
  }

  getGameSettings = async () => {
    return await this.fetchData('game-settings')
  }

  getWinners = async () => {
    return await this.fetchData('winners')
  }

  setWinner = async (query: WinnerQuery) => {
    return await this.postData('winners', query)
  }

}