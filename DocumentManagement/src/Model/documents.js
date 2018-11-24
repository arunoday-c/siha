module.exports = {
  saveDocument: (req, res, next) => {
    console.log("Here inside File", req.file);
    res.status(200).json({
      success: true,
      records: req.file
    });
  }
};
