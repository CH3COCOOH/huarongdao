"use client";

import styles from './Square.module.css';
import { useDrag } from 'react-dnd';
import { useState, useRef } from 'react';

export function Square(props) {

    const [col, setCol] = useState(props.col);
    const [row, setRow] = useState(props.row);
    const [type, setType] = useState(props.type);
    
    const [{isDragging}, drag, preview] = useDrag(() => ({
        type: 'move',
        item: {type, col, row},
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        })
    }));
    
    if(type === 2)
        var result = <button 
                        ref={drag}
                        className={styles.s}
                        style={{ 
                            gridRow: row.toString() + ' / span 1',
                            gridColumn: col.toString() + ' / span 1'
                        }}
                    />;

    else if(type === 3)
        var result = <button 
                        ref={drag}
                        className={styles.z}
                        style={{ 
                            gridColumn: col.toString() + ' / span 1',
                            gridRow: row.toString() + ' / span 2'
                        }}
                    />;

    else if(type === 4)
        var result = <button 
                        ref={drag}
                        className={styles.h}
                        style={{ 
                            gridRow: row.toString() + ' / span 1',
                            gridColumn: col.toString() + ' / span 2'
                        }}
                    />;

    else if(type === 5)
        var result = <button 
                        ref={drag}
                        className={styles.ss}
                        style={{ 
                            gridRow: row.toString() + ' / span 2',
                            gridColumn: col.toString() + ' / span 2' 
                        }}
                    />;

    else
        var result = null;
    
    return result;
}

/* 
 * type
 * 0 -> 空
 * 1 -> 占位
 * 2 -> 兵
 * 3 -> 竖
 * 4 -> 横
 * 5 -> 曹操
 */
export class Element {
    constructor(type, col, row) {
        this.type=type;
        this.col=col;
        this.row=row;
    }
}
