// 建立更新圖表的函數，讓它可以被多次呼叫
function updateChart(
  skill1_consume,
  skill2_consume,
  jinton1_consume,
  jinton2_consume,
  jinton3_consume,
  jinton4_consume,
  strong1_consume,
  strong2_consume,
  strong3_consume,
  strong4_consume,
  common1_consume
) {
  // 修正選擇器變數名稱
  const elements = document.querySelector("#chart");

  // 檢查元素是否存在
  if (!elements) {
    console.error("找不到 #chart 元素");
    return;
  }

  // 使變數名稱一致，使用 chart 而不是 pieChart
  const chart = new window.orbcharts.SeriesChart(elements);

  // 計算剩餘碎片數
  let not_enough =
    37608 -
    skill1_consume -
    skill2_consume -
    jinton1_consume -
    jinton2_consume -
    jinton3_consume -
    jinton4_consume -
    strong1_consume -
    strong2_consume -
    strong3_consume -
    strong4_consume -
    common1_consume;
  not_enough = not_enough < 0 ? 0 : not_enough; // 確保不為負數

  // 設定圖表插件
  chart.plugins$.next([
    new window.orbcharts.Pie(),
    new window.orbcharts.PieLabels(),
    new window.orbcharts.SeriesLegend(),
    new window.orbcharts.SeriesTooltip(),
  ]);

  // 設定圖表資料
  chart.data$.next([
    [{ label: "技能核心1", value: skill1_consume }],
    [{ label: "技能核心2", value: skill2_consume }],
    [{ label: "精通核心1", value: jinton1_consume }],
    [{ label: "精通核心2", value: jinton2_consume }],
    [{ label: "精通核心3", value: jinton3_consume }],
    [{ label: "精通核心4", value: jinton4_consume }],
    [{ label: "強化核心1", value: strong1_consume }],
    [{ label: "強化核心2", value: strong2_consume }],
    [{ label: "強化核心3", value: strong3_consume }],
    [{ label: "強化核心4", value: strong4_consume }],
    [{ label: "共通核心1", value: common1_consume }],
    [{ label: "碎片不足", value: not_enough }],
  ]);
  chart.chartParams$.next({
    colorScheme: "light",
    colors: {
      light: {
        label: [
          "#84C1FF",
          "#66B3FF",
          "#2894FF",
          "#0080FF",
          "#0072E3",
          "#0066CC",
          "#005AB5",
          "#004B97",
          "#003D79",
          "#003060",
          "#011c38",
          "#FF2D2D",
        ],
      },
    },
  });
}

// 將函數設為全局變數，以便從其他地方呼叫
window.updateChart = updateChart;

// 等待 DOM 完全載入後再初始化圖表
document.addEventListener("DOMContentLoaded", function () {
  // 不立即更新圖表，等待使用者點擊「計算」按鈕
  console.log("圖表初始化完成，等待使用者操作");

  // 如果需要初始顯示空圖表，可以取消下面這行的註解
  //   updateChart();
});
