![Logo PanApp](src/assets/logo.svg)

<h1 align="center">PanApp</h1>

Aplicación web híbrida para la gestión sencilla de información (usuarios, pedidos, clientes y productos). Proyecto para el curso Aplicaciones Móviles.

# Entrega 2 - App híbrida

**Realizado por:** Samuel Pérez

## Descripción

PanApp es una app construida con React + Vite que funciona sin conexión a internet gracias al uso de almacenamiento local del navegador. Está pensada para ser ligera, rápida y usable desde dispositivos móviles o escritorio.

## Stack Tecnológico

- React 18 + TypeScript: interfaz y lógica de componentes.
- Vite 5: bundler y servidor de desarrollo rápido.
- React Router 7: enrutamiento de vistas.
- Tailwind CSS 3: estilos utilitarios y diseño responsivo.
- Lucide React: iconografía.
- Almacenamiento local (`localStorage`): persistencia de datos offline.

## Ejecución del Proyecto

Requisitos previos:

- Node.js 18+ y npm

Pasos:

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Ejecutar en desarrollo (recibirás una URL local, por ejemplo `http://localhost:5173`):

   ```bash
   npm run dev
   ```

3. Construir para producción:

   ```bash
   npm run build
   ```

4. Previsualizar el build localmente:

   ```bash
   npm run preview
   ```

## Funcionamiento Offline

- La app no depende de un backend para las funcionalidades principales.
- Los datos (usuario, pedidos, clientes y productos) se guardan en `localStorage`, por lo que permanecen disponibles aunque no haya internet.
- Al volver la conexión, la información sigue presente en el dispositivo del usuario.
- Nota: actualmente no se utiliza Service Worker; el soporte offline se basa en almacenamiento local del navegador.

## Créditos

- Autor: Samuel Pérez
- Curso: Aplicaciones Móviles
