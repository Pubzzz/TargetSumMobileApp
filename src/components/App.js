import React from 'react';
import Game from './Game';


class App extends React.Component {
    state={
        gameID:1,
    };
    resetGame = () => {
        this.setState((prevState)=>{
            return {gameID:prevState.gameID+1};
        });
    };
    render(){
        return (
            <Game key={this.state.gameID} 
            onPlayAgain={this.resetGame}
            randomNumberCount={6} 
            initialSeconds={10}
            />
        );
    }
}
export default App;