# Ruby
```
Class.class # => Class
Class.superclass # => Module
Module.class # => Class
Module.superclass # => Object
Object.class # => Class
Object.superclass # => BasicObject
BasicObject.class # => Class
```
Everything in ruby is a object of some class and Object by itself is a class.

> What came first Class or Object?

In other languages class are blueprint for there objects. In ruby things are little different.

As we now in ruby there is no such things as method, we just send messages to the Class with some args.
And class response with some data.

Keeping the same philosophy lets consider in ruby Class are not blueprints but a map.

- To define the type of the class we just define a key in that map where the value is there class.
- Similarly superclass is also a key in that map.

They how ruby works they when we call a method it first looks for the type key and which give us its class. Then we can look for the method and responds to that. 
When we didn't find something in that class we goes to the superclass key find that class and now look for amethod in that.

```ruby
Class A
    def method_o
    end

    def self.method_c
    end
end
```

It representation will look like
```ruby
A = {
    class: {
        type: "Class",
        method_c: <how to respond?
    },
    superclass: "Object" 
}
```
SO on...
```ruby
a = A.new

a = {
    class: {
        type: "A",
        method_o: <how to respond?
    },
}
```

```ruby
Class B < A
end

B = {
    class: {
        type: "Class"
    }
    superclass: "A"
}
```

```ruby
Object = {
    class: {
        type: "Class"
    },
    superclass: "BasicObject"
}
```

Piece of ruby code for which we created the analogy
```c
void
Init_class_hierarchy(void)
{
    rb_cBasicObject = boot_defclass("BasicObject", 0);
    rb_cObject = boot_defclass("Object", rb_cBasicObject);
    rb_vm_register_global_object(rb_cObject);

    /* resolve class name ASAP for order-independence */
    rb_set_class_path_string(rb_cObject, rb_cObject, rb_fstring_lit("Object"));

    rb_cModule = boot_defclass("Module", rb_cObject);
    rb_cClass =  boot_defclass("Class",  rb_cModule);
    rb_cRefinement =  boot_defclass("Refinement",  rb_cModule);

#if 0 /* for RDoc */
    // we pretend it to be public, otherwise RDoc will ignore it
    rb_define_method(rb_cRefinement, "import_methods", refinement_import_methods, -1);
#endif

    rb_const_set(rb_cObject, rb_intern_const("BasicObject"), rb_cBasicObject);
    RBASIC_SET_CLASS(rb_cClass, rb_cClass);
    RBASIC_SET_CLASS(rb_cModule, rb_cClass);
    RBASIC_SET_CLASS(rb_cObject, rb_cClass);
    RBASIC_SET_CLASS(rb_cRefinement, rb_cClass);
    RBASIC_SET_CLASS(rb_cBasicObject, rb_cClass);

    ENSURE_EIGENCLASS(rb_cRefinement);
}
```

We can see first the inheritance chain is made and then we define the class for everything.

Refs: 
- [mental model for ruby](https://techconative.com/blog/ruby-class-mental-model/)


202410091000
