// Sätt aktuellt år i footern
document.getElementById("year").textContent = new Date().getFullYear();

// Scrolla till kalkylatorn när man klickar "Börja räkna"
document.getElementById("startBtn").addEventListener("click", () => {
  const el = document.getElementById("calculator");
  el.scrollIntoView({ behavior: "smooth" });
});

// Visa/dölj fältet för känd årskostnad
const costRadios = document.querySelectorAll('input[name="costKnowledge"]');
const knownCostGroup = document.getElementById("knownCostGroup");

costRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    if (radio.value === "yes" && radio.checked) {
      knownCostGroup.style.display = "block";
    } else if (radio.value === "no" && radio.checked) {
      knownCostGroup.style.display = "none";
    }
  });
});

// Enkel, förenklad beräkning (placeholder – inte Skatteverkets exakta regler)
document.getElementById("deductionForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const daysPerYear = Number(document.getElementById("daysPerYear").value || 0);
  const distanceKm = Number(document.getElementById("distanceKm").value || 0);
  const transportMode = document.querySelector('input[name="transportMode"]:checked').value;
  const costKnowledge = document.querySelector('input[name="costKnowledge"]:checked').value;
  const knownYearlyCost = Number(document.getElementById("knownYearlyCost").value || 0);

  if (daysPerYear <= 0 || distanceKm <= 0) {
    alert("Fyll i både antal dagar och avstånd för att fortsätta.");
    return;
  }

  // Enkel modell: tur/retur varje dag
  const totalKmPerYear = distanceKm * 2 * daysPerYear;

  // Antag schablonkostnad per km beroende på transportsätt (placeholder!)
  let costPerKm;
  if (transportMode === "car") {
    costPerKm = 2.0; // t.ex. 2 kr/km
  } else if (transportMode === "public") {
    costPerKm = 1.2; // t.ex. motsvarande biljettkostnad per km
  } else {
    costPerKm = 1.5; // blandat
  }

  let yearlyCost;
  if (costKnowledge === "yes" && knownYearlyCost > 0) {
    yearlyCost = knownYearlyCost;
  } else {
    yearlyCost = totalKmPerYear * costPerKm;
  }

  // Placeholder-resavdrag: vi antar att delar av kostnaden kan vara avdragsgill.
  // I verkligheten är reglerna mer komplexa, med gränsbelopp osv.
  const assumedDeductibleShare = 0.6; // 60 % av årskostnaden antas avdragsgill (förenkling)
  const estimatedDeduction = yearlyCost * assumedDeductibleShare;

  // Antag skatt på 30 % – hur mycket skatten minskar
  const taxRate = 0.30;
  const estimatedTaxSaving = estimatedDeduction * taxRate;

  const resultSection = document.getElementById("resultSection");
  const resultText = document.getElementById("resultText");

  resultText.innerHTML = `
    Baserat på dina uppgifter uppskattar vi att du kan ha ett resavdrag på ungefär
    <strong>${Math.round(estimatedDeduction).toLocaleString("sv-SE")} kr</strong> per år.<br/><br/>
    Med en antagen skattesats på 30 % innebär det att din skatt skulle kunna minska med cirka
    <strong>${Math.round(estimatedTaxSaving).toLocaleString("sv-SE")} kr</strong>.
  `;

  resultSection.style.display = "block";
  resultSection.scrollIntoView({ behavior: "smooth" });
});
