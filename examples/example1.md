# Test Document

## Status Tags Demo

### Basic Status Tags

<!-- Status tags with default colors -->

((tag|todo)) ((tag|planned)) ((tag|in-progress)) ((tag|doing)) ((tag|done)) ((tag|tip)) ((tag|on-hold)) ((tag|tbd)) ((tag|proposed)) ((tag|draft)) ((tag|wip)) ((tag|mvp)) ((tag|blocked)) ((tag|canceled)) ((tag|error)) ((tag|warning)) ((tag|warn))

### Custom Label Tags

<!-- Tags with custom labels and default colors -->

((tag|custom label)) ((tag|custom label|grey)) ((tag|custom label|orange)) ((tag|custom label|green)) ((tag|custom label|blue)) ((tag|custom label|purple)) ((tag|custom label|red)) ((tag|custom label|yellow))

## Arrow Tags Demo

### Arrow Status Tags

<!-- Arrow-style tags with default colors -->

((<tag|todo)) ((<tag|planned)) ((<tag|in-progress)) ((<tag|doing)) ((<tag|done)) ((<tag|tip)) ((<tag|on-hold)) ((<tag|tbd)) ((<tag|proposed)) ((<tag|draft)) ((<tag|wip)) ((<tag|mvp)) ((<tag|blocked)) ((<tag|canceled)) ((<tag|error)) ((<tag|warning)) ((<tag|warn))

### Custom Arrow Labels

<!-- Arrow tags with custom labels and default colors -->

((<tag|custom arrow)) ((<tag|custom arrow|grey)) ((<tag|custom arrow|orange)) ((<tag|custom arrow|green)) ((<tag|custom arrow|blue)) ((<tag|custom arrow|purple)) ((<tag|custom arrow|red)) ((<tag|custom arrow|yellow))

## Custom Color Tags Demo

### Hex Color Customization

<!-- Tags with custom background and foreground colors -->

((tag|mvp|#008000)) ((tag|mvp||#90ee90)) ((tag|mvp|#008000|#90ee90))

### Mixed Color Customizations

<!-- Demonstrates various combinations of custom background and foreground colors -->

((tag|custom bg|#007bff)) ((tag|custom fg||#ff1493)) ((tag|custom colors|#007bff|#ff1493))

### Complex Tag Styling

<!-- Examples with specific styling combinations to test edge cases -->

((tag|long label for testing|#222222|#ffffff))
((tag|no-bg|)) ((tag|only-fg||#ff6347))

## Mixed Usage and Custom Labels

### Combination of Styles and Labels

<!-- Tests various combinations of arrows, custom colors, and labels -->

((tag|normal)) ((<tag|arrow only)) ((tag|bg only|#1e90ff)) ((<tag|fg only||#ff69b4)) ((tag|all styles|#8a2be2|#ffdab9))

## Slash Separator

### Same Tags with `/`

<!-- Every form should render identically to its | equivalent above -->

((tag/todo)) ((tag/done)) ((<tag/in-progress)) ((tag/custom label)) ((tag/custom label/blue)) ((tag/mvp/#008000)) ((tag/mvp//#90ee90)) ((tag/mvp/#008000/#90ee90)) ((<tag/custom arrow/purple))

### Mixed Separators

<!-- Both separators in one tag: the plugin accepts either between each field -->

((tag|custom/blue)) ((tag/custom|blue)) ((<tag|custom/red|#ffffff))

## Case and Validation

### Case Insensitivity

<!-- Label and color names are matched without regard to case -->

((tag|TODO)) ((tag|Done)) ((tag|custom|BLUE)) ((tag|custom|Orange)) ((tag|custom|#FF0000))

### Short Hex Colors

<!-- 3-digit hex colors are valid -->

((tag|short hex|#f00)) ((tag|short hex|#0f0|#000)) ((tag|short hex||#00f))

### Invalid Colors Fall Back to Grey

<!-- Unknown names and malformed hex values must not break the tag -->

((tag|bad color|notacolor)) ((tag|bad hex|#12)) ((tag|bad hex|#12345g)) ((tag|bad hex|ff0000)) ((tag|bad fg|#008000|notacolor))

### Empty Fields

<!-- Empty background and foreground slots -->

((tag|empty bg|)) ((tag|empty both||)) ((tag|only fg||#ff6347))

## Labels

### Labels with Special Characters

<!-- Characters that need HTML escaping must show exactly as typed -->

((tag|R&D)) ((tag|a < b)) ((tag|"quoted")) ((tag|it's done)) ((tag|50% done)) ((tag|v1.2.3))

### Labels with Unicode and Spaces

((tag|café)) ((tag|日本語)) ((tag|✅ shipped)) ((tag|two spaces)) ((tag| leading space))

### Long Labels

((tag|a very long label that goes on for quite a while to check wrapping and sizing behaviour))

## Spacing and Adjacency

### Tags Without Spaces Between

((tag|todo))((tag|doing))((tag|done))

### Tags Inside Text

Text before ((tag|todo)) text after, then ((<tag|done)) and finally ((tag|blocked)).

### Tags at Line Start and End

((tag|todo)) starts this line
This line ends with ((tag|done))

## Should Stay Plain Text

<!-- None of these are valid tags, so none should render -->

((tag|todo) ((tag|todo)
(tag|todo)
((label|todo))
((tag))
((tag|))
((tags|todo))
( (tag|todo) )
