const range: number = 2
// 生成错误代码提示块，具体多少行什么代码
export function generateCodeFrame(
  source: string,
  start = 0,
  end = source.length
): string {
  // Split the content into individual lines but capture the newline sequence
  // that separated each line. This is important because the actual sequence is
  // needed to properly take into account the full line length for offset
  // comparison
  let lines = source.split(/(\r?\n)/) // 按照换行切割代码

  // Separate the lines and newline sequences into separate arrays for easier referencing
  const newlineSequences = lines.filter((_, idx) => idx % 2 === 1) // 获取奇数行代码 获取每行代码的换行符 \n | \r\n
  lines = lines.filter((_, idx) => idx % 2 === 0) // 获取偶数行代码 获取每行的代码

// source 输入的代码
//   <template>
    // <div>
    //   <h1>Sign In</h1>
    //   <form>
    //     <div>
    //       <label for="email">Email</label>
    //       <input name="email" type="text"/>
    //     </div>
    //     <div id="hook">
    //       <label for="password">Password</label>
    //       <input name="password" type="password"/>
    //     </div>
    //   </form>
    // </div>
//   </template>


//  返回的结果
//  8  |          <input name="email" type="text"/>
//  9  |        </div>
//  10 |        <div id="hook">
   //  |        ^^^^^^^^^^^^^^^
//  11 |          <label for="password">Password</label>
//     |  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//  12 |          <input name="password" type="password"/>
//     |  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//  13 |        </div>
   //  |  ^^^^^^^^^^^^


  // 由于换行符号在unix和windows上的表现不一致，导致把lines拆分成两个数组；问题是为什呢
  // https://github.com/vuejs/core/pull/3992/commits/600f03d90afd4017d22a6bfcfaa7c56aa75e5425   测试文件地址
  // 有关与j的值的问题，由于\r的长度为1，\r\n的长度为2，如果代码过于冗长可能会出现 end > count 的情况导致死循环
  
  // j 是罪魁祸首，为什么具体情况分析
  // j 由i和range相关，而 i 是lines的长度 --> lines.length 
  let count = 0
  const res: string[] = []
  for (let i = 0; i < lines.length; i++) {
    count +=
      lines[i].length + // 第i行代码的长度
      ((newlineSequences[i] && newlineSequences[i].length) || 0) // 第i行 分隔符的长度
    if (count >= start) { // start 代码指定开始的长度，默认为 0
      for (let j = i - range; j <= i + range || end > count; j++) { // i - range 的原因是因为，一行代码需要占据两行，一行实际代码 一行 ^^^^ 标识代码
        // 以测试的返回结果为例，第0项 的长度应该为 即 i = 0, j = 0-2 --> -2; 
        //j<= 43|| end(end的长度为所有代码的长度，为324) > count (第一次应该为Linux: lines[i]+1 || windows: lines[i]+2 )
        if (j < 0 || j >= lines.length) continue // j < 0, range = 2 ， 所以前两次j 都是小于 0 ， j > lines.length 表示迭代完成
        const line = j + 1  // line 也就是 i - 1 ,需要看后续j是否发生改变
        res.push( // res 也就是输出结果的代码数组， | 前面表示的是当前代码所在行数，后面则是代码内容
                  // line表示 当前代码所在行， j + 1 因为数组下标从 0 开始
          `${line}${' '.repeat(Math.max(3 - String(line).length, 0))}|  ${ // 3 - String(line).length 是因为默认最大999 三位数代码显示，小于三位补空格对齐显示
            lines[j]
          }`
        )
        const lineLength = lines[j].length
        const newLineSeqLength =
          (newlineSequences[j] && newlineSequences[j].length) || 0 // 可能存在是最后一行不存在换行符

        if (j === i) {
          // push underline
          const pad = start - (count - (lineLength + newLineSeqLength))
          const length = Math.max(
            1,
            end > count ? lineLength - pad : end - start
          )
          res.push(`   |  ` + ' '.repeat(pad) + '^'.repeat(length))
        } else if (j > i) {
          if (end > count) {  // end 所有代码总长度，count 当前已迭代的代码长度
            const length = Math.max(Math.min(end - count, lineLength), 1)
            res.push(`   |  ` + '^'.repeat(length))
          }

          count += lineLength + newLineSeqLength // count加上了 ^^^ 的长度
        }
      }
      break
    }
  }
  return res.join('\n')
}
