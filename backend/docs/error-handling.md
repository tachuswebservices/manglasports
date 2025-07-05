# Error Handling

- All controller functions use try/catch blocks
- Errors are returned as JSON with an `error` field and appropriate HTTP status code
- Example:
  ```js
  try {
    // ...
  } catch (err) {
    res.status(400).json({ error: 'Failed to ...' });
  }
  ```
- Unhandled errors are logged to the console
- Use meaningful error messages for client debugging 