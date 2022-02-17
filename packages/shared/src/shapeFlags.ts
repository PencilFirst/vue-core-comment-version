export const enum ShapeFlags {
  ELEMENT = 1, // 元素节点
  FUNCTIONAL_COMPONENT = 1 << 1, // 函数式组件
  STATEFUL_COMPONENT = 1 << 2, // 状态组件
  TEXT_CHILDREN = 1 << 3, // 子文本结点
  ARRAY_CHILDREN = 1 << 4, // 子数组节点
  SLOTS_CHILDREN = 1 << 5, // 子插槽节点
  TELEPORT = 1 << 6, // TELEPORT 节点
  SUSPENSE = 1 << 7, // SUSPENSE 节点
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8, // 应该 keep alive 节点
  COMPONENT_KEPT_ALIVE = 1 << 9, // keep alive 节点
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT
}
