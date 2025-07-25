export const parseDeepJson = (value: any): any => {
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (typeof parsed === 'object' && parsed !== null) {
        return parseDeepJson(parsed);
      }
      return value;
    } catch (error) {
      return value;
    }
  } else if (Array.isArray(value)) {
    return value.map(item => parseDeepJson(item));
  } else if (value && typeof value === 'object') {
    const result: any = {};
    for (const key in value) {
      result[key] = parseDeepJson(value[key]);
    }
    return result;
  }
  return value;
};

export const json2Obj = (params: any, type: 'object' | 'array' = 'object') => {
  let val;
  if (typeof params === 'string') {
    try {
      val = parseDeepJson(params);
    } catch (error) {
      console.warn(error);
    }
  } else if (Array.isArray(params) || typeof params === 'object') {
    val = parseDeepJson(params);
  }
  return val ? val : type === 'array' ? [] : {};
};