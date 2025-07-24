# TTY
TTY (teleypes) is device which was used to communicate with computer or other devices. like in 1869 it was used to distribute stock prices over long distance. It was just a typer which was connected with wire to a teletype printer.

On high level a process is called TTY when it directly interacts with the terminal. For example is we print a simple output using python without any redirection to a file or pipe then it is a TTY.
Same goes for input if it directly takes input from the terminal then it is a TTY.
```python
print(sys.stdout.isatty())

!python main.py # The output directly goes to the terminal
True

!python main.py > out # We are redirecting the output here
False

!python main.py | cat # We are pipeing the output here
False
```


## Evolution of TTY

### Early instance
When a user wanted to communicate with the computer they use a physical TTY to provide input this input was transmitter to a UART(unitary asynchronous receiver and transmitter). 
The os contains a UART driver for the physical transmission in bytes and handles few operation like parity check (check for data loss) and flow control.

User process <-> TTY <-> line discipline <-> UART driver <-> UART <-> Physical line <-> Terminal

Software - TTY, line discipline, UART driver
Hardware - UART, Physical line, Terminal

This made few operation difficult like removal of words. This could have been added to the application but it was not done due the unix design philosophy. 

#### Line Operation
So the OS provided edit buffer and few basic operation like backspace, delete work, remove line etc in the line discipline by default.
> note
> Advance application handle operation on its level and disable this feature by using the line discipline in raw mode.
Line discipline also provide character echoing(showing the character you pressed on the screen) and handling of carriage return (CR) and line feed (LF), different ways to handle end of line.

> note
> There multiple different line discipline and only one is connected to the serial device at a time and most common (default) line discipline is N_TTY (norma TTY). There are also other for the different use cases.


#### Session managment
In a computer system we want may want to run multiple program, Program should be able to run in BG, is some program in running endlessly we should be able to kill or terminate is. THe Input should be captured in the program which is running in FG.
OS provide this functionality in a TTY driver, `/drivers/char/tty_io.c`

> note
> By default the process running in BG can keep writing in the terminal without suspending. But we can change this nature using `stty tostop` and change it back to normal using `stty -tostop`

In an OS process can be ALIVE which mean it can perform operations, while a TTY is a passive object(with some data and methods) which mean it only perform action when called by some other component.


## Terminal Emulators
In every os there terminal which we interact with to perform multiple operations, is not a real terminal but a terminal emulator.
Terminal emulator run shell (bash, sh, zsh) which we use to perform commands.

The system have evolved and most of the components remain same but now there is no UART driver
![Diagram](https://www.linusakesson.net/programming/tty/case3.png)

And further the terminal emulation was move the the user space with the introduction of pseudo terminal(PTY).
![Diagram](https://www.linusakesson.net/programming/tty/case4.png)


## Process
A Linux process can be in one of the following states:

![Process states](https://www.linusakesson.net/programming/tty/linuxprocess.png)

|   |   |
|---|---|
|R|Running or runnable (on run queue)|
|D|Uninterruptible sleep (waiting for some event)|
|S|Interruptible sleep (waiting for some event or signal)|
|T|Stopped, either by a job control signal or because it is being traced by a debugger.|
|Z|Zombie process, terminated but not yet reaped by its parent.|

we can use `ps l` to check which process status(running and sleeping), if the process in sleeping it will be in wait queue(we can use WCHAN to get the wait queue info)
There are 2 types of sleep Interruptible sleep and uninterruptible sleep, most common is interruptible sleep. which get affected by the signal. 

STAT - provides details related to the process.
- s - session leader
- + - fg process

### Jobs, process and sessions
When we start a terminal we get a process of terminal session which will run a shell (a session leader) which will perform and spawn all the further action and process.
All the action and process will be in the context of that session. Now job is just like a group of processes.

**Job Control** When we do `ctrl+z` the process goes into a suspend job in that session and we can use jobs, fg, bg to interact with the job.

> note
>`<defunct>` are zombies process where there actions is completed but there parent have not killed them properly.

Every pipeline (commands combined together using |) is a job and it have to be controlled in a group. TTY keeps track of the FG process group id in a passive way means it is need to updated by the session leader.

### Example

#### Background process and signals
Let assume you are running vim and it is performing a large operation inside it (spellcheck) now when we press `ctrl+z` it will not wait for child process (spellcheck to end) but the line discipline will intercept the character and will send the suspend signal to the process group.
Now if we try to run vim in background using `bg` it will try to render the GUI to the TTY device but as the process is in background TTY device will not allow it and send the process back to suspend.

#### Flow control and I/O blocking
Lets start with a process `yes` which generate y at a very high rate. Now xterm wont be able to keep up with it and render every new y which is generated.
To manage this flow control is used (I/O blocking) when the kernel buffer of xterm is full, and `yes` tries to write in it it will be blocked and send to sleep until the xterm process write of some data from the buffer.

There is a similar behavior which is used FLow control where we can used `ctrl+s` and `ctrl+q` to start and stop the flow control for the output.
When we do `ctrl+s` it will stop the flow control but the process will keep generating the data which will be stored in the terminal memory buffer and once you do `ctrl+q` it will start the flow control and show all the output at once

Can try with the below script to see it in action
```
#!/bin/bash

counter=1
while true; do
  echo $counter
  counter=$((counter + 1))
  sleep 1
done

done
```

## TTY device in process
when you run `tty` it will tell which tty device you are using. eg `/dev/ttys002` `tty` mean teletyper, `s` mean a serial/pseudo terminal, `002` tells it is a second device for it.

## Some TTY commands
`stty -F /dev/ttys003 rows 40 columns 100` we can use this to change the row and columns for the TTY device.
`stty -a` this command can be use to get all info about TTY.
eg.
```
speed 38400 baud; 49 rows; 252 columns;
lflags: icanon isig iexten echo echoe echok echoke -echonl echoctl
        -echoprt -altwerase -noflsh -tostop -flusho pendin -nokerninfo
        -extproc
iflags: -istrip icrnl -inlcr -igncr ixon -ixoff -ixany -imaxbel iutf8
        -ignbrk -brkint -inpck -ignpar -parmrk
oflags: opost onlcr -oxtabs -onocr -onlret
cflags: cread cs8 -parenb -parodd -hupcl -clocal -cstopb -crtscts
        -dsrflow -dtrflow -mdmbuf
cchars: discard = ^@; dsusp = ^@; eof = ^D; eol = <undef>;
        eol2 = <undef>; erase = ^?; intr = ^C; kill = ^U; lnext = ^V;
        min = 1; quit = ^\; reprint = ^R; start = ^Q; status = ^@;
        stop = ^S; susp = ^Z; time = 0; werase = ^W;
```
`stty -echo; cat` now this will run the cat commant with the char echoing off turned off. so when you will type something in the terminal it will not be echoed.
`stty tostop` this will change the behavior of the TTY device and the process will suspend when you process tries to write something in the terminal
`stty -tostop` to undo the above change (will not suspend when process write something in the terminal)


Refs: 
[BLOG: The TTY demystified](https://www.linusakesson.net/programming/tty/)


202409221527
