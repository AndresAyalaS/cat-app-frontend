# Cat App

Aplicación web desarrollada en Angular para mostrar información y características de gatos.

## Tabla de contenido

- [Descripción](#descripción)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Librerías instaladas](#librerías-instaladas)
- [Comandos útiles](#comandos-útiles)
- [Pruebas](#pruebas)
- [Contribución](#contribución)
- [Licencia](#licencia)
- [Autores](#autores)

## Descripción

Cat App es una aplicación web construida con Angular que permite visualizar información sobre gatos, utilizando componentes modernos y estilos personalizados.

## Requisitos previos

- [Node.js](https://nodejs.org/) (versión recomendada: >= 16)
- [Angular CLI](https://angular.io/cli) (versión recomendada: >= 16)

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/AndresAyalaS/cat-app-frontend
   cd cat-app
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia la aplicación:
   ```bash
   ng serve
   ```
   La aplicación estará disponible en `http://localhost:4200`.

## Estructura del proyecto

```
cat-app/
├── src/
│   ├── app/
│   ├── environments/
│   └── index.html
├── angular.json
├── package.json
└── README.md
```

## Librerías instaladas

### Dependencias principales

- [@angular/animations](https://www.npmjs.com/package/@angular/animations)
- [@angular/common](https://www.npmjs.com/package/@angular/common)
- [@angular/compiler](https://www.npmjs.com/package/@angular/compiler)
- [@angular/core](https://www.npmjs.com/package/@angular/core)
- [@angular/forms](https://www.npmjs.com/package/@angular/forms)
- [@angular/platform-browser](https://www.npmjs.com/package/@angular/platform-browser)
- [@angular/router](https://www.npmjs.com/package/@angular/router)
- [rxjs](https://www.npmjs.com/package/rxjs)
- [swiper](https://www.npmjs.com/package/swiper)
- [tslib](https://www.npmjs.com/package/tslib)
- [zone.js](https://www.npmjs.com/package/zone.js)

### Dependencias de desarrollo

- [@angular-devkit/build-angular](https://www.npmjs.com/package/@angular-devkit/build-angular)
- [@angular/build](https://www.npmjs.com/package/@angular/build)
- [@angular/cli](https://www.npmjs.com/package/@angular/cli)
- [@angular/compiler-cli](https://www.npmjs.com/package/@angular/compiler-cli)
- [@types/jasmine](https://www.npmjs.com/package/@types/jasmine)
- [@types/swiper](https://www.npmjs.com/package/@types/swiper)
- [autoprefixer](https://www.npmjs.com/package/autoprefixer)
- [jasmine-core](https://www.npmjs.com/package/jasmine-core)
- [karma](https://www.npmjs.com/package/karma)
- [karma-chrome-launcher](https://www.npmjs.com/package/karma-chrome-launcher)
- [karma-coverage](https://www.npmjs.com/package/karma-coverage)
- [karma-jasmine](https://www.npmjs.com/package/karma-jasmine)
- [karma-jasmine-html-reporter](https://www.npmjs.com/package/karma-jasmine-html-reporter)
- [postcss](https://www.npmjs.com/package/postcss)
- [tailwindcss](https://www.npmjs.com/package/tailwindcss)
- [typescript](https://www.npmjs.com/package/typescript)

## Comandos útiles

- Iniciar la aplicación:  
  ```bash
  ng serve
  ```
- Ejecutar pruebas unitarias:  
  ```bash
  ng test
  ```
- Construir para producción:  
  ```bash
  ng build
  ```

## Pruebas

Este proyecto utiliza [Jasmine](https://jasmine.github.io/) y [Karma](https://karma-runner.github.io/) para pruebas unitarias.  
Para ejecutar los tests:
```bash
ng test
```

## Contribución

¡Las contribuciones son bienvenidas! Por favor, abre un issue o un pull request para sugerencias o mejoras.

## Licencia

Este proyecto está bajo la licencia MIT.

## Autores

- [Andres Gerardo Ayala Sanchez](https://github.com/AndresAyalaS)
