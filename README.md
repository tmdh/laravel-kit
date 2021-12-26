<p align="center">
  <img src="./build/icon.png" height="128">
</p>
<h1 align="center">Laravel Kit</h1>
<div align="center">
  A simple and elegant desktop application for managing your Laravel applications.<br>
  <sub>Available for Windows, Linux and macOS.</sub>
</div>
<br>
<div align="center">
  <!-- Version -->
  <a href="https://github.com/tmdh/laravel-kit/releases/latest">
    <img src="https://badgen.net/github/release/tmdh/laravel-kit" alt="Latest release">
  </a>
  <!-- Build Status -->
  <a href="https://github.com/tmdh/laravel-kit/actions/workflows/build.yml">
    <img src="https://github.com/tmdh/laravel-kit/actions/workflows/build.yml/badge.svg" alt="build">
  </a>
  <!-- Downloads total -->
  <a href="https://github.com/tmdh/laravel-kit/releases">
    <img src="https://img.shields.io/github/downloads/tmdh/laravel-kit/total">
  </a>
</div>
<div align="center">
  <h3>
    <a href="https://tmdh.github.io/laravel-kit/">
      Website
    </a>
    <span> | </span>
    <a href="https://github.com/tmdh/laravel-kit#features">
      Features
    </a>
    <span> | </span>
    <a href="https://github.com/tmdh/laravel-kit#download">
      Installation
    </a>
    <span> | </span>
    <a href="https://github.com/tmdh/laravel-kit#contribution">
      Contribution
    </a>
    <span> | </span>
    <a href="https://github.com/tmdh/laravel-kit/wiki">
      Documentation
    </a>
  </h3>
</div>
<div align="center">
  <sub>
  Built with ❤︎ by <a href="https://github.com/tmdh">Tareque Md Hanif</a>
  </sub>
</div>

## Features

- No configuration required.
- Execute Artisan commands easily in a nice interface.
- Tinker with your project in a magical code editor.
- Serve your Laravel application locally with a click of a button (so convenient :star_struck: ).
- Beautiful user interface inspired by VSCode and dark theme.
- Artisan commands are retrieved from your Laravel project.
- Many more features yet to come.

## Installation

PHP must be installed in your system.

### Windows

[Download the setup file](https://github.com/tmdh/laravel-kit/releases/download/v2.0.4/Laravel-Kit-Setup-2.0.4.exe) and install it. Updates will be installed automatically.

### macOS

The recommended way to install on macOS is by using [brew](https://brew.sh/).
```
brew install laravel-kit
```
Or, download zip or dmg formats from the [Releases](https://github.com/tmdh/laravel-kit/releases) page.

### Ubuntu and other derivatives

Run these commands from the terminal:
```
wget https://github.com/tmdh/laravel-kit/releases/download/v2.0.4/laravel-kit_2.0.4_amd64.deb
sudo apt install ./laravel-kit_2.0.4_amd64.deb
```

### Other Linux distributions

Only AppImage format is available for other Linux distributions. Download it from the [Releases](https://github.com/tmdh/laravel-kit/releases) page. Proper methods will be added very soon.
                                          

## Screenshots

<h4 align="center"> :high_brightness: themes :crescent_moon: </h4>

|               Light                |               Dark                |
| :--------------------------------: | :-------------------------------: |
| ![](screenshots/artisan-light.jpg) | ![](screenshots/artisan-dark.jpg) |
| ![](screenshots/tinker-light.jpg)  | ![](screenshots/tinker-dark.jpg)  |

## Development

Laravel Kit is made with [Electron](https://electronjs.org), [Vue.js 2](https://vuejs.org), [Tailwind CSS](https://tailwindcss.com) and [Webpack](https://webpack.js.org).

```bash
# For development,
# Start development server with Webpack
yarn run dev:one
# Start Electron
yarn run dev:two

# For production,
# Build files with Webpack
yarn run prod
# Make executable
yarn run pack
```

## Documentation

Go to [Laravel Kit wiki](https://github.com/tmdh/laravel-kit/wiki).

---

Copyright © 2018-2021 by [Tareque Md Hanif](https://github.com/tmdh)
