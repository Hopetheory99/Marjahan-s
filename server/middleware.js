/**
 * Validation middleware
 * Validates request payloads against Zod schemas and returns 400 on validation errors
 */

const logger = require('./logger');

const validate = (schema) => {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.body);
      req.validatedData = validated;
      next();
    } catch (error) {
      logger.warn('Request validation failed', {
        path: req.path,
        errors: error.errors?.map((e) => ({ path: e.path.join('.'), message: e.message })),
      });

      return res.status(400).json({
        message: 'Validation failed',
        errors: error.errors?.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }
  };
};

module.exports = { validate };
