# CoverGo take home exercise

## Get started

### Clone the repo

```shell
git clone https://github.com/mr-nilesh/cover-go-take-home-excercise.git
cd cover-go-take-home-excercise
```

### Install npm packages

Install the `npm` packages described in the `package.json` and verify that it works:

```shell
npm install
ng serve --open
```
This command will open up the application in the browser at http://localhost:4200/

## Technical choices and architecture

Code is written in Angular. Every screen has a separate component.

There are total 4 components

```shell
1) Welcome: Represents welcome screen
2) User details: Represents user/insurance form screen
3) Insurance summary: Represents insurance summary screen
4) Error message: Represents error screen
```

There are 2 routes.

```shell
1) / : This route opens up the welcome screen and it is the default route.
2) /user-details : This route opens up the insurance form.
```

## NOTE
You may see 2 different usernames in the commit. Both are mine. FYI
