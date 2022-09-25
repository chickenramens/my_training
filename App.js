import { StatusBar } from 'expo-status-bar';
import {StyleSheet, View} from 'react-native';
import {Button, Text, Slider} from "@rneui/themed";
import {useEffect, useRef, useState} from "react";
import {useKeepAwake} from "expo-keep-awake";
import * as Speech from 'expo-speech';
import {Audio} from 'expo-av';

function Counter() {
    /*global require, console, setInterval, clearInterval*/
    const [count, setCount] = useState(0);
    const [maxCount, setMaxCount] = useState(6);
    const [maxReps, setMaxReps] = useState(10);
    const intervalRef = useRef(null);
    const [sound, setSound] = useState(undefined);

    async function playSound(){
        try{
            if(sound === undefined){
                const theSound = await Audio.Sound.createAsync(
                require('./assets/sound/mixkit-retro-game-notification-212.wav'), { shouldPlay: true });
                setSound(theSound);
            } else {
                await sound.sound.stopAsync().then(sound.sound.playAsync());
            }
        } catch (e) {
            console.log(e);
        }
    }

    const countout = () => {
        if(count > 1 && count % maxCount === 0){
            const reps = Math.floor(count / maxCount);
            if (reps === maxReps){
                Speech.speak('finished',{language: 'en-US'});
            } else {
                Speech.speak(reps.toString(),{language: 'en-US'});
            }
        } else if(count !== 0) {
            playSound();
        }
    }

    useEffect( () => {
        countout();
    },[count]);

    const start = () => {
        if (intervalRef.current !== null) {
            return;
        }
        intervalRef.current = setInterval(() => {
            setCount(c => c + 1);

        }, 1000);
    };
    const stop = () => {
        if (intervalRef.current === null) {//タイマーが止まっている時はstart押せないように
            return;
        }
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        Speech.speak('stopped',{language: 'en-US'});
    };
    const reset = () => {
        stop();
        setCount(0);
        setMaxCount(6);
        setMaxReps(10);
    }

    useKeepAwake();
    return (

        <View style={styles.buttonContainer}>

            <Text>Seconds of one rep:{maxCount}</Text>
            <Slider value={maxCount} onValueChange={setMaxCount} step={1} minimumValue={3} maximumValue={20} disabled={intervalRef.current !== null}/>
            <Text>Reps to go:{maxReps}</Text>
            <Slider value={maxReps} onValueChange={setMaxReps} step={1} minimumValue={5} maximumValue={50} disabled={intervalRef.current !== null}/>

            <Text h4>Reps: {Math.floor(count / maxCount)}</Text>
            <Text h4>Count: {count % maxCount}</Text>

            <View style={{flexDirection:'row', justifyContent: 'center'}}>
                <Button onPress={() => start()} containerStyle={styles.button}>Start</Button>
                <Button color="secondary" onPress={() => stop()} containerStyle={styles.button}>Stop</Button>
                <Button color="warning" onPress={() => reset()} containerStyle={styles.button}>Reset</Button>
            </View>
        </View>
    );
}

export default function App() {
    return (
        <View style={styles.container}>
            <Text h4>Open up App.js to start working on your app!!</Text>
            <Counter />
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContainer:{
//        justifyContent: 'center',
//        margin: 10,
//        width: '80%',
    },
    button:{
        width: 100,
        marginHorizontal: 10,
        borderRadius: 5,
    }
});
