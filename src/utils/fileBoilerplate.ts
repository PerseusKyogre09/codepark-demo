export function getboilerplate(filename: string) {

    const cppboilp = `#include <iostream>
using namespace std;

int main() {
    
    return 0;
}`


    const jsboilp = `console.log("Hello World");`
    if (!filename) {
        return ""
    }


    const htmlboilp = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Page Title</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- Your visible content goes here -->
    <h1>Hello, World!</h1>
    <p>This is a basic HTML5 boilerplate.</p>
    <script src="index.js"></script>
</body>
</html>
`


    const cssboilp = `*, *::before, *::after {
  box-sizing: border-box;
}

body {
  margin: 0; 
  padding: 0;
}

html {
  font-size: 62.5%; 
}

body {
  font-size: 1.6rem;
}
`

    const cboilp = `#include <stdio.h>

int main() {
    
    return 0;
}`

    const className = filename.replace(".java", "")

    const javboilp = `public class ${className} {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
`

    if (filename.toLowerCase().endsWith(".js")) {
        return jsboilp
    }

    if (filename.toLowerCase().endsWith(".html")) {
        return htmlboilp
    }

    if (filename.toLowerCase().endsWith(".css")) {
        return cssboilp
    }

    if (filename.toLowerCase().endsWith(".java")) {
        return javboilp
    }

    if (filename.toLowerCase().endsWith(".cpp")) {
        return cppboilp
    }

    if (filename.toLowerCase().endsWith(".c")) {
        return cboilp
    }

    return ""
}