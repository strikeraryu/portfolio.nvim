![Photo by UNIBOA on Unsplash](/assets/blogs/revamp/header.png)

The virtual world is getting bigger. Everything from rocket simulation to grocery shopping is virtual now, and now a new thing is getting added to this list.

Moving your furniture can be a tough job, and trying a new look on a virtual platform can give a new dimension and make it a little easier to do.

There are a few layers when you wish to give your room a new look. Usually, you want to add new furniture or move the old one to a new location, but it gets tricky when you want a perfect setting for your furniture or want to buy a new one that will perfectly fit in your room’s theme. But we can add a virtual element in this and make visualization easier.

---

## What ReVamp brings to the table?

In ReVamp, you can make a virtual element of your furniture using your camera.  
You can click on the object, and it will create a virtual overlay that you can move using your camera.  
It also allows you to use external images so you can use pictures of furniture you wish to buy to make the virtual overlay.

![Product](/assets/blogs/revamp/product.png)

---

## Technical view of ReVamp

I was working on this project and finished a software version of ReVamp using Python.

### ReVamp Demo  
![ReVamp Demo](/assets/blogs/revamp/demo.gif)

Let’s see how ReVamp works.

I used OpenCV to get the camera feed of the device or the IP cam for better quality. Using this, I get a continuous stream of frames that I use to extract the object.

### Connection with camera

Extracting the object from a picture is tricky, so I tried different approaches to do that.

![Connection with camera](/assets/blogs/revamp/camera-code.png)

---

## Flood fill with the color difference

I tried the flood fill algorithm with different color difference formulas.

- **Euclidean distance** was better for computer-generated images.  
- **Red Mean** was good for the pictures taken from the camera.

![Euclidean distance](/assets/blogs/revamp/euclidean.png)
![Red Mean](/assets/blogs/revamp/red-mean.png)

However, results were not ideal due to noise left in the image.

---

## Adding edge Detection

The next big step was adding edge-detection.  
I ran a flood fill algorithm with low Delta-e on edges and then drew contours on the result.  
This gave a mask of the object, which applied to the original image created the virtual overlay.

![Results after adding edge Detection](/assets/blogs/revamp/edge-detection.png)

There were flaws in this approach.

---

## Adding convolution filters and contour smoothing

To fix flaws, I added preprocessing using convolution filters.  
- **Smooth + edge enhance** filter worked best.  
- Added **contour smoothing** during mask creation.

- ![Results after adding convolution filters and contour smoothing](/assets/blogs/revamp/after-processing.png)

Though results improved, some images still failed.  
During my research, I found **BASNet**.

---

## Using BASNet

BASNet is a deep convolutional neural network for salient object detection.  
It gives accurate predictions with clear boundaries — perfect for our use case.

> “Deep CNNs provide state-of-the-art performance on salient object detection, focusing not just on region accuracy but boundary quality.”

![Results after using BASNet](/assets/blogs/revamp/basnet.png)

Using BASNet gave the best results for creating overlays.

---

## Interface / UI

To build the interface, I used **Pygame**.  
I avoided Tkinter to get more flexible UI features.  
I built my own UI library in Pygame and used **multithreading** to ensure smooth operation.

![ReVamp Demo](/assets/blogs/revamp/demo.png)
![Using external images](/assets/blogs/revamp/external.png)

---

## Using external images

I implemented basic functionality like:
- Creating overlays from external images
- Saving/loading overlays
- Camera functions
- Overlay editing functions

You can check out the project here: [GitHub - ReVamp](https://github.com/strikeraryu/ReVamp)

---

202011121010
