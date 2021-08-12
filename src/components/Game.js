import React from 'react';
import PropTypes from 'prop-types';

import {View,Text,Button,StyleSheet} from 'react-native';
import RandomNumber from './RandomNumber';
import shuffle from 'lodash.shuffle';

class Game extends React.Component {
    static propTypes={
        randomNumberCount:PropTypes.number.isRequired,
        initialSeconds:PropTypes.number.isRequired,
        onPlayAgain:PropTypes.func.isRequired,
    };
    state={
        selectedIds:[],
        remainingSeconds:this.props.initialSeconds,
    }
    gameStatus='PLAYING';
    randomNumbers=Array
        .from({length:this.props.randomNumberCount})
        .map(()=> 1+Math.floor(10*Math.random()));
    value = this.randomNumbers
        .slice(0,this.props.randomNumberCount-2)
        .reduce((acc,curr)=>acc+curr,0);
       
        shuffledRandomNumbers = shuffle(this.randomNumbers);

        componentDidMount(){
            this.intervalId=setInterval(()=>{
                this.setState((prevState)=>{
                    return {remainingSeconds:prevState.remainingSeconds-1};
                },()=>{
                    if(this.state.remainingSeconds === 0){
                        clearInterval(this.intervalId);
                    }
                });
            },1000);
        }
        componentWillUnmount(){
            clearInterval(this.intervalId);
        }

        isNumberSelected = (numberIndex)=>{
            return this.state.selectedIds.indexOf(numberIndex)>=0;
        }
        selectNumber=(numberIndex)=>{
            this.setState((prevState)=>({
                selectedIds:[...prevState.selectedIds,numberIndex]
            }));
        }
        UNSAFE_componentWillUpdate(nextProps,nextState){
            if(nextState.selectedIds !== this.state.selectedIds || nextState.remainingSeconds === 0){
                this.gameStatus = this.calcGameStatus(nextState);
                if(this.gameStatus !== 'PLAYING'){
                    clearInterval(this.intervalId);
                }
            }
        }
        calcGameStatus=(nextState)=>{
            const sumSelected= nextState.selectedIds.reduce((acc,curr)=>{
                return acc + this.shuffledRandomNumbers[curr];
            },0);
            if(nextState.remainingSeconds === 0){
                return 'LOST';
            }
            if(sumSelected<this.value){
                return 'PLAYING';
            }
            if(sumSelected === this.value){
                return 'WON';
            }
            if(sumSelected>this.value){
                return 'LOST';
            }
        };
       
    render(){
        const gameStatus = this.gameStatus;
        return (
            <View style={styles.container}>
                <Text style={[styles.target,styles[`STATUS_${gameStatus}`]]}>{this.value}</Text>
                <View style={styles.randomContainer}>
                {this.shuffledRandomNumbers.map((randomNumber,index)=>
                <RandomNumber 
                key={index} 
                id={index}
                number={randomNumber}
                isDisabled={this.isNumberSelected(index) || gameStatus !== 'PLAYING'}
                onPress = {this.selectNumber}
                />
                )}
                </View>
                <Text style={styles.statusText}>{gameStatus}</Text>
                {this.gameStatus !== 'PLAYING' && (
                    <Button style={styles.buttonText} title="Play Again" onPress={this.props.onPlayAgain}/>
                )}
                <Text style={styles.statusText}>Remaining time: {this.state.remainingSeconds}</Text>
            </View>
         );
    }
}

const styles = StyleSheet.create({
    container:{
        paddingTop:50,
        backgroundColor:'#000',
        flex:1,
    },
    target:{
        textAlign:'center',
        fontSize:50,
        backgroundColor:'#fff',
        margin:50,
    },
    randomContainer:{
        flex:1,
        flexDirection:'row',
        flexWrap:'wrap',
        justifyContent:'space-around',
    },
    statusText:{
        backgroundColor:'#000',
        color:'#fff',
        fontSize:20,
        paddingBottom:15,
        textAlign:'center',
    },
    STATUS_PLAYING:{
        backgroundColor:'#fff',
    },
    STATUS_WON:{
        backgroundColor:'green',
    },
    STATUS_LOST:{
        backgroundColor:'red',
    },
    buttonText:{
        width:200,
        height:50,
        padding:10,
        fontSize:40,
    },
    
})
export default Game;