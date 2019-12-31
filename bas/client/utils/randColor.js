export const stringToColor = function (str) {
  let hash = 0;
  const rstr = str.split('').reverse().join('');
  for (let i = 0; i < str.length; i++) {
    hash = rstr.charCodeAt(i) * 121 + ((hash << 7) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += (`00${value.toString(16)}`).substr(-2);
  }
  return color;
};

// $('body').css('background-color', stringToColour("201104051"));
