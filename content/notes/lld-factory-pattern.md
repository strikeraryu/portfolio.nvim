# Factory Pattern
This pattern is used to create objects without exposing the creation logic to the client. 
Use case: If we have a define logic to create different objects of different class and now we are using this logic at multiple places.
To handle this we can create a factory class which will return the object. Based on some business logic.


```
class PaymentService
pay();

class Neft < PaymentService
pay(){}

class demand_draft < PaymentService
pay(){}

class cod < PaymentService
pay(){}

class PaymentServiceFactory
get_payment_service(string type, int amount)
{
    // some logic

    // return different payment service object from (Neft, demand_draft, cod)
}
```

# Abstraction Factory Pattern
This goes one level further and this is a factory which generates different factories which will return different objects.


Refs: 


202411161712
