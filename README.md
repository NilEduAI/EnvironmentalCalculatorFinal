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
- Backend: Node.js + Express
- Base de datos: PostgreSQL
- Email: Nodemailer

## Despliegue

### Variables de entorno requeridas:

```
DATABASE_URL=tu_url_de_postgresql
GMAIL_USER=tu_email@gmail.com
GMAIL_PASSWORD=tu_contraseña_de_aplicacion
```

### Comandos:

```bash
npm install
npm run build
npm start
```

## Factores de emisión

- Transporte: desde 0 kg CO₂e/día (caminar) hasta 8.8 kg CO₂e/día (coche privado)
- Hidratación: desde 0.2 kg CO₂e/día (agua del grifo) hasta 0.9 kg CO₂e/día (bebidas)
- Envasado: desde 0.1 kg CO₂e/día (sin envases) hasta 0.8 kg CO₂e/día (botellas de plástico)

---

Desarrollado para el Institut de Química i Biotecnologia de Barcelona