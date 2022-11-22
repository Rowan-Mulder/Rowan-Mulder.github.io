function imageColorSplitter(imageElement) {
    let imageWrapper = imageElement.parentElement

    let imageR = imageMultiplyColor(imageElement.src, {r: 1, g: 0, b: 0, a: 1})
    let imageG = imageMultiplyColor(imageElement.src, {r: 0, g: 1, b: 0, a: 1})
    let imageB = imageMultiplyColor(imageElement.src, {r: 0, g: 0, b: 1, a: 1})

    imageWrapper.appendChild(imageR).classList.add("imageR")
    imageWrapper.appendChild(imageG).classList.add("imageG")
    imageWrapper.appendChild(imageB).classList.add("imageB")
}

function imageMultiplyColor(url, colorMultiply = {r: 1, g: 1, b: 1, a: 1}) {
    const imgCanvas = document.createElement("canvas")
    const imgContext = imgCanvas.getContext("2d")
    const img = new Image()
    img.src = url

    img.addEventListener("load", e => {
        imgCanvas.width = e.target.width
        imgCanvas.height = e.target.height

        imgContext.drawImage(img, 0, 0, imgCanvas.width, imgCanvas.height)
        const scannedImage = imgContext.getImageData(0, 0, imgCanvas.width, imgCanvas.height)

        for (let i = 0; i < scannedImage.data.length; i += 4) {
            scannedImage.data[i]     *= colorMultiply.r
            scannedImage.data[i + 1] *= colorMultiply.g
            scannedImage.data[i + 2] *= colorMultiply.b
            scannedImage.data[i + 3] *= colorMultiply.a
        }

        imgContext.putImageData(scannedImage, 0, 0)
    })

    return imgCanvas
}