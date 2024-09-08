"use client";

import styles from './Game.module.css';
import { useState, useRef, useEffect } from 'react';
import { Square } from './Square.js';
import load from './Level.js';
import { useDrop } from 'react-dnd';
import Cookies from 'js-cookie';

/**
 * 0: 空
 * 1: 附属
 * 2: 兵
 * 3: 纵
 * 4: 横
 * 5: 曹操
 */

export default function Game(props) {

    const levelRef = useRef(props.level);
    const [layout, setLayout] = useState(load(props.level));
    const layoutRef = useRef(layout);
    const nextStepRef = useRef({});
    const statusRef = useRef(false);
    const historyRef = useRef([]);
    const numStepRef = useRef(0);
    const [mode, setMode] = useState(true);
    const modeRef = useRef(true);

    if(levelRef.current !== props.level) {
        setMode(true);
        modeRef.current = true;
        levelRef.current = props.level;
        statusRef.current = false;
        historyRef.current = [];
        numStepRef.current = 0;
        layoutRef.current = load(props.level);
        setLayout(load(props.level));
        setCookie();
    }

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
        if(statusRef.current) {
            return ;
        }
        
        setMode(false);
        modeRef.current = false;
        const layout = layoutRef.current;
        const step = _auto(layout);
        
        let new_layout = null;
        while(modeRef.current === false && (new_layout = step.pop())) {
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
        setMode(true);
        modeRef.current = true;
    }

    function stop_auto() {
        setMode(true);
        modeRef.current = true;
    }

    function move(type, oldCol, oldRow, toCol, toRow) {
        if(statusRef.current === true) {
            return ;
        }

        let resCol = null, resRow = null;
        const rowGap = toRow - oldRow;
        const colGap = toCol - oldCol;
        const pairs = gen_pairs(rowGap, colGap);
        for(let pair of pairs) {
            const toCol = oldCol + pair[1];
            const toRow = oldRow + pair[0];
            if(canMove(type, oldCol, oldRow, toCol, toRow)) {
                resCol = toCol;
                resRow = toRow;
                break;
            }
        }

        if(resCol === null || resRow === null) {
            return ;
        }
        
        const new_layout = _move(type, oldCol, oldRow, resCol, resRow, layoutRef.current);
        
        historyRef.current.push(layoutRef.current);
        layoutRef.current = new_layout;
        numStepRef.current++;
        if(isWin(new_layout)) {
            statusRef.current = true;
        }
        setLayout(new_layout);
        setCookie();
    }

    function gen_pairs(rowGap, colGap) {
        const result = [];
        const gap = Math.abs(rowGap) + Math.abs(colGap);
        const sign1 = rowGap > 0 ? 1 : -1;
        const sign2 = colGap > 0 ? 1 : -1;
        for(let cur = gap; cur > 0; cur--) {
            for(let rGap = rowGap; rGap * sign1 >= 0; rGap -= sign1) {
                const cGap = (cur - Math.abs(rGap)) * sign2;
                if(Math.abs(cGap) > Math.abs(colGap) || cGap * sign2 < 0) {
                    continue;
                }
                result.push([rGap, cGap]);
            }
        }
        return result;
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
        setMode(true);
        modeRef.current = true;
        numStepRef.current--;
        const new_history = history.slice(0, -1);
        historyRef.current = new_history;
        const new_layout = history[history.length - 1];
        layoutRef.current = new_layout;
        setLayout(new_layout);
        setCookie();
    }

    function restart() {
        setMode(true);
        modeRef.current = true;
        numStepRef.current = 0;
        historyRef.current = [];
        statusRef.current = false;
        const new_layout = load(levelRef.current);
        layoutRef.current = new_layout;
        setLayout(new_layout);
        setCookie();
    }

    function setCookie() {
        Cookies.set('layout', JSON.stringify(layoutRef.current), { expires: 365});
        Cookies.set('status', JSON.stringify(statusRef.current), { expires: 365});
        Cookies.set('history', JSON.stringify(historyRef.current), { expires: 365});
        Cookies.set('num', JSON.stringify(numStepRef.current), { expires: 365});
    }

    function getCookie() {
        const lCookie = Cookies.get('layout');
        const sCookie = Cookies.get('status');
        const hCookie = Cookies.get('history');
        const nCookie = Cookies.get('num');

        sCookie !== undefined && (statusRef.current = JSON.parse(sCookie));
        hCookie !== undefined && (historyRef.current = JSON.parse(hCookie));
        nCookie !== undefined && (numStepRef.current = JSON.parse(nCookie));
        
        if(lCookie !== undefined) {
            layoutRef.current = JSON.parse(lCookie);
            setLayout(JSON.parse(lCookie));
        }
    }

    function toBoard(layout) {
        var len = 0;            // 包含的棋子数
        const new_board = [];
        layout.map((data, index) => {
            if(data >= 2 && data <= 5) {
                const col = index % 4 + 1;
                const row = (index - col + 1) / 4 + 1;
                const square = <Square key={`${data}${col}${row}`} type={data} col={col} row={row} />;
                new_board[len] = square;
                len++;
            }
        });
        return new_board;
    }

    const board = toBoard(layoutRef.current);
    const isMobile = window.innerWidth <= 520 ? true : false;
    const width = isMobile ? 242 : 352;
    const height = isMobile ? 297 : 432;

    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'move',  
        canDrop: () => modeRef.current,
        drop: (item, monitor) => {
            const oldCol = item.col;
            const oldRow = item.row;
            const offset = monitor.getDifferenceFromInitialOffset();
            const toCol = location(offset.x, oldCol, 4);
            const toRow = location(offset.y, oldRow, 5);
            move(item.type, oldCol, oldRow, toCol, toRow);
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    function location(offset, oldValue, maxValue) {
        const unit = isMobile ? 55 : 80;
        var result = oldValue + Math.round(offset/unit);
        if(result <= 0) {
            result = 1;
        }
        if(result > maxValue) {
            result = maxValue;
        }
        return result;
    }

    return (
        <div className={styles.mainContent}>
            <div className={styles.boardImage}>
                <img
                    src="/huaboard.png"
                    alt="huaboard"
                    width={width}
                    height={height}
                />
                <div ref={drop} className={styles.board}>
                    { board }
                </div>
            </div>
            <StatusBar isWin={statusRef.current} num={numStepRef.current} />
            <ActionBar auto={auto} undo={undo} restart={restart} mode={modeRef.current} stop={stop_auto} />
        </div>
    );
}

function ActionBar(props) {
    return (
        <div className={styles.actionBar}>
            <button className={styles.actionbtn} onClick={props.undo}>
                <img 
                    src="/undo.svg"
                    alt='undo'
                    width={ 30 }
                    height={ 30 }
                />
            </button>
            { props.mode === true ? 
            <button className={styles.actionbtn} onClick={props.auto}>
                <img
                    src="/play.svg"
                    alt='auto'
                    width={ 22 }
                    height={ 22 }
                />
            </button> :
            <button className={styles.actionbtn} onClick={props.stop}>
                <img
                    src="/stop.svg"
                    alt='stop'
                    width={ 28 }
                    height={ 28 }
                />
            </button> }
            <button className={styles.actionbtn} onClick={props.restart}>
                <img
                    src='restart.svg'
                    alt='restart'
                    width={ 26 }
                    height={ 26 }
                />
            </button>
        </div>
    );
}

function StatusBar(props) {
    return (
        <div className={styles.statusBar}>
            <p>步数: {props.num} </p>
            {props.isWin && <div className={styles.statusText}>胜利</div>}
        </div>
    );
}

function sleep() {
    return new Promise(resolve => setTimeout(resolve, 500));
}
