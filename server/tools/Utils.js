
function JsonIsNull(value) {
  var type;
  if (value == null) { // 等同于 value === undefined || value === null  
    return true;
  }

  if (Array.isArray(value) && value.length==0) {
    return true;
  }

  return false;
};


module.exports =
  {
    JsonIsNull: JsonIsNull
  }