"use client";

import { useState, useRef } from 'react';
import Board from './Board.js';
import styles from './Game.module.css';
import load from './Level.js';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { MultiBackend } from 'react-dnd-multi-backend';
import { HTML5toTouch } from 'rdndmb-html5-to-touch';

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

    analyze();
    
    function canMove(type, oldCol, oldRow, toCol, toRow) {
        const nextStep = nextStepRef.current;
        const toIndex = 4*(toRow-1)+toCol-1;
        const step = nextStep[type.toString()+oldCol.toString()+oldRow.toString()];
        if(step.includes(toIndex)) {
            return true;
        } else {
            return false;
        }
    }

    function analyze() {
        const nextStep = nextStepRef.current;
        const layout = layoutRef.current;

        for(var key in nextStep) {
            delete nextStep[key];
        }
        for(var i = 0; i < 20; i++) {
            const value = layout[i];

            if(value <= 1) {
                continue;
            }

            const col = i % 4 + 1;
            const row = (i - col + 1) / 4 + 1;

            if(value == 2) {
                var step = analyze_impl2(i);
            } else if(value == 3) {
                var step = analyze_impl3(i);
            } else if(value == 4) {
                var step = analyze_impl4(i);
            } else if(value == 5) {
                var step = analyze_impl5(i);
            }

            nextStep[value.toString()+col.toString()+row.toString()] = step;
        }
    }

    function analyze_impl2(i) {
        const layout = layoutRef.current;
        const result = [];

        /* 左1 */
        if(i % 4 != 0) {
            if(layout[i-1] == 0) {
                result.push(i-1);
            }
        }

        /* 左2 */
        if(i % 4 >= 2) {
            if(layout[i-1] == 0 && layout[i-2] == 0) {
                result.push(i-2);
            }
        }

        /* 左上 */
        if(i % 4 != 0 && i >= 4) {
            if(layout[i-5] == 0) {
                if(layout[i-1] == 0 || layout[i-4] == 0) {
                    result.push(i-5);
                }
            }
        }

        /* 上1 */
        if(i >= 4) {
            if(layout[i-4] == 0) {
                result.push(i-4);
            }
        }

        /* 上2 */
        if(i >= 8) {
            if(layout[i-4] == 0 && layout[i-8] == 0) {
                result.push(i-8);
            }
        }

        /* 右上 */
        if(i % 4 != 3 && i >= 4) {
            if(layout[i-3] == 0) {
                if(layout[i+1] == 0 || layout[i-4] == 0) {
                    result.push(i-3);
                }
            }
        }

        /* 右1 */
        if(i % 4 != 3) {
            if(layout[i+1] == 0) {
                result.push(i+1);
            }
        }

        /* 右2 */
        if(i % 4 <= 1) {
            if(layout[i+1] == 0 && layout[i+2] == 0) {
                result.push(i+2);
            }
        }

        /* 右下 */
        if(i % 4 != 3 && i <= 15) {
            if(layout[i+5] == 0) {
                if(layout[i+1] == 0 || layout[i+4] == 0) {
                    result.push(i+5);
                }
            }
        }

        /* 下1 */
        if(i <= 15) {
            if(layout[i+4] == 0) {
                result.push(i+4);
            }
        }

        /* 下2 */
        if(i <= 11) {
            if(layout[i+4] == 0 && layout[i+8] == 0) {
                result.push(i+8);
            }
        }

        /* 左下 */
        if(i % 4 != 0 && i <= 15) {
            if(layout[i+3] == 0) {
                if(layout[i-1] == 0 || layout[i+4] == 0) {
                    result.push(i+3);
                }
            }
        }

        return result;
    }

    function analyze_impl3(i) {
        const layout = layoutRef.current;
        const result = [];

        if(i % 4 != 0) {
            if(layout[i-1] == 0 && layout[i+3] == 0) {
                result.push(i-1);
            }
        }

        if(i >= 4) {
            if(layout[i-4] == 0) {
                result.push(i-4);
            }
        }

        if(i >= 8) {
            if(layout[i-4] == 0 && layout[i-8] == 0) {
                result.push(i-8);
            }
        }

        if(i % 4 != 3) {
            if(layout[i+1] == 0 && layout[i+5] == 0) {
                result.push(i+1);
            }
        }

        if(i <= 11) {
            if(layout[i+8] == 0) {
                result.push(i+4);
            }
        }

        if(i <= 7) {
            if(layout[i+8] == 0 && layout[i+12] == 0) {
                result.push(i+8);
            }
        }
        
        return result;
    }

    function analyze_impl4(i) {
        const layout = layoutRef.current;
        const result = [];

        if(i % 4 != 0) {
            if(layout[i-1] == 0) {
                result.push(i-1);
            }
        }

        if(i % 4 == 2) {
            if(layout[i-1] == 0 && layout[i-2] == 0) {
                result.push(i-2);
            }
        }

        if(i >= 4) {
            if(layout[i-4] == 0 && layout[i-3] == 0) {
                result.push(i-4);
            }
        }

        if(i % 4 != 2) {
            if(layout[i+2] == 0) {
                result.push(i+1);
            }
        }

        if(i % 4 == 0) {
            if(layout[i+2] == 0 && layout[i+3] == 0) {
                result.push(i+2);
            }
        }

        if(i <= 14) {
            if(layout[i+4] == 0 && layout[i+5] == 0) {
                result.push(i+4);
            }
        }

        return result;
    }

    function analyze_impl5(i) {
        const layout = layoutRef.current;
        const result = [];

        if(i % 4 != 0) {
            if(layout[i-1] == 0 && layout[i+3] == 0) {
                result.push(i-1);
            }
        }

        if(i >= 4) {
            if(layout[i-4] == 0 && layout[i-3] == 0) {
                result.push(i-4);
            }
        }

        if(i % 4 != 2) {
            if(layout[i+2] == 0 && layout[i+6] == 0) {
                result.push(i+1);
            }
        }

        if(i <= 10) {
            if(layout[i+8] == 0 && layout[i+9] == 0) {
                result.push(i+4);
            }
        }

        return result;
    }

    function move(type, oldCol, oldRow, toCol, toRow) {
        if(!canMove(type, oldCol, oldRow, toCol, toRow)) {
            return ;
        }
        if(statusRef.current == true) {
            return ;
        }
        
        const old_index = (oldRow-1)*4-1+oldCol;
        const index = (toRow-1)*4-1+toCol;
        const new_layout = layoutRef.current.slice();

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

        historyRef.current.push(layoutRef.current);
        layoutRef.current = new_layout;
        numStepRef.current++;
        if(isWin()) {
            statusRef.current = true;
        }

        setLayout(new_layout);
        
    }

    function isWin() {
        const layout = layoutRef.current;
        if(layout[13] === 5) {
            return true;
        } else {
            return false;
        }
    }

    function undo() {
        if(statusRef.current == true) {
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
    }

    function restart() {
        numStepRef.current = 0;
        historyRef.current = [];
        statusRef.current = false;
        const new_layout = load(levelRef.current);
        layoutRef.current = new_layout;
        setLayout(new_layout);
    }

    function select(level) {
        numStepRef.current = 0;
        statusRef.current = false;
        historyRef.current = [];
        levelRef.current = level;
        const new_layout = load(level);
        layoutRef.current = new_layout;
        setLayout(new_layout);
    }

    return (
        <DndProvider backend={MultiBackend} options={HTML5toTouch}>
            <Board layout={ layout } move={ move } undo={ undo } num={numStepRef.current}
                restart={ restart } canMove={ canMove } select={ select } isWin={ statusRef.current }/>
        </DndProvider>
    );
}
