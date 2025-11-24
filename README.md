# 網頁時鐘 Web Clock

## 概述 Overview
一個功能完整的網頁時鐘應用程式，支援 12/24 小時制切換、響應式設計和無障礙功能。

A fully functional web clock application with 12/24-hour format toggle, responsive design, and accessibility features.

## 功能特色 Features
- ⏰ 即時顯示當前時間和日期
- 🔄 支援 12/24 小時制切換
- 📱 響應式設計（支援手機、平板、桌面）
- ♿ 完整的無障礙功能支援
- 🎨 美觀的漸層背景和高對比度配色
- ⌨️ 鍵盤導航支援

## 如何使用 How to Use

### 啟動時鐘 Start the Clock
1. 在瀏覽器中開啟 `index.html`
2. 時鐘會自動開始運行
3. 點擊「切換 12/24 小時制」按鈕來切換時間格式

Simply open `index.html` in a web browser. The clock will start automatically.

### 執行測試 Run Tests

#### 選項 1: 瀏覽器測試（無需安裝）
開啟 `test-runner.html` 在瀏覽器中執行基本單元測試。

Open `test-runner.html` in a browser to run basic unit tests.

#### 選項 2: 完整測試套件（需要 Node.js）
```bash
npm install
npm test
```

## 專案結構 Project Structure

### 核心檔案 Core Files
- `index.html` - 主要 HTML 結構
- `styles.css` - CSS 樣式和響應式設計
- `timeManager.js` - 時間管理和格式化邏輯
- `displayController.js` - DOM 更新控制器
- `clockEngine.js` - 時鐘引擎和更新機制
- `app.js` - 應用程式初始化

### 測試檔案 Test Files
- `timeManager.test.js` - TimeManager 的屬性測試和單元測試
- `displayController.test.js` - DisplayController 的屬性測試
- `clockEngine.test.js` - ClockEngine 的屬性測試和生命週期測試
- `integration.test.js` - 格式切換的整合測試
- `test-runner.html` - 瀏覽器測試執行器

## 技術實作 Technical Implementation

### 架構 Architecture
```
TimeManager (時間管理)
    ↓
ClockEngine (協調器)
    ↓
DisplayController (顯示控制)
    ↓
DOM (使用者介面)
```

### 測試覆蓋 Test Coverage
- ✅ 8 個正確性屬性的屬性測試（每個 100 次迭代）
- ✅ 邊界情況的單元測試
- ✅ 生命週期測試
- ✅ 整合測試

## 需求驗證 Requirements Validated
- ✅ Requirements 1.1-1.4: 時間顯示和持續更新
- ✅ Requirements 2.1-2.3: 清晰易讀的顯示
- ✅ Requirements 3.1-3.3: 12/24 小時制支援
- ✅ Requirements 4.1-4.3: 日期顯示
- ✅ Requirements 5.1-5.3: 響應式設計
- ✅ 無障礙功能完整支援

## 瀏覽器支援 Browser Support
- Chrome / Edge (最新版本)
- Firefox (最新版本)
- Safari (最新版本)

## 授權 License
MIT
