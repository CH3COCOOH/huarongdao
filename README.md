# 华容道

用React实现的华容道  
[在线demo](https://xuehuan.cloudns.be)

## TODO

1. 优化Board.js中的代码逻辑
2. 用图的深度(广度)优先算法实现自动求解

## 算法

将布局用一个长度为4x5的一维数组来表示，每个数字代表一个格子  
0表示空位  
1表示占位符  
2表示兵  
3表示竖的棋子  
4表示横的棋子  
5表示曹操  

## 项目结构

### Game.js

华容道的底层实现逻辑  

变量

> **levelRef**(useRef: int) 当前关卡  
> **layout**(useState: array(int)) 布局数组  
> **layoutRef**(useRef: array(int)) 布局数组  
> **nextStepRef**(useRef: dict) 记录各个棋子下一步可移动的字典  
> 字典的key为type + col + row  
> **statusRef**(useRef: bool) 记录游戏是否胜利  
> **historyRef**(useRef: array) 记录历史布局, 用于撤回  
> **numStepRef**(useRef: int) 记录步数

函数

> **analyze()** 用于判断各个棋子下一步可移动的位置  
> **analyze_impl2(i) -> array(int)** 判断兵的下一步可移动的位置  
> i(int): 当前棋子的位置  
> **analyze_impl3(i) -> array(int)** 判断竖棋子的下一步可移动的位置  
> i(int): 当前棋子的位置  
> **analyze_impl4(i) -> array(int)** 判断横棋子的下一步可移动的位置  
> i(int): 当前棋子的位置  
> **analyze_impl5(i) -> array(int)** 判断曹操的下一步可移动的位置  
> i(int): 当前棋子的位置  
>
> **move(type, oldCol, oldRow, toCol, toRow)** 移动棋子  
> type(int): 棋子类型  
> oldCol(int): 棋子原来的列  
> oldRow(int): 棋子原来的行  
> toCol(int): 棋子新的列  
> toRow(int): 棋子新的行
>
> **canMove(type, oldCol, oldRow, toCol, toRow) -> bool** 判断是否可以移动棋子  
> type(int): 棋子类型  
> oldCol(int): 棋子原来的列  
> oldRow(int): 棋子原来的行  
> toCol(int): 棋子新的列  
> toRow(int): 棋子新的行  
>
> **isWin() -> bool** 判断是否胜利  
> **undo()** 撤销操作  
> **restart()** 重新开始  
> **select(level)** 选择关卡  
> level(int): 关卡

传递给Board的props

> layout = layout 布局数组  
> move = move 移动函数  
> undo = undo 撤销函数  
> num = numStepRef.current 步数  
> restart = restart 重新开始函数  
> canMove = canMove 判断是否可以移动函数  
> select = select 选择关卡函数  
> isWin = statusRef.current 游戏状态  

### Board.js

华容道的图形渲染

### Board

变量

> **showSidebar**(useState: bool) 是否显示侧边栏  
> **layout**(array(int)) 接受Game的布局数组props  
> **board**(array(Square)) 棋子数组  
> **isMobile**(bool) 设备是否为手机  
> **width**(int) 华容道背景图片宽度  
> **height**(int) 华容道背景图片高度  

函数

> **drop()** 拖动放置函数  
> **location(offset, oldValue, maxValue) -> int** 计算拖动放置的位置  
> offset(int): 拖动偏移量  
> oldValue(int): 旧的行(列)值  
> maxValue(int): 行(列)最大值  
> **toBoard(layout) -> array(Square)** 将布局数组转换为棋子数组  
> layout(array(int)): 布局数组  
> Square的key: type + col + row  
> **openSide()** 打开侧边栏  
> **closeSide()** 关闭侧边栏  

传递给Square的props

> type 棋子的种类  
> col 棋子的列  
> row 棋子的行  

传递给Selector的props

> select = props.select 选择关卡函数  
> name css的className  

### Selector

变量

> **levelRef**(useRef: int) 当前关卡  
> **levelbtnarr**(array(LevelButton)) 关卡按钮数组  

函数

> **handleClick(id)** 按钮点击事件  
> id(int): 按钮代表的关卡数  

### Square.js

华容道棋子的渲染

变量

> **col**(int) 棋子的列  
> **row**(int) 棋子的行  
> **type**(int) 棋子的种类  

函数

> **drag()** 拖动函数  

### Level.js

用来保存各关卡的初始布局
