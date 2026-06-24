# CineNova — frontend

Frontend responsive de cartelera y reservas construido con React 19, Vite y JavaScript. Consume el backend NestJS; no contiene lógica ni código del servidor.

## Configuración

1. Copia `.env.example` como `.env` y ajusta `VITE_API_URL` si el backend no se ejecuta en `http://localhost:3000`.
2. Instala dependencias con `yarn install`.
3. Inicia desarrollo con `yarn dev`.

## Verificación

- `yarn lint`
- `yarn build`
- `yarn preview`

La cartelera es pública. Las reservas requieren una cuenta y las rutas bajo `/admin` requieren que `/auth/me` devuelva `role: "admin"`.
