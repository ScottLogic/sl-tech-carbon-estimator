# Tech Carbon Standard Estimator

The tech carbon estimator is a web component that allow you to estimate, at high level, your carbon emissions

## Cloning the project

When cloning the project on a Windows machine, it is recommended to add the following option:

```
git clone REPOSITORY_URL --config core.autocrlf=input
```

For more information on why this is necessary, see the section on [Line Endings](#line-endings)

## Using component

exposed as a web component `tech-carbon-estimator`. The component takes the follow optional input:

- `extra-height` - this is extra height to be taken into account when calculating the height of the chart. E.g. the height of a header/footer that will be visible on the page.

You will need to import the following files to use the tech-carbon-estimator:

- main.js
- polyfill.js

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

If working on WSL the following steps establish a Chrome instance that can be used by Web Test Runner:

In `/tmp` download .deb\
`sudo wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb`

Then\
`sudo dpkg -i google-chrome-stable_current_amd64.deb`

If there's any errors\
`sudo apt install --fix-broken -y`

Then re-run\
`sudo dpkg -i google-chrome-stable_current_amd64.deb`

In `~/.bashrc` add `export CHROME_PATH=/usr/bin/google-chrome-stable`

N.B. These steps assume there isn't a Chrome install on the Windows host machine 


## Git Commit messages

This project follows the the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification to track the types of changes being made, to determine the version number that should be used in package releases. To ensure that commits lead to a version number increase, then they should contain the following structural elements:

`fix: <commit description>` - Results in a patch version increase (ie. 0.0.1 => 0.0.2). This must be the first line of the commit message.
`feat: <commit description>` - Results in a minor version increase (ie. 0.0.1 => 0.1.0). This must be the first line of the commit message.
`BREAKING CHANGE: <reason for breaking change>` - Results in a major version increase (ie. 0.0.1 => 1.0.0). This must be the footer/final line of the commit message.

Other prefixes are acceptable (`docs:`, `build:` etc.) but these are the only ones guaranteed to affect the version number. For more information on the Package release process see [Publishing Tech Carbon Estimator Package](docs/publish_process.md).

For ease and consitency Husky and Commitizen have been added so that upon running `git commit` you will be presented with a step by step wizard in the terminal to guide you through creating a correctly formated commit message.

## Pull Requests / GitHub Actions

The project uses [GitHub Actions](https://docs.github.com/en/actions) to automate certain workflows. One such workflow runs when opening a pull request and pushing changes to the related branch. The `develop` branch also has a ruleset that ensures that the status checks from this workflow have passed successfully before PRs can be merged into it. Ruleset details can be viewed [here](https://github.com/ScottLogic/sl-tech-carbon-estimator/rules).

If you would like to skip running the workflow for a given push to a PR branch there are [various ways](https://docs.github.com/en/actions/managing-workflow-runs/skipping-workflow-runs) this can be achieved. For example, adding `[skip ci]` to the end of the commit message in the push (e.g. `git commit -m "My message [skip ci]"`) will skip running the workflow for that push. However, you should be aware that this will also mark the status checks in the PR as pending, which will still block it from being merged.

Unfortunately Github does not recognise manually triggered runs of this workflow, so if you end up in this state you will either need to push additional changes without `[skip ci]` or amend the original commit to remove it from the description (e.g. `git commit --amend -m "My message"`), and then force push the branch (`git push --force-with-lease` - not recommended if anyone else has pulled down the branch), if there are no more legitimate changes to make.

When it comes to merging PRs into `develop`, we have restricted the options to show 'Squash and merge' only. We request that you use the standard merge message that GitHub generates when using this option, as this preserves the conventional commit messages that allow us to determine the next version number.

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
