export const handleSaveError = (error, data, next) => {
  error.status = 400;
  next(error);
};

export const handleUpdateError = function (next) {
  this.options.new = true;
  this.options.runValidators = true;
  next();
};
