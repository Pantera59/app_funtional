# Configurar cuentas y roles (Supabase)

Sin estas variables la app funciona en **modo local**, como antes: sin cuentas y con los datos solo en el navegador.

## 1. Crear el proyecto

1. Entra a [supabase.com](https://supabase.com) y crea un proyecto (el plan gratuito alcanza).
2. Abre **SQL Editor** → *New query*, pega todo `supabase/migrations/0001_auth_roles.sql` y ejecútalo.
3. En **Authentication → URL Configuration**, pon tu dominio de Vercel en *Site URL* y agrega
   `http://localhost:3000/**` en *Redirect URLs* para desarrollo.
4. (Opcional) En **Authentication → Providers → Email** puedes desactivar *Confirm email*, para que las
   cuentas nuevas entren sin confirmar el correo.

## 2. Variables de entorno

Copia `.env.example` a `.env.local` y llena los valores de **Project Settings → API**:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

En Vercel, agrega las mismas dos variables en *Settings → Environment Variables* y vuelve a desplegar
(se incrustan al hacer el build).

## 3. Primer acceso

- **La primera cuenta que se registra es superadmin.** Regístrate tú primero desde `/login`.
- Todas las cuentas siguientes empiezan como **Alumno**. Desde **Usuarios** (menú de cuenta → Usuarios y roles)
  las subes a **Coach** o **Superadmin**.
- Al entrar como coach por primera vez, tu banco de ejercicios, reglas, materiales e historial de este navegador
  se suben a la nube. Desde ahí todos los coaches comparten la misma copia.

## Roles

| Rol | Puede |
| --- | --- |
| Superadmin | Todo lo del coach y gestionar usuarios y roles. |
| Coach (`admin`) | Planificador, materiales, reglas y banco, modo coach, publicar clases. |
| Alumno (`usuario`) | Ver en **Mis clases** las clases publicadas. |

Los permisos los aplica la base de datos (Row Level Security), no solo la interfaz. Nadie puede cambiarse el rol
a sí mismo y siempre debe quedar al menos un superadmin.

## Recuperar acceso

Si te quedas sin superadmin, en el SQL Editor:

```sql
update public.profiles set role = 'superadmin' where email = 'tu@correo.com';
```
