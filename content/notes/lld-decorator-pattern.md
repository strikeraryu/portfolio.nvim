
# Decorator Pattern
The idea of decorator pattern is to add new functionality to an existing object without modifying its structure.

For example you have pizza and you want different toppings. Now pizza can be the base class but toppings can be anything for a list of toppings.
Now creating class for every combination of toppings is very tedious. So we can use here decorator pattern.

```

## Base Class
Class Pizza: # abstract class
get_cost();

Class Margharita < Pizza:
get_cost() {
    return 100;
}

Class Hawaiian < Pizza:
get_cost() {
    return 200;
}

## Decorators
Class Toppings < Pizza:
Pizza pizza;

Class CheeseTopping < Toppings:
CheeseTopping(pizza) {
    this.pizza = pizza;
}
get_cost() {
    return this.pizza.get_cost() + 10;
}

Class OlivesTopping < Toppings:
OlivesTopping(pizza) {
    this.pizza = pizza;
}
get_cost() {
    return this.pizza.get_cost() + 20;
}


## Usage

Pizza pizza = new Margharita();
pizza = new CheeseTopping(pizza);
pizza = new OlivesTopping(pizza);
```


Refs: 


202411161457
