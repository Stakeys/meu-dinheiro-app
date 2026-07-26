import { Directory, File, Paths } from "expo-file-system";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

const imagesDir = new Directory(Paths.document, "images");

type Aspect = [number, number];

function ensureImagesDir() {
  if (!imagesDir.exists) {
    imagesDir.create({ intermediates: true });
  }
}

function persistImage(tempUri: string): string {
  ensureImagesDir();
  const sourceFile = new File(tempUri);
  const extension = sourceFile.extension || ".jpg";
  const fileName = `${Date.now()}-${Math.round(Math.random() * 1e6)}${extension}`;
  const destFile = new File(imagesDir, fileName);
  sourceFile.copy(destFile);
  return destFile.uri;
}

// Corta a imagem no centro pra bater exatamente com a proporção alvo, independente
// do que o seletor nativo do iOS tenha (ou não) permitido ajustar — o picker do iOS
// às vezes pula a tela de recorte (acesso limitado às fotos usa o PHPicker, que não
// suporta edição), então garantimos a proporção certa aqui em vez de confiar nele.
async function centerCropToAspect(uri: string, sourceWidth: number, sourceHeight: number, aspect: Aspect): Promise<string> {
  const targetRatio = aspect[0] / aspect[1];
  const sourceRatio = sourceWidth / sourceHeight;

  let cropWidth = sourceWidth;
  let cropHeight = sourceHeight;
  if (sourceRatio > targetRatio) {
    cropWidth = Math.round(sourceHeight * targetRatio);
  } else {
    cropHeight = Math.round(sourceWidth / targetRatio);
  }
  const originX = Math.round((sourceWidth - cropWidth) / 2);
  const originY = Math.round((sourceHeight - cropHeight) / 2);

  const context = ImageManipulator.manipulate(uri);
  context.crop({ originX, originY, width: cropWidth, height: cropHeight });
  const imageRef = await context.renderAsync();
  const result = await imageRef.saveAsync({ format: SaveFormat.JPEG, compress: 0.85 });
  return result.uri;
}

async function pickFromLibrary(aspect: Aspect): Promise<string | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect,
    quality: 0.8,
  });
  if (result.canceled || !result.assets[0]) return null;
  const asset = result.assets[0];
  const croppedUri = await centerCropToAspect(asset.uri, asset.width, asset.height, aspect);
  return persistImage(croppedUri);
}

async function pickFromCamera(aspect: Aspect): Promise<string | null> {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) return null;

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect,
    quality: 0.8,
  });
  if (result.canceled || !result.assets[0]) return null;
  const asset = result.assets[0];
  const croppedUri = await centerCropToAspect(asset.uri, asset.width, asset.height, aspect);
  return persistImage(croppedUri);
}

export function pickImage(title: string, aspect: Aspect = [3, 1]): Promise<string | null> {
  return new Promise((resolve) => {
    Alert.alert(title, "Escolha de onde tirar a foto.", [
      { text: "Câmera", onPress: () => pickFromCamera(aspect).then(resolve) },
      { text: "Galeria", onPress: () => pickFromLibrary(aspect).then(resolve) },
      { text: "Cancelar", style: "cancel", onPress: () => resolve(null) },
    ]);
  });
}

export const ImagePickerHelper = { pickFromLibrary, pickFromCamera, pickImage };
