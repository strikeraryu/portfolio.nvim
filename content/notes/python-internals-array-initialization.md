## Different ways

In python there are different ways to intialize an array.
```python
a = [0] * 3
b = [0, 0, 0]
c = [0 for i in range(3)]
```

All give a single result `[0, 0, 0]`, but if we do

```python
print("A size", sys.getsizeof(a)) // 80
print("B size", sys.getsizeof(b)) // 120
print("C size", sys.getsizeof(c)) // 88
```

## What is happening?

### Basic idea
Python in a interpretor based language, and all code first compiled to a bytecode and the execute. There are different way to generate this bytecode - cPython, Jython, PyPy, etc.
Python by default use the cPython interpreter.

we can use `dis` library to see what the bytecode is doing.
```python
import dis

dis.dis('[0] * 3')
dis.dis('[0, 0, 0]')
dis.dis('[0 for i in range(3)]')
```

If we will look the bytecode we will get 3 different instructions.

To create list python manage a c struct which store a metadata of 56 bytes and list of memory address of 8 bytes to the original entries.

**Some Background:**
When we create dynamic size array and add new element in it we dont just find memory of n+1 size everyTime and move the element to the next position. As then we have to copy the result into the new memory.
This will increase the complexity to o(n) of just adding the elements

So when we add elements and the limit of size is reached we find new memory local of some offset n size (can be n*2, n+OFFSET...) or any way. 
So lets the array reached limit at 2, it not necessary the new size is 3, it can be anything based on the logic of resizing.


#### For `[0] * 3`
To create this array cPython uses BINARY_MULTIPLY instruction.
In this it knows the size of the array. `current_size * multiplier`, so when python intialize the new array it intialize of the exact size. Therefore `56 + 8*3 = 80`

#### For `[0, 0, 0]`
For creating this array cPython uses LIST_EXTEND instruction.
In this it perform operation of list_resize(3) which create a new array of size 8. Therefore `56 + 8*8 = 120`

it uses this for finding new size
```c
/*
* Add padding to make the allocated size multiple of 4.
* The growth pattern is:  0, 4, 8, 16, 24, 32, 40, 52, 64, 76, ...
*/
new_allocated = ((size_t)newsize + (newsize >> 3) + 6) & ~(size_t)3;
(3 + 0 + 6) & 3 = 9 & 3 = 8
```

#### For `[0 for i in range(3)]`
For creating this array cPython uses LIST_APPEND instruction.
Which also at its core perform list_resize only, But the difference is as the final size might not be known it do it one by one.
list_resize(1) > list_resize(2) > list_resize(3)

Therefore for list_resize(1) we will get.
`(1+0+6) & 3 = 7 & 3 = 4`

And adding 3 elements never reaches the limit of 4, therefore it results into `56 + 8*4 = 88`

Refs: 
[Science behind Arrays Initialization](https://freedium.cfd/https://medium.com/frontend-canteen/interviewer-what-is-the-difference-between-0-3-and-0-0-0-in-python-f642a0c93a11)


202410220851
