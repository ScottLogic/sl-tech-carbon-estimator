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

## Installing Dependencies

To run the following `ng` commands, you will need to have the Angular CLI installed globally. This requires that you have [Node.js](https://nodejs.org) installed and then run the following command from any directory:

```bash
npm install -g @angular/cli
```

You will also need to run `npm install` from the root directory of this repository.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files. You can also run `ng serve --open` to automatically open the application in a browser tab.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Web Test Runner](https://modern-web.dev/docs/test-runner/overview/).

## GitHub Actions

The project uses [GitHub Actions](https://docs.github.com/en/actions) to automate certain workflows. One such workflow runs when opening a pull request and pushing changes to the related branch. If you would like to skip running the workflow for a given push to a PR branch there are [various ways](https://docs.github.com/en/actions/managing-workflow-runs/skipping-workflow-runs) this can be achieved. For example, adding `[skip ci]` to the end of the commit message in the push (e.g. `git commit -m "My message [skip ci]"`) will skip running the workflow for that push.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Line endings

This project is configured to use Linux/macOS line endings (Line Feed or LF), which will be enforced by prettier. If working on Windows, your editor should be configured to insert these kind of line endings (the default for VSCode using the repo settings). To prevent git from attempting to change line endings when pulling down changes you should set the following config option:

```
git config core.autocrlf input
```

This option can also be set when cloning the repository by running:

```
git clone REPOSITORY_URL --config core.autocrlf=input
```

Applying the setting when cloning rather than after cloning may help resolve issues related to line endings when setting up the project in VSCode.

## Documentation

For further documentation please see the [docs](docs) folder.

---

© Copyright Scott Logic
