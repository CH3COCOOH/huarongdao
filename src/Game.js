"use client";

import { useState, useRef, useEffect } from 'react';
import Board from './Board.js';
import load from './Level.js';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { MultiBackend } from 'react-dnd-multi-backend';
import { HTML5toTouch } from 'rdndmb-html5-to-touch';
import Cookies from 'js-cookie';

/**
 * 0: 空
 * 1: 附属
 * 2: 兵
 * 3: 纵
 * 4: 横
 * 5: 曹操
 */

export default function Game() {

    const levelRef = useRef(1);
    const [layout, setLayout] = useState(load(1));
    const layoutRef = useRef(layout);
    const nextStepRef = useRef({});
    const statusRef = useRef(false);
    const historyRef = useRef([]);
    const numStepRef = useRef(0);
    const modeRef = useRef('manual');

    useEffect(() => {
        getCookie();
    }, []);

    analyze(nextStepRef.current, layoutRef.current);
    
    function canMove(type, oldCol, oldRow, toCol, toRow) {
        const nextStep = nextStepRef.current;
        const toIndex = 4*(toRow-1)+toCol-1;
        const step = nextStep[`${type}${oldCol}${oldRow}`];
        if(step.includes(toIndex)) {
            return true;
        } else {
            return false;
        }
    }

    function analyze(nextStep, layout) {
        for(const key in nextStep) {
            delete nextStep[key];
        }

        for(let i = 0; i < 20; i++) {
            const value = layout[i];
    
            if(value <= 1) {
                continue;
            }
    
            const col = i % 4 + 1;
            const row = (i - col + 1) / 4 + 1;
            const step = [i];
    
            if(value === 2) {
                analyze_impl2(i, layout, step);
            } else if(value === 3) {
                analyze_impl3(i, layout, step);
            } else if(value === 4) {
                analyze_impl4(i, layout, step);
            } else if(value === 5) {
                analyze_impl5(i, layout, step);
            }
            const delIndex = step.indexOf(i);
            step.splice(delIndex, 1);
    
            nextStep[`${value}${col}${row}`] = step;
        }
    }
    
    function analyze_impl2(i, layout, step) {
        if(!step.includes(i-1) && i % 4 !== 0 && layout[i-1] === 0) {
            step.push(i-1);
            analyze_impl2(i-1, layout, step);
        }
    
        if(!step.includes(i-4) && i > 3 && layout[i-4] === 0) {
            step.push(i-4);
            analyze_impl2(i-4, layout, step);
        }
    
        if(!step.includes(i+1) && i % 4 !== 3 && layout[i+1] === 0) {
            step.push(i+1);
            analyze_impl2(i+1, layout, step);
        }
    
        if(!step.includes(i+4) && i < 16 && layout[i+4] === 0) {
            step.push(i+4);
            analyze_impl2(i+4, layout, step);
        }
    }
    
    function analyze_impl3(i, layout, step) {
        if(!step.includes(i-1) && i % 4 !== 0) {
            if(layout[i-1] === 0 && layout[i+3] === 0) {
                step.push(i-1);
                analyze_impl3(i-1, layout, step);
            }
        }
    
        if(!step.includes(i-4) && i > 3) {
            if(layout[i-4] === 0) {
                step.push(i-4);
                analyze_impl3(i-4, layout, step);
            }
        }
    
        if(!step.includes(i+1) && i % 4 !== 3) {
            if(layout[i+1] === 0 && layout[i+5] === 0) {
                step.push(i+1);
                analyze_impl3(i+1, layout, step);
            }
        }
    
        if(!step.includes(i+4) && i < 12) {
            if(layout[i+8] === 0) {
                step.push(i+4);
                analyze_impl3(i+4, layout, step);
            }
        }
    }
    
    function analyze_impl4(i, layout, step) {
        if(!step.includes(i-1) && i % 4 !== 0) {
            if(layout[i-1] === 0) {
                step.push(i-1);
                analyze_impl4(i-1, layout, step);
            }
        }
    
        if(!step.includes(i-4) && i > 3) {
            if(layout[i-4] === 0 && layout[i-3] === 0) {
                step.push(i-4);
                analyze_impl4(i-4, layout, step);
            }
        }
    
        if(!step.includes(i+1) && i % 4 <= 1) {
            if(layout[i+2] === 0) {
                step.push(i+1);
                analyze_impl4(i+1, layout, step);
            }
        }
    
        if(!step.includes(i+4) && i < 16) {
            if(layout[i+4] === 0 && layout[i+5] === 0) {
                step.push(i+4);
                analyze_impl4(i+4, layout, step);
            }
        }
    }
    
    function analyze_impl5(i, layout, step) {
        if(!step.includes(i-1) && i % 4 !== 0) {
            if(layout[i-1] === 0 && layout[i+3] === 0) {
                step.push(i-1);
                analyze_impl5(i-1, layout, step);
            }
        }
    
        if(!step.includes(i-4) && i > 3) {
            if(layout[i-4] === 0 && layout[i-3] === 0) {
                step.push(i-4);
                analyze_impl5(i-4, layout, step);
            }
        }
    
        if(!step.includes(i+1) && i % 4 <= 1) {
            if(layout[i+2] === 0 && layout[i+6] === 0) {
                step.push(i+1);
                analyze_impl5(i+1, layout, step);
            }
        }
    
        if(!step.includes(i+4) && i < 12) {
            if(layout[i+8] === 0 && layout[i+9] === 0) {
                step.push(i+4);
                analyze_impl5(i+4, layout, step);
            }
        }
    }

    function _auto(layout) {
        const nextStep = {}, path = {[layout]: true}, point = [layout];
        let tmp = null;
        while(true) {
            tmp = point.shift();

            if(isWin(tmp)) {
                const result = [];
                for(; tmp !== true; tmp = path[tmp])
                    result.push(tmp);
                result.pop();
                return result;
            }

            analyze(nextStep, tmp);
            for(const key in nextStep) {
                const type = parseInt(key.charAt(0));
                const oldCol = parseInt(key.charAt(1));
                const oldRow = parseInt(key.charAt(2));
                const indexs = nextStep[key];
                
                for(const index of indexs) {
                    const toCol = index % 4 + 1;
                    const toRow = (index - toCol + 1) / 4 + 1;
                    const new_layout = _move(type, oldCol, oldRow, toCol, toRow, tmp);

                    !path[new_layout] && (path[new_layout] = tmp) && point.push(new_layout);
                }
            }
        }
    }

    async function auto() {
        modeRef.current = 'auto';
        const layout = layoutRef.current;
        const step = _auto(layout);
        
        let new_layout = null;
        while(modeRef.current === 'auto' && (new_layout = step.pop())) {
            historyRef.current.push(layoutRef.current);
            layoutRef.current = new_layout;
            numStepRef.current++;
            if(isWin(new_layout)) {
                statusRef.current = true;
            }
            setLayout(new_layout);
            setCookie();
            await sleep();
        }
    }

    function move(type, oldCol, oldRow, toCol, toRow) {
        if(!canMove(type, oldCol, oldRow, toCol, toRow)) {
            return ;
        }
        if(statusRef.current === true) {
            return ;
        }
        
        const new_layout = _move(type, oldCol, oldRow, toCol, toRow, layoutRef.current);
        
        historyRef.current.push(layoutRef.current);
        layoutRef.current = new_layout;
        numStepRef.current++;
        if(isWin(new_layout)) {
            statusRef.current = true;
        }
        setLayout(new_layout);
        setCookie();
    }

    function _move(type, oldCol, oldRow, toCol, toRow, layout) {
        const old_index = (oldRow-1)*4-1+oldCol;
        const index = (toRow-1)*4-1+toCol;
        const new_layout = layout.slice();

        if(type===2) {
            new_layout[old_index]=0;
            new_layout[index]=2;

        } else if(type===3) {
            new_layout[old_index]=0;
            new_layout[old_index+4]=0;
            new_layout[index]=3;
            new_layout[index+4]=1;

        } else if(type===4) {
            new_layout[old_index]=0;
            new_layout[old_index+1]=0;
            new_layout[index]=4;
            new_layout[index+1]=1;

        } else if(type===5) {
            new_layout[old_index]=0;
            new_layout[old_index+1]=0;
            new_layout[old_index+4]=0;
            new_layout[old_index+5]=0;
            new_layout[index]=5;
            new_layout[index+1]=1;
            new_layout[index+4]=1;
            new_layout[index+5]=1;
        }
        return new_layout;
    }

    function isWin(layout) {
        if(layout[13] === 5) {
            return true;
        } else {
            return false;
        }
    }

    function undo() {
        if(statusRef.current === true) {
            return ;
        }
        const history = historyRef.current;
        if(history.length === 0) {
            return ;
        }
        numStepRef.current--;
        const new_history = history.slice(0, -1);
        historyRef.current = new_history;
        const new_layout = history[history.length - 1];
        layoutRef.current = new_layout;
        setLayout(new_layout);
        setCookie();
    }

    function restart() {
        numStepRef.current = 0;
        historyRef.current = [];
        statusRef.current = false;
        const new_layout = load(levelRef.current);
        layoutRef.current = new_layout;
        setLayout(new_layout);
        setCookie();
    }

    function select(level) {
        numStepRef.current = 0;
        statusRef.current = false;
        historyRef.current = [];
        levelRef.current = level;
        const new_layout = load(level);
        layoutRef.current = new_layout;
        setLayout(new_layout);
        setCookie();
    }

    function setCookie() {
        Cookies.set('level', JSON.stringify(levelRef.current), { expires: 365});
        Cookies.set('layout', JSON.stringify(layoutRef.current), { expires: 365});
        Cookies.set('status', JSON.stringify(statusRef.current), { expires: 365});
        Cookies.set('history', JSON.stringify(historyRef.current), { expires: 365});
        Cookies.set('num', JSON.stringify(numStepRef.current), { expires: 365});
    }

    function getCookie() {
        const levCookie = Cookies.get('level');
        const lCookie = Cookies.get('layout');
        const sCookie = Cookies.get('status');
        const hCookie = Cookies.get('history');
        const nCookie = Cookies.get('num');

        if(levCookie !== undefined) {
            levelRef.current = JSON.parse(levCookie);
        }
        if(sCookie !== undefined) {
            statusRef.current = JSON.parse(sCookie);
        }
        if(hCookie !== undefined) {
            historyRef.current = JSON.parse(hCookie);
        }
        if(nCookie !== undefined) {
            numStepRef.current = JSON.parse(nCookie);
        }
        if(lCookie !== undefined) {
            layoutRef.current = JSON.parse(lCookie);
            setLayout(JSON.parse(lCookie));
        }
    }

    return (
        <DndProvider backend={MultiBackend} options={HTML5toTouch}>
            <Board layout={layout} move={move} undo={undo} num={numStepRef.current}
                restart={restart} canMove={canMove} select={select} 
                isWin={statusRef.current} auto={auto} />
        </DndProvider>
    );
}

function sleep() {
    return new Promise(resolve => setTimeout(resolve, 500));
}
