# Metaprogramming
It a concept that allows you to write code dynamically at runtime.

## Ruby Internals [ruby-class-paradox](00-zettelkasten/ruby-class-paradox.md)
In ruby everything is a object of something even the classes are objects of class `Class`.

```ruby
class A
    def self.a
    end

    def b
    end
end
```
Here `a` is method of class and b is a method if class instance/object.
In ruby everything executes on some object which is self and ruby keep tracks for it on each line. The self stores some object where the method on which the method will be executed.

```ruby
class A
    p self
end

# A

class A
    def a
        p self
    end
end

A.new.a

# #<A:0x0000000102f1fbf0>
```

## Metaclass
In ruby every object have its own metaclass which we can manipulate it.

```ruby
s = "This is a string"

def s.upcase
    "UPPERCASE"
end

p s.upcase

# UPPERCASE
```
The method we added will only be available to this object only.

This can be used to achive same this in multiple ways
```ruby
class A
    def self.a
        p "a"
    end
end

def A.a
    p "a"
end

class A
    class << self
        def a
            p "a"
        end
    end
end
```

## Eval
- class_eval
- instance_eval

We can use this to create methods on classes and objects

```ruby
class A
end

A.instance_eval do
    p "instance_eval " + self.to_s
    def a
        p "inside " + self.to_s
    end
end
# instance_eval A

A.a
# inside A
```

this create a singleton method for that object. As a class in a singleton object therefore it will be same as class method.

```ruby
class A
end

A.class_eval do
    p "instance_eval " + self.to_s
    def a
        p "inside " + self.to_s
    end
end
# instance_eval A

A.a
# inside #<A:0x0000000102f1fbf0>
```

class_eval run in context of the class, just like reopening the class and creating methods.

# Method missing and define method
When some method is called ruby first search in the metaclass and then search in its class for instance method. If not found goes down in the inheritance chain to find the method. once not found anywhere it calls method missing which is a instance method of kernel object.

Similarly we have define method which ia method defined in Module class.

define method is another way to create methods for the class
```ruby
class A

  ["a", "b"].each do |method|
    define_method "letter_#{method}" do
      p "letter " + method.to_s
    end
  end
    
end
```

We can also use method missing to perform some action when some method is not found. And using define_method we can create methods in the fly (runtime)

Refs: 
- [ruby-meteprogramming-toptal](https://www.toptal.com/ruby/ruby-metaprogramming-cooler-than-it-sounds)


202410090932
