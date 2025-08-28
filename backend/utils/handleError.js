const handleHttpError = (res, message = 'Algo sucedió', code = 403) => {
    res.status(code).json({ error: message });
}

module.exports = { handleHttpError };
