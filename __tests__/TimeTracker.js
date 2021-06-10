import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TimeTracker from '../src/components/TimeTracker.tsx';
import { act } from 'react-test-renderer';
import { advanceBy, clear } from 'jest-date-mock';

const task = {
  uid: undefined,
  title: "",
  description: "",
  due_date: "",
  duration: "",
  tags: [],
  contacts: [],
  checklist: [],
  tracks: [],
  order: 0,
  duration_ms: 0,
  done: false,
  commit_date: null,
  matrix: "todo",
};

it('Play and stop pomodoro correctly', async () => {
    jest.useFakeTimers()
    advanceBy(-2000);
    const { getByTestId } =  render(<TimeTracker task={task} onTick={() => {}} onPomodoroStarted={() => { }} onPomodoroStopped={() => {}} config={2000}/>);
    const btnPlay = getByTestId('btnPlay');
    let time = ""
    await act(async () => {
      expect(getByTestId('txtTime').children[0]).toBe('25:00')
      fireEvent.press(btnPlay)
      clear()
      jest.advanceTimersByTime(2000)
      time = getByTestId('txtTime').children[0]
      fireEvent.press(btnPlay)
    })
    expect(time).toBe('24:58')
    expect(getByTestId('txtTime').children[0]).toBe('25:00')
})

it('Timer should be disabled',async () => {
    jest.useFakeTimers()
    advanceBy(-2000);
    const { getByTestId } =  render(<TimeTracker task={task} onTick={() => {}} onPomodoroStarted={() => { }} onPomodoroStopped={() => {}} config={2000} disabled={true}/>); 
    const btnPlay = getByTestId('btnPlay');
    let time = ""
    await act(async () => {
      expect(getByTestId('txtTime').children[0]).toBe('25:00')
      fireEvent.press(btnPlay)
      clear()
      jest.advanceTimersByTime(2000)
      time = getByTestId('txtTime').children[0]
      fireEvent.press(btnPlay)
    })
    expect(time).toBe('25:00')
    expect(getByTestId('txtTime').children[0]).toBe('25:00')
})