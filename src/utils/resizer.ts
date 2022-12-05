/**
 *
 * @author Onur Zorluer
 *
 */
class Resizer {
  static changeHeightWidth(
    height: number,
    maxHeight: number,
    width: number,
    maxWidth: number,
    minWidth?: number,
    minHeight?: number
  ) {
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }
    if (height > maxHeight) {
      width = Math.round((width * maxHeight) / height);
      height = maxHeight;
    }
    if (minWidth && width < minWidth) {
      height = Math.round((height * minWidth) / width);
      width = minWidth;
    }
    if (minHeight && height < minHeight) {
      width = Math.round((width * minHeight) / height);
      height = minHeight;
    }
    return { height, width };
  }

  static resizeAndRotateImage(
    image: HTMLImageElement,
    maxWidth: number,
    maxHeight: number,
    minWidth?: number,
    minHeight?: number,
    compressFormat: string = "jpeg",
    quality: number = 100,
    rotation: number = 0
  ) {
    var qualityDecimal = quality / 100;
    var canvas = document.createElement("canvas");

    var width = image.width;
    var height = image.height;

    var newHeightWidth = this.changeHeightWidth(
      height,
      maxHeight,
      width,
      maxWidth,
      minWidth,
      minHeight
    );
    if (rotation && (rotation === 90 || rotation === 270)) {
      canvas.width = newHeightWidth.height;
      canvas.height = newHeightWidth.width;
    } else {
      canvas.width = newHeightWidth.width;
      canvas.height = newHeightWidth.height;
    }

    width = newHeightWidth.width;
    height = newHeightWidth.height;

    var ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.fillStyle = "rgba(0, 0, 0, 0)";
    ctx.fillRect(0, 0, width, height);

    if (ctx.imageSmoothingEnabled && ctx.imageSmoothingQuality) {
      ctx.imageSmoothingQuality = "high";
    }

    if (rotation) {
      ctx.rotate((rotation * Math.PI) / 180);
      if (rotation === 90) {
        ctx.translate(0, -canvas.width);
      } else if (rotation === 180) {
        ctx.translate(-canvas.width, -canvas.height);
      } else if (rotation === 270) {
        ctx.translate(-canvas.height, 0);
      } else if (rotation === 0 || rotation === 360) {
        ctx.translate(0, 0);
      }
    }
    ctx.drawImage(image, 0, 0, width, height);

    return canvas.toDataURL(`image/${compressFormat}`, qualityDecimal);
  }

  static b64toByteArrays(b64Data: string, contentType: string) {
    contentType = contentType || "image/jpeg";
    var sliceSize = 512;

    var byteCharacters = atob(
      b64Data.toString().replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "")
    );
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }
    return byteArrays;
  }

  static b64toBlob(b64Data: string, contentType: string) {
    const byteArrays = this.b64toByteArrays(b64Data, contentType);
    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  static b64toFile(b64Data: string, fileName: string, contentType: string) {
    const byteArrays = this.b64toByteArrays(b64Data, contentType);
    const file = new File(byteArrays, fileName, { type: contentType });
    return file;
  }

  static createResizedImage(
    file: Blob | File,
    maxWidth: number,
    maxHeight: number,
    compressFormat: string,
    quality: number,
    rotation: number,
    responseUriFunc: (
      value: string | Blob | File | ProgressEvent<FileReader>
    ) => void,
    outputType: string = "base64",
    minWidth?: number,
    minHeight?: number
  ) {
    const reader = new FileReader();
    if (file) {
      if (file.type && !file.type.includes("image")) {
        throw Error("File Is NOT Image!");
      } else {
        reader.readAsDataURL(file);
        reader.onload = () => {
          var image = new Image();
          image.src = reader.result as string;
          image.onload = function () {
            var resizedDataUrl = Resizer.resizeAndRotateImage(
              image,
              maxWidth,
              maxHeight,
              minWidth,
              minHeight,
              compressFormat,
              quality,
              rotation
            );
            const contentType = `image/${compressFormat}`;
            switch (outputType) {
              case "blob":
                const blob = Resizer.b64toBlob(resizedDataUrl, contentType);
                responseUriFunc(blob);
                break;
              case "base64":
                responseUriFunc(resizedDataUrl);
                break;
              case "file":
                let fileName = file;
                let fileNameWithoutFormat = fileName
                  .toString()
                  .replace(/(png|jpeg|jpg|webp)$/i, "");
                let newFileName = fileNameWithoutFormat.concat(
                  compressFormat.toString()
                );
                const newFile = Resizer.b64toFile(
                  resizedDataUrl,
                  newFileName,
                  contentType
                );
                responseUriFunc(newFile);
                break;
              default:
                responseUriFunc(resizedDataUrl);
            }
          };
        };
        reader.onerror = (error) => {
          throw error;
        };
      }
    } else {
      throw Error("File Not Found!");
    }
  }
  static imageFileResizer = (
    file: Blob | File,
    maxWidth: number,
    maxHeight: number,
    compressFormat: string,
    quality: number,
    rotation: number,
    responseUriFunc: (
      value: string | Blob | File | ProgressEvent<FileReader>
    ) => void,
    outputType?: string,
    minWidth?: number,
    minHeight?: number
  ) => {
    return Resizer.createResizedImage(
      file,
      maxWidth,
      maxHeight,
      compressFormat,
      quality,
      rotation,
      responseUriFunc,
      outputType,
      minWidth,
      minHeight
    );
  };
}

const resizeFile = (file: File | Blob, maxWidth: number, maxHeight: number) =>
  new Promise<File>((resolve) => {
    Resizer.imageFileResizer(
      file,
      maxWidth,
      maxHeight,
      "JPEG",
      100,
      0,
      (uri) => {
        resolve(uri as File);
      },
      "file"
    );
  });

const imageResize = async (
  file: File | Blob,
  maxWidth: number,
  maxHeight: number
): Promise<File> => {
  try {
    const resFile = await resizeFile(file, maxWidth, maxHeight);
    return resFile;
  } catch (err) {
    throw err;
  }
};
export { imageResize };
