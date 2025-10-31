# La Cazuela Chapina - Sistema de Gestión Web

Aplicación web de gestión para La Cazuela Chapina construida con React + Vite.

## 🚀 Configuración Inicial

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
VITE_API_URL=https://localhost:7001/api
VITE_GOOGLE_CLIENT_ID=tu_client_id_aqui
```

### 3. Configurar Google OAuth

Para habilitar el login con Google, necesitas:

1. **Ir a Google Cloud Console**
   - Visita: [https://console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)

2. **Crear o seleccionar un proyecto**
   - Si no tienes uno, crea un nuevo proyecto

3. **Crear Credenciales OAuth 2.0**
   - Ve a "APIs y servicios" → "Credenciales"
   - Haz clic en "Crear credenciales" → "ID de cliente OAuth 2.0"

4. **Configurar la aplicación**
   - Tipo de aplicación: **"Aplicación web"**
   - Nombre: (cualquier nombre descriptivo)
   - **Orígenes autorizados de JavaScript**: 
     - `http://localhost:5173` (para desarrollo)
     - Tu dominio de producción (ej: `https://tudominio.com`)
   - **URI de redirección autorizadas**:
     - `http://localhost:5173` (para desarrollo)
     - Tu dominio de producción

5. **Copiar el Client ID**
   - Una vez creado, copia el "ID de cliente"
   - Pégalo en el archivo `.env` reemplazando `tu_client_id_aqui`

### 4. Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

**⚠️ Importante**: Si modificas el archivo `.env`, debes **reiniciar** el servidor de desarrollo para que los cambios surtan efecto.

## 📦 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la construcción de producción
- `npm run lint` - Ejecuta el linter

## 🔐 Autenticación

El sistema incluye:

- ✅ Login con Google OAuth
- ✅ Login con email y contraseña
- ✅ Registro de nuevos usuarios
- ✅ Validación de tokens JWT
- ✅ Manejo automático de sesiones

## 🛠️ Tecnologías Utilizadas

- React 19
- Vite
- Tailwind CSS
- Google OAuth 2.0
- Axios
- React Router DOM
- JWT Decode
