function createSparkline(canvasId, data) {
  const canvas = document.getElementById(canvasId);

  if (!canvas) return;

  new Chart(canvas, {
    type: "line",
    data: {
      labels: data.map((_, i) => i),
      datasets: [{
        data: data,
        borderColor: "#22c55e",
        borderWidth: 2,
        pointRadius: 0,
        fill: false,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: false
        }
      },
      scales: {
        x: {
          display: false
        },
        y: {
          display: false
        }
      }
    }
  });
}
