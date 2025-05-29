# Calculadora de Impacto Ambiental - IQBB

Aplicación web para calcular el impacto ambiental de estudiantes del Institut de Química i Biotecnologia de Barcelona.

## Características

- Cálculo de huella de carbono basado en transporte, hidratación y hábitos de envasado
- Soporte multiidioma (Español, Catalán, Inglés)
- Registro de estudiantes y reportes personalizados por email
- Comparativa con el promedio de todos los usuarios
- Documentación técnica con metodología científica

## Tecnologías

- Frontend: React + TypeScript + Tailwind CSS
- Backend: Netlify Functions
- Base de datos: Supabase PostgreSQL
- Email: Nodemailer

## Despliegue en Netlify + Supabase

### 1. Configurar Supabase:
1. Crear cuenta en [Supabase](https://supabase.com)
2. Crear nuevo proyecto
3. Ir a Settings → Database
4. Copiar la Connection String (URI)

### 2. Variables de entorno en Netlify:
```
DATABASE_URL=postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
GMAIL_USER=tu_email@gmail.com
GMAIL_PASSWORD=tu_contraseña_de_aplicacion
```

### 3. Comandos:
```bash
npm install
npm run build
```

## Factores de emisión

- Transporte: desde 0 kg CO₂e/día (caminar) hasta 8.8 kg CO₂e/día (coche privado)
- Hidratación: desde 0.2 kg CO₂e/día (agua del grifo) hasta 0.9 kg CO₂e/día (bebidas)
- Envasado: desde 0.1 kg CO₂e/día (sin envases) hasta 0.8 kg CO₂e/día (botellas de plástico)

---

Desarrollado para el Institut de Química i Biotecnologia de Barcelona