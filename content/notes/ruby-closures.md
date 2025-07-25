# Procs
- Dont hard check the arguments passed (flexible arity)
- Perform as code executed in the scope, So return will return the methods in which proc was executed
- It is a like a code block with memory management
- A object is associated with a method
```ruby
def generate_print_proc(num)
    Proc.new do
        puts num
    end
end

a = generate_print_proc(10)
b = generate_print_proc(20)
a.call # => 10
b.call # => 20
```

# Lambdas
- Hard checks on the args (strict arity)
- Perform as code executed in the scope of lambda, return will return from the lambda itself
- A object is associated with a method
eg.
```ruby
greet = ->(name) { puts "Hello, #{name}" }
greet.call("Ruby")  # => Hello, Ruby
```

# Blocks
- Anomymous code passed to the methods.
- No object associated with the code. It can be converted using &block
eg.
```ruby
def greet
  yield("Ruby")
end

greet { |name| puts "Hello, #{name}" }  # => Hello, Ruby
```

## Side notes
### Block to Proc
```ruby
def call_block(&block)
  block.call("Ruby")
end

call_block { |name| puts "Hello, #{name}" }  # => Hello, Ruby
```
### Symbol to Proc
```ruby
["a", "b", "c"].map(&:upcase)  # => ["A", "B", "C"]
# Equivalent to: .map { |x| x.upcase }
```

Refs: 


202504291515
