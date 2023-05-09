import { ref } from 'vue';
// 在目标节点前插入新的节点
function insertAfter(newElement, targetElement) {
  const parent = targetElement?.parentNode;// 获取目标节点的父级标签
  if (parent?.lastChild === targetElement) { // 如果目标节点正好是最后一个节点，使用appendChild插入
    parent?.appendChild(newElement);
  } else {
    // 一般情况下要取得目标节点的下一个节点，再使用insertBefore()方法。
    parent?.insertBefore(newElement, targetElement?.nextSibling);
  }
}
// 评论表单的功能函数
const useCommentFromFunEffect = () => {
  const textareaPropUp = ref(null);
  const sendUnlock = ref(false);
  const textareaInput = (event) => {
    textareaPropUp.value.innerHTML = event.target.value;
    if (event.target.value !== '') {
      sendUnlock.value = true;
    } else {
      sendUnlock.value = false;
    }
  };
  const textareaFocus = () => {
  };
  return {
    textareaInput, textareaFocus, textareaPropUp, sendUnlock,
  };
};
export { insertAfter, useCommentFromFunEffect };
