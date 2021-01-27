# Template Validator
A GitHub Action to validate submitted Issues & Pull Requests against provided Templates.

## Features
- Provides standard templates such as `Bug Report`, `Feature Request` and `Discussion` for Issues and one standard for PRs.
- Validates submitted issues & PRs against the provided templates.
- Adds relevant labels such as `Bug`, `Feature` and `Discussion` on issues based on the template used.
- Greets users for their contribution using a provided custom message.

## Documentation

Read the documentation carefully before making changes in configuration YAML file and templates.

### Introduction
- The **Template Validator** considers an Issue and a Pull Request (PR) as a **Contribution**.
- It will trigger everytime a new issue or pull request is `opened`, `edited` or `reopened`.
- The **Template Validator** responds with an 'Issue Comment' for its output.

### Standard Rules for Issues & PRs
- Every `opened`, `edited` or `reopened` issue and pull request will be **closed** immediately, if it did not validate against its template.
- Every issue will have either a `Bug :shield:`, `Feature :shield:` or `Discussion :shield:` tag based on the template selected.

### Template Configuration

#### Template Path:

- Template paths are hardcoded and cannot be changed.
- The `name` and `labels` property inside the issue templates must not be changed.
- Headers inside these templates can be changed, inserted or deleted to match your needs.
- For issues 3 standard templates are provided: 
    1. **Bug Report** - Path: `.github/ISSUE_TEMPLATE/bug_report.md`.
    2. **Feature Request** - Path: `.github/ISSUE_TEMPLATE/feature_request.md`.
    3. **Discussion** - Path: `.github/ISSUE_TEMPLATE/discussion.md`.
- For PRs, one standard template is created, Path: `.github/PULL_REQUEST_TEMPLATE.md`.

#### Headers

- Sentences starting with `###` in the issue and PR templates are considered as **Headers**.
- Headers are the primary element against which the issue or PR body is validated. 
- Headers should always represent 'Points' to describe an issue or a PR. 
- Atleast one header ust be present inside a template.
- A header example would be `Describe the bug:` or `Steps to reproduce:` 
- It is a best practice to add `:` at the end of each header to represent that ot should be elaborated.

### Properties

| Name | Datatype | Description | Example |
|------|----------|-------------|---------|
| token | string | GitHub secret access token. | ${{ secrets.GITHUB_TOKEN }} |
| issue--greeting-message | string | Greeting message for issue authors. | 'Thanks you!' |
| pull-request--greeting-message | string | Greeting message for issue authors. | 'Thanks you!' |


### Example

```
name: Template Validator

on: 
  issues:
    types: [opened, edited, reopened]
  pull_request:
    types: [opened, edited, reopened]

jobs:
  template_validator:
    runs-on: ubuntu-latest
    name: Template Validator
    steps:
    - name: All Checks
      uses: flowdify/contribution-inspector@main
      with:
        token: ${{ secrets.GITHUB_TOKEN }}
        issue--greeting-message: 'Thanks for your contribution! :)'
        pull-request--greeting-message: 'Thanks for your contribution! :)'
```

## Future Plans

- Adding functionality for Check List validation.
- Validating the actual body of the submitted issue and PR to check if it is not some gibberish.
- Providing more customization for template paths and number of templates.