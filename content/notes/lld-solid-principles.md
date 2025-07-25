S - single responsibility: A class should have only one reason to change
O - open to extension and close to modification: Classes should be open for extension but closed for modification
L - liskov substitution: Subclasses should be substitutable for their base classes
I - interface segregation: Classes should be segregated into proper distributed interfaces so we dont need to implement extra stuff
D - dependency inversion: Classes should depend on abstractions interfaces rather than concrete classes


## S - single responsibility
Assume a class implements 2 different logic.
Like one logic to move a player and other logic to render a player. Now there are multiple reason where we might need change the class.
- if we move to a new render logic
- Or we change the logic to move a player

So ideally these should be handled by a separate class

```
wrong
class Enemy {
    void move() {
        // do something
    }

    void render() {
        // do something
    }
}

right
class Enemy {
    void move() {
        // do something
    }
}

class EnemyRenderer {
    void render() {
        // do something
    }
}
```

## O - open to extension and close to modification
If we make a class it should be extentable but we should not be such a case that we need to modify the class
Like in above case lets say create a enemy and implement a logic to move it. And then in future we got a requirement that we need to add another type of enemy.
No this get breaks the rule as we made a single class for the enemy so we need to modify it so it starts working with another type of enemy. To resolve this we can create a parent interface
Then create a child class that implements that interface for different enemy.

```
wrong
class Enemy {
    void 2dmove() {
        
    }

    // added later for supporting new enemy
    void 3dmove() {
        
    }
}

interface Enemy {
    void move();
}

class 2dEnemy implements Enemy {
    void move() {
        // do something
    }
}

class 3dEnemy implements Enemy {
    void move() {
        // do something
    }
}
```

## L - liskov substitution
This suggest child class should be able to replace the base class.
lets see to resolve above issue we create a base class enemy and implement 2 child class bowser, goomba(mushroom enemy in mario). Now in the interface we create a method attack, and move.
Now as we all now bowser attack the the player with flame, but goomba does not attack the player and just move but if we touch it we take damage. So now we have to change add the logic when ever attack method is used in goomba it should raise error.
Now this break the single responsibility principle as not we cant replace goomba class with the enemy class.
To resolve this we can remove the logic for attack from enemy and only keep the core logic.

```
wrong
interface Enemy {
    void attack();
    void move();
}

class Bowser implements Enemy {
    public void attack() {
        // do something
    }
    public void move() {
        // do something
    }
}

class Goomba implements Enemy {
    public void attack() {
        raise error("cant attack");
    }
    public void move() {
        // do something
    }
}

right
interface Enemy {
    void move();
}

class Bowser implements Enemy {
    public void attack() {
        // do something
    }
    public void move() {
        // do something
    }
}

class Goomba implements Enemy {
    public void move() {
        // do something
    }
}

```



## I - interface segregation
No we could I not raised a error in the attack method but just implemented it to do nothing. Now this breaks the interface segregation principle.
So the another way we could hace resolved this issue was creating 2 different interfaces for different enemy - aggressive enemy and passive enemy. 
Add attack method in one and not in the another.

```
wrong
interface Enemy {
    void attack();
    void move():
}

right
interface AggressiveEnemy {
    void attack();
    void move();
}

interface PassiveEnemy {
    void move();
}
```

## D - dependency inversion
No lets say we are implemented Enemy renderer and coded it to explicitly take passive enemy as input (basically set the data type for the attribute as passive enemy).
Now this is not correct as we can have any enemy so we should take Enemy as input and then handle the logic.

```
wrong
class EnemyRenderer {
    PassiveEnemy enemy;
    EnemyRenderer(PassiveEnemy enemy) {
        this.enemy = enemy;
    }
}

right
class EnemyRenderer {
    Enemy enemy;
    EnemyRenderer(Enemy enemy) {
        this.enemy = enemy;
    }
}
```

Refs: 


202410132341
