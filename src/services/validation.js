const VALIDATION_ERRORS = {
    displayName: 'The User name is required.',
    favMovie: 'Favorite movie can have between 2 and 100 characters or be empty.',
    favSeries: 'Favorite series can have between 2 and 100 characters or be empty.',
    anAdditionalComment: 'The comment can have between 2 and 500 characters or be empty.',
    title: 'The title is required.',
    reviewType: 'You must select whether it is a movie or a series.',
};

// Esquema con las reglas de validación
const validationSchema = {
    displayName: { required: true },
    favMovie: { minLength: 2, maxLength: 100 },
    favSeries: { minLength: 2, maxLength: 100 },
    anAdditionalComment: { minLength: 2, maxLength: 500 },
    title: { required: true },
    reviewType: { required: true, allowed: ['movie', 'series'] },
};

// Validador genérico que recorre el esquema y aplica reglas
export function validatePostFields(data, fieldsToValidate) {
    const errors = {};

    fieldsToValidate.forEach((field) => {
        const rules = validationSchema[field];
        const value = data[field];
        

        if (!rules) return;

        const trimmedValue = (value ?? '').toString().trim();

        // Validación de campo requerido
        if (rules.required && trimmedValue === '') {
            errors[field] = VALIDATION_ERRORS[field];
            return;
        }

        // Si el campo no es requerido y está vacío, salteamos otras validaciones
        if (!rules.required && trimmedValue === '') {
            return;
        }

        // Validación de mínimo
        if (rules.minLength && trimmedValue.length < rules.minLength) {
            errors[field] = VALIDATION_ERRORS[field];
            return;
        }

        // Validación de máximo
        if (rules.maxLength && trimmedValue.length > rules.maxLength) {
            errors[field] = VALIDATION_ERRORS[field];
            return;
        }

        // Validación de valores permitidos
        if (rules.allowed && !rules.allowed.includes(value)) {
            errors[field] = VALIDATION_ERRORS[field];
        }
    });

    return errors;
}



