import { useState, useEffect } from 'react';
import { DisplayState } from './helper';
import AlarmSound from './assets/AlarmSound.mp3';

import './App.css';
import TimeSetter from './TimeSetter';
import Display from './Display';

const defaultBreakTime = 60 * 5;
const defaultSessionTime = 60 * 25;
const min = 60;
const max = 60 * 60;
const interval = 60;

function App() {
  const [breakTime, setBreakTime] = useState(defaultBreakTime);
  const [sessionTime, setSesstionTime] = useState(defaultSessionTime);
  const [displayState, setDisplayState] = useState<DisplayState>({
    time: sessionTime,
    timeType: 'session',
    timerRunning: false,
  });

  useEffect(() => {
    let timerID: number;
    if (!displayState.timerRunning) return;

    if (displayState.timerRunning) {
      timerID = window.setInterval(decrementDisplay, 1000);
    }

    return () => {
      window.clearInterval(timerID);
    };
  }, [displayState.timerRunning]);

  useEffect(() => {
    const audio = document.getElementById('beep') as HTMLAudioElement;
    console.log('play audio', displayState);
    if (displayState.time < 0) {
      audio.currentTime = 0;
      audio.play().catch((err) => console.log(err));
      console.log('displayState: ', displayState);
      setTimeout(() => {
        audio.pause();
      }, 1500);

      setDisplayState((prev) => {
        console.log(prev);
        return {
          ...prev,
          timeType: prev.timeType === 'session' ? 'break' : 'session',
          time: prev.timeType === 'session' ? breakTime : sessionTime,
        };
      });
    }
  }, [displayState, breakTime, sessionTime]);

  const reset = () => {
    setBreakTime(defaultBreakTime);
    setSesstionTime(defaultSessionTime);
    setDisplayState({
      time: defaultSessionTime,
      timeType: 'session',
      timerRunning: false,
    });

    const audio = document.getElementById('beep') as HTMLAudioElement;
    audio.pause();
    audio.currentTime = 0;
  };

  const startStop = () => {
    console.log('startStop run');
    setDisplayState((prev) => ({
      ...prev,
      timerRunning: !prev.timerRunning,
    }));
  };

  const changeBreakTime = (time: number) => {
    if (displayState.timerRunning) return;
    setBreakTime(time);
  };

  const decrementDisplay = () => {
    setDisplayState((prev) => ({
      ...prev,
      time: prev.time - 1,
    }));
  };

  const changeSessionTime = (time: number) => {
    if (displayState.timerRunning) return;
    setSesstionTime(time);
    setDisplayState({
      time: time,
      timeType: 'session',
      timerRunning: false,
    });
  };

  return (
    <>
      <div className='clock'>
        <div className='setters'>
          <div className='break'>
            <h4 id='break-label'>Break Length</h4>
            <div id='break-length'>
              <TimeSetter
                time={breakTime}
                setTime={changeBreakTime}
                min={min}
                max={max}
                interval={interval}
                type='break'
              />
            </div>
          </div>
          <div className='session'>
            <h4 id='session-label'>Session Length</h4>
            <TimeSetter
              time={sessionTime}
              setTime={changeSessionTime}
              min={min}
              max={max}
              interval={interval}
              type='session'
            />
          </div>
        </div>
        <Display
          displayState={displayState}
          reset={reset}
          startStop={() => startStop()}
        />
        <audio id='beep' src={AlarmSound}></audio>
      </div>
    </>
  );
}

export default App;
