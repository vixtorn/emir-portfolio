import { CanvasTexture, ClampToEdgeWrapping } from "three";

export const brushedTextureResolution = 512;

function createDeterministicRandom(seed: number) {
  let value = seed >>> 0;

  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 0x100000000;
  };
}

export function createBrushedAluminiumRoughnessTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = brushedTextureResolution;
  canvas.height = brushedTextureResolution;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to create brushed aluminium texture context.");
  }

  const random = createDeterministicRandom(0x4a82c1);
  context.fillStyle = "rgb(244, 244, 244)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let x = 0; x < canvas.width; x += 1) {
    const brightness = 233 + Math.floor(random() * 15);
    context.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
    context.fillRect(x, 0, 1, canvas.height);
  }

  context.lineWidth = 0.5;
  for (let index = 0; index < 140; index += 1) {
    const brightness = 216 + Math.floor(random() * 16);
    const startX = random() * canvas.width;
    const startY = random() * canvas.height;
    const length = 8 + random() * 38;

    context.strokeStyle = `rgba(${brightness}, ${brightness}, ${brightness}, 0.06)`;
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(startX + (random() - 0.5) * 0.8, startY + length);
    context.stroke();
  }

  const texture = new CanvasTexture(canvas);
  texture.wrapS = ClampToEdgeWrapping;
  texture.wrapT = ClampToEdgeWrapping;

  return texture;
}
