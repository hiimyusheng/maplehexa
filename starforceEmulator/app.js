// DOM wiring, i18n, profile persistence, and UI orchestration.
// Depends on globals set by data.js (`window.StarForceData`) and
// simulator.js (`window.StarForceSim`).

document.addEventListener("DOMContentLoaded", () => {
  const { defaultStarForceData, translations } = window.StarForceData;
  const { calculateStats, simulateOneItem } = window.StarForceSim;

  const dom = {
    startLevel: document.getElementById("start-level"),
    targetLevel: document.getElementById("target-level"),
    itemCount: document.getElementById("item-count"),
    equipmentCost: document.getElementById("equipment-cost"),
    safeguardCheck: document.getElementById("safeguard-check"),
    event30off: document.getElementById("event-30off"),
    event51015: document.getElementById("event-5-10-15"),
    eventDestroyProtect: document.getElementById("event-destroy-protect"),
    sundayDiscount: document.getElementById("sunday-discount"),
    vipSelect: document.getElementById("vip-select"),
    startButton: document.getElementById("start-simulation"),
    loader: document.getElementById("loader"),
    resultsContainer: document.getElementById("results-container"),
    boomChartCanvas: document.getElementById("boomChart"),
    resultItemCount: document.getElementById("result-item-count"),
    resultTargetLevel: document.getElementById("result-target-level"),
    mesoAvg: document.getElementById("meso-avg"),
    mesoMedian: document.getElementById("meso-median"),
    mesoStdev: document.getElementById("meso-stdev"),
    mesoMin: document.getElementById("meso-min"),
    mesoMax: document.getElementById("meso-max"),
    mesoP75: document.getElementById("meso-p75"),
    mesoP85: document.getElementById("meso-p85"),
    mesoP95: document.getElementById("meso-p95"),
    totalInheritanceCost: document.getElementById("total-inheritance-cost"),
    boomAvg: document.getElementById("boom-avg"),
    boomMedian: document.getElementById("boom-median"),
    boomStdev: document.getElementById("boom-stdev"),
    boomMin: document.getElementById("boom-min"),
    boomMax: document.getElementById("boom-max"),
    boomP75: document.getElementById("boom-p75"),
    boomP85: document.getElementById("boom-p85"),
    boomP95: document.getElementById("boom-p95"),
    openSettingsBtn: document.getElementById("open-settings-btn"),
    closeSettingsBtn: document.getElementById("close-settings-btn"),
    settingsModal: document.getElementById("settings-modal"),
    settingsProfileSelect: document.getElementById("settings-profile-select"),
    addProfileBtn: document.getElementById("add-profile-btn"),
    deleteProfileBtn: document.getElementById("delete-profile-btn"),
    settingsTableBody: document.getElementById("settings-table-body"),
    saveSettingsBtn: document.getElementById("save-settings-btn"),
    mainProfileSelect: document.getElementById("profile-select"),
    languageSwitcher: document.getElementById("language-switcher"),
  };

  let boomChartInstance = null;
  let starForceProfiles = {};
  let currentProfileName = "";
  let currentLang = "zh-Hant";

  function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    localStorage.setItem("starforce-lang", lang);
    const translationData = translations[lang];
    document.querySelectorAll("[data-i18n-key]").forEach((el) => {
      const key = el.dataset.i18nKey;
      if (translationData[key]) el.textContent = translationData[key];
    });
    dom.openSettingsBtn.title = t("settings");
    updateProfileSelectors(currentProfileName);
  }

  function t(key, ...args) {
    const translation = translations[currentLang][key];
    return typeof translation === "function"
      ? translation(...args)
      : translation || key;
  }

  function formatMeso(num) {
    return Math.round(num).toLocaleString("en-US");
  }

  function renderBoomChart(boomData) {
    if (boomChartInstance) boomChartInstance.destroy();
    const boomCounts = {};
    boomData.forEach((boom) => {
      boomCounts[boom] = (boomCounts[boom] || 0) + 1;
    });
    const labels = Object.keys(boomCounts).sort((a, b) => a - b);
    const data = labels.map((label) => boomCounts[label]);
    const ctx = dom.boomChartCanvas.getContext("2d");
    boomChartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: t("boom_chart_dataset_label"),
            data,
            backgroundColor: "rgba(79, 70, 229, 0.6)",
            borderColor: "rgba(99, 102, 241, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#1f2937",
            callbacks: {
              title: (ctx) =>
                `${t("boom_chart_tooltip_title")}: ${ctx[0].label}`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: "rgba(255,255,255,0.1)" },
            ticks: { color: "#d1d5db" },
            title: {
              display: true,
              text: t("boom_chart_y_axis"),
              color: "#d1d5db",
            },
          },
          x: {
            grid: { color: "rgba(255,255,255,0.05)" },
            ticks: { color: "#d1d5db" },
            title: {
              display: true,
              text: t("boom_chart_x_axis"),
              color: "#d1d5db",
            },
          },
        },
      },
    });
  }

  function startSimulation() {
    const startLevel = parseInt(dom.startLevel.value, 10);
    const targetLevel = parseInt(dom.targetLevel.value, 10);
    const itemCount = parseInt(dom.itemCount.value, 10);
    const equipmentCost = parseInt(dom.equipmentCost.value, 10) || 0;

    if (
      !Number.isInteger(startLevel) ||
      !Number.isInteger(targetLevel) ||
      !Number.isInteger(itemCount) ||
      startLevel < 0 ||
      targetLevel < 1 ||
      itemCount < 1
    ) {
      alert(t("alert_invalid_input"));
      return;
    }
    if (startLevel >= targetLevel) {
      alert(t("alert_target_level"));
      return;
    }
    const currentData = starForceProfiles[currentProfileName];
    if (!currentData || targetLevel > currentData.length) {
      alert(t("alert_max_level"));
      return;
    }

    const options = {
      useSafeguard: dom.safeguardCheck.checked,
      is30off: dom.event30off.checked,
      is5_10_15: dom.event51015.checked,
      isDestroyProtect: dom.eventDestroyProtect.checked,
      sundayDiscount: dom.sundayDiscount.checked,
      vipRating: dom.vipSelect.value,
      equipmentCost: equipmentCost,
    };

    dom.loader.classList.remove("hidden");
    dom.resultsContainer.classList.add("hidden");
    dom.startButton.disabled = true;

    setTimeout(() => {
      const mesoResults = [];
      const boomResults = [];
      for (let i = 0; i < itemCount; i++) {
        const result = simulateOneItem(
          startLevel,
          targetLevel,
          options,
          currentData
        );
        if (result) {
          mesoResults.push(result.cost);
          boomResults.push(result.booms);
        }
      }
      const mesoStats = calculateStats(mesoResults);
      const boomStats = calculateStats(boomResults);

      const totalInheritanceCost = boomResults.reduce(
        (sum, booms) => sum + booms * equipmentCost,
        0
      );

      dom.resultItemCount.textContent = itemCount;
      dom.resultTargetLevel.textContent = targetLevel;
      dom.mesoAvg.textContent = formatMeso(mesoStats.mean);
      dom.mesoMedian.textContent = formatMeso(mesoStats.median);
      dom.mesoStdev.textContent = formatMeso(mesoStats.stdev);
      dom.mesoMin.textContent = formatMeso(mesoStats.min);
      dom.mesoMax.textContent = formatMeso(mesoStats.max);
      dom.mesoP75.textContent = t("p_chance_within", formatMeso(mesoStats.p75));
      dom.mesoP85.textContent = t("p_chance_within", formatMeso(mesoStats.p85));
      dom.mesoP95.textContent = t("p_chance_within", formatMeso(mesoStats.p95));
      dom.totalInheritanceCost.textContent = formatMeso(totalInheritanceCost);

      dom.boomAvg.textContent = boomStats.mean.toFixed(2);
      dom.boomMedian.textContent = boomStats.median.toFixed(2);
      dom.boomStdev.textContent = boomStats.stdev.toFixed(2);
      dom.boomMin.textContent = boomStats.min.toFixed(2);
      dom.boomMax.textContent = boomStats.max.toFixed(2);
      dom.boomP75.textContent = t(
        "p_chance_within_booms",
        boomStats.p75.toFixed(0)
      );
      dom.boomP85.textContent = t(
        "p_chance_within_booms",
        boomStats.p85.toFixed(0)
      );
      dom.boomP95.textContent = t(
        "p_chance_within_booms",
        boomStats.p95.toFixed(0)
      );

      renderBoomChart(boomResults);
      dom.loader.classList.add("hidden");
      dom.resultsContainer.classList.remove("hidden");
      dom.startButton.disabled = false;
    }, 100);
  }

  function loadProfiles() {
    const savedProfiles = localStorage.getItem("starForceProfiles");
    starForceProfiles = savedProfiles
      ? JSON.parse(savedProfiles)
      : JSON.parse(JSON.stringify(defaultStarForceData));
    updateProfileSelectors();
    selectProfile(Object.keys(starForceProfiles)[0]);
  }

  function saveProfiles() {
    localStorage.setItem(
      "starForceProfiles",
      JSON.stringify(starForceProfiles)
    );
  }

  function updateProfileSelectors(selectedName) {
    const profileKeys = Object.keys(starForceProfiles);
    [dom.mainProfileSelect, dom.settingsProfileSelect].forEach((select) => {
      select.innerHTML = "";
      profileKeys.forEach((key) => {
        const option = document.createElement("option");
        option.value = key;
        option.textContent =
          translations[currentLang].profile_names[key] || key;
        select.appendChild(option);
      });
      if (selectedName) select.value = selectedName;
    });
    currentProfileName = selectedName || profileKeys[0];
    updateMaxLevels();
  }

  function selectProfile(name) {
    if (!starForceProfiles[name]) return;
    currentProfileName = name;
    [dom.mainProfileSelect, dom.settingsProfileSelect].forEach(
      (s) => (s.value = name)
    );
    populateSettingsTable(starForceProfiles[name]);
    updateMaxLevels();
  }

  function updateMaxLevels() {
    const maxLevel = starForceProfiles[currentProfileName]?.length || 25;
    dom.startLevel.max = maxLevel - 1;
    dom.targetLevel.max = maxLevel;
  }

  function populateSettingsTable(data) {
    dom.settingsTableBody.innerHTML = "";
    data.forEach((d, i) => {
      const row = document.createElement("tr");
      row.className = "bg-gray-800 border-b border-gray-700";
      row.innerHTML = `
        <td class="px-4 py-2 font-medium text-white whitespace-nowrap">${i} → ${
        i + 1
      }</td>
        ${["success", "maintain", "downgrade", "destroy", "cost"]
          .map(
            (key) => `
          <td class="px-4 py-2"><input type="number" step="any" data-index="${i}" data-key="${key}" value="${d[key]}" class="input-field w-full p-1 rounded-md text-sm"></td>
        `
          )
          .join("")}`;
      dom.settingsTableBody.appendChild(row);
    });
  }

  function saveSettingsFromTable() {
    const inputs = dom.settingsTableBody.querySelectorAll("input");
    const newProfileData = [];
    const rowCount = starForceProfiles[currentProfileName].length;
    for (let i = 0; i < rowCount; i++) {
      const rowData = {};
      inputs.forEach((input) => {
        if (parseInt(input.dataset.index, 10) === i)
          rowData[input.dataset.key] = parseFloat(input.value) || 0;
      });
      newProfileData.push(rowData);
    }
    starForceProfiles[currentProfileName] = newProfileData;
    saveProfiles();
    alert(t("alert_saved", currentProfileName));
  }

  dom.openSettingsBtn.addEventListener("click", () => {
    dom.settingsModal.style.display = "block";
  });
  dom.closeSettingsBtn.addEventListener("click", () => {
    dom.settingsModal.style.display = "none";
  });
  dom.settingsProfileSelect.addEventListener("change", (e) =>
    selectProfile(e.target.value)
  );
  dom.mainProfileSelect.addEventListener("change", (e) =>
    selectProfile(e.target.value)
  );
  dom.saveSettingsBtn.addEventListener("click", saveSettingsFromTable);
  dom.addProfileBtn.addEventListener("click", () => {
    const newName = prompt(t("prompt_new_profile"), "Custom Profile");
    if (newName && !starForceProfiles[newName]) {
      starForceProfiles[newName] = JSON.parse(
        JSON.stringify(starForceProfiles["Eternal (250)"])
      );
      saveProfiles();
      updateProfileSelectors(newName);
      selectProfile(newName);
    } else if (newName) {
      alert(t("alert_name_exists"));
    }
  });
  dom.deleteProfileBtn.addEventListener("click", () => {
    if (Object.keys(starForceProfiles).length <= 1) {
      alert(t("alert_keep_one_profile"));
      return;
    }
    if (confirm(t("confirm_delete", currentProfileName))) {
      delete starForceProfiles[currentProfileName];
      saveProfiles();
      loadProfiles();
    }
  });
  dom.languageSwitcher.addEventListener("change", (e) =>
    setLanguage(e.target.value)
  );
  window.onclick = (event) => {
    if (event.target == dom.settingsModal) {
      dom.settingsModal.style.display = "none";
    }
  };

  const savedLang = localStorage.getItem("starforce-lang") || "zh-Hant";
  dom.languageSwitcher.value = savedLang;
  loadProfiles();
  setLanguage(savedLang);
  dom.startButton.addEventListener("click", startSimulation);
});
