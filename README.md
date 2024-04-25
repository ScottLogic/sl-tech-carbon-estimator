# sl-tech-carbon-estimator

The tech carbon estimator is a web component that allow you to estimate, at high level, your carbon emissions

## Using component

exposed as a web component `tech-carbon-estimator`. The component takes the follow optional input:
- `extra-height` - this is extra height to be added whe calculating the height if the chart. eg a header/footer that will be visible on the page

You will need to import the following files to use the tech-carbon-estimator:
- main.js
- polyfill.js
- styles.css

These files can be found under dist/tech-carbon-estimator when developing locally.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Line endings

This project is configured to use Linux/macOS line endings (Line Feed or LF), which will be enforced by prettier. If working on Windows, your editor should be configured to insert these kind of line endings (the default for VSCode using the repo settings). To prevent git from attempting to change line endings when pulling down changes you should set the following config option:

```
git config core.autocrlf input
```

## Documentation

For further documentation please see the [docs](docs) folder.

---

© Copyright Scott Logic
