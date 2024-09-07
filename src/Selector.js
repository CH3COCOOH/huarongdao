"use client";

import styles from './Selector.module.css';
import { useRef } from 'react';

export function Selector(props) {

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
