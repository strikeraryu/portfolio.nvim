# Java Memory
Java Memory is it part of JVM. Used for memory management in the program
Java has two types of memory
- Heap
- Stack

## Stack
It is used to for static allocation store locally scoped primitive data types and methods calls, it is fast and limited. It removes the object once the scope ends.
It store the function call stack. which store which function to return to after the execution of the function

## Heap
It is used to for dynamic allocation. To store instances of classes and objects. It is slow but large. And managed by garbage collector. We can access object in head memory from anywhere, until the reference exists.
- So when a reference is removed for a object in heap memory. It is no more required and therefor can be removed. So when there is no pointer to the object in heap memory. It is removed by the garbage collector
- Static variables are stored in heap memory


```java
public static Main {

    class A {
        int a = 4; // Part of the heap memory of the object

        int add(int a, int b) { // Part of the stack memory
            return a + b;
        }
    }
    public static void main(String[] args) {
        int a = 10; // a variable in stored in stack memory

        A a1 = new A(); // a1 variable in stored in stack memory, but it stores the reference of memory address for the Class A which is in heap memory
        int b = a1.add(a, 5); // b variable in stored in stack memory

        System.out.println(b);
    }
}
```

main Stack Memory
b|15
a1|<#3243> // memory address
a|10

add Stack Memory
b|5
a|10

Heap Memory
Object of A on <#3243>
a|4
add()


### Java String Pool
String Pool is a part of Java heap memory. It is used to store the String literals.
In java string object are immutable. This is done to save memory, when multiple variables holds same string.

```java
public static void main(String[] args) {
    String s1 = "Hello";
    String s2 = "Hello";
}
```

Both s1 and s2 will point to a single object in string pool(heap memory) which stores the string "Hello". As both are pointing to the same object, we need to make sure that the string is immutable.
But if we explicitly creates a new object, it create a new object in heap memory.

```java
public static void main(String[] args) {
    String s1 = "Hello";
    String s2 = "Hello";
    String s3 = new String("Hello");

    // it compares the memory address
    System.out.println(s1 == s2); // true
    System.out.println(s1 == s3); // false
}
```
And when we do s2="New String", it is not that string are mutable. But now s2 starts pointing to a new object in heap memory.

### Garbage Collector
When object in heap memory are no more referenced. It is removed by the garbage collector. This help use insure there is no memory leak.
- When ever GC runs it stops the code execution.

Garbage collector does 2 steps - Mark and Sweep
- Mark it marks which objects are still in use (referenced by someone)
- Sweep it removes which objects are not in use and moves between segments like eden to survivors and so on

This marking and sweep can start taking more time as object increase. And there can be chance we objects are remain in use for long time like global variables.
Now this will increase unnecessary time for mark and sweep. To handle this java move objects which have lived multiple mark-sweep cycle. To old-generation.
So when a new object is created, it is stored in new-generation and then moved to old-generation when it survive few mark-sweep cycle.

#### Young Generation (Minor GC)
Have 3 parts
- Eden `<-` (new object get stored in eden)
- Survivors (we sweep into survivors, when they survive a sweep cycle alternate between S0 and S1, and increase the age)
    - s0 
    - s1

#### Old Generation (Major GC)
After a threshold of age is reached, it is moved to old generation. And GC happens here less often.

*Other GC ALGO*
- Marker Sweep Compact - Same as mark and sweep. But it move the objects to fill the gap so it is more sequential order and free a large chunk of memory.

**Version of GC**
- Serial GC
- Parallel GC
- Concurrent GC (Try to clean up as much as possible, without blocking the thread but not guaranteed and no compaction)
- G1 GC (Better version of concurrent GC with compaction and guarantee)

## Non-Heap (metaspace)
It is used to store meta information about the class. And it is expanded as needed.

Refs: 


202411092347
