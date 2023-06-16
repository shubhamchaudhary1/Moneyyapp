import React, { useState } from "react";
import { Stack, useRouter } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  View,
  TextInput,
  StyleSheet,
  Button,
  Platform,
  Share,
  SafeAreaView,
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import XLSX from "xlsx";
import * as SecureStore from "expo-secure-store";

const Home = () => {
  const [gridData, setGridData] = useState(
    Array.from({ length: 10 }, () => Array(5).fill(""))
  );

  const handleInputChange = (text, rowIndex, columnIndex) => {
    setGridData((prevGridData) => {
      const newGridData = [...prevGridData];
      newGridData[rowIndex][columnIndex] = text;
      return newGridData;
    });
  };

  const handleDownload = async () => {
    const workbook = XLSX.utils.book_new();
    const worksheetData = gridData.map((row) =>
      row.map((cellValue) => ({ v: cellValue }))
    );
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const wbout = XLSX.write(workbook, { type: "base64" });

    const uri = `${FileSystem.cacheDirectory}data.xlsx`;

    await FileSystem.writeAsStringAsync(uri, wbout, {
      encoding: FileSystem.EncodingType.Base64,
    });

    Sharing.shareAsync(uri, {
      mimeType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      dialogTitle: "Share Excel File",
      UTI: "com.microsoft.excel.xlsx",
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, { width: wp("100%"), height: hp("100%") }]}
    >
      <Stack.Screen options={{ headerTitle: "Google Sheets Clone" }} />
      <View style={styles.title}>
        <Button title="Download Excel" onPress={handleDownload} />
      </View>
      {gridData.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((value, columnIndex) => (
            <TextInput
              key={`${rowIndex}-${columnIndex}`}
              style={styles.input}
              value={value}
              onChangeText={(text) =>
                handleInputChange(text, rowIndex, columnIndex)
              }
            />
          ))}
        </View>
      ))}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    width: "100%",
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 5,
    marginRight: 5,
  },
  title: {
    textAlign: "center",
    marginVertical: 50,
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});

export default Home;
