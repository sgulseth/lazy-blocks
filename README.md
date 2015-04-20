# Lazy Blocks

Small library that lets you lazy-load chunks of html in html comments.


### Use
Define the markup you want to lazy-load inside <!-- and --> you also have to manually define the height with css since the markup is not rendered by the browser before the its in the users viewport.

`<div class="lazy-element" style="height:1000px; width: 300px"><!-- <p>This content is lazy-loaded and not rendered before its needed</p> --></div>
<div class="lazy-element" style="height:500px; width: 300px"><!-- <p>This content is lazy-loaded and not rendered before its needed</p> --></div>`

Insert the lazy-block.js script from the dist folder.
`var Lazy = new LazyBlocks({
  elements: document.querySelectorAll('.lazy-element')
}).execute();`

Open the dev tools and see the browser renders the content when you scroll. See the examples/blocks.html for more information.


### API
LazyBlocks accepts the following params:

- `elements: An array of elements to lazy-load *required`
- `threshold: You can modify the threshold for when the lazy-loader kicks in, default: 100px`
- `throttle: throttle the callback to check if elements are visible, default: 500ms`
- `aboveTheFold: If the user refreshes, or a element is dynamically added, and the element(s) are above the users viewport should we render this? default: false`
- `callback: define a custom callback to not load html comments. See dist/lazy-block.js for the default callback function`

`new LazyBlocks({...})` returns an object with the following prototype:

- `execute(): this is the function which checks if elements are within viewport, this is executed with throttle on scroll`
- `detach(): Detaches the lazy-loaders and call the callbacks for all the elements`
- `addElement(el[, params]): add a new element to the current lazy loader. The first argument must be a DOMNodeElement. You can also pass a custom params with the above options, if this is not passed the options from initialization is used.`

#### Bonus:
Since its callback based you can easily add a different lazy loader, ie. image lazy-loading. See the examples/ folder for how to use LazyBlock to render images lazy. 


### Collaborators
- [Sindre Gulseth](https://github.com/sgulseth)
- [Mads Forberg](https://github.com/forberg)
