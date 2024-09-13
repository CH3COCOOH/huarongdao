"use client";

import { Selector } from './Selector.js';
import styles from './Board.module.css';
import Game from './Game.js';
import { useState, useRef } from 'react';
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

export default function Board(props) {

    const [level, setLevel] = useState(getlCookie());
    const levelRef = useRef(getlCookie());
    const [showSidebar, setShowSidebar] = useState(false);

    function openSide() {
        setShowSidebar(true);
    }
    function closeSide() {
        setShowSidebar(false);
    }

    function select(level) {
        levelRef.current = level;
        setLevel(level);
        setlCookie();
    }

    function setlCookie() {
        Cookies.set('level', JSON.stringify(levelRef.current), { expires: 365 });
    }

    function getlCookie() {
        const lCookie = Cookies.get('level');
        if(lCookie !== undefined) {
            return JSON.parse(lCookie);
        } else {
            return 1;
        }
    }
    
    return (
        <>
            { showSidebar && <Sidebar closeSide={ closeSide } 
                select={ select } level={ levelRef.current } /> }
            <Header openSide={ openSide } />
            <Content select={ select } level={ levelRef.current } />
        </>
    );
}

function Sidebar(props) {
    return (
        <div className={styles.sidebar}>
            <Selector name={styles.sidebarMain} select={props.select} level={props.level} />
            <div className={styles.sidebarOver} onClick={props.closeSide} />
        </div>
    );
}

function Header(props) {
    return (
        <div className={styles.header}>
            <h1 className={styles.title}>华容道</h1>
            <button className={`${styles.hideLarge} ${styles.menubtn}`} onClick={props.openSide}>
                <img
                    src="/menu.png"
                    alt="menu"
                    width={30}
                    height={30}
                />
            </button>
        </div>
    );
}

function Content(props) {
    return (
        <DndProvider backend={MultiBackend} options={HTML5toTouch}>
            <div className={styles.content}>
                <Game level={ props.level } />
                <Selector select={props.select} name={`${styles.rightMenu} ${styles.hideSmall}`} level={props.level} />
            </div>
        </DndProvider>
    );
}
