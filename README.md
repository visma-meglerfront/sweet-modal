# SweetModal

alert, confirm, prompt and Modal - only better!

![Some variants](http://bfx.re/faYw/sweetModal-overview.png)

## Usage

Install SweetModal through bower **or** npm:

    npm install sweet-modal
    bower install sweet-modal
    
You can also install it manually by [downloading a release archive](https://github.com/adeptoas/sweet-modal/releases).

Reference these files in your HTML:

```html
<link rel="stylesheet" href="path/to/sweetmodal/dist/min/jquery.sweet-modal.min.css" />
<script src="path/to/sweetmodal/dist/min/jquery.sweet-modal.min.js"></script>
```

## Examples

For examples, refer to [the demo page](http://sweet-modal.adepto.as).

## Browser compatibility

SweetModal should work in most major browsers:

- IE11
- Safari 6+
- Firefox 4+
- Chrome 20+
- Opera 15+
- Microsoft Edge

## Contribution

1. Fork the repository
2. Install `grunt-cli`, `browserify` and `coffee-script` globally via npm
3. Run `node server` and `grunt watch` in two separate terminal tabs while developing. You can reach the example site for development at `http://localhost:5000`
4. When you're done, run one final `grunt` command and commit your work for a pull request.

### Guidelines

- tabs for indentation, 1 tab = 4 spaces
- no inline JavaScript in CoffeeScript files
- camelCase function names
- _camelCase for private functions
- no curly brackets for objects
- always brackets around function calls, except typeof
- document your functions!

