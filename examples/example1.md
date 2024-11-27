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
