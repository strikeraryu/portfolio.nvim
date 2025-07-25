
# Modular Multiplicative Inverse
Modular Multiplicative Inverse of number A with mod M, mean a number that can be multiplied with A and then mod M will be 1.
ModInv only exists when A and M are relatively prime.

```
<> = congruent
A * A^-1 <> 1 (mod M)
or
(A * A^-1) mod M = 1
```

**Note:** `1 <= A^-1 < (M-1)`


# Finding Modular Multiplicative Inverse

## Bruce Force
One way to find modular multiplicative inverse is to try all value between the range.
```c++
int modInverse(int A, int M){    
    for(int i = 1; i < M; i++){
        if((i * A) % M == 1){
            return i;
        }
    }

    return -1;
}
```

## Little Fermat Theorem
Considering M is a prime number.

```math
A ^ (M - 1) mod M = 1 (A ^ (M - 1) <> 1 mod M)

If we take A common
(A * A ^ (M - 2)) mod M = 1

Using modulo properties
((A mod M) * (A ^ (M - 2)) mod M) mod M = 1

Using -> (A * A ^ -1) mod M = 1

(A ^ (M - 2)) mod M = A ^ -1
```

`(A ^ (M - 2)) mod M = A ^ -1` This is basically modulo power and we have algorithm to calculate this, eg. binary exponentiation.
There using that we can find modular multiplicative inverse.

**Note**: It can be used to detect prime numbers


# Use case

```
a * b mod m = ((a mod m) * (b mod m)) mod m
(a + b) mod m = ((a mod m) + (b mod m)) mod m

but
a/b mod m != ((a mod m) / (b mod m)) mod m

a/b mod m = ((a mod m) * (b^-1 mod m)) mod m

where b^-1 is modular multiplicative inverse of b
```


Refs: 


202502271513
