// Shared constants for the application

// Gender enum (SQLite doesn't support native enums)
export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHER = 'OTHER',
}

// Sort order
export enum OrderBy {
    Asc = 'asc',
    Desc = 'desc',
}

// Sort fields for profiles
export enum ProfileSortBy {
    CreatedAt = 'createdAt',
    Age = 'age',
    Name = 'name',
}
