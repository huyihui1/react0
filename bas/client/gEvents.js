export function isPhoneNumber(tel) {
  const isMob = /^\d{7,12}$/;
  if (isMob.test(tel)) {
    return true;
  }
  return false;
}

export function isCellTowerCode(code) {
  const isCode = /^[a-fA-F0-9]+:[a-fA-F0-9]+:[a-fA-F0-9]+$/;
  if (isCode.test(code)) {
    return true;
  }
  return false;
}

export function isEventTime(time) {
  time = time.replace(/(^\s*)|(\s*$)/g, "");
  const isTime = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/;
  const isDate = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
  if (isTime.test(time) || isDate.test(time)) {
    return true;
  }
  return false;
}

export function isShortNum(num) {
  const r = /^\d{3,6}$/;
  if (r.test(num)) {
    return true
  } else {
    return false
  }
}
