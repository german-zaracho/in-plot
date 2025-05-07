const VALIDATION_ERRORS = {
    displayName: 'The User name is required.',
    favMovie: 'Favorite movie can have between 2 and 100 characters or be empty.',
    favSeries: 'Favorite series can have between 2 and 100 characters or be empty.',
    anAdditionalComment: 'The comment can have between 2 and 500 characters or be empty.',
    title: 'The title is required.',
    reviewType: 'You must select whether it is a movie or a series.',
    photo: 'Only JPEG, PNG, or WEBP files under 2MB are allowed',
};

// Schema with validation rules
const validationSchema = {
    displayName: { required: true },
    favMovie: { minLength: 2, maxLength: 100 },
    favSeries: { minLength: 2, maxLength: 100 },
    anAdditionalComment: { minLength: 2, maxLength: 500 },
    title: { required: true },
    reviewType: { required: true, allowed: ['movie', 'series'] },
    photo: {
        required: true,
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
    });

    return errors;
}


