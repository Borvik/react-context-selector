# react-component-library

A bare bones component library for react, used to jumpstart the creation of a react component library.

It includes a demo app for testing your component as you build it, the demo app is run with webpack dev server and supports (will support) Fast Refresh/Hot Reloading.

The folder `src/library` should contain your actual library code. This is what gets built for publishing (the demo app gets ignored).

Because of the number of different ways styles can be imported into any given React app, I felt it best to keep it simple and just provide a single stylesheet as an output that others could import.  Normal stylesheets also allow the best capability to override the styles (vs class names being generated) - which was the whole point of Cascading Style Sheets.

**DO NOT** import styles inside of library (js/ts) code. When built those imports would stick around, and could cause issues in application that use the component (depending on how they do their styles).

Webpack _could_ be used to build the library and handle the styles, but it adds unnecessary boilerplate code that will just get duplicated in the consuming application (most packer libraries include their own boilerplate in some form or another).