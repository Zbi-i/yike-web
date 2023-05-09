// 判断是否为移动端
const isMobile = () => {
  const userAgentInfo = navigator.userAgent;
  const agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
  for (let i = 0; i < agents.length; i += 1) {
    if (userAgentInfo.indexOf(agents[i]) > 0) {
      return true;
    }
  }
  return false;
};
if (isMobile()) {

}
