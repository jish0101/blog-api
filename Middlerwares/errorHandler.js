export const notFoundHandler = async (req, res, next) => {
  try {
    const error = new Error(`Not found: ${req.originalUrl}`);
    res.status(404);
    next(error);
  } catch (error) {
    console.log(error);
  }
};

export const errorHandler = async (err, req, res, next) => {
  try {
    console.log('err: ', err.message);
    const code = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(code);

    if (err instanceof Error && err.message === 'Validation Error') {
      res.status(400).json({
        status: false,
        message: 'Validation Error',
        errors: req.errors,
      });
    } else {
      res.status(code).json({
        status: false,
        message: err.message,
      });
    }

    // res.json({
    //   status: false,
    //   message: err.message,
    // });
  } catch (error) {
    console.log(error);
  } finally {
    next(err);
  }
};
