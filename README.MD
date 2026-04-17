# 新楓之谷工具箱

這個專案是一個部署在 GitHub Pages 的靜態網站，提供兩個新楓之谷工具：

- 六轉核心計算器
- 星力模擬器

網站入口頁位於根目錄，使用者進入 maplehexa.cisyy.cc 後可以選擇要進入哪一個工具。

## 網站結構

- `/`：工具入口頁
- `/hexaCalculator/`：六轉核心計算器
- `/starforceEmulator/`：星力模擬器

## 專案檔案

```text
.
├── index.html
├── hexaCalculator/
│   ├── index.html
│   ├── script.js
│   └── chart.js
├── starforceEmulator/
│   ├── index.html
│   ├── app.js
│   ├── simulator.js
│   ├── data.js
│   └── check_probs.js
└── images/
```

## 工具說明

### 六轉核心計算器

用來計算 HEXA 核心目前已消耗的碎片、剩餘所需碎片、整體進度，以及各核心分布圖。

主要檔案：

- `hexaCalculator/index.html`
- `hexaCalculator/script.js`
- `hexaCalculator/chart.js`

### 星力模擬器

用來模擬不同裝備等級、活動、VIP 折扣與防爆設定下的強化成本與爆裝風險。

主要檔案：

- `starforceEmulator/index.html`
- `starforceEmulator/app.js`
- `starforceEmulator/simulator.js`
- `starforceEmulator/data.js`

## 本機使用

這個專案沒有 build step，也沒有套件安裝需求，直接用靜態伺服器開啟即可。

可以直接開啟 HTML，或使用 VS Code Live Server：

- 入口頁：`http://localhost:5501/`
- 六轉核心計算器：`http://localhost:5501/hexaCalculator/`
- 星力模擬器：`http://localhost:5501/starforceEmulator/`

## 資料與技術

- 純 HTML / CSS / JavaScript
- 透過 CDN 載入 Tailwind CSS
- 六轉核心計算器使用 jQuery 與 orbcharts
- 星力模擬器使用 Chart.js

## 部署

此專案設計為靜態頁面，可直接部署到 GitHub Pages。

目前網站網址：

- `https://maplehexa.cisyy.cc/`

## 備註

- 兩個工具彼此獨立，修改時可分開處理。