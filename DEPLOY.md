# Configuración de Despliegue Automático

## Secrets de GitHub

Para que el despliegue automático funcione, debes configurar los siguientes **secrets** en tu repositorio de GitHub:

### Cómo agregar secrets:

1. Ve a tu repositorio en GitHub: `https://github.com/codigoraul/istmoconsultores-wpastro`
2. Click en **Settings** (Configuración)
3. En el menú lateral, click en **Secrets and variables** → **Actions**
4. Click en **New repository secret**
5. Agrega cada uno de los siguientes secrets:

### Secrets requeridos:

| Nombre del Secret | Valor |
|------------------|-------|
| `FTP_SERVER` | `ftp.istmoconsultores.cl` |
| `FTP_USERNAME` | `conexion@istmoconsultores.cl` |
| `FTP_PASSWORD` | `[TU_CONTRASEÑA_FTP]` |
| `FTP_PORT` | `21` |

### Importante:

- **FTP_PASSWORD**: Debes ingresar la contraseña de tu cuenta FTP. Este valor es sensible y nunca se mostrará después de guardarlo.
- Los nombres de los secrets deben ser **exactamente** como se muestran arriba (en mayúsculas).

## Cómo funciona el despliegue

1. Cada vez que hagas `git push` a la rama `main`, se activará automáticamente el workflow.
2. GitHub Actions:
   - Descargará el código
   - Instalará las dependencias (`npm ci`)
   - Construirá el proyecto (`npm run build`)
   - Subirá los archivos de la carpeta `dist/` a `istmoconsultores.cl/prueba/` vía FTPS

## Verificar el despliegue

Después de hacer push, puedes ver el progreso del despliegue en:
- GitHub → Tu repositorio → Pestaña **Actions**

El sitio estará disponible en: `https://istmoconsultores.cl/prueba/`

## Despliegue manual

Si necesitas redesplegar sin hacer cambios en el código:
1. Ve a **Actions** en GitHub
2. Selecciona el workflow "Deploy to FTP"
3. Click en **Run workflow** → **Run workflow**

## Notas

- El protocolo usado es **FTPS** (FTP sobre TLS/SSL) en el puerto 21
- Los archivos se suben a la carpeta `/prueba/` en el servidor
- El despliegue NO borra archivos existentes (`dangerous-clean-slate: false`)
