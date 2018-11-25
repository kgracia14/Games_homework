import { JsonController, Get, Param, Put, Body, NotFoundError, Post, HttpCode, BadRequestError } from 'routing-controllers'
import Game from './entity'

const defaultBoard = [
	['o', 'o', 'o'],
	['o', 'o', 'o'],
	['o', 'o', 'o']
]

const colors =  ["red", "blue", "green", "yellow", "magenta"]


@JsonController()
export default class GameController {


  @Get('/games')
    async allGames() {
    const games = await Game.find()
    return { games }
    }

  @Post('/games')
    @HttpCode(201)
    createGame(
      @Body() game: Game
    ) {
      game.color = colors[Math.floor(Math.random()*5)]
      game.board = defaultBoard
      return game.save()
    }

  @Put('/games/:id')
    async updateGame(
      @Param('id') id: number,
      @Body() update: Game
    ) {
    const game = await Game.findOne(id)

    if (!game) throw new NotFoundError('Cannot find game')
    
    if (update.color) {
      if (colors.includes(update.color) === false) {
        throw new BadRequestError('Only red, blue, green, yellow, and magenta are valid colors')
      }
    }
  
    if (update.board) {
      const moves = (board1, board2) => 
      board1
        .map((row, y) => row.filter((cell, x) => board2[y][x] !== cell))
        .reduce((a, b) => a.concat(b))
        .length

        if(moves(update.board, game) > 1) {
          throw new BadRequestError('Only allowed one move per turn')
      }
    }

    return Game.merge(game, update).save()
    }
}
