# CV & Professional Profile Management (MVP) Implementation Notes

## 1. Data Model Summary (Conceptual)

- **Entity**: `CV` (Table: `cvs`)
- **Fields**:
  - `id`: UUID (Primary Key)
  - `userId`: UUID (Foreign Key to generic Users table)
  - `fileName`: String (Original file name)
  - `filePath`: String (Local system path)
  - `fileType`: String (MIME type)
  - `fileSize`: Number (Bytes)
  - `version`: Number (Incremental versioning, starting from 1)
  - `isLatest`: Boolean (Flag for identifying the current active CV)
  - `uploadedAt`: Timestamp (Creation date)

## 2. File Storage Strategy

- **Storage Type**: Local Filesystem
- **Directory**: `uploads/cv/{userId}/` (Relative to project root)
- **Naming Convention**: `v{version}_{timestamp}{extension}` to ensure uniqueness and order.
- **Security**: Files are stored outside the public web root (typically) and served via a controlled API endpoint locally.

## 3. API List

| Method   | Endpoint              | Description                                                                   | Access                        |
| :------- | :-------------------- | :---------------------------------------------------------------------------- | :---------------------------- |
| **POST** | `/me/cv`              | Upload a new CV file (Multipart/form-data). Automatically increments version. | Authenticated User (Own data) |
| **GET**  | `/me/cv`              | List all CV versions for the current user.                                    | Authenticated User (Own data) |
| **GET**  | `/me/cv/:id/download` | Download a specific CV version file.                                          | Authenticated User (Own data) |

## 4. Known Limitations (MVP)

- **Storage**: No external cloud storage (S3/GCS). Not suitable for ephemeral container deployments (like Heroku) without persistent volumes.
- **Validation**: Basic file type (PDF, DOC, DOCX) and size limits (10MB).
- **Deletion**: No API to delete old versions (Read-only history).
- **Admin Access**: Admins cannot view or manage user CVs in this version.
- **Sharing**: No public sharing link generation.
