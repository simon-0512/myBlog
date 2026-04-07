---
title: "贪心算法在基金组合优化中的应用"
date: "2024-02-28"
tags:
  - Algorithm
  - Python
  - 基金组合
  - 量化投资
excerpt: "从热点股票出发，构建目标行业权重的基金组合"
featured: false
---

在构建基金组合时，经常需要达到特定行业配置比例。本文介绍一种基于贪心算法的解决方案，从目标行业权重出发，反向选择基金。

## 问题定义

假设我们有：
- 目标行业权重配置：`target_weights = {'科技': 0.3, '消费': 0.2, '医药': 0.2, '金融': 0.3}`
- 可选基金池：每只基金有明确的行业配置比例

目标：选择最小数量的基金，使得累计行业权重接近目标配置。

## 算法实现

```python
from dataclasses import dataclass
from typing import List, Dict
import numpy as np

@dataclass
class Fund:
    code: str
    name: str
    industry_weights: Dict[str, float]  # 行业权重

def greedy_portfolio_build(
    target: Dict[str, float],
    candidates: List[Fund],
    tolerance: float = 0.05
) -> List[Fund]:
    """
    贪心算法构建基金组合

    Args:
        target: 目标行业权重
        candidates: 可选基金列表
        tolerance: 容差阈值

    Returns:
        选中的基金列表
    """
    current_weights = {k: 0.0 for k in target}
    selected = []
    remaining = candidates.copy()

    while sum(target.values()) > 0.01:  # 目标未完成
        best_fund = None
        best_score = float('-inf')

        for fund in remaining:
            score = evaluate_fund(fund, current_weights, target)
            if score > best_score:
                best_score = score
                best_fund = fund

        if best_fund is None:
            break

        selected.append(best_fund)
        remaining.remove(best_fund)

        # 更新当前权重
        for industry, weight in best_fund.industry_weights.items():
            if industry in current_weights:
                current_weights[industry] += weight * 0.1  # 假设单只基金仓位 10%

        # 检查是否满足条件
        if check_completion(current_weights, target, tolerance):
            break

    return selected

def evaluate_fund(fund: Fund, current: Dict, target: Dict) -> float:
    """评估基金对组合的边际贡献"""
    score = 0.0
    for industry in target:
        current_weight = current.get(industry, 0)
        target_weight = target[industry]
        fund_weight = fund.industry_weights.get(industry, 0)

        # 越接近目标且贡献越大的基金分数越高
        gap = target_weight - current_weight
        if gap > 0:
            score += fund_weight * gap

    return score
```

## 示例应用

```python
# 定义可选基金
funds = [
    Fund('001', '科技先锋', {'科技': 0.6, '消费': 0.2, '医药': 0.1, '金融': 0.1}),
    Fund('002', '消费成长', {'科技': 0.1, '消费': 0.5, '医药': 0.2, '金融': 0.2}),
    Fund('003', '医药精选', {'科技': 0.1, '消费': 0.1, '医药': 0.7, '金融': 0.1}),
    Fund('004', '金融稳健', {'科技': 0.1, '消费': 0.1, '医药': 0.1, '金融': 0.7}),
]

# 目标配置
target_weights = {'科技': 0.3, '消费': 0.25, '医药': 0.25, '金融': 0.2}

# 构建组合
portfolio = greedy_portfolio_build(target_weights, funds)
print(f"选中 {len(portfolio)} 只基金")
```

## 算法复杂度

- 时间复杂度：O(n²)，其中 n 为候选基金数量
- 空间复杂度：O(n)，存储中间状态

## 局限性

1. **局部最优**：贪心算法不能保证全局最优解
2. **离散约束**：基金仓位是离散的，难以精确匹配目标权重
3. **动态变化**：行业权重会随市场变化而变化

对于需要精确最优解的场景，可以考虑使用整数规划或遗传算法。
