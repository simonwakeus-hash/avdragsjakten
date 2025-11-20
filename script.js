// Sätt aktuellt år i footern
document.getElementById("year").textContent = new Date().getFullYear();

// Scrolla till kalkylatorn när man klickar "Börja räkna"
document.getElementById("startBtn").addEventListener("click", () => {
  const el = document.getElementById("calculator");
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
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

// Visa/dölj fält för dubbel bosättning
const hasDoubleHousingCheckbox = document.getElementById("hasDoubleHousing");
const doubleHousingGroup = document.getElementById("doubleHousingGroup");

hasDoubleHousingCheckbox.addEventListener("change", () => {
  doubleHousingGroup.style.display = hasDoubleHousingCheckbox.checked ? "block" : "none";
});

// Visa/dölj fält för hemresor
const hasHomeTravelCheckbox = document.getElementById("hasHomeTravel");
const homeTravelGroup = document.getElementById("homeTravelGroup");

hasHomeTravelCheckbox.addEventListener("change", () => {
  homeTravelGroup.style.display = hasHomeTravelCheckbox.checked ? "block" : "none";
});

// Förenklad beräkning för flera avdrag
document.getElementById("deductionForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const daysPerYear = Number(document.getElementById("daysPerYear").value || 0);
  const distanceKm = Number(document.getElementById("distanceKm").value || 0);
  const transportMode = document.querySelector('input[name="transportMode"]:checked').value;
  const costKnowledge = document.querySelector('input[name="costKnowledge"]:checked').value;
  const knownYearlyCost = Number(document.getElementById("knownYearlyCost").value || 0);

  const hasHomeOffice = document.getElementById("hasHomeOffice").checked;
  const hasDoubleHousing = hasDoubleHousingCheckbox.checked;
  const hasHomeTravel = hasHomeTravelCheckbox.checked;

  const doubleHousingYearlyCost = hasDoubleHousing
    ? Number(document.getElementById("doubleHousingYearlyCost").value || 0)
    : 0;

  const homeTravelYearlyCost = hasHomeTravel
    ? Number(document.getElementById("homeTravelYearlyCost").value || 0)
    : 0;

  if (daysPerYear <= 0 || distanceKm <= 0) {
    alert("Fyll i både antal dagar och avstånd för att fortsätta.");
    return;
  }

  // --- Resor till och från arbetet (förenklad modell) ---
  const totalKmPerYear = distanceKm * 2 * daysPerYear;

  // Antag schablonkostnad per km beroende på transportsätt (förenkling!)
  let costPerKm;
  if (transportMode === "car") {
    costPerKm = 2.5; // t.ex. 2,5 kr/km
  } else if (transportMode === "public") {
    costPerKm = 1.2; // motsvarande snittkostnad per km
  } else {
    costPerKm = 1.8; // blandat
  }

  let yearlyTravelCost;
  if (costKnowledge === "yes" && knownYearlyCost > 0) {
    yearlyTravelCost = knownYearlyCost;
  } else {
    yearlyTravelCost = totalKmPerYear * costPerKm;
  }

  // Grundnivå som kostnaderna måste överstiga för att bli avdragsgilla (förenklad)
  const TRAVEL_THRESHOLD = 10000; // kr
  const travelDeduction = Math.max(0, yearlyTravelCost - TRAVEL_THRESHOLD);

  // --- Arbetsrum hemma (mycket förenklad schablon) ---
  let homeOfficeDeduction = 0;
  if (hasHomeOffice) {
    homeOfficeDeduction = 2000; // schablonbelopp, inte Skatteverkets exakta regel
  }

  // --- Dubbel bosättning & hemresor (förenklad modell) ---
  const doubleHousingDeduction = doubleHousingYearlyCost > 0 ? doubleHousingYearlyCost : 0;
  const homeTravelDeduction = homeTravelYearlyCost > 0 ? homeTravelYearlyCost : 0;

  // --- Totalsummering ---
  const totalDeduction =
    travelDeduction + homeOfficeDeduction + doubleHousingDeduction + homeTravelDeduction;

  const TAX_RATE = 0.30; // förenklad marginalskatt 30 %
  const estimatedTaxSaving = totalDeduction * TAX_RATE;

  const resultSection = document.getElementById("resultSection");
  const resultText = document.getElementById("resultText");

  const formatKr = (val) => `${Math.round(val).toLocaleString("sv-SE")} kr`;

  resultText.innerHTML = `
    Baserat på dina uppgifter gör vi följande uppskattning av möjliga avdrag per år:<br/><br/>
    • Resor till och från arbetet: <strong>${formatKr(travelDeduction)}</strong><br/>
    • Arbetsrum i bostaden (schablon): <strong>${formatKr(homeOfficeDeduction)}</strong><br/>
    • Dubbel bosättning (extra boendekostnad): <strong>${formatKr(doubleHousingDeduction)}</strong><br/>
    • Hemresor på grund av arbete på annan ort: <strong>${formatKr(homeTravelDeduction)}</strong><br/><br/>
    Totalt uppskattat avdrag: <strong>${formatKr(totalDeduction)}</strong><br/>
    Med en antagen skattesats på 30 % skulle det kunna minska din skatt med ungefär
    <strong>${formatKr(estimatedTaxSaving)}</strong>.
  `;

  resultSection.style.display = "block";
  resultSection.scrollIntoView({ behavior: "smooth" });
});

// Enkel e-post-"signup" (ingen backend – bara feedback i UI)
const emailForm = document.getElementById("emailForm");
const emailInput = document.getElementById("emailInput");
const emailFeedback = document.getElementById("emailFeedback");

emailForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = (emailInput.value || "").trim();

  if (!email) {
    return;
  }

  // Här skulle vi normalt skicka e-postadressen till en backend eller en tjänst som Mailchimp.
  // I den här versionen visar vi bara ett kvitto till användaren.
  emailFeedback.textContent = "Tack! Vi har sparat din e-postadress inför kommande uppdateringar.";
  emailFeedback.style.display = "block";
  emailInput.value = "";
});
