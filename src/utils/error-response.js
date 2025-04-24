export const catchError = (err, res) => {
    return res.status(500).send(err.message);
}