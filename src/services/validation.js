const VALIDATION_ERRORS = {
    displayName: 'The User name is required.',
    favMovie: 'Favorite movie can have between 2 and 100 characters or be empty.',
    favSeries: 'Favorite series can have between 2 and 100 characters or be empty.',
    anAdditionalComment: 'The comment can have between 2 and 500 characters or be empty.',
    title: 'The title is required.',
    reviewType: 'You must select whether it is a movie or a series.',
    contentType: 'You must select whether it is a movie or a series.',
    synopsis: 'The synopsis can have up to 500 characters or be empty.',
    trailer: 'If provided, the trailer must start with "www.youtube.com/".',
    year: 'The year must be a number between 1900 and 2026.',
    photo: 'Only JPEG, PNG, or WEBP files under 2MB are allowed',
};

// Schema with validation rules
const validationSchema = {
    displayName: { required: true },
    favMovie: { minLength: 2, maxLength: 100 },
    favSeries: { minLength: 2, maxLength: 100 },
    anAdditionalComment: { minLength: 2, maxLength: 500 },
    title: { required: true },
    year: { type: 'number', min: 1900, max: 2026 },
    synopsis: { maxLength: 500 },
    trailer: { pattern: /^https:\/\/www\.youtube\.com\// },
    contentType: { required: true, allowed: ['Movie', 'Series'] },
    reviewType: { required: true, allowed: ['Movie', 'Series'] },
    photo: {
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
        maxSize: 2 * 1024 * 1024 // 2MB in bytes
    },
};

// Generic validator that runs the schema and applies rules
export function validatePostFields(data, fieldsToValidate) {
    const errors = {};

    fieldsToValidate.forEach((field) => {
        const rules = validationSchema[field];
        const value = data[field];
        
        if (!rules) return;

        if (field === 'photo' && value instanceof File) {
            if (rules.allowedTypes && !rules.allowedTypes.includes(value.type)) {
                errors[field] = VALIDATION_ERRORS[field];
                return;
            }
        
            if (rules.maxSize && value.size > rules.maxSize) {
                errors[field] = VALIDATION_ERRORS[field];
                return;
            }
        
            return; 
        }

        const trimmedValue = (value ?? '').toString().trim();

        // Required field validation
        if (rules.required && trimmedValue === '') {
            errors[field] = VALIDATION_ERRORS[field];
            return;
        }

        // If the field is not required and is empty, we skip further validations.
        if (!rules.required && trimmedValue === '') {
            return;
        }

        // Pattern validation ( trailer URL)
        if (rules.pattern && !rules.pattern.test(trimmedValue)) {
            errors[field] = VALIDATION_ERRORS[field];
            return;
        }

        // Minimum validation
        if (rules.minLength && trimmedValue.length < rules.minLength) {
            errors[field] = VALIDATION_ERRORS[field];
            return;
        }

        // Maximum validation
        if (rules.maxLength && trimmedValue.length > rules.maxLength) {
            errors[field] = VALIDATION_ERRORS[field];
            return;
        }

        // Validation of allowed values
        if (rules.allowed && !rules.allowed.includes(value)) {
            errors[field] = VALIDATION_ERRORS[field];
        }

        // Type 'number' validation (year min/max)
        if (rules.type === 'number') {
            const numericValue = Number(value);
            if (isNaN(numericValue) || (rules.min && numericValue < rules.min) || (rules.max && numericValue > rules.max)) {
                errors[field] = VALIDATION_ERRORS[field];
                return;
            }
        }
    });

    return errors;
}


