---
title: "基于 AkShare 的基金反推算法实现"
date: "2024-03-10"
tags:
  - Python
  - AkShare
  - 基金分析
  - Algorithm
excerpt: "如何通过持仓股票反推持有该股票的主动基金"
featured: false
---

在基金研究过程中，一个常见的需求是：给定一只股票，找出所有持有该股票的主动基金。这个问题看似简单，但涉及到海量的持仓数据计算。

## 问题分析

公募基金的持仓数据每季度公布一次，有一定的滞后性。而且基金数量众多（目前 A 股市场上有超过 5000 只公募基金），逐一计算不现实。

思路：
1. 获取某股票的前十大股东/流通股东数据
2. 通过持股股东信息反推持有该股票的基金
3. 结合基金净值规模进行筛选

## 实现方案

```python
import akshare as ak
import pandas as pd
from collections import defaultdict

def get_stock_funds(stock_code: str) -> list:
    """
    通过股票代码获取持有该股票的基金列表

    Args:
        stock_code: 股票代码，如 '000001'

    Returns:
        持有该股票的基金代码列表
    """
    # 获取股票前十大流通股东
    try:
        df = ak.stockindi_stock_main_new(indicator="十大流通股东", symbol=stock_code)
        # 解析股东信息，筛选出基金
        funds = []
        for _, row in df.iterrows():
            holder = row.get('holder', '')
            if '基金' in holder or '资产管理' in holder:
                funds.append(holder)
        return funds
    except Exception as e:
        print(f"Error fetching data for {stock_code}: {e}")
        return []

def analyze_fund_portfolio(stock_code: str) -> pd.DataFrame:
    """
    分析持有特定股票的基金组合
    """
    funds = get_stock_funds(stock_code)

    # 获取基金持仓详情
    result = []
    for fund in funds:
        try:
            # 获取基金持仓
            holdings = ak.fund_individual_basic_info_xq(fund)
            # 筛选包含目标股票的持仓
            target = holdings[holdings['code'] == stock_code]
            if not target.empty:
                result.append({
                    'fund_code': fund,
                    'holding_ratio': target.iloc[0]['ratio'],
                    'holding_amount': target.iloc[0]['amount']
                })
        except:
            continue

    return pd.DataFrame(result)
```

## 贪心算法优化

对于大规模计算，可以使用贪心算法进行优化：

1. 按基金规模降序排列
2. 优先计算大型基金的持仓
3. 累计计算覆盖率，达到阈值后停止

```python
def greedy_fund_selection(stock_code: str, top_n: int = 100) -> list:
    """
    贪心算法选择持有某股票的主要基金
    """
    # 获取所有基金列表
    all_funds = ak.fund_basic()

    # 按规模排序
    large_funds = all_funds.nlargest(top_n, 'total_asset')

    result = []
    accumulated_ratio = 0
    threshold = 0.5  # 50% 覆盖率

    for _, fund in large_funds.iterrows():
        if accumulated_ratio >= threshold:
            break

        holdings = get_fund_holdings(fund['code'])
        for stock, ratio in holdings.items():
            if stock == stock_code:
                result.append({
                    'fund': fund['code'],
                    'ratio': ratio,
                    'name': fund['name']
                })
                accumulated_ratio += ratio
                break

    return result
```

## 注意事项

1. **数据滞后性**：基金持仓每季度公布，结果有 1-3 个月延迟
2. **估算偏差**：前十大股东数据不等于全部持仓，仅能估算
3. **规模筛选**：建议只分析规模 5 亿以上的主动基金

## 总结

通过 AkShare 提供的数据接口，结合持仓分析算法，可以较准确地反推持有特定股票的主动基金。这对于基金筛选、板块轮动分析等场景都很有价值。
