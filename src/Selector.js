"use client";

import styles from './Selector.module.css';
import { useRef } from 'react';

export function Selector(props) {
    const handleClick = (id => {
        if(id === props.level) {
            return ;
        }
        props.select(id);
    });

    const levelbtnarr = [];
    for(let i = 1; i <= 6; i++) {
        const active = (i === props.level);
        const btn = <LevelButton key={i} info={i} active={active} onClick={() => handleClick(i)}/>;
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

function LevelButton(props) {
    return props.active ? 
        <button className={`${styles.levelbtn} ${styles.active}`} onClick={props.onClick}>{props.info}</button> :
        <button className={`${styles.levelbtn} ${styles.inactive}`} onClick={props.onClick}>{props.info}</button>
}
