"use client";

import { Square } from './Square.js';
import styles from './Board.module.css';
import { useState, useRef } from 'react';
import { useDrop } from 'react-dnd';

/**
 * 0: 空
 * 1: 附属
 * 2: 兵
 * 3: 纵
 * 4: 横
 * 5: 曹操
 */

export default function Board(props) {

    const [showSidebar, setShowSidebar] = useState(false);

    const layout = props.layout;
    const board = toBoard(layout);
    const isMobile = window.innerWidth <= 520 ? true : false;

    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'move',  
        drop: (item, monitor) => {
            const oldCol = item.col;
            const oldRow = item.row;
            const offset = monitor.getDifferenceFromInitialOffset();
            const toCol = location(offset.x, oldCol, 4);
            const toRow = location(offset.y, oldRow, 5);
            props.move(item.type, oldCol, oldRow, toCol, toRow);
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

    function toBoard(layout) {
        var len = 0;            // 包含的棋子数
        const new_board = [];
        layout.map((data, index) => {
            if(data >= 2 && data <= 5) {
                const col = index % 4 + 1;
                const row = (index - col + 1) / 4 + 1;
                const square = <Square key={data.toString()+col.toString()+row.toString()} type={data} col={col} row={row} />;
                new_board[len] = square;
                len++;
            }
        });
        return new_board;
    }

    function openSide() {
        setShowSidebar(true);
    }

    function closeSide() {
        setShowSidebar(false);
    }

    const width = isMobile ? 242 : 352;
    const height = isMobile ? 297 : 432;

    return (
        <>
            {showSidebar && <div className={styles.sidebar}>
                <Selector name={styles.sidebarMain} select={props.select}/>
                <div className={styles.sidebarOver} onClick={closeSide}></div>
            </div>}
            <div className={styles.header}>
                <h1 className={styles.title}>华容道</h1>
                <button className={`${styles.hideLarge} ${styles.menubtn}`} onClick={openSide}>
                    <img
                        src="/menu.png"
                        alt="menu"
                        width={30}
                        height={30}
                    />
                </button>
            </div>
            <div className={styles.content}>
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
                    <div className={styles.statusBar}>
                        <p>步数: {props.num} </p>
                        {props.isWin && <div className={styles.statusText}>胜利</div>}
                    </div>
                    <div className={styles.actionBar}>
                        <button className={styles.actionbtn} onClick={props.undo}>
                            <img 
                                src="/undo.svg"
                                alt='undo'
                                width={30}
                                height={30}
                            />
                        </button>
                        <button className={styles.actionbtn} onClick={props.restart}>
                            <img
                                src='restart.svg'
                                alt='restart'
                                width={26}
                                height={26}
                            />
                        </button>
                    </div>
                </div>
                <Selector select={props.select} name={`${styles.rightMenu} ${styles.hideSmall}`}/>
            </div>
            
        </>
    );
}

function Selector(props) {

    const levelRef = useRef(1);

    const handleClick = (id => {
        if(id == levelRef.current) {
            return ;
        }
        levelRef.current = id;
        props.select(id);
    });

    const levelbtnarr = [];
    for(let i = 1; i <= 6; i++) {
        const btn = <LevelButton key={i} info={i} onClick={() => handleClick(i)}/>;
        levelbtnarr.push(btn);
    }

    return (
        <>
            <div className={props.name}>
                <h2>关卡选择</h2>
                <div className={styles.selector}>
                    { levelbtnarr }
                </div>
            </div>
        </>
    )
}

function LevelButton({info, onClick}) {
    return <button className={styles.levelbtn} onClick={onClick}>{info}</button>
}

