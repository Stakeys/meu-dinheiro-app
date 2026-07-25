import { Directory, File, Paths } from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

const imagesDir = new Directory(Paths.document, "images");

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

async function pickFromLibrary(): Promise<string | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  });
  if (result.canceled || !result.assets[0]) return null;
  return persistImage(result.assets[0].uri);
}

async function pickFromCamera(): Promise<string | null> {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) return null;

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  });
  if (result.canceled || !result.assets[0]) return null;
  return persistImage(result.assets[0].uri);
}

export function pickImage(title: string): Promise<string | null> {
  return new Promise((resolve) => {
    Alert.alert(title, "Escolha de onde tirar a foto", [
      { text: "Câmera", onPress: () => pickFromCamera().then(resolve) },
      { text: "Galeria", onPress: () => pickFromLibrary().then(resolve) },
      { text: "Cancelar", style: "cancel", onPress: () => resolve(null) },
    ]);
  });
}

export const ImagePickerHelper = { pickFromLibrary, pickFromCamera, pickImage };
