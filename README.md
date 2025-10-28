## Requisitos previos
- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) 
- [Python 3.10+](https://www.python.org/downloads/)
- [Expo CLI](https://docs.expo.dev/)

## Ejecutar localmente

### Backend (Django REST Framework)

#### 1. Entrar a la carpeta del backend
```bash
cd backend
```

#### 2. Crear y activar un entorno virtual
**Linux / macOS**
```bash
python3 -m venv venv
source venv/bin/activate
```

**Windows (PowerShell)**
```bash
python -m venv venv
venv\Scripts\activate
```

#### 3. Instalar dependencias
```bash
pip install -r requirements.txt
```

#### 4. Configurar la base de datos SQLite
Abre `backend/remember_you/settings.py` y asegúrate de tener esta configuración:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

#### 5. Ejecutar migraciones
```bash
python manage.py migrate
```

#### 6. Crear un superusuario (opcional pero recomendado)
```bash
python manage.py createsuperuser
```

#### 7. Correr el servidor de desarrollo
```bash
python manage.py runserver
```

El backend estará disponible en:
```
http://127.0.0.1:8000/
```
