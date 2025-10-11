# UML Component Diagrams - Medical Management System

## Tổng Quan
Sơ đồ thành phần UML mô tả cấu trúc các thành phần và mối quan hệ giữa chúng trong hệ thống quản lý y tế.

## 1. Component Diagram - System Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        FE[React Frontend]
        UI[UI Components]
        API_CLIENT[API Client]
    end
    
    subgraph "API Gateway Layer"
        GW[API Gateway]
        AUTH_GW[Authentication Gateway]
        RATE_LIMIT[Rate Limiting]
    end
    
    subgraph "Application Layer"
        subgraph "Controllers"
            AUTH_CTRL[AuthController]
            USER_CTRL[UserController]
            PRESC_CTRL[PrescriptionController]
            DOCTOR_CTRL[DoctorController]
            PATIENT_CTRL[PatientController]
            NOTIF_CTRL[NotificationController]
            REPORT_CTRL[ReportController]
        end
        
        subgraph "Services"
            AUTH_SVC[AuthService]
            USER_SVC[UserService]
            PRESC_SVC[PrescriptionService]
            NOTIF_SVC[NotificationService]
            REPORT_SVC[ReportService]
            EMAIL_SVC[EmailService]
            SMS_SVC[SMSService]
        end
        
        subgraph "Business Logic"
            PRESC_LOGIC[PrescriptionLogic]
            ADHERENCE_LOGIC[AdherenceLogic]
            ALERT_LOGIC[AlertLogic]
            SCHEDULER[MedicationScheduler]
        end
    end
    
    subgraph "Data Access Layer"
        PRISMA[Prisma ORM]
        REPO[Repository Pattern]
        CACHE[Redis Cache]
    end
    
    subgraph "Database Layer"
        POSTGRES[(PostgreSQL Database)]
        REDIS[(Redis Cache)]
    end
    
    subgraph "External Services"
        EMAIL_PROVIDER[Email Provider]
        SMS_PROVIDER[SMS Provider]
        PUSH_SERVICE[Push Notification Service]
    end
    
    subgraph "Infrastructure"
        WEBSOCKET[WebSocket Server]
        CRON[Cron Jobs]
        LOGGER[Logger Service]
        MONITOR[Monitoring Service]
    end
    
    %% Frontend connections
    FE --> UI
    FE --> API_CLIENT
    API_CLIENT --> GW
    
    %% API Gateway connections
    GW --> AUTH_GW
    GW --> RATE_LIMIT
    GW --> AUTH_CTRL
    GW --> USER_CTRL
    GW --> PRESC_CTRL
    GW --> DOCTOR_CTRL
    GW --> PATIENT_CTRL
    GW --> NOTIF_CTRL
    GW --> REPORT_CTRL
    
    %% Controller to Service connections
    AUTH_CTRL --> AUTH_SVC
    USER_CTRL --> USER_SVC
    PRESC_CTRL --> PRESC_SVC
    DOCTOR_CTRL --> PRESC_SVC
    PATIENT_CTRL --> PRESC_SVC
    NOTIF_CTRL --> NOTIF_SVC
    REPORT_CTRL --> REPORT_SVC
    
    %% Service to Business Logic connections
    PRESC_SVC --> PRESC_LOGIC
    PRESC_SVC --> ADHERENCE_LOGIC
    NOTIF_SVC --> ALERT_LOGIC
    NOTIF_SVC --> SCHEDULER
    
    %% Service to External connections
    NOTIF_SVC --> EMAIL_SVC
    NOTIF_SVC --> SMS_SVC
    EMAIL_SVC --> EMAIL_PROVIDER
    SMS_SVC --> SMS_PROVIDER
    NOTIF_SVC --> PUSH_SERVICE
    
    %% Data Access connections
    AUTH_SVC --> PRISMA
    USER_SVC --> PRISMA
    PRESC_SVC --> PRISMA
    NOTIF_SVC --> PRISMA
    REPORT_SVC --> PRISMA
    
    PRISMA --> REPO
    REPO --> POSTGRES
    REPO --> CACHE
    CACHE --> REDIS
    
    %% Infrastructure connections
    WEBSOCKET --> NOTIF_SVC
    CRON --> SCHEDULER
    LOGGER --> AUTH_SVC
    LOGGER --> USER_SVC
    LOGGER --> PRESC_SVC
    LOGGER --> NOTIF_SVC
    MONITOR --> AUTH_SVC
    MONITOR --> USER_SVC
    MONITOR --> PRESC_SVC
    MONITOR --> NOTIF_SVC
```

## 2. Component Diagram - Prescription Module

```mermaid
graph TB
    subgraph "Prescription Module"
        subgraph "Controllers"
            PRESC_CTRL[PrescriptionController]
            DOCTOR_PRESC_CTRL[DoctorPrescriptionController]
            PATIENT_PRESC_CTRL[PatientPrescriptionController]
            ADMIN_PRESC_CTRL[AdminPrescriptionController]
        end
        
        subgraph "Services"
            PRESC_SVC[PrescriptionService]
            ADHERENCE_SVC[AdherenceService]
            VALIDATION_SVC[ValidationService]
        end
        
        subgraph "Business Logic"
            PRESC_LOGIC[PrescriptionLogic]
            ADHERENCE_LOGIC[AdherenceLogic]
            INTERACTION_LOGIC[DrugInteractionLogic]
            SCHEDULE_LOGIC[MedicationScheduleLogic]
        end
        
        subgraph "Data Models"
            PRESC_MODEL[Prescription Model]
            PRESC_ITEM_MODEL[PrescriptionItem Model]
            ADHERENCE_MODEL[AdherenceLog Model]
            MEDICATION_MODEL[Medication Model]
        end
        
        subgraph "External Dependencies"
            USER_SVC[UserService]
            NOTIF_SVC[NotificationService]
            MEDICATION_SVC[MedicationService]
        end
    end
    
    %% Controller connections
    PRESC_CTRL --> PRESC_SVC
    DOCTOR_PRESC_CTRL --> PRESC_SVC
    PATIENT_PRESC_CTRL --> PRESC_SVC
    ADMIN_PRESC_CTRL --> PRESC_SVC
    
    %% Service connections
    PRESC_SVC --> PRESC_LOGIC
    PRESC_SVC --> VALIDATION_SVC
    ADHERENCE_SVC --> ADHERENCE_LOGIC
    
    %% Business Logic connections
    PRESC_LOGIC --> INTERACTION_LOGIC
    PRESC_LOGIC --> SCHEDULE_LOGIC
    ADHERENCE_LOGIC --> SCHEDULE_LOGIC
    
    %% Data Model connections
    PRESC_SVC --> PRESC_MODEL
    PRESC_SVC --> PRESC_ITEM_MODEL
    ADHERENCE_SVC --> ADHERENCE_MODEL
    PRESC_SVC --> MEDICATION_MODEL
    
    %% External Dependencies
    PRESC_SVC --> USER_SVC
    PRESC_SVC --> NOTIF_SVC
    PRESC_SVC --> MEDICATION_SVC
    ADHERENCE_SVC --> NOTIF_SVC
```

## 3. Component Diagram - Notification Module

```mermaid
graph TB
    subgraph "Notification Module"
        subgraph "Controllers"
            NOTIF_CTRL[NotificationController]
            WEBSOCKET_CTRL[WebSocketController]
        end
        
        subgraph "Services"
            NOTIF_SVC[NotificationService]
            EMAIL_SVC[EmailService]
            SMS_SVC[SMSService]
            PUSH_SVC[PushService]
            WEBSOCKET_SVC[WebSocketService]
        end
        
        subgraph "Business Logic"
            ALERT_LOGIC[AlertLogic]
            SCHEDULER_LOGIC[MedicationSchedulerLogic]
            TEMPLATE_LOGIC[NotificationTemplateLogic]
        end
        
        subgraph "Data Models"
            ALERT_MODEL[Alert Model]
            NOTIF_TEMPLATE_MODEL[NotificationTemplate Model]
            NOTIF_LOG_MODEL[NotificationLog Model]
        end
        
        subgraph "External Providers"
            EMAIL_PROVIDER[Email Provider]
            SMS_PROVIDER[SMS Provider]
            PUSH_PROVIDER[Push Notification Provider]
        end
        
        subgraph "Infrastructure"
            WEBSOCKET_SERVER[WebSocket Server]
            CRON_SCHEDULER[Cron Scheduler]
            QUEUE_SERVICE[Queue Service]
        end
    end
    
    %% Controller connections
    NOTIF_CTRL --> NOTIF_SVC
    WEBSOCKET_CTRL --> WEBSOCKET_SVC
    
    %% Service connections
    NOTIF_SVC --> EMAIL_SVC
    NOTIF_SVC --> SMS_SVC
    NOTIF_SVC --> PUSH_SVC
    NOTIF_SVC --> WEBSOCKET_SVC
    
    %% Business Logic connections
    NOTIF_SVC --> ALERT_LOGIC
    NOTIF_SVC --> SCHEDULER_LOGIC
    NOTIF_SVC --> TEMPLATE_LOGIC
    
    %% Data Model connections
    NOTIF_SVC --> ALERT_MODEL
    NOTIF_SVC --> NOTIF_TEMPLATE_MODEL
    NOTIF_SVC --> NOTIF_LOG_MODEL
    
    %% External Provider connections
    EMAIL_SVC --> EMAIL_PROVIDER
    SMS_SVC --> SMS_PROVIDER
    PUSH_SVC --> PUSH_PROVIDER
    
    %% Infrastructure connections
    WEBSOCKET_SVC --> WEBSOCKET_SERVER
    SCHEDULER_LOGIC --> CRON_SCHEDULER
    NOTIF_SVC --> QUEUE_SERVICE
```

## 4. Component Diagram - Authentication Module

```mermaid
graph TB
    subgraph "Authentication Module"
        subgraph "Controllers"
            AUTH_CTRL[AuthController]
            JWT_CTRL[JWTController]
        end
        
        subgraph "Services"
            AUTH_SVC[AuthService]
            JWT_SVC[JWTService]
            USER_SVC[UserService]
            PASSWORD_SVC[PasswordService]
        end
        
        subgraph "Business Logic"
            AUTH_LOGIC[AuthenticationLogic]
            AUTHORIZATION_LOGIC[AuthorizationLogic]
            SESSION_LOGIC[SessionLogic]
        end
        
        subgraph "Data Models"
            USER_MODEL[User Model]
            SESSION_MODEL[Session Model]
            TOKEN_MODEL[Token Model]
        end
        
        subgraph "Security"
            JWT_LIBRARY[JWT Library]
            BCRYPT[BCrypt]
            RATE_LIMITER[Rate Limiter]
        end
        
        subgraph "External Dependencies"
            DATABASE[Database]
            CACHE[Cache]
            LOGGER[Logger]
        end
    end
    
    %% Controller connections
    AUTH_CTRL --> AUTH_SVC
    JWT_CTRL --> JWT_SVC
    
    %% Service connections
    AUTH_SVC --> USER_SVC
    AUTH_SVC --> PASSWORD_SVC
    AUTH_SVC --> JWT_SVC
    
    %% Business Logic connections
    AUTH_SVC --> AUTH_LOGIC
    AUTH_SVC --> AUTHORIZATION_LOGIC
    AUTH_SVC --> SESSION_LOGIC
    
    %% Data Model connections
    AUTH_SVC --> USER_MODEL
    AUTH_SVC --> SESSION_MODEL
    JWT_SVC --> TOKEN_MODEL
    
    %% Security connections
    JWT_SVC --> JWT_LIBRARY
    PASSWORD_SVC --> BCRYPT
    AUTH_SVC --> RATE_LIMITER
    
    %% External Dependencies
    USER_SVC --> DATABASE
    SESSION_LOGIC --> CACHE
    AUTH_SVC --> LOGGER
```

## 5. Component Diagram - Database Layer

```mermaid
graph TB
    subgraph "Database Layer"
        subgraph "ORM Layer"
            PRISMA[Prisma ORM]
            PRISMA_CLIENT[Prisma Client]
            PRISMA_MIGRATE[Prisma Migrate]
        end
        
        subgraph "Repository Layer"
            USER_REPO[UserRepository]
            PRESC_REPO[PrescriptionRepository]
            MEDICATION_REPO[MedicationRepository]
            ADHERENCE_REPO[AdherenceRepository]
            ALERT_REPO[AlertRepository]
        end
        
        subgraph "Database Services"
            CONNECTION_POOL[Connection Pool]
            TRANSACTION_MGR[Transaction Manager]
            QUERY_BUILDER[Query Builder]
        end
        
        subgraph "Data Models"
            USER_SCHEMA[User Schema]
            PRESC_SCHEMA[Prescription Schema]
            MEDICATION_SCHEMA[Medication Schema]
            ADHERENCE_SCHEMA[Adherence Schema]
            ALERT_SCHEMA[Alert Schema]
        end
        
        subgraph "Database Instances"
            POSTGRES_MAIN[(PostgreSQL Main)]
            POSTGRES_REPLICA[(PostgreSQL Replica)]
            REDIS_CACHE[(Redis Cache)]
        end
        
        subgraph "External Tools"
            PRISMA_STUDIO[Prisma Studio]
            DB_MIGRATIONS[Database Migrations]
            BACKUP_SERVICE[Backup Service]
        end
    end
    
    %% ORM Layer connections
    PRISMA --> PRISMA_CLIENT
    PRISMA --> PRISMA_MIGRATE
    
    %% Repository connections
    USER_REPO --> PRISMA_CLIENT
    PRESC_REPO --> PRISMA_CLIENT
    MEDICATION_REPO --> PRISMA_CLIENT
    ADHERENCE_REPO --> PRISMA_CLIENT
    ALERT_REPO --> PRISMA_CLIENT
    
    %% Database Services connections
    PRISMA_CLIENT --> CONNECTION_POOL
    PRISMA_CLIENT --> TRANSACTION_MGR
    PRISMA_CLIENT --> QUERY_BUILDER
    
    %% Data Model connections
    PRISMA --> USER_SCHEMA
    PRISMA --> PRESC_SCHEMA
    PRISMA --> MEDICATION_SCHEMA
    PRISMA --> ADHERENCE_SCHEMA
    PRISMA --> ALERT_SCHEMA
    
    %% Database Instance connections
    CONNECTION_POOL --> POSTGRES_MAIN
    CONNECTION_POOL --> POSTGRES_REPLICA
    CONNECTION_POOL --> REDIS_CACHE
    
    %% External Tools connections
    PRISMA_MIGRATE --> DB_MIGRATIONS
    PRISMA_STUDIO --> POSTGRES_MAIN
    BACKUP_SERVICE --> POSTGRES_MAIN
    BACKUP_SERVICE --> POSTGRES_REPLICA
```

## Mô Tả Chi Tiết

### 1. System Architecture Component Diagram
- **Frontend Layer**: React frontend với UI components và API client
- **API Gateway Layer**: API gateway với authentication và rate limiting
- **Application Layer**: Controllers, Services, và Business Logic
- **Data Access Layer**: Prisma ORM với Repository pattern và Redis cache
- **Database Layer**: PostgreSQL database và Redis cache
- **External Services**: Email, SMS, và Push notification providers
- **Infrastructure**: WebSocket server, Cron jobs, Logger, và Monitoring

### 2. Prescription Module Component Diagram
- **Controllers**: Các controller cho prescription management
- **Services**: PrescriptionService, AdherenceService, ValidationService
- **Business Logic**: PrescriptionLogic, AdherenceLogic, DrugInteractionLogic
- **Data Models**: Prescription, PrescriptionItem, AdherenceLog, Medication models
- **External Dependencies**: UserService, NotificationService, MedicationService

### 3. Notification Module Component Diagram
- **Controllers**: NotificationController và WebSocketController
- **Services**: NotificationService, EmailService, SMSService, PushService
- **Business Logic**: AlertLogic, MedicationSchedulerLogic, NotificationTemplateLogic
- **Data Models**: Alert, NotificationTemplate, NotificationLog models
- **External Providers**: Email, SMS, và Push notification providers
- **Infrastructure**: WebSocket server, Cron scheduler, Queue service

### 4. Authentication Module Component Diagram
- **Controllers**: AuthController và JWTController
- **Services**: AuthService, JWTService, UserService, PasswordService
- **Business Logic**: AuthenticationLogic, AuthorizationLogic, SessionLogic
- **Data Models**: User, Session, Token models
- **Security**: JWT library, BCrypt, Rate limiter
- **External Dependencies**: Database, Cache, Logger

### 5. Database Layer Component Diagram
- **ORM Layer**: Prisma ORM với client và migrate
- **Repository Layer**: Các repository cho từng entity
- **Database Services**: Connection pool, Transaction manager, Query builder
- **Data Models**: Các schema cho từng entity
- **Database Instances**: PostgreSQL main/replica và Redis cache
- **External Tools**: Prisma Studio, Database migrations, Backup service

## Lợi Ích Của Component Diagrams

1. **Hiểu rõ kiến trúc**: Giúp hiểu rõ kiến trúc hệ thống và các thành phần
2. **Thiết kế hệ thống**: Hỗ trợ thiết kế và phát triển hệ thống
3. **Tài liệu hóa**: Tài liệu hóa kiến trúc cho team phát triển
4. **Bảo trì**: Dễ dàng bảo trì và mở rộng hệ thống
5. **Giao tiếp**: Giúp giao tiếp giữa team về kiến trúc hệ thống
6. **Testing**: Hỗ trợ thiết kế test cases cho từng thành phần
