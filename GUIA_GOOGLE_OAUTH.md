# 🔐 Guía Paso a Paso: Configurar Google OAuth Client ID

Esta guía te ayudará a configurar el Client ID de Google OAuth para tu aplicación La Cazuela Chapina.

## 📋 Requisitos Previos

- Una cuenta de Google (Gmail, Google Workspace, etc.)
- Acceso a internet para usar Google Cloud Console

---

## 🚀 Pasos Detallados

### Paso 1: Acceder a Google Cloud Console

1. Abre tu navegador y ve a: **[https://console.cloud.google.com/](https://console.cloud.google.com/)**
2. Inicia sesión con tu cuenta de Google

### Paso 2: Crear un Proyecto

1. En la parte superior, haz clic en el **selector de proyectos** (al lado de "Google Cloud")
2. Haz clic en **"NUEVO PROYECTO"**
3. Completa el formulario:
   - **Nombre del proyecto**: `La Cazuela Chapina` (o el nombre que prefieras)
   - **Ubicación**: Deja la opción predeterminada
4. Haz clic en **"CREAR"**
5. Espera unos segundos a que se cree el proyecto
6. Selecciona el proyecto recién creado desde el selector de proyectos

### Paso 3: Configurar la Pantalla de Consentimiento de OAuth

1. En el menú lateral izquierdo, ve a:
   - **"APIs y servicios"** → **"Pantalla de consentimiento de OAuth"**
   
2. Selecciona el tipo de usuario:
   - **"Externo"** (recomendado para desarrollo y producción pública)
   - O **"Interno"** (solo si tienes Google Workspace)
   
3. Haz clic en **"CREAR"**

4. Completa el formulario:
   - **Nombre de la app**: `La Cazuela Chapina`
   - **Correo electrónico de soporte**: Tu email
   - **Logo** (opcional): Puedes subir un logo más tarde
   - **Dominio autorizado** (opcional por ahora)

5. Haz clic en **"GUARDAR Y CONTINUAR"**

6. En **"Ámbitos"**:
   - Por ahora puedes omitir este paso
   - Haz clic en **"GUARDAR Y CONTINUAR"**

7. En **"Usuarios de prueba"** (solo si elegiste "Externo"):
   - Si tu app está en modo "Externo" y aún no está publicada, puedes agregar usuarios de prueba
   - Por ahora haz clic en **"GUARDAR Y CONTINUAR"**
   - Luego haz clic en **"VOLVER AL PANEL"**

### Paso 4: Habilitar Google+ API (si es necesario)

1. En el menú lateral, ve a: **"APIs y servicios"** → **"Biblioteca"**
2. Busca: **"Google+ API"** o **"People API"**
3. Haz clic en el resultado y luego en **"HABILITAR"**
   - Nota: Para OAuth básico, esto puede no ser necesario, pero ayuda con información del perfil

### Paso 5: Crear las Credenciales OAuth 2.0

1. En el menú lateral, ve a:
   - **"APIs y servicios"** → **"Credenciales"**

2. Haz clic en **"CREAR CREDENCIALES"** (botón azul en la parte superior)

3. Selecciona **"ID de cliente OAuth 2.0"**

4. Si es la primera vez, Google te pedirá configurar la pantalla de consentimiento (ya la configuraste en el Paso 3)

5. En el formulario de creación:
   
   **Tipo de aplicación**: Selecciona **"Aplicación web"**
   
   **Nombre**: `La Cazuela Chapina Web` (o el nombre que prefieras)
   
   **Orígenes de JavaScript autorizados**:
   - Haz clic en **"+ AGREGAR URI"**
   - Agrega: `http://localhost:5173`
   - Si tienes otros dominios de desarrollo, también agrégalos aquí
   
   **URIs de redirección autorizadas**:
   - Haz clic en **"+ AGREGAR URI"**
   - Agrega: `http://localhost:5173`
   - Nota: Para desarrollo con Vite, generalmente no necesitas una URI de redirección específica, pero agregarla no causa problemas

6. Haz clic en **"CREAR"**

### Paso 6: Copiar el Client ID

1. Después de crear, verás una ventana con tus credenciales
2. Verás dos valores importantes:
   - **ID de cliente**: `123456789-abcdefghijklmnop.apps.googleusercontent.com`
   - **Secreto de cliente**: (NO lo necesitas para el frontend)

3. **COPIA el "ID de cliente"** completo

### Paso 7: Configurar el archivo .env

1. Abre el archivo `.env` en la raíz de tu proyecto LaCazuelaChapinaWeb

2. Busca la línea:
   ```
   VITE_GOOGLE_CLIENT_ID=TU_CLIENT_ID_DE_GOOGLE_AQUI
   ```

3. Reemplaza `TU_CLIENT_ID_DE_GOOGLE_AQUI` con el Client ID que copiaste:
   ```
   VITE_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
   ```

4. **Guarda el archivo**

### Paso 8: Reiniciar el Servidor de Desarrollo

1. Si tienes el servidor corriendo (`npm run dev`), deténlo presionando `Ctrl + C`

2. Inicia el servidor nuevamente:
   ```bash
   npm run dev
   ```

3. **¡Listo!** Ahora deberías poder usar el botón "Acceder con Google" sin errores.

---

## 🔍 Verificación

Para verificar que todo está configurado correctamente:

1. Abre tu aplicación en el navegador: `http://localhost:5173`
2. Deberías ver la pantalla de login
3. Haz clic en **"Acceder con Google"**
4. Deberías ser redirigido a la página de login de Google
5. Después de autenticarte, deberías volver a tu aplicación

---

## ⚠️ Problemas Comunes

### Error: "invalid_client"
- **Causa**: El Client ID no está configurado o es incorrecto
- **Solución**: Verifica que el archivo `.env` tenga el Client ID correcto y reinicia el servidor

### Error: "redirect_uri_mismatch"
- **Causa**: La URL de tu aplicación no está en los "Orígenes autorizados"
- **Solución**: Asegúrate de que `http://localhost:5173` esté en los orígenes autorizados en Google Cloud Console

### El Client ID no se carga
- **Causa**: El servidor no se reinició después de cambiar el `.env`
- **Solución**: Detén y reinicia el servidor (`npm run dev`)

### No puedo ver el archivo .env
- **Causa**: Los archivos `.env` están ocultos por defecto
- **Solución**: 
  - En VS Code: Archivos → Preferencias → Configuración → Busca "files.exclude" y desactiva `.env`
  - O busca el archivo directamente en el explorador de archivos

---

## 📝 Configuración para Producción

Cuando vayas a desplegar tu aplicación a producción:

1. Ve a Google Cloud Console → Credenciales
2. Edita tu "ID de cliente OAuth 2.0"
3. Agrega a "Orígenes autorizados":
   - `https://tudominio.com`
   - `https://www.tudominio.com`
4. Agrega a "URIs de redirección":
   - `https://tudominio.com`
5. Guarda los cambios
6. Actualiza tu `.env` de producción con el mismo Client ID (funciona para desarrollo y producción si configuraste ambos orígenes)

---

## 🆘 Ayuda Adicional

Si tienes problemas:

1. Verifica que el archivo `.env` esté en la raíz del proyecto (donde está `package.json`)
2. Verifica que el nombre de la variable sea exactamente `VITE_GOOGLE_CLIENT_ID` (mayúsculas/minúsculas importan)
3. Verifica que no haya espacios antes o después del `=` en el archivo `.env`
4. Asegúrate de haber reiniciado el servidor después de cambiar el `.env`
5. Revisa la consola del navegador (F12) para ver si hay errores

---

## 🔗 Enlaces Útiles

- [Google Cloud Console](https://console.cloud.google.com/)
- [Documentación de Google OAuth](https://developers.google.com/identity/protocols/oauth2)
- [@react-oauth/google - Documentación](https://www.npmjs.com/package/@react-oauth/google)

