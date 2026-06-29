# PointForge User Guide

Welcome to the PointForge User Guide.

PointForge is an open source, browser-based 3D Point Cloud and Gaussian Splat Editor. You can use it to view, inspect, transform, combine, crop, clean up and optimize 3D Gaussian Splats.

## Installing PointForge

PointForge is a web app so you do not need to install it. Simply point your browser at:

https://YaeSakura923.github.io/PointForge

However, for your convenience, you can also install PointForge as a PWA (Progressive Web App). This will make PointForge appear and behave more like a native application. An app icon for PointForge will be generated on your desktop or home screen. Furthermore, .ply files will be associated with the PointForge PWA, enabling you to launch PointForge more quickly.

## Loading Splats

PointForge loads splats from .ply and .spz files. Only files containing 3D Gaussian Splat data can be loaded. If you attempt to load any other type of data from a .ply file, it will fail.

There are three ways that you can load a .ply file:

1. Drag and drop one or more .ply files from your file system into PointForge's client area.
2. Select the `Scene` > `Open` menu item and select one or more .ply files from your file system.
3. Use the `load` query parameter. This is in the form: `https://YaeSakura923.github.io/PointForge?load=<PLY_URL>`. An example would be:

    https://YaeSakura923.github.io/PointForge?load=https://raw.githubusercontent.com/willeastcott/assets/main/dragon.compressed.ply

    This is a useful mechanism for sharing splats with other people (say on social platforms like X and LinkedIn).

## Saving Splats

To save the currently loaded scene, select the `Scene` > `Save` or `Save As` menu items. This will save a `.ply` file to your file system.

PointForge can also export to two additional formats via the `Scene` > `Export` sub-menu:

* **Compressed Ply**: A lightweight, compressed format that is far smaller than the equivalent uncompressed .ply file. It quantizes splat data and drops spherical harmonics from the output file.
* **Splat File**: Another compressed format, although not as efficient as the compressed ply format.

## Controlling the Camera

The camera controls in PointForge are as follows:

| Control                                         | Description                     |
| ----------------------------------------------- | ------------------------------- |
| Left Mouse Button / Shift + Right Mouse Button  | Orbit camera                    |
| Middle Mouse Button / Alt + Right Mouse Button  | Dolly camera                    |
| Right Mouse Button                              | Pan camera                      |
| Left/Right Arrow Keys                           | Strafe camera left/right        |
| Up/Down Arrow Keys                              | Dolly camera forwards/backwards |
| F Key                                           | Frame selection                 |

To set the target point for orbiting the camera, double click anywhere in the 3D view.

## Visualizing Splats

Splats can be rendered in two 'modes':

* **Centers Mode**: A blue dot is rendered at the center of each Gaussian.
* **Rings Mode**: A ring is rendered at the outer boundary of each Gaussian.

You can disable rendering of the centers or rings (depending on the active mode) by pressing Space. This allows you to view the scene as it would normally appear.

You can control the pixel size of the center dots in the VIEW OPTIONS panel.

## Selecting and Deleting Splats

Cropping splats or deleting unwanted Gaussians is a key function of PointForge. To help with this, there are multiple selection tools available:

* **Rect Select**: Click and drag to select splats in a rectangular area.
* **Brush Select**: Click and drag a selection circle. Change the brush size with the `[` and `]` keys.
* **Lasso Select**: Draw a freeform selection boundary.
* **Polygon Select**: Click to define polygon vertices for selection.
* **Sphere Select**: Activate a sphere volume to add or remove splats from the current selection.
* **Box Select**: Activate a box volume for 3D selection.
* **Flood Select**: Select connected regions based on spatial proximity.
* **Eyedropper Select**: Select splats by color similarity.

Once you are happy with your selection, you can delete it with the Delete key.

## Transforming Splats

PointForge can translate, rotate and scale splats. To do this, select a splat in the Scene Manager and activate one of the gizmos via the horizontal icon bar.

To achieve fine grain control over the transform of the selected splat, you can use the TRANSFORM panel.

## Merging Splats

It is possible to merge multiple .ply files together and output a single, combined .ply file. Simply load any number of .ply files into Scene Manager, perform whatever transformations and edits you require, and then save the result via the `Scene` > `Save` menu item.

## Inspecting Splat Data

The Data Panel can be used to analyze the contents of your splat scenes. Initially, it is collapsed at the bottom of the application's window. To open it, click on the panel's header or press the 'D' key.

The Data Panel plots various scene properties on a histogram display. You can select splats directly by dragging on the histogram view. Use the Shift key to add to the current selection and the Ctrl key to remove from the current selection.
