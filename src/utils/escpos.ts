export const generatePrintLogoPayload = async (base64Url: string): Promise<Uint8Array | null> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      // 1. Draw to temp canvas to find bounds (Trim)
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
      if (!tempCtx) return resolve(null);
      
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;
      tempCtx.fillStyle = "#FFFFFF";
      tempCtx.fillRect(0, 0, img.width, img.height);
      tempCtx.drawImage(img, 0, 0);
      
      const pxData = tempCtx.getImageData(0, 0, img.width, img.height).data;
      let minX = img.width, minY = img.height, maxX = 0, maxY = 0;
      
      // Find non-white pixels
      for (let y = 0; y < img.height; y++) {
        for (let x = 0; x < img.width; x++) {
          const i = (y * img.width + x) * 4;
          const r = pxData[i], g = pxData[i+1], b = pxData[i+2];
          if (r < 250 || g < 250 || b < 250) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      
      if (minX > maxX || minY > maxY) return resolve(null); // Blank image
      
      const cropW = maxX - minX + 1;
      const cropH = maxY - minY + 1;
      
      // 2. Resize with Hard Limit (Max W: 160, Max H: 60)
      const MAX_WIDTH = 160;
      const MAX_HEIGHT = 60;
      
      let scale = Math.min(MAX_WIDTH / cropW, MAX_HEIGHT / cropH);
      if (scale > 1) scale = 1; // don't upscale
      
      const targetWidth = Math.floor((cropW * scale) / 8) * 8; // ensure multiple of 8
      if (targetWidth === 0) return resolve(null);
      const targetHeight = Math.round(cropH * scale);
      
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(null);
      
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, targetWidth, targetHeight);
      ctx.drawImage(tempCanvas, minX, minY, cropW, cropH, 0, 0, targetWidth, targetHeight);
      
      const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
      const pixels = imgData.data;
      
      const xL = (targetWidth / 8) % 256;
      const xH = Math.floor((targetWidth / 8) / 256);
      const yL = targetHeight % 256;
      const yH = Math.floor(targetHeight / 256);
      
      const data = new Uint8Array(8 + (targetWidth / 8) * targetHeight);
      data[0] = 0x1D;
      data[1] = 0x76;
      data[2] = 0x30;
      data[3] = 0x00;
      data[4] = xL;
      data[5] = xH;
      data[6] = yL;
      data[7] = yH;
      
      let byteIndex = 8;
      for (let y = 0; y < targetHeight; y++) {
        for (let x = 0; x < targetWidth; x += 8) {
          let byte = 0;
          for (let b = 0; b < 8; b++) {
            const i = ((y * targetWidth) + x + b) * 4;
            const luminance = (pixels[i] * 0.3) + (pixels[i+1] * 0.59) + (pixels[i+2] * 0.11);
            if (luminance < 150) {
              byte |= (1 << (7 - b));
            }
          }
          data[byteIndex++] = byte;
        }
      }
      resolve(data);
    };
    img.onerror = () => resolve(null);
    img.src = base64Url;
  });
};
