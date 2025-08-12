# Contact-Book

I'll start with a mobile-first design, create a Contact class for data management, implement CRUD operations with proper validation, and use localStorage for persistence. I'll structure the code with separation of concerns. In below mention i want functional requirement 


Functional Requirements
1. Contact Management 
Add new contacts with validation
View all contacts in an organized layout
Edit existing contact information
Delete contacts with confirmation

2. Contact Information Fields
Name (Required)
Phone Number (Required, with format validation)
Email Address (Required, with email validation)
Category/Tag (Friend, Work, Family, Other)

3. Search & Filter Functionality
Real-time search by name, phone, or email
Filter contacts by category/tag
Clear search and filter options

4. Data Persistence
Store contacts locally (localStorage)
Maintain data between browser sessions

5. User Experience Features
Responsive design for mobile/desktop
Form validation with user feedback
Success/error notifications
Statistics dashboard showing contact counts





High-Level System Design
┌─────────────────────────────────────┐
│           Contact Book App          │
├─────────────────────────────────────┤
│  UI Layer (Presentation)            │
│  ├── ContactForm Component          │
│  ├── ContactList Component          │
│  ├── SearchFilter Component         │
│  └── Statistics Component           │
├─────────────────────────────────────┤
│  Business Logic Layer               │
│  ├── ContactManager (CRUD)          │
│  ├── ValidationService              │
│  ├── SearchService                  │
│  └── NotificationService            │
├─────────────────────────────────────┤
│  Data Layer                         │
│  ├── LocalStorageService            │
│  ├── ContactModel                   │
│  └── DataValidation                 │
