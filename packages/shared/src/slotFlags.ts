export const enum SlotFlags {
  /**
   * Stable slots that only reference slot props or context state. The slot
   * can fully capture its own dependencies so when passed down the parent won't
   * need to force the child to update.
   * 父节点收集自己的依赖子结点无需去更新
   */
  STABLE = 1,
  /**
   * Slots that reference scope variables (v-for or an outer slot prop), or
   * has conditional structure (v-if, v-for). The parent will need to force
   * the child to update because the slot does not fully capture its dependencies.
   * 子结点需要去根据状态渲染，需要动态更新视图的情况下
   */
  DYNAMIC = 2,
  /**
   * `<slot/>` being forwarded into a child component. Whether the parent needs
   * to update the child is dependent on what kind of slots the parent itself
   * received. This has to be refined at runtime, when the child's vnode
   * is being created (in `normalizeChildren`)
   * 插槽被转发到子组件，是否渲染如何渲染需要根据具体插槽类型，需要在渲染的时候进行判断
   */
  FORWARDED = 3
}

/**
 * Dev only
 */
export const slotFlagsText = {
  [SlotFlags.STABLE]: 'STABLE',
  [SlotFlags.DYNAMIC]: 'DYNAMIC',
  [SlotFlags.FORWARDED]: 'FORWARDED'
}
