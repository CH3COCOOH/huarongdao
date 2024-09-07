"use client";

import styles from './Square.module.css';
import { useDrag } from 'react-dnd';

export function Square(props) {

    const col = props.col;
    const row = props.row;
    const type = props.type;
    
    const [{isDragging}, drag, preview] = useDrag(() => ({
        type: 'move',
        item: {type, col, row},
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        })
    }));
    
    let result = null;
    if(type === 2)
        result = <button 
                        ref={drag}
                        className={styles.s}
                        style={{ 
                            gridRow: row.toString() + ' / span 1',
                            gridColumn: col.toString() + ' / span 1'
                        }}
                    />;

    else if(type === 3)
        result = <button 
                        ref={drag}
                        className={styles.z}
                        style={{ 
                            gridColumn: col.toString() + ' / span 1',
                            gridRow: row.toString() + ' / span 2'
                        }}
                    />;

    else if(type === 4)
        result = <button 
                        ref={drag}
                        className={styles.h}
                        style={{ 
                            gridRow: row.toString() + ' / span 1',
                            gridColumn: col.toString() + ' / span 2'
                        }}
                    />;

    else if(type === 5)
        result = <button 
                        ref={drag}
                        className={styles.ss}
                        style={{ 
                            gridRow: row.toString() + ' / span 2',
                            gridColumn: col.toString() + ' / span 2' 
                        }}
                    />;
    
    return result;
}
