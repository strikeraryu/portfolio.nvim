# Virtual in C++
Allows us to get binding and calls for methods at runtime.
It have performant overhead. But allows us to use polymorphism on object level and more flexibility with objects.

Very specific, the object type should be knows to call specific functions.
```c++
#include <iostream>
#include <vector>
using namespace std;

class CreditCard {
public:
    void processPayment(double amount) { cout << "Processing Credit Card payment of $" << amount << endl; }
};

class PayPal {
public:
    void processPayment(double amount) { cout << "Processing PayPal payment of $" << amount << endl; }
};

class BankTransfer {
public:
    void processPayment(double amount) { cout << "Processing Bank Transfer payment of $" << amount << endl; }
};

int main() {
    CreditCard cc;
    PayPal pp;
    BankTransfer bt;

    cc.processPayment(100.0);
    pp.processPayment(200.0);
    bt.processPayment(150.0);

    return 0;
}
```

**Using Virtual Functions**
Allows us to get binding and calls for methods at runtime. More flexibility with the usage of objects.
```c++
#include <iostream>
#include <vector>
using namespace std;

class PaymentMethod {
public:
    virtual void processPayment(double amount) = 0;
};

class CreditCard : public PaymentMethod {
public:
    void processPayment(double amount) override { cout << "Processing Credit Card payment of $" << amount << endl; }
};

class PayPal : public PaymentMethod {
public:
    void processPayment(double amount) override { cout << "Processing PayPal payment of $" << amount << endl; }
};

class BankTransfer : public PaymentMethod {
public:
    void processPayment(double amount) override { cout << "Processing Bank Transfer payment of $" << amount << endl; }
};

int main() {
    vector<PaymentMethod*> payments;

    payments.push_back(new CreditCard());
    payments.push_back(new PayPal());
    payments.push_back(new BankTransfer());

    for (auto payment : payments) { payment->processPayment(100.0); }

    for (auto payment : payments) { delete payment; }

    return 0;
}
```


Refs: 


202504291428
