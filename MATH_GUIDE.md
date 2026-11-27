# Markdown 数学公式与符号写法

网站已接入 remark-math 和 KaTeX。文章正文可以直接写下面的语法；不需要安装桌面 LaTeX。
本文件是项目使用说明，不会作为文章发布。下面代码框用于展示源码：写文章时复制框内内容，不要复制外面的三反引号。

## 行内公式

```markdown
状态为 $\mathbf{x}_k$，噪声为 $v_k \sim \mathcal{N}(0,R)$。
角度为 $\theta = 30^\circ$，误差为 $\varepsilon$。
```

## 独立公式

前后留空行，两个 `$$` 各自单独占一行：

```markdown
$$
K_k = P_k^- H_k^\top \left(H_k P_k^- H_k^\top + R_k\right)^{-1}
$$
```

## 常用表达式

| 内容 | Markdown 源码 |
| --- | --- |
| 上标、下标 | `$x^2$`、`$x_k$`、`$x_{k+1}^{-}$` |
| 分数、平方根 | `$\frac{a+b}{c}$`、`$\sqrt{x}$` |
| 求和 | `$\sum_{i=1}^{n} x_i$` |
| 积分 | `$\int_0^T f(t)\,dt$` |
| 粗体向量、希腊字母 | `$\mathbf{x}$`、`$\boldsymbol{\theta}$` |
| 估计、转置、逆 | `$\hat{x}_k$`、`$A^\top$`、`$A^{-1}$` |
| 小于等于、大于等于 | `$a \leq b$`、`$a \geq b$` |
| 不等于、约等于、正负 | `$a \neq b$`、`$a \approx b$`、`$\pm 2$` |
| 乘法、点乘 | `$a \times b$`、`$a \cdot b$` |
| 属于、实数空间 | `$x \in \mathbb{R}^n$` |
| 无穷、箭头 | `$\infty$`、`$x \to 0$`、`$A \Rightarrow B$` |
| 公式内的说明 | `$\text{error} = x-\hat{x}$` |
| 范数 | `$\lVert \mathbf{x} \rVert_2$` |

## 希腊字母

以下命令放在 `$...$` 或独立公式的 `$$` 内，例如 `$\alpha + \beta$`。

| 字母 | 命令 | 字母 | 命令 |
| --- | --- | --- | --- |
| α | `\alpha` | β | `\beta` |
| γ | `\gamma` | δ | `\delta` |
| ε | `\epsilon` 或 `\varepsilon` | ζ | `\zeta` |
| η | `\eta` | θ | `\theta` |
| ι | `\iota` | κ | `\kappa` |
| λ | `\lambda` | μ | `\mu` |
| ν | `\nu` | ξ | `\xi` |
| ο | `o` | π | `\pi` |
| ρ | `\rho` | σ | `\sigma` |
| τ | `\tau` | υ | `\upsilon` |
| φ | `\phi` 或 `\varphi` | χ | `\chi` |
| ψ | `\psi` | ω | `\omega` |

常用大写：`\Gamma`（Γ）、`\Delta`（Δ）、`\Theta`（Θ）、`\Lambda`（Λ）、`\Xi`（Ξ）、`\Pi`（Π）、`\Sigma`（Σ）、`\Upsilon`（Υ）、`\Phi`（Φ）、`\Psi`（Ψ）、`\Omega`（Ω）。
形状与拉丁字母相同的大写通常直接写 `A`、`B` 等，不要把每个小写命令机械改成大写。
正文中也可直接输入 Unicode 字母，如 α、β、θ、Ω；数学公式内建议使用命令保持统一排版。

## 矩阵

`&` 分列，`\\` 换行：

```markdown
$$
A = \begin{bmatrix}
1 & 2 \\
3 & 4
\end{bmatrix}
$$
```

## 多行对齐

```markdown
$$
\begin{aligned}
\hat{x}_{k|k-1} &= F_k\hat{x}_{k-1|k-1} \\
P_{k|k-1} &= F_k P_{k-1|k-1}F_k^\top + Q_k
\end{aligned}
$$
```

## 分段函数

```markdown
$$
f(x) = \begin{cases}
x^2, & x \geq 0 \\
-x, & x < 0
\end{cases}
$$
```

## 写作注意

- 公式不要放进反引号或代码块，否则会作为源码显示。
- Markdown 文件中命令只写一个反斜杠，如 `\alpha`；矩阵换行才写两个。
- 多字符上下标用花括号包住，例如 `x_{k+1}`。
- 正文中的美元符号写成 `\$`，例如 `价格为 \$10`，避免被当成公式边界。
- 公式中的百分号写 `\%`，下划线的字面符号写 `\_`。
- Markdown 表格里优先用 `\lvert`、`\rvert` 表示绝对值，避免竖线被当成分列符。
- 不需要 `\documentclass`、`\begin{document}` 或 `\usepackage`。KaTeX 支持数学命令，不是完整 LaTeX 文档编译器。
- 长独立公式在手机上可以横向滚动；也可以用 `aligned` 主动拆行。
- 编辑器自己的 Markdown 预览与网站不是同一套渲染器，以网站预览为准。
