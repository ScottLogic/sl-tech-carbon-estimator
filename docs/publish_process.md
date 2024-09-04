# Publishing Tech Carbon Estimator Package

## Introduction

We have created the Tech Carbon Estimator so that it can be used in multiple sites, by including its package from npm. This document outlines some of the concerns around the publishing process, which may be needed in future.

## Pre-Publish

Before being able to release a new version you need to bump the package version and create a tag to build the version from.

### Bump version and create a tag for a release

We will continue to use the `npm version` command to update the version of the package. Since this also commits the change by default, you should create a branch to submit the change as a PR first. For example, if the current version is 0.1.0, you might do the following:

```bash
git checkout -b v0-2-0

npm version minor

git push -–follow-tags
```

This should then give you a commit that you can push up for review (remember to add `--follow-tags` to the `git push` command to include tags).

For clarity, here are the version increment types and the `npm version` parameter that would generate them.

| Version update | `npm version` parameter |
| -------------- | ----------------------- |
| 0.0.1 -> 0.0.2 | `patch`                 |
| 0.0.1 -> 0.1.0 | `minor`                 |
| 0.0.1 -> 1.0.0 | `major`                 |

#### Creating linear history

While the package process should work whether the tag is merged in or not, for clarity we would like the tag to appear as a single commit on main after the last change it includes. This is not strictly possible through the GitHub PR process, as it will always create a merge commit, even if the branch was made from the current head of main. And using the Rebase and merge option is not a possibility, as this duplicates the branch commit but does not move the tag (only one tag with the same name can exist).

To get around this, it is possible to force a fast-forward merge locally and push it up once the PR is approved. To do this, use the following commands:

```bash
git checkout main

git merge v0-0-5 --ff-only

git push
```

The `--ff-only` flag will ensure that this merge only succeeds if it is able to merge without an additional commit. You can then push this change up as normal, and the PR will automatically close.

If it fails, then there is another commit on main after you branched for the version release, and it is unable to fast forward the merge. At this point you will have to do a standard PR merge and accept that the version commit may appear after changes that are not included in the tag, or attempt to re-write history to rebase the commit and tag on top of main (not recommended).

## Publishing via GitHub Action

A workflow has been setup to publish new versions from GitHub, which does not require you have a Scott Logic member npm account. This will also create a GitHub release at the same time and update the GitHub pages site. Anyone with write access to the repo should be able to run the '[Publish new package](https://github.com/ScottLogic/sl-tech-carbon-estimator/actions/workflows/publish-package.yml)' workflow, which requires you to choose where to run it from.

![](images/publish_process_1.png)

You should select a version tag that has already been merged into main. The workflow will validate that the tag matches the version of the current package and fail early if it does not. The GitHub release step will use the specified tag and fail if it does not already exist, so we want to be sure of that before we publish to npm.

This workflow relies on the version already being incremented before it is run, and it will fail if it has already been published. This is because NPM does not allow you to overwrite packages with the same version number. If this is the case, you will see a message along the lines of:

```
npm error code E403

npm error 403 403 Forbidden - PUT <https://registry.npmjs.org/@scottlogic%2ftech-carbon-estimator> - You cannot publish over the previously published versions: 0.0.2.

npm error 403 In most cases, you or one of your dependencies are requesting

npm error 403 a package version that is forbidden by your security policy, or

npm error 403 on a server you do not have access to.
```

Another error that can occur is the token used to allow GitHub Actions to publish to npm will expire. This would result in an error along the lines of:

```
npm error code E404

npm error 404 Not Found - PUT <https://registry.npmjs.org/@scottlogic%2ftech-carbon-estimator> - Not found

npm error 404

npm error 404 '@scottlogic/tech-carbon-estimator@0.0.2' is not in this registry.

npm error 404

npm error 404 Note that you can also install from a

npm error 404 tarball, folder, http url, or git url.
```

Since the request is not authorised, it acts as if the entry does not exist, instead of reporting that it does exist but you don't have access. To resolve this issue, see the next section.

## Troubleshooting

### Pipeline failure

The Publish new package workflow will currently fail on the last step of publishing to GitHub pages, due to duplicated steps in the pipeline attempting to create the same artifact twice. Issue [SFD-193](https://scottlogic.atlassian.net/browse/SFD-193) is logged to deal with this and until it is resolved, the 'Deploy estimator Pages' workflow should be triggered manually from the same tag.

### Updating NPM_TOKEN

NPM publishing has been setup using a secret token, which is only visible to those with admin access to the repo. If this ever expires and the original token creator is not available, then you will need to take the following steps to add a new one.

1. Gain admin access to the sl-tech-carbon-estimator repo.
2. Create an npm account and add it to the @scottlogic org.
3. Create a new token on npm.
4. Add it to the secrets within the github repo.

#### Gain admin access to the sl-tech-carbon-estimator repo

There should always be someone with admin access, which is managed by being a member of the <https://github.com/orgs/ScottLogic/teams/sustainable-technology-development-admin> team. If there are no active members in this team, you will need to make a Support Request.

#### Create an npm account and add it to the @scottlogic org

We have created the estimator package within the @scottlogic scope, which was possible due to there being a Scott Logic organization created on [npmjs.com](https://www.npmjs.com/org/scottlogic). To be able to publish packages to this organization from your local machine, you will need to be added as a member, which will require you to have an account set up there. It is not mandatory, but it is advised that your username matches that used for the GitHub account used for Scott Logic (a common pattern is &lt;initial&gt;&lt;surname&gt;-scottlogic).

To be added as a member, send a [Support Request](https://scottlogic.atlassian.net/servicedesk/customer/portal/1/group/67/create/66) asking to be added, along with your npm username. Be aware that this organization is not using a paid plan, so only public packages can be added under this scope. Attempts to use `npm publish` without adding the flag `--access public` will always fail.

#### Create a new token on npm

Initial instructions were written following [Github documentation](https://docs.github.com/en/actions/publishing-packages/publishing-nodejs-packages#publishing-packages-to-the-npm-registry) and current npmjs site, this may change in future.

Click on Access Tokens from your profile image on npmjs.com:

![](images/publish_process_2.png)

Click on ‘Generate New Token’ -> ‘Granular Access Token’

![](images/publish_process_3.png)

Add something like the following:

![](images/publish_process_4.png)

![](images/publish_process_5.png)

You should be able to select the specific package only, to minimise the access the token provides. The maximum selectable expiration is 90 days but a custom date can be selected if desired.

Once you submit this form, it should give you a token that can be copied. Make sure to take a copy of it at this point as it will never be shown in full again.

#### Add it to the secrets within the github repo

From <https://github.com/ScottLogic/sl-tech-carbon-estimator/settings>, access the secrets for actions:

![](images/publish_process_6.png)

Choose to add a new repository secret:

![](images/publish_process_7.png)

Name the token `NPM_TOKEN` and paste in the token you generated in the previous step. When updating this in future, it should already be present and only require the secret to be edited:

![](images/publish_process_8.png)