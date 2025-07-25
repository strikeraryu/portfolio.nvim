# Bridge Pattern
It is a structural pattern that allows different entities to work together. Without creating support for each entity. One entity can intercat with other entity over a common bridge.

Like how GUI of a software create bridge to different APIs to abstract the implementation from GUI.


```
class MarioGame {
    controller Controller;

    MarioGame(Controller controller) {
        this.controller = controller;
    }

    move() {
        if(controller.left()) {
            // move left
        }
        ...
    }
}

class TetrisGame {
    controller Controller;

    TetrisGame(Controller controller) {
        this.controller = controller;
    }

    move() {
        if(controller.left()) {
            // rotate left
        }
    }
    ...
}


class Ps5Controller extends Controller
left();
right();
up();
down();
microphone();

class NitendoController extends Controller
left();
right();
up();
down();

interface Controller {
    left();
    right();
    up();
    down();
    microphone();
}
```

Refs: 


202505190900
