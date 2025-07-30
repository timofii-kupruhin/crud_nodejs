# 📦 CRUD API на Node.js

**(MongoDB + Redis + Nginx + Docker + Jenkins)**

> Простий, але функціональний REST API-проєкт із підтримкою продакшн-розгортання на AWS EC2 через Jenkins.

---

## 🔧 Системні вимоги

* **Node.js** 18
* **Docker**
* **Docker Compose**
* **Git**

---

## 📁 Файл `.env_example`

Розмісти файл у корені проєкту (`crud_nodejs/.env_example`):

```
PORT=3000
PORT_PRODUCTION=80

JWT_SECRET="Your TOKEN"
SESSION_SECRET="Secret"

MONGO_DB_URL=mongodb://admin:12345@mongo:27017/?authSource=admin
MONGO_DB_DEV_URL=mongodb+srv://admin:12345@nodemongo.e9qyvvb.mongodb.net/?retryWrites=true&w=majority

MONGO_ADMIN=admin
MONGO_PASSWORD=12345

REDIS_DB_URL=redis://redis:6379
```

---

## 🚀 Запуск проєкту з Docker

### 🔹 1. Клонування репозиторію

```bash
git clone https://github.com/timofii-kupruhin/crud_nodejs.git
cd crud_nodejs
```

### 🔹 2. Запуск у режимі розробки (Dev)

```bash
docker-compose --env-file .env -f docker-compose.yml -f docker-compose.dev.yml up -d --build
```

---

## ☁️ Деплой на AWS EC2 (Production)

### 🧱 Крок 1: Встановлення Jenkins

#### Для Ubuntu 18.04/20.04/22.04:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install openjdk-11-jdk -y

curl -fsSL https://pkg.jenkins.io/debian/jenkins.io-2023.key | sudo tee /usr/share/keyrings/jenkins-keyring.asc > /dev/null
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian binary/ | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null

sudo apt update
sudo apt install jenkins -y

sudo systemctl enable jenkins
sudo systemctl start jenkins
```

---

### 🌐 Крок 2: Доступ до Jenkins

У браузері відкрий:

```
http://<IP-адреса-сервера>:8080
```

> ⚠️ В AWS EC2 дозволити порт **8080** у **Security Group**.

Щоб отримати початковий пароль Jenkins:

```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

---

### 🧹 Крок 3: Початкова конфігурація Jenkins

1. Вибери **Install suggested plugins**
2. Створи обліковий запис адміністратора
3. Натисни **Start using Jenkins**

---

### 🛠️ Крок 4: Встановлення Docker

```bash
sudo apt install docker.io docker-compose -y
sudo usermod -aG docker jenkins
sudo systemctl restart docker
sudo systemctl restart jenkins
```

---

### 🔑 Крок 5: Додай `.env` на сервер

```bash
sudo nano /home/ubuntu/.env
```

(скопіюй туди вміст `.env_example` і заповни значення)

---

### ⚙️ Крок 6: Налаштування пайплайну

1. У Jenkins → **New Item**
2. Назва: `crud_nodejs_deploy`
3. Тип: **Pipeline**
4. SCM: **Git**

   * URL: `https://github.com/timofii-kupruhin/crud_nodejs.git`
   * Branch: `main`
   * Script Path: `Jenkinsfile`

---

### 🚀 Крок 7: Запуск деплою

У Jenkins → **Build Now**

> Після успішного деплою буде повідомлення ✅ Контейнери запущені.

Перевір доступ:
http://localhost:80

---

![image](https://github.com/user-attachments/assets/89e29d20-1e80-4123-950f-47ac41f1d271)

---

🔒 **Безпека:** Не забудь **змінити паролі та секрети** перед продакшн-деплоєм!

📚 **Рекомендація:** Використовуй GitHub Secrets + Docker Secrets для безпечного зберігання токенів.
