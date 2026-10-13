# Student Management System — CampusFlow

A full-stack student management project with a modern responsive dashboard, Java 17, Spring Boot, Spring Data JPA, MySQL, HTML, CSS and JavaScript.

## Features
- Dashboard cards: total students, active students, and unique courses
- Add, view, search, edit, and delete students (CRUD)
- Student fields: name, email, phone, course, department, year, status
- Input validation and duplicate-email protection
- Responsive interface for desktop and mobile
- REST API at `/api/students`

## Requirements
- Java JDK 17 or newer
- Maven 3.6+ (or use an IDE with Maven support)
- MySQL 8+
- IntelliJ IDEA, Eclipse, or VS Code (optional)

## Run on Windows

### 1. Create the database
Open MySQL Workbench or MySQL Command Line and run:

```sql
CREATE DATABASE student_management;
```

### 2. Configure your MySQL password
Open `src/main/resources/application.properties`. The default username is `root` and the password is blank. If your MySQL password is different, either update the properties or set environment variables:

**Command Prompt:**
```bat
set DB_USERNAME=root
set DB_PASSWORD=YOUR_MYSQL_PASSWORD
```

**PowerShell:**
```powershell
$env:DB_USERNAME="root"
$env:DB_PASSWORD="YOUR_MYSQL_PASSWORD"
```

### 3. Start the app
From this project folder, run:

```bash
mvn spring-boot:run
```

If Maven is not installed, open the folder in IntelliJ IDEA and run `StudentManagementApplication.java` after Maven dependencies finish loading.

### 4. Open the website
Visit: http://localhost:8080

The Spring Boot app serves the dashboard and API on the same port. The first run creates/updates the `students` table automatically.

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/students` | List all students |
| GET | `/api/students?search=hari` | Search by name or email |
| GET | `/api/students/{id}` | Get one student |
| POST | `/api/students` | Add student |
| PUT | `/api/students/{id}` | Update student |
| DELETE | `/api/students/{id}` | Delete student |

Example POST body:

```json
{
  "name": "Aditi Sharma",
  "email": "aditi@example.com",
  "phone": "+91 9876543210",
  "course": "MCA",
  "department": "Computer Applications",
  "yearOfStudy": 1,
  "status": "Active"
}
```

## Troubleshooting
- **Communications link failure:** Start MySQL Server and verify the port, username, and password.
- **Access denied for user:** Update `DB_USERNAME` and `DB_PASSWORD`.
- **Port 8080 already in use:** Change `server.port=8081`, then open `http://localhost:8081`.
- **`mvn` is not recognized:** Install Maven or run the project using IntelliJ IDEA's Maven integration.
- **Email already exists:** Each student must have a unique email address.

## Folder structure

```text
Student-Management-System/
├── pom.xml
├── README.md
├── database/
│   └── schema.sql
└── src/main/
    ├── java/com/hariom/sms/
    │   ├── StudentManagementApplication.java
    │   ├── config/WebConfig.java
    │   ├── controller/StudentController.java
    │   ├── model/Student.java
    │   └── repository/StudentRepository.java
    └── resources/
        ├── application.properties
        └── static/
            ├── index.html
            ├── styles.css
            └── app.js
```

## Before publishing
This is a learning/demo project. Before deploying publicly, add authentication and role-based access, restrict CORS, use environment secrets, and configure production database migrations/backups.
