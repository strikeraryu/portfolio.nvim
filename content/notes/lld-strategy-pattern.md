# Strategy Pattern

## Problem Statement
- When we have a parent class which have multiple sub classes, And each subclass have some common behavior. Then there will be log of repeat code.
Eg.
```
Enemy
- move() # 1d movement

Goomba

Bowser
- move() # 2d movement

Boo
- move() # 2d movement
```

Now here Goomba and the same move as parent but bowser and boo both have same move. So here we have to repeat code and this can quickly increase as we scale

## Idea
The idea is to create a strategy interface which will be used by these class to perform the move.

```
interface MoveStrategy
- move()

1dMoveStrategy
- move()

2dMoveStrategy

Enemy
MoveStrategy move_strategy

Enemy(MoveStrategy _move_strategy)
move_strategy = _move_strategy

- move() {move_strategy.move()}

Goomba
Goomba()
super(new 1dMoveStrategy())

Bowser
Bowser()
super(new 2dMoveStrategy())

Boo
Boo()
super(new 2dMoveStrategy())

```


Refs: 


202411052335
