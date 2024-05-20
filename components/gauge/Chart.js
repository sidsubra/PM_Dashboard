import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const PieChart = ({ target, completed }) => {
  const chartContainer = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const ctx = chartContainer.current.getContext("2d");

    let pending = Math.max(target - completed, 0);

    const data = {
      labels: ["completed", "inprogress"],
      datasets: [
        {
          data: [completed, pending],
          backgroundColor: ["#0098e8", "rgba(0, 0, 0, 0.1)"],
          padding: 30,
          borderWidth: 1,
          circumference: 180,
          rotation: 270,
          cutout: "80%",
          needleValue: completed,
        },
      ],
    };

    const options = {
      plugins: {
        legend: {
          display: false, // hide legend
        },
        tooltip: {
          enabled: false, // hide tooltips
        },
      },
      animation: false,
      rotation: 1.0 * Math.PI, // fixed rotation (270 degrees)
    };

    // Destroy previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create a new chart instance
    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: data,
      options: options,
      plugins: [
        {
          afterDatasetsDraw: (chart, args, pluginOptions) => {
            const { ctx, data, chartArea: { top, bottom, left, right, width, height } } = chart;
            const xCoor = chart.getDatasetMeta(0).data[0].x;
            const yCoor = chart.getDatasetMeta(0).data[0].y;

            function textLabel(textSize, textBaseLine, textAlign, text, x, y, textColor) {
              ctx.font = `${textSize}px sans-serif`;
              ctx.fillStyle = textColor;
              ctx.textBaseLine = textBaseLine;
              ctx.textAlign = textAlign;
              ctx.fillText(text, x, y);
            }

            textLabel(17, "top", "left", 0, left, yCoor + 18,'#666');
            textLabel(17, "top", "right", target, right, yCoor + 18,'#666');
            textLabel(24, "bottom", "center", completed, xCoor, yCoor - 25,'#666');
            textLabel(16,"bottom", "center", "Hours Logged", xCoor, yCoor,'#747594');
          },
        },
      ],
    });

    return () => {
      // Cleanup on component unmount
      chartInstance.current.destroy();
    };
  }, [completed]);

  return <canvas ref={chartContainer} style={{ height: 250, width: 250 }} />;
};

export default PieChart;
