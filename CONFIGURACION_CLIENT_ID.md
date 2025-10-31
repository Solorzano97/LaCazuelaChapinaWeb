# 🔑 Configuración del Client ID: Frontend vs Backend

## 📋 Respuesta Corta

**SÍ**, el Client ID de Google OAuth debe estar configurado en **ambos** lados (frontend y backend), pero con propósitos diferentes.

## 🎯 ¿Por qué se necesita en ambos lados?

### Frontend (React/Vite)
- **Propósito**: Inicializar el componente de Google Login y obtener el token JWT
- **Ubicación**: Archivo `.env` → `VITE_GOOGLE_CLIENT_ID`
- **Uso**: Se pasa al componente `<GoogleOAuthProvider>`
- **Seguridad**: ✅ Es PÚBLICO, no hay problema en exponerlo

### Backend (API)
- **Propósito**: **Validar** el token JWT que viene del frontend
- **Ubicación**: Archivo `appsettings.json` del backend → `GOOGLE_CLIENT_ID`
- **Uso**: Para verificar que el token es válido y fue generado por Google con tu Client ID
- **Seguridad**: ✅ También puede ser público, pero se usa para validación

## ✅ Requisitos Importantes

### 1. Debe ser el MISMO Client ID

El Client ID en el frontend y backend debe ser **exactamente el mismo**, del mismo proyecto de Google Cloud.

✅ **Correcto:**
```
Frontend (.env): VITE_GOOGLE_CLIENT_ID=123456789-xxx.apps.googleusercontent.com
Backend (.env):  GOOGLE_CLIENT_ID=123456789-xxx.apps.googleusercontent.com
```

❌ **Incorrecto:**
```
Frontend: Client ID del Proyecto A
Backend:  Client ID del Proyecto B
```

### 2. Flujo de Autenticación

```
┌──────────┐                    ┌──────────┐                    ┌──────────┐
│ Frontend │                    │  Google  │                    │ Backend  │
└────┬─────┘                    └────┬─────┘                    └────┬─────┘
     │                                │                                │
     │ 1. Usuario hace clic           │                                │
     │    en "Acceder con Google"     │                                │
     ├───────────────────────────────>│                                │
     │                                │                                │
     │                                │ 2. Google autentica usuario    │
     │                                │    y genera token JWT          │
     │                                │                                │
     │ 3. Google devuelve token       │                                │
     │    JWT al frontend             │                                │
     │<───────────────────────────────┤                                │
     │                                │                                │
     │ 4. Frontend envía token        │                                │
     │    al backend                  │                                │
     ├───────────────────────────────────────────────────────────────>│
     │                                │                                │
     │                                │                                │ 5. Backend valida token
     │                                │                                │    usando Client ID
     │                                │                                │
     │                                │                                │ 6. Backend verifica token
     │                                │                                │    con Google
     │                                │<───────────────────────────────┤
     │                                │                                │
     │                                │ 7. Google confirma que token   │
     │                                │    es válido                    │
     │                                ├───────────────────────────────>│
     │                                │                                │
     │ 8. Backend devuelve token      │                                │
     │    propio de la aplicación    │                                │
     │<───────────────────────────────────────────────────────────────┤
     │                                │                                │
```

## 🔧 Configuración Actual

### ✅ Frontend (Ya configurado)

**Archivo:** `.env`
```env
VITE_GOOGLE_CLIENT_ID=993374300794-1phr4jk4rgpdjipa8hi3hk1c2gi9p1nu.apps.googleusercontent.com
```

**Archivo:** `src/main.jsx` (línea 8)
```javascript
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
```

**Archivo:** `src/main.jsx` (línea 20)
```javascript
<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
```

### ⚠️ Backend (Debes verificar)

Tu backend debe tener en su archivo `.env`:

```env
GOOGLE_CLIENT_ID=993374300794-1phr4jk4rgpdjipa8hi3hk1c2gi9p1nu.apps.googleusercontent.com
```

**Nota:** El nombre de la variable puede variar según tu framework:
- Node.js/Express: `GOOGLE_CLIENT_ID`
- .NET: Puede ser `Google:ClientId` o `GOOGLE_CLIENT_ID`
- Otros frameworks: Consulta la documentación

## 💻 Ejemplo de Código Backend

### Node.js/Express con google-auth-library

```javascript
const { OAuth2Client } = require('google-auth-library');

// El Client ID debe ser el mismo que en el frontend
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post('/api/auth/google', async (req, res) => {
  try {
    const { credential } = req.body;
    
    // Validar el token con Google usando el Client ID
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID, // MISMO Client ID que el frontend
    });
    
    const payload = ticket.getPayload();
    // payload contiene: email, name, picture, etc.
    
    // Aquí creas/buscas el usuario en tu BD y generas tu propio token
    const userToken = generateYourAppToken(payload);
    
    res.json({
      success: true,
      data: {
        token: userToken,
        usuario: {
          email: payload.email,
          nombre: payload.name,
          // ...
        }
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token de Google inválido',
      error: error.message
    });
  }
});
```

### .NET / C#

```csharp
using Google.Apis.Auth;

public async Task<IActionResult> GoogleAuth([FromBody] GoogleAuthRequest request)
{
    try
    {
        // El Client ID debe ser el mismo que en el frontend
        var settings = new GoogleJsonWebSignature.ValidationSettings()
        {
            Audience = new[] { Configuration["Google:ClientId"] }
        };
        
        var payload = await GoogleJsonWebSignature.ValidateAsync(
            request.Credential, 
            settings
        );
        
        // Aquí creas/buscas el usuario y generas tu token
        // ...
        
        return Ok(new { success = true, data = userData });
    }
    catch (InvalidJwtException)
    {
        return Unauthorized(new { success = false, message = "Token de Google inválido" });
    }
}
```

## ❓ Preguntas Frecuentes

### ¿Por qué el mismo Client ID?
Porque Google verifica que el token fue generado con ese Client ID específico. Si son diferentes, la validación fallará.

### ¿Es seguro exponer el Client ID?
✅ **SÍ**, el Client ID es público por diseño. Está pensado para estar en código frontend visible. Lo importante es:
- ✅ Client ID: Público ✅
- ❌ Client Secret: Privado ❌ (solo para aplicaciones de servidor, no para apps web)

### ¿Qué pasa si uso diferentes Client IDs?
❌ La validación fallará con el error "Token de Google inválido" porque Google solo acepta tokens generados con el mismo Client ID que se usa para validar.

### ¿Puedo tener múltiples Client IDs para desarrollo y producción?
✅ Sí, puedes tener:
- Un Client ID para desarrollo (`localhost:5173`)
- Otro Client ID para producción (`tudominio.com`)

Pero en ese caso, el backend debe validar contra ambos o usar variables de entorno diferentes.

## ✅ Checklist de Verificación

- [ ] Frontend tiene `VITE_GOOGLE_CLIENT_ID` en `.env`
- [ ] Backend tiene `GOOGLE_CLIENT_ID` (o nombre equivalente) en su `.env`
- [ ] Ambos Client IDs son **idénticos**
- [ ] Ambos Client IDs provienen del mismo proyecto de Google Cloud
- [ ] El backend está usando el Client ID para validar el token
- [ ] El backend tiene instalada la librería de Google Auth correspondiente

## 🔍 Cómo Verificar que Está Configurado Correctamente

1. **Frontend**: Abre la consola del navegador y verifica que no aparezca el mensaje de "Client ID no configurado"

2. **Backend**: Verifica los logs cuando intentas hacer login:
   - Si ves "Token de Google inválido", probablemente el Client ID no coincide
   - Si funciona correctamente, verás información del usuario de Google

3. **Google Cloud Console**: Verifica que ambos lados estén usando el Client ID del mismo proyecto

