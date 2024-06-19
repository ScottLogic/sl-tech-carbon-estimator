# sl-tech-carbon-estimator

The tech carbon estimator is a web component that allow you to estimate, at high level, your carbon emissions

## Cloning the project

When cloning the project on a Windows machine, it is recommended to add the following option:

```
git clone REPOSITORY_URL --config core.autocrlf=input
```

For more information on why this is necessary, see the section on [Line Endings](#line-endings)

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

## Pull Requests / GitHub Actions

The project uses [GitHub Actions](https://docs.github.com/en/actions) to automate certain workflows. One such workflow runs when opening a pull request and pushing changes to the related branch. The main branch also has a branch protection rule that ensures that the status checks from this workflow have passed successfully before PRs can be merged into it.

If you would like to skip running the workflow for a given push to a PR branch there are [various ways](https://docs.github.com/en/actions/managing-workflow-runs/skipping-workflow-runs) this can be achieved. For example, adding `[skip ci]` to the end of the commit message in the push (e.g. `git commit -m "My message [skip ci]"`) will skip running the workflow for that push. However, you should be aware that this will also mark the status checks in the PR as pending, which will still block it from being merged.

Unfortunately Github does not recognise manually triggered runs of this workflow, so if you end up in this state you will either need to push additional changes without `[skip ci]` or amend the original commit to remove it from the description (e.g. `git commit --amend -m "My message"`), and then force push the branch (`git push --force` - not recommended if anyone else has pulled down the branch), if there are no more legitimate changes to make.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Line endings

This project is configured to use Linux/macOS line endings (Line Feed or LF), which will be enforced by Prettier. If working on Windows, your editor should be configured to insert these kind of line endings (the default for VSCode using the repo settings). To prevent git from attempting to change line endings when pulling down changes you should set the following config option:

```
git config core.autocrlf input
```

This option can also be set when cloning the repository by running:

```
git clone REPOSITORY_URL --config core.autocrlf=input
```

Applying the setting when cloning rather than after cloning may help resolve issues related to line endings when setting up the project in VSCode. Otherwise the default behaviour of git is to convert the line endings to the Windows standard of CRLF as you pull down the code and convert them back again on push. As Prettier can only use one standard, this then results in every line ending in the project being marked as an error within VSCode.

## Documentation

For further documentation please see the [docs](docs) folder.

---

© Copyright Scott Logic
